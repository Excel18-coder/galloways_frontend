import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from './entities/payment.entity';
import axios from 'axios';

interface MpesaSTKPushRequest {
  BusinessShortCode: string;
  Password: string;
  Timestamp: string;
  TransactionType: string;
  Amount: number;
  PartyA: string;
  PartyB: string;
  PhoneNumber: string;
  CallBackURL: string;
  AccountReference: string;
  TransactionDesc: string;
}

export interface MpesaSTKPushResponse {
  MerchantRequestID: string;
  CheckoutRequestID: string;
  ResponseCode: string;
  ResponseDescription: string;
  CustomerMessage: string;
}

interface MpesaCallbackResponse {
  Body: {
    stkCallback: {
      MerchantRequestID: string;
      CheckoutRequestID: string;
      ResultCode: number;
      ResultDesc: string;
      CallbackMetadata?: {
        Item: Array<{
          Name: string;
          Value: string | number;
        }>;
      };
    };
  };
}

@Injectable()
export class MpesaService {
  private readonly logger = new Logger(MpesaService.name);
  private readonly baseUrl: string;

  constructor(
    private configService: ConfigService,
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
  ) {
    const environment = this.configService.get('MPESA_ENVIRONMENT', 'sandbox');
    this.baseUrl = environment === 'production' 
      ? 'https://api.safaricom.co.ke' 
      : 'https://sandbox.safaricom.co.ke';
  }

