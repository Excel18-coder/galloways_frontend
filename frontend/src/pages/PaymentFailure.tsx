import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { XCircle, RotateCcw, Phone, Mail } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const PaymentFailure = () => {
  return (
  <div className="h-screen">
      <Header />
      <main className="py-16 bg-secondary/30">
        <div className="max-w-2xl mx-auto px-4">
          <Card className="shadow-lg border-red-200">
            <CardContent className="p-12 text-center">
              <XCircle className="h-20 w-20 text-red-600 mx-auto mb-6" />
              
              <h1 className="text-3xl font-bold text-primary mb-4">
                Payment Failed
              </h1>
              
              <p className="text-lg text-muted-foreground mb-8">
                We're sorry, but your payment could not be processed at this time. 
                Please try again or contact our support team for assistance.
              </p>

              <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
                <h3 className="font-semibold text-red-800 mb-3">Common reasons for payment failure:</h3>
                <ul className="text-sm text-red-700 text-left space-y-1">
                  <li>• Insufficient funds in your account</li>
                  <li>• Incorrect card details or expired card</li>
                  <li>• Transaction limit exceeded</li>
                  <li>• Network connectivity issues</li>
                  <li>• M-PESA transaction cancelled or timed out</li>
                </ul>
              </div>

              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    asChild
                    className="bg-accent hover:bg-accent/90 text-accent-foreground flex items-center space-x-2"
                  >
                    <Link to="/payment">
                      <RotateCcw className="h-4 w-4" />
                      <span>Try Again</span>
                    </Link>
                  </Button>
                  
                  <Button
                    asChild
                    variant="outline"
                    className="flex items-center space-x-2"
                  >
                    <Link to="/">
                      <span>Back to Home</span>
                    </Link>
                  </Button>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-secondary">
                <h3 className="font-semibold text-primary mb-4">Need Assistance?</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Our support team is here to help you complete your payment.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a
                    href="tel:+254700123456"
                    className="inline-flex items-center space-x-2 text-accent hover:underline"
                  >
                    <Phone className="h-4 w-4" />
                    <span>+254 700 123 456</span>
                  </a>
                  
                  <a
                    href="mailto:info@galloways.co.ke"
                    className="inline-flex items-center space-x-2 text-accent hover:underline"
                  >
                    <Mail className="h-4 w-4" />
                    <span>info@galloways.co.ke</span>
                  </a>
                </div>
                
                <p className="text-xs text-muted-foreground mt-4">
                  Support hours: Monday - Friday, 8:00 AM - 6:00 PM EAT
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PaymentFailure;