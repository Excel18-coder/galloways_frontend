import { useSearchParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Download, Home, FileText } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const transactionRef = searchParams.get("ref") || "TXN123456789";
  const amount = searchParams.get("amount") || "15,000";

  const handleDownloadReceipt = () => {
    // Simulate PDF download
    const element = document.createElement("a");
    element.href = "data:text/plain;charset=utf-8,Payment Receipt - Galloways Insurance\n\nTransaction Reference: " + transactionRef + "\nAmount: KES " + amount + "\nDate: " + new Date().toLocaleDateString();
    element.download = `Receipt_${transactionRef}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
  <div className="h-screen">
      <Header />
      <main className="py-16 bg-secondary/30">
        <div className="max-w-2xl mx-auto px-4">
          <Card className="shadow-lg border-green-200">
            <CardContent className="p-12 text-center">
              <CheckCircle className="h-20 w-20 text-green-600 mx-auto mb-6" />
              
              <h1 className="text-3xl font-bold text-primary mb-4">
                Payment Successful!
              </h1>
              
              <p className="text-lg text-muted-foreground mb-8">
                Thank you for your payment. Your transaction has been processed successfully.
              </p>

              <div className="bg-secondary/50 rounded-lg p-6 mb-8">
                <div className="grid grid-cols-2 gap-4 text-left">
                  <div>
                    <p className="text-sm text-muted-foreground">Transaction Reference</p>
                    <p className="font-mono font-semibold">{transactionRef}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Amount Paid</p>
                    <p className="font-semibold text-accent text-xl">KES {amount}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Date</p>
                    <p className="font-semibold">{new Date().toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <p className="font-semibold text-green-600">Completed</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  A receipt has been automatically sent to your email address.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    onClick={handleDownloadReceipt}
                    variant="outline"
                    className="flex items-center space-x-2"
                  >
                    <Download className="h-4 w-4" />
                    <span>Download Receipt</span>
                  </Button>
                  
                  <Button
                    asChild
                    variant="outline"
                    className="flex items-center space-x-2"
                  >
                    <Link to="/claims">
                      <FileText className="h-4 w-4" />
                      <span>View Claims</span>
                    </Link>
                  </Button>
                  
                  <Button
                    asChild
                    className="bg-accent hover:bg-accent/90 text-accent-foreground flex items-center space-x-2"
                  >
                    <Link to="/">
                      <Home className="h-4 w-4" />
                      <span>Back to Home</span>
                    </Link>
                  </Button>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-secondary">
                <p className="text-sm text-muted-foreground">
                  Need help? Contact us at{" "}
                  <a href="mailto:info@galloways.co.ke" className="text-accent hover:underline">
                    info@galloways.co.ke
                  </a>{" "}
                  or{" "}
                  <a href="tel:+254700123456" className="text-accent hover:underline">
                    +254 700 123 456
                  </a>
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

export default PaymentSuccess;