  /**
   * Generate OAuth access token for M-Pesa API
   */
  private async getAccessToken(): Promise<string> {
    try {
      const consumerKey = this.configService.get('MPESA_CONSUMER_KEY');
      const consumerSecret = this.configService.get('MPESA_CONSUMER_SECRET');
      
      if (!consumerKey || !consumerSecret) {
        throw new Error('M-Pesa consumer key and secret are required');
      }

      const credentials = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');
      
      const response = await axios.get(
        `${this.baseUrl}/oauth/v1/generate?grant_type=client_credentials`,
        {
          headers: {
            Authorization: `Basic ${credentials}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data.access_token;
    } catch (error) {
      this.logger.error('Failed to get M-Pesa access token', error);
      throw new Error('Failed to authenticate with M-Pesa API');
    }
  }

  /**
   * Generate password for STK Push
   */
  private generatePassword(): { password: string; timestamp: string } {
    const shortCode = this.configService.get('MPESA_BUSINESS_SHORT_CODE');
    const passkey = this.configService.get('MPESA_PASSKEY');
    const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, -3);
    
    const password = Buffer.from(`${shortCode}${passkey}${timestamp}`).toString('base64');
    
    return { password, timestamp };
  }

  /**
   * Format phone number to required M-Pesa format
   */
  private formatPhoneNumber(phone: string): string {
    // Remove any non-digit characters
    let cleanPhone = phone.replace(/\D/g, '');
    
    // Handle different formats
    if (cleanPhone.startsWith('0')) {
      cleanPhone = '254' + cleanPhone.slice(1);
    } else if (cleanPhone.startsWith('+254')) {
      cleanPhone = cleanPhone.slice(1);
    } else if (cleanPhone.startsWith('254')) {
      // Already in correct format
    } else if (cleanPhone.length === 9 && cleanPhone.startsWith('7')) {
      cleanPhone = '254' + cleanPhone;
    }
    
    return cleanPhone;
  }

  /**
   * Initiate STK Push payment
   */
  async initiateSTKPush(data: {
    phoneNumber: string;
    amount: number;
    accountReference: string;
    transactionDesc: string;
    userId?: number;
    consultationId?: number;
  }): Promise<{ success: boolean; data?: MpesaSTKPushResponse; message: string; error?: string }> {
    try {
      const accessToken = await this.getAccessToken();
      const { password, timestamp } = this.generatePassword();
      const formattedPhone = this.formatPhoneNumber(data.phoneNumber);
      
      const shortCode = this.configService.get('MPESA_BUSINESS_SHORT_CODE');
      const callbackUrl = this.configService.get('MPESA_CALLBACK_URL');

      const stkPushRequest: MpesaSTKPushRequest = {
        BusinessShortCode: shortCode,
        Password: password,
        Timestamp: timestamp,
        TransactionType: 'CustomerPayBillOnline',
        Amount: data.amount,
        PartyA: formattedPhone,
        PartyB: shortCode,
        PhoneNumber: formattedPhone,
        CallBackURL: callbackUrl,
        AccountReference: data.accountReference,
        TransactionDesc: data.transactionDesc,
      };

      this.logger.log('Initiating STK Push', { 
        phoneNumber: formattedPhone, 
        amount: data.amount,
        accountReference: data.accountReference 
      });

      const response = await axios.post(
        `${this.baseUrl}/mpesa/stkpush/v1/processrequest`,
        stkPushRequest,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const mpesaResponse: MpesaSTKPushResponse = response.data;

      // Create payment record
      const payment = this.paymentRepository.create({
        user_id: data.userId || 0,
        amount: data.amount,
        currency: 'KES',
        method: 'mpesa',
        status: 'PENDING',
        reference: `MPESA-${data.accountReference}-${Date.now()}`,
        metadata: {
          phoneNumber: formattedPhone,
          merchantRequestId: mpesaResponse.MerchantRequestID,
          checkoutRequestId: mpesaResponse.CheckoutRequestID,
          accountReference: data.accountReference,
          transactionDesc: data.transactionDesc,
          consultationId: data.consultationId,
          timestamp: new Date().toISOString(),
        },
      });

      await this.paymentRepository.save(payment);

      if (mpesaResponse.ResponseCode === '0') {
        return {
          success: true,
          data: mpesaResponse,
          message: 'STK Push initiated successfully. Please check your phone and enter your M-PESA PIN.',
        };
      } else {
        return {
          success: false,
          message: mpesaResponse.ResponseDescription || 'Failed to initiate payment',
          error: `Response Code: ${mpesaResponse.ResponseCode}`,
        };
      }
    } catch (error) {
      this.logger.error('STK Push failed', error);
      
      if (error.response) {
        this.logger.error('M-Pesa API Error Response', error.response.data);
        return {
          success: false,
          message: 'Payment initiation failed',
          error: error.response.data?.errorMessage || error.response.data?.ResponseDescription || 'M-Pesa API error',
        };
      }
      
      return {
        success: false,
        message: 'Payment initiation failed',
        error: error.message || 'Unknown error occurred',
      };
    }
  }

  /**
   * Handle M-Pesa callback response
   */
  async handleCallback(callbackData: MpesaCallbackResponse): Promise<{ success: boolean; message: string }> {
    try {
      const { stkCallback } = callbackData.Body;
      const { MerchantRequestID, CheckoutRequestID, ResultCode, ResultDesc } = stkCallback;

      this.logger.log('Processing M-Pesa callback', {
        merchantRequestId: MerchantRequestID,
        checkoutRequestId: CheckoutRequestID,
        resultCode: ResultCode,
      });

      // Find the payment record
      const payment = await this.paymentRepository.findOne({
        where: {
          metadata: {
            merchantRequestId: MerchantRequestID,
            checkoutRequestId: CheckoutRequestID,
          } as any,
        },
      });

      if (!payment) {
        this.logger.error('Payment record not found for callback', {
          merchantRequestId: MerchantRequestID,
          checkoutRequestId: CheckoutRequestID,
        });
        return { success: false, message: 'Payment record not found' };
      }

      // Update payment status based on result code
      if (ResultCode === 0) {
        // Payment successful
        const callbackMetadata = stkCallback.CallbackMetadata?.Item || [];
        const amount = callbackMetadata.find(item => item.Name === 'Amount')?.Value;
        const mpesaReceiptNumber = callbackMetadata.find(item => item.Name === 'MpesaReceiptNumber')?.Value;
        const transactionDate = callbackMetadata.find(item => item.Name === 'TransactionDate')?.Value;
        const phoneNumber = callbackMetadata.find(item => item.Name === 'PhoneNumber')?.Value;

        payment.status = 'COMPLETED';
        payment.metadata = {
          ...payment.metadata,
          mpesaReceiptNumber,
          transactionDate,
          phoneNumber,
          resultCode: ResultCode,
          resultDesc: ResultDesc,
          callbackReceived: true,
          completedAt: new Date().toISOString(),
        };

        this.logger.log('Payment completed successfully', {
          paymentId: payment.id,
          amount,
          mpesaReceiptNumber,
        });
      } else {
        // Payment failed
        payment.status = 'FAILED';
        payment.metadata = {
          ...payment.metadata,
          resultCode: ResultCode,
          resultDesc: ResultDesc,
          callbackReceived: true,
          failedAt: new Date().toISOString(),
        };

        this.logger.warn('Payment failed', {
          paymentId: payment.id,
          resultCode: ResultCode,
          resultDesc: ResultDesc,
        });
      }

      await this.paymentRepository.save(payment);

      return { success: true, message: 'Callback processed successfully' };
    } catch (error) {
      this.logger.error('Failed to process M-Pesa callback', error);
      return { success: false, message: 'Failed to process callback' };
    }
  }

  /**
   * Query STK Push transaction status
   */
  async querySTKPushStatus(checkoutRequestId: string): Promise<{ success: boolean; data?: any; message: string }> {
    try {
      const accessToken = await this.getAccessToken();
      const { password, timestamp } = this.generatePassword();
      const shortCode = this.configService.get('MPESA_BUSINESS_SHORT_CODE');

      const queryRequest = {
        BusinessShortCode: shortCode,
        Password: password,
        Timestamp: timestamp,
        CheckoutRequestID: checkoutRequestId,
      };

      const response = await axios.post(
        `${this.baseUrl}/mpesa/stkpushquery/v1/query`,
        queryRequest,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return {
        success: true,
        data: response.data,
        message: 'Status query successful',
      };
    } catch (error) {
      this.logger.error('STK Push status query failed', error);
      return {
        success: false,
        message: 'Failed to query payment status',
      };
    }
  }

  /**
   * Get payment by checkout request ID
   */
  async getPaymentByCheckoutRequestId(checkoutRequestId: string): Promise<Payment | null> {
    try {
      const payment = await this.paymentRepository.findOne({
        where: {
          metadata: {
            checkoutRequestId,
          } as any,
        },
      });

      return payment;
    } catch (error) {
      this.logger.error('Failed to get payment by checkout request ID', error);
      return null;
    }
  }
}