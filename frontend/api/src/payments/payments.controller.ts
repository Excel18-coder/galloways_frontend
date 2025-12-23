import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Put, Query } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { MpesaService, MpesaSTKPushResponse } from './mpesa.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { InitiateSTKPushDto } from './dto/initiate-stk-push.dto';
import { Payment } from './entities/payment.entity';

interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

@Controller('payments')
export class PaymentsController {
  constructor(
    private readonly paymentsService: PaymentsService,
    private readonly mpesaService: MpesaService,
  ) {}

  @Post()
  create(@Body() createPaymentDto: CreatePaymentDto): Promise<ApiResponse<Payment>> {
    return this.paymentsService.create(createPaymentDto);
  }

  @Get()
  findAll(): Promise<ApiResponse<Payment[]>> {
    return this.paymentsService.findAll();
  }

  // Paystack (or provider) callback/verification endpoint using query params
  // MUST be before @Get(':id') to avoid route conflicts
  @Get('callback')
  verifyCallback(
    @Query('reference') reference?: string,
    @Query('trxref') trxref?: string,
    @Query('ref') ref?: string,
    @Query('provider') provider?: string,
  ): Promise<ApiResponse<{ reference: string; provider?: string }>> {
    const finalRef = reference || trxref || ref || '';
    return this.paymentsService.verifyByReference(finalRef, provider);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<ApiResponse<Payment>> {
    return this.paymentsService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePaymentDto: UpdatePaymentDto,
  ): Promise<ApiResponse<Payment>> {
    return this.paymentsService.update(id, updatePaymentDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<ApiResponse<null>> {
    return this.paymentsService.remove(id);
  }

  // M-Pesa STK Push endpoints
  @Post('mpesa/stkpush')
  async initiateSTKPush(@Body() body: InitiateSTKPushDto): Promise<{ success: boolean; data?: MpesaSTKPushResponse; message: string; error?: string }> {
    return this.mpesaService.initiateSTKPush(body);
  }

  @Post('mpesa/callback')
  async handleMpesaCallback(@Body() callbackData: any) {
    return this.mpesaService.handleCallback(callbackData);
  }

  @Post('mpesa/timeout')
  async handleMpesaTimeout(@Body() timeoutData: any) {
    // Handle timeout callback
    return { success: true, message: 'Timeout callback received' };
  }

  @Get('mpesa/status/:checkoutRequestId')
  async querySTKPushStatus(@Param('checkoutRequestId') checkoutRequestId: string) {
    return this.mpesaService.querySTKPushStatus(checkoutRequestId);
  }

  @Get('mpesa/payment/:checkoutRequestId')
  async getPaymentByCheckoutRequestId(@Param('checkoutRequestId') checkoutRequestId: string) {
    const payment = await this.mpesaService.getPaymentByCheckoutRequestId(checkoutRequestId);
    if (payment) {
      return { success: true, data: payment, message: 'Payment found' };
    }
    return { success: false, message: 'Payment not found' };
  }
}
