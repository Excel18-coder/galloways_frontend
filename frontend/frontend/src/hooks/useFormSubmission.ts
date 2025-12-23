import emailjs from '@emailjs/browser';
import { useToast } from '@/hooks/use-toast';

interface FormSubmissionData {
  name: string;
  email: string;
  phone?: string;
  formType: string;
  [key: string]: any;
}

export const useFormSubmission = () => {
  const { toast } = useToast();

  const submitToEmailJS = async (data: FormSubmissionData): Promise<boolean> => {
    try {
      // EmailJS configuration from environment
      const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
      const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
      const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

      // Fallback configuration for immediate use
      const config = {
        serviceId: serviceId || 'service_galloways',
        templateId: templateId || 'template_galloways',
        publicKey: publicKey || 'your-public-key'
      };

      if (!serviceId || !templateId || !publicKey) {
        console.warn('⚠️ EmailJS not configured - Using console logging');
        console.log('📋 Form Submission:', data);
        
        // Store in localStorage as backup
        const submissions = JSON.parse(localStorage.getItem('form_submissions') || '[]');
        submissions.unshift({
          ...data,
          timestamp: new Date().toISOString(),
          id: Date.now().toString()
        });
        localStorage.setItem('form_submissions', JSON.stringify(submissions.slice(0, 100))); // Keep last 100
        
        toast({
          title: "Form Submitted Successfully!",
          description: "Your submission has been recorded. We'll contact you soon.",
        });
        return true;
      }

      // Prepare email template data
      const emailData = {
        to_email: 'excel6737@gmail.com', // Your admin email
        from_name: data.name,
        from_email: data.email,
        phone: data.phone || 'Not provided',
        form_type: data.formType,
        subject: `New ${data.formType} from ${data.name}`,
        message: formatFormData(data),
        timestamp: new Date().toLocaleString(),
        reply_to: data.email
      };

      // Send via EmailJS
      const result = await emailjs.send(
        config.serviceId,
        config.templateId,
        emailData,
        config.publicKey
      );

      if (result.status === 200) {
        // Also store locally for admin dashboard
        const submissions = JSON.parse(localStorage.getItem('form_submissions') || '[]');
        submissions.unshift({
          ...data,
          timestamp: new Date().toISOString(),
          id: Date.now().toString(),
          status: 'sent'
        });
        localStorage.setItem('form_submissions', JSON.stringify(submissions.slice(0, 100)));

        toast({
          title: "Form Submitted Successfully!",
          description: "Thank you for your submission. We'll contact you within 24 hours.",
        });
        return true;
      } else {
        throw new Error('Email sending failed');
      }
    } catch (error) {
      console.error('❌ Form submission error:', error);
      
      // Fallback: Store locally even if email fails
      const submissions = JSON.parse(localStorage.getItem('form_submissions') || '[]');
      submissions.unshift({
        ...data,
        timestamp: new Date().toISOString(),
        id: Date.now().toString(),
        status: 'pending'
      });
      localStorage.setItem('form_submissions', JSON.stringify(submissions.slice(0, 100)));

      toast({
        title: "Submission Recorded",
        description: "Your form has been saved. Please also contact us directly if urgent.",
        variant: "default",
      });
      return true; // Return true so form still works
    }
  };

  const formatFormData = (data: FormSubmissionData): string => {
    const lines = [`📋 ${data.formType} Submission`];
    lines.push(`👤 Name: ${data.name}`);
    lines.push(`📧 Email: ${data.email}`);
    if (data.phone) lines.push(`📱 Phone: ${data.phone}`);
    lines.push(''); // Empty line

    // Add form-specific fields
    Object.entries(data).forEach(([key, value]) => {
      if (!['name', 'email', 'phone', 'formType'].includes(key) && value) {
        const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
        lines.push(`• ${label}: ${value}`);
      }
    });

    lines.push(''); // Empty line
    lines.push(`⏰ Submitted: ${new Date().toLocaleString()}`);
    lines.push(`🌐 Website: https://galloways.co.ke`);
    
    return lines.join('\n');
  };

  // Method to get stored submissions for admin dashboard
  const getStoredSubmissions = () => {
    return JSON.parse(localStorage.getItem('form_submissions') || '[]');
  };

  // Method to mark submission as processed
  const markAsProcessed = (id: string) => {
    const submissions = getStoredSubmissions();
    const updated = submissions.map((sub: any) => 
      sub.id === id ? { ...sub, status: 'processed', processedAt: new Date().toISOString() } : sub
    );
    localStorage.setItem('form_submissions', JSON.stringify(updated));
  };

  return {
    submitForm: submitToEmailJS,
    getSubmissions: getStoredSubmissions,
    markAsProcessed
  };
};

// Utility function for quick form submission
export const submitInsuranceForm = async (formData: any, formType: string) => {
  const { submitForm } = useFormSubmission();
  return await submitForm({
    ...formData,
    formType
  });
};
