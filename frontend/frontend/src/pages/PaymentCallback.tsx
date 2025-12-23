import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
// API import disabled for build

export default function PaymentCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'failed'>('loading');
  const [message, setMessage] = useState('Verifying payment...');
  
  const reference = searchParams.get('reference');
  const trxref = searchParams.get('trxref');

  useEffect(() => {
    const verifyPayment = async () => {
      const paymentReference = reference || trxref;
      
      if (!paymentReference) {
        setStatus('failed');
        setMessage('Payment reference not found');
        return;
      }

      try {
        const response = await console.log(paymentReference);
        
        if (response.success && response.data.status === 'success') {
          setStatus('success');
          setMessage('Payment completed successfully! You will receive a confirmation email shortly.');
        } else {
          setStatus('failed');
          setMessage(response.data?.message || response.error || 'Payment verification failed');
        }
      } catch (error) {
        console.error('Payment verification error:', error);
        setStatus('failed');
        setMessage('Failed to verify payment status');
      }
    };

    verifyPayment();
  }, [reference, trxref]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20 pb-20 px-4">
        <div className="max-w-2xl mx-auto">
          <Card className="p-8 text-center">
            {status === 'loading' && (
              <>
                <Loader2 className="w-16 h-16 mx-auto mb-4 animate-spin text-primary" />
                <h2 className="text-2xl font-bold mb-4">Verifying Payment</h2>
                <p className="text-muted-foreground">{message}</p>
              </>
            )}
            
            {status === 'success' && (
              <>
                <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-500" />
                <h2 className="text-2xl font-bold mb-4 text-green-600">Payment Successful!</h2>
                <p className="text-muted-foreground mb-6">{message}</p>
                <div className="space-y-4">
                  <Button 
                    className="w-full" 
                    onClick={() => navigate('/diaspora')}
                  >
                    Back to Diaspora Services
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    onClick={() => {
                      const phoneNumber = import.meta.env.VITE_WHATSAPP_NUMBER || "+254712345678";
                      const message = encodeURIComponent(`Hello! I have successfully completed payment with reference: ${reference || trxref}. I would like to schedule my diaspora consultation.`);
                      window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
                    }}
                  >
                    Schedule Consultation via WhatsApp
                  </Button>
                </div>
              </>
            )}
            
            {status === 'failed' && (
              <>
                <XCircle className="w-16 h-16 mx-auto mb-4 text-red-500" />
                <h2 className="text-2xl font-bold mb-4 text-red-600">Payment Failed</h2>
                <p className="text-muted-foreground mb-6">{message}</p>
                <div className="space-y-4">
                  <Button 
                    className="w-full" 
                    onClick={() => navigate('/diaspora')}
                  >
                    Try Again
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    onClick={() => {
                      const phoneNumber = import.meta.env.VITE_WHATSAPP_NUMBER || "+254712345678";
                      const message = encodeURIComponent("Hello! I'm having trouble with payment for diaspora consultation. Could you please help me?");
                      window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
                    }}
                  >
                    Get Help via WhatsApp
                  </Button>
                </div>
              </>
            )}
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
