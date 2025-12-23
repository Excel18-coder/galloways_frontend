# M-Pesa STK Push Integration Setup Guide

## Overview
This project now includes M-Pesa STK Push integration for consultation payments. The integration allows users to pay directly from their mobile phones using M-Pesa.

## Required M-Pesa API Keys and Configuration

### 1. Safaricom Daraja API Credentials
You need to obtain these from the Safaricom Developer Portal (https://developer.safaricom.co.ke):

```env
# M-Pesa Configuration (Add these to api/.env)
MPESA_ENVIRONMENT=sandbox                    # Use 'production' for live environment
MPESA_CONSUMER_KEY=your_consumer_key_here   # From Daraja API
MPESA_CONSUMER_SECRET=your_consumer_secret_here # From Daraja API
MPESA_BUSINESS_SHORT_CODE=174379            # Your business short code (174379 for sandbox)
MPESA_PASSKEY=your_passkey_here             # From Daraja API
MPESA_CALLBACK_URL=https://your-domain.com/api/v1/payments/mpesa/callback
MPESA_RESULT_URL=https://your-domain.com/api/v1/payments/mpesa/result
MPESA_QUEUE_TIMEOUT_URL=https://your-domain.com/api/v1/payments/mpesa/timeout
```

### 2. How to Get M-Pesa API Keys

#### Step 1: Register on Safaricom Developer Portal
1. Visit https://developer.safaricom.co.ke
2. Create an account or login
3. Create a new app

#### Step 2: Get Sandbox Credentials
For testing purposes, you'll get:
- **Consumer Key**: Your app's consumer key
- **Consumer Secret**: Your app's consumer secret
- **Business Short Code**: 174379 (for sandbox)
- **Passkey**: Provided by Safaricom for sandbox testing

#### Step 3: Production Credentials
For production, you'll need:
- **Consumer Key**: Your production app consumer key
- **Consumer Secret**: Your production app consumer secret  
- **Business Short Code**: Your actual M-Pesa business number
- **Passkey**: Your production passkey from Safaricom

### 3. Environment Configuration

#### Backend (.env file location: `api/.env`)
```env
# M-Pesa Configuration
MPESA_ENVIRONMENT=sandbox
MPESA_CONSUMER_KEY=your_actual_consumer_key_here
MPESA_CONSUMER_SECRET=your_actual_consumer_secret_here
MPESA_BUSINESS_SHORT_CODE=174379
MPESA_PASSKEY=your_actual_passkey_here
MPESA_CALLBACK_URL=https://your-production-domain.com/api/v1/payments/mpesa/callback
MPESA_RESULT_URL=https://your-production-domain.com/api/v1/payments/mpesa/result
MPESA_QUEUE_TIMEOUT_URL=https://your-production-domain.com/api/v1/payments/mpesa/timeout
```

#### Frontend (.env file location: `frontend/.env`)
```env
# API Configuration (Update port to match your backend)
VITE_API_URL=http://localhost:3000/api/v1

# M-Pesa Frontend Config (Optional)
VITE_MPESA_ENVIRONMENT=sandbox
VITE_ENABLE_MPESA=true
```

### 4. Testing Credentials (Sandbox)

For sandbox testing, you can use these test credentials:
- **Consumer Key**: Get from your Daraja app
- **Consumer Secret**: Get from your Daraja app
- **Business Short Code**: 174379
- **Test Phone Numbers**: Use 254708374149 or 254711111111
- **Test Amount**: Any amount (recommended: 1-1000 KES for testing)

### 5. Production Setup Checklist

When going to production:

1. **Update Environment**:
   ```env
   MPESA_ENVIRONMENT=production
   ```

2. **Update URLs**: Replace localhost URLs with your production domain
   ```env
   MPESA_CALLBACK_URL=https://yourdomain.com/api/v1/payments/mpesa/callback
   ```

3. **SSL Required**: M-Pesa requires HTTPS for production callbacks

4. **Business Registration**: Ensure your business is registered with Safaricom

5. **Go-Live Process**: Follow Safaricom's go-live process for production access

### 6. API Endpoints

The following M-Pesa endpoints are available:

- **POST** `/api/v1/payments/mpesa/stkpush` - Initiate STK Push
- **POST** `/api/v1/payments/mpesa/callback` - M-Pesa callback (webhook)
- **POST** `/api/v1/payments/mpesa/timeout` - Timeout callback
- **GET** `/api/v1/payments/mpesa/status/:checkoutRequestId` - Query payment status
- **GET** `/api/v1/payments/mpesa/payment/:checkoutRequestId` - Get payment details

### 7. Phone Number Format

The system automatically formats phone numbers to M-Pesa format:
- Input: `0712345678` → Output: `254712345678`
- Input: `+254712345678` → Output: `254712345678`
- Input: `712345678` → Output: `254712345678`

### 8. Payment Flow

1. User fills consultation form
2. Frontend calls `/payments/mpesa/stkpush`
3. User receives STK Push on phone
4. User enters M-Pesa PIN
5. M-Pesa sends callback to your server
6. Payment status updated in database
7. User receives confirmation

### 9. Error Handling

Common error scenarios handled:
- Invalid phone numbers
- Insufficient funds
- User cancellation
- Network timeouts
- Invalid credentials

### 10. Security Notes

- Never expose API keys in frontend code
- Use HTTPS for all callback URLs
- Validate all callback data
- Implement proper logging for transactions
- Store sensitive data securely

### 11. Testing the Integration

1. Start your backend server
2. Use sandbox credentials
3. Test with sandbox phone numbers
4. Check logs for transaction flow
5. Verify callback handling

## Troubleshooting

### Common Issues:

1. **"Consumer Key/Secret not found"**
   - Check if MPESA_CONSUMER_KEY and MPESA_CONSUMER_SECRET are set in .env

2. **"Invalid phone number"**
   - Ensure phone number is in format 254XXXXXXXXX

3. **"Callback not received"**
   - Check if MPESA_CALLBACK_URL is accessible publicly
   - Ensure HTTPS in production

4. **"Authentication failed"**
   - Verify consumer key and secret are correct
   - Check if they're for the right environment (sandbox/production)

### Support

For M-Pesa API support:
- Email: apisupport@safaricom.co.ke
- Documentation: https://developer.safaricom.co.ke/docs

## Files Modified/Created

### Backend Files:
- `api/src/payments/mpesa.service.ts` - M-Pesa service implementation
- `api/src/payments/payments.controller.ts` - Added M-Pesa endpoints
- `api/src/payments/payments.module.ts` - Added MpesaService
- `api/src/payments/dto/initiate-stk-push.dto.ts` - STK Push DTO
- `api/.env` - Added M-Pesa configuration

### Frontend Files:
- `frontend/src/lib/api.ts` - Added M-Pesa API calls
- `frontend/src/pages/Consultancy.tsx` - Integrated real M-Pesa payment
- `frontend/.env` - Added frontend configuration

The integration is now ready for testing with sandbox credentials and production deployment with real credentials.