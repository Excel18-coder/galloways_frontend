import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, Lock, CreditCard, Smartphone } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
// API import disabled for build

const Payment = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams(); 
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [paymentData, setPaymentData] = useState({
    policyNumber: searchParams.get("policy") || "",
    clientName: "",
    amount: searchParams.get("amount") || "",
    paymentMethod: "mpesa",
    phoneNumber: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    email: "",
    billingPhone: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Basic validation
    if (!paymentData.clientName || !paymentData.amount || !paymentData.email) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      setIsProcessing(false);
      return;
    }

    try {
      if (paymentData.paymentMethod === "mpesa") {
        // Process M-PESA payment
        if (!paymentData.phoneNumber) {
          toast({
            title: "Validation Error",
            description: "Please provide a valid phone number for M-PESA payment.",
            variant: "destructive"
          });
          setIsProcessing(false);
          return;
        }

        const mpesaResult = await console.log({
          phone: paymentData.phoneNumber,
          amount: parseInt(paymentData.amount),
          description: `Policy Payment - ${paymentData.policyNumber || 'Premium Payment'}`
        });

        if (mpesaResult.success) {
          // Also create payment record
          await console.log({
            clientName: paymentData.clientName,
            email: paymentData.email,
            amount: paymentData.amount,
            policyNumber: paymentData.policyNumber,
            paymentMethod: paymentData.paymentMethod,
            phone: paymentData.phoneNumber,
            checkoutRequestId: mpesaResult.data.checkoutRequestId
          });

          toast({
            title: "Payment Initiated",
            description: "Please check your phone and enter your M-PESA PIN to complete the payment."
          });

          // Redirect to success page
          setTimeout(() => {
            const transactionRef = mpesaResult.data.checkoutRequestId;
            navigate(`/payment-success?ref=${transactionRef}&amount=${paymentData.amount}`);
          }, 2000);
        } else {
          throw new Error(mpesaResult.message || 'Failed to initiate M-PESA payment');
        }
      } else {
        // Process card payment (simulation)
        if (!paymentData.cardNumber || !paymentData.expiryDate || !paymentData.cvv) {
          toast({
            title: "Validation Error",
            description: "Please fill in all card details.",
            variant: "destructive"
          });
          setIsProcessing(false);
          return;
        }

        // Create payment record
        await console.log({
          clientName: paymentData.clientName,
          email: paymentData.email,
          amount: paymentData.amount,
          policyNumber: paymentData.policyNumber,
          paymentMethod: paymentData.paymentMethod,
          cardNumber: paymentData.cardNumber.slice(-4),
          billingPhone: paymentData.billingPhone
        });

        // Simulate card processing
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const transactionRef = `TXN${Date.now()}`;
        navigate(`/payment-success?ref=${transactionRef}&amount=${paymentData.amount}`);
      }
    } catch (error: any) {
      console.error('Payment processing error:', error);
      toast({
        title: "Payment Failed",
        description: error.message || "Failed to process payment. Please try again.",
        variant: "destructive"
      });
      navigate("/payment-failure");
    } finally {
      setIsProcessing(false);
    }
  };

  if (isProcessing) {
    return (
  <div className="h-screen">
        <Header />
        <main className="py-16">
          <div className="max-w-2xl mx-auto px-4 text-center">
            <Card>
              <CardContent className="p-12">
                <div className="animate-spin w-16 h-16 border-4 border-accent border-t-transparent rounded-full mx-auto mb-6"></div>
                <h2 className="text-2xl font-bold text-primary mb-4">Processing your payment...</h2>
                <p className="text-muted-foreground">Please wait while we process your payment. Do not close this window.</p>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
  <div className="h-screen">
      <Header />
      <main className="py-16 bg-secondary/30">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-primary mb-4">Secure Payment Portal</h1>
            <div className="flex items-center justify-center space-x-4 text-sm text-muted-foreground">
              <div className="flex items-center space-x-1">
                <Shield className="h-4 w-4 text-green-600" />
                <span>Secure Payment</span>
              </div>
              <div className="flex items-center space-x-1">
                <Lock className="h-4 w-4 text-green-600" />
                <span>SSL Protected</span>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Policy Information */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Policy Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium">Policy Number</Label>
                    <p className="text-lg font-mono">{paymentData.policyNumber || "POL-2024-001"}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Amount Due</Label>
                    <p className="text-2xl font-bold text-accent">KES {paymentData.amount || "15,000"}</p>
                  </div>
                  <div className="pt-4 border-t">
                    <p className="text-sm text-muted-foreground">
                      You are making a secure payment to Galloways Insurance Agency
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Payment Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Payment Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Client Information */}
                    <div className="space-y-4">
                      <h3 className="font-semibold text-primary">Client Information</h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="clientName">Client Name *</Label>
                          <Input
                            id="clientName"
                            value={paymentData.clientName}
                            onChange={(e) => setPaymentData(prev => ({ ...prev, clientName: e.target.value }))}
                            placeholder="Enter full name"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="amount">Amount (KES) *</Label>
                          <Input
                            id="amount"
                            type="number"
                            value={paymentData.amount}
                            onChange={(e) => setPaymentData(prev => ({ ...prev, amount: e.target.value }))}
                            placeholder="15000"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    {/* Payment Methods */}
                    <div className="space-y-4">
                      <h3 className="font-semibold text-primary">Payment Method</h3>
                      <Tabs value={paymentData.paymentMethod} onValueChange={(value) => setPaymentData(prev => ({ ...prev, paymentMethod: value }))}>
                        <TabsList className="grid w-full grid-cols-2">
                          <TabsTrigger value="mpesa" className="flex items-center space-x-2">
                            <Smartphone className="h-4 w-4" />
                            <span>M-PESA</span>
                          </TabsTrigger>
                          <TabsTrigger value="card" className="flex items-center space-x-2">
                            <CreditCard className="h-4 w-4" />
                            <span>Card</span>
                          </TabsTrigger>
                        </TabsList>

                        <TabsContent value="mpesa" className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="phoneNumber">Phone Number *</Label>
                            <Input
                              id="phoneNumber"
                              value={paymentData.phoneNumber}
                              onChange={(e) => setPaymentData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                              placeholder="254700123456"
                              required
                            />
                            <p className="text-sm text-muted-foreground">
                              You will receive an STK push notification to complete the payment
                            </p>
                          </div>
                        </TabsContent>

                        <TabsContent value="card" className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="cardNumber">Card Number *</Label>
                            <Input
                              id="cardNumber"
                              value={paymentData.cardNumber}
                              onChange={(e) => setPaymentData(prev => ({ ...prev, cardNumber: e.target.value }))}
                              placeholder="1234 5678 9012 3456"
                              required
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="expiryDate">Expiry Date *</Label>
                              <Input
                                id="expiryDate"
                                value={paymentData.expiryDate}
                                onChange={(e) => setPaymentData(prev => ({ ...prev, expiryDate: e.target.value }))}
                                placeholder="MM/YY"
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="cvv">CVV *</Label>
                              <Input
                                id="cvv"
                                value={paymentData.cvv}
                                onChange={(e) => setPaymentData(prev => ({ ...prev, cvv: e.target.value }))}
                                placeholder="123"
                                maxLength={3}
                                required
                              />
                            </div>
                          </div>
                        </TabsContent>
                      </Tabs>
                    </div>

                    {/* Billing Details */}
                    <div className="space-y-4">
                      <h3 className="font-semibold text-primary">Billing Details</h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="email">Email Address *</Label>
                          <Input
                            id="email"
                            type="email"
                            value={paymentData.email}
                            onChange={(e) => setPaymentData(prev => ({ ...prev, email: e.target.value }))}
                            placeholder="client@example.com"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="billingPhone">Phone Number *</Label>
                          <Input
                            id="billingPhone"
                            value={paymentData.billingPhone}
                            onChange={(e) => setPaymentData(prev => ({ ...prev, billingPhone: e.target.value }))}
                            placeholder="254700123456"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-6 border-t">
                      <Button
                        type="submit"
                        className="w-full bg-accent hover:bg-accent/90 text-accent-foreground text-lg py-6"
                        disabled={isProcessing}
                      >
                        <Lock className="h-5 w-5 mr-2" />
                        Confirm & Pay KES {paymentData.amount || "15,000"}
                      </Button>
                      <p className="text-xs text-muted-foreground text-center mt-4">
                        By proceeding, you agree to our terms and conditions. Your payment is secured with 256-bit SSL encryption.
                      </p>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Payment;