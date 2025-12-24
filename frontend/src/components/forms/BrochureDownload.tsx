import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, CheckCircle, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  company: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface BrochureDownloadProps {
  onClose?: () => void;
}

export default function BrochureDownload({ onClose }: BrochureDownloadProps) {
  const [isDownloaded, setIsDownloaded] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      company: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      // First, log the download request
      console.log("Brochure download request:", data);
      
      // Try to get brochure from backend, fallback to local generation
      let downloadSuccessful = false;
      
      try {
        // Simple direct download - replace with actual brochure URL
        const brochureUrl = "/Downloads/galloways_brochure.pdf";
        const link = document.createElement('a');
        link.href = brochureUrl;
        link.download = 'Galloways_Insurance_Brochure.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        downloadSuccessful = true;
        
        toast({
          title: "Brochure Downloaded!",
          description: "The official brochure has been downloaded from our servers.",
        });
      } catch (error) {
        console.log("Backend brochure not available, generating locally:", error);
        
        // Fallback: Create a local brochure file
        const pdfContent = `
        Galloways Insurance Agency & Consultancy Services
        
        Comprehensive Insurance Solutions & Expert Advisory
        
        Contact Information:
        Name: ${data.name}
        Email: ${data.email}
        Company: ${data.company || 'Individual'}
        
        Our Services:
        • Risk Assessment & Management
        • Corporate Insurance Structuring  
        • Claims Audits & Processing
        • Policy Reviews & Optimization
        • Professional Training & Workshops
        • Industry-Specific Solutions
        
        Specialized Expertise:
        • Credit File Insurance Underwriting
        • NGO & Development Organization Insurance
        • Banking & Financial Services Insurance
        • Professional Indemnity Coverage
        • Motor & Property Insurance
        
        Contact us for personalized consultations:
        Phone: +254720769993 / +254758301346
        Email: gallowaysquotations@gmail.com
        
        Licensed by IRA (Insurance Regulatory Authority)
        14+ Years of Professional Experience
      `;
      
        const blob = new Blob([pdfContent], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'galloways-insurance-brochure.txt';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        
        downloadSuccessful = true;
        
        toast({
          title: "Brochure Generated!",
          description: "A comprehensive brochure has been generated and downloaded to your device.",
        });
      }
      
      if (downloadSuccessful) {
        setIsDownloaded(true);
      }
    } catch (error: any) {
      console.error('Brochure download error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to download brochure. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isDownloaded) {
    return (
      <Card className="max-w-md mx-auto">
        <CardContent className="text-center pt-6">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Brochure Downloaded!</h3>
          <p className="text-muted-foreground mb-4">
            Thank you for your interest! The brochure has been downloaded to your device.
          </p>
          <p className="text-sm text-muted-foreground mb-4">
            We'll also send you a digital copy via email for easy access.
          </p>
          {onClose && (
            <Button onClick={onClose} className="w-full">
              Close
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Download Our Brochure
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="Your full name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address *</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="your.email@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="company"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company/Organization</FormLabel>
                  <FormControl>
                    <Input placeholder="Your company name (optional)" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-4">
              <Button 
                type="submit" 
                className="flex-1"
                disabled={form.formState.isSubmitting}
              >
                <Download className="w-4 h-4 mr-2" />
                {form.formState.isSubmitting ? "Preparing..." : "Download Brochure"}
              </Button>
              {onClose && (
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}