import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, Clock, CheckCircle } from "lucide-react";
import { bookingConsultantsService, ConsultType } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
// API import disabled for build

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  company: z.string().optional(),
  serviceType: z.string().min(1, "Please select a service type"),
  consultationDate: z.string().min(1, "Please select a preferred date"),
  consultationTime: z.string().min(1, "Please select a preferred time"),
  message: z
    .string()
    .min(10, "Please provide details about your consultation needs"),
});

type FormData = z.infer<typeof formSchema>;

interface ConsultationBookingFormProps {
  onClose?: () => void;
}

export default function ConsultationBookingForm({
  onClose,
}: ConsultationBookingFormProps) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      company: "",
      serviceType: "",
      consultationDate: "",
      consultationTime: "",
      message: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      console.log("📋 Submitting consultation to API...");
      const result = await bookingConsultantsService.createConsultation({
        full_name: data.name,
        email: data.email,
        phone: data.phone,
        organization: data.company || "",
        consult_type: data.serviceType as ConsultType,
        preferred_date: data.consultationDate,
        preferred_time: data.consultationTime,
        // message: data.message,
        // consultationTime: data.consultationTime,
        // consultationDate: data.consultationDate,
        // description: data.message,
        // status: "PENDING",
      });

      console.log("Consultation booking result:", result);

      if (result.success) {
        setIsSubmitted(true);
        toast({
          title: "Consultation Booked Successfully!",
          description:
            result.message ||
            "We'll contact you within 24 hours to confirm your appointment.",
        });
      } else {
        throw new Error(result.message || "Failed to book consultation");
      }
    } catch (error: any) {
      console.error("Consultation booking error:", error);
      toast({
        title: "Error",
        description:
          error.message || "Failed to book consultation. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isSubmitted) {
    return (
      <Card className="max-w-md mx-auto">
        <CardContent className="text-center pt-6">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Consultation Booked!</h3>
          <p className="text-muted-foreground mb-4">
            Thank you for booking a consultation with us. We'll contact you
            within 24 hours to confirm your appointment.
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
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarDays className="w-5 h-5" />
          Schedule Your Consultation
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      <Input
                        type="email"
                        placeholder="your.email@example.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number *</FormLabel>
                    <FormControl>
                      <Input placeholder="+254 700 000 000" {...field} />
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
                      <Input
                        placeholder="Your company name (optional)"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="serviceType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Consultation Type *</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select the type of consultation you need" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Risk Assessment">
                        Risk Assessment
                      </SelectItem>
                      <SelectItem value="Corporate Structuring">
                        Corporate Structuring
                      </SelectItem>
                      <SelectItem value="Claims Audit">Claims Audit</SelectItem>
                      <SelectItem value="Policy Review">
                        Policy Review
                      </SelectItem>
                      <SelectItem value="Insurance Training">
                        Insurance Training
                      </SelectItem>
                      <SelectItem value="General Consultation">
                        General Consultation
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="consultationDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preferred Date *</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="consultationTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preferred Time *</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select preferred time" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="09:00">9:00 AM</SelectItem>
                        <SelectItem value="10:00">10:00 AM</SelectItem>
                        <SelectItem value="11:00">11:00 AM</SelectItem>
                        <SelectItem value="14:00">2:00 PM</SelectItem>
                        <SelectItem value="15:00">3:00 PM</SelectItem>
                        <SelectItem value="16:00">4:00 PM</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Consultation Details *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Please describe your consultation needs, current challenges, and what you hope to achieve..."
                      className="min-h-[100px]"
                      {...field}
                    />
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
                <Clock className="w-4 h-4 mr-2" />
                {form.formState.isSubmitting
                  ? "Booking..."
                  : "Book Consultation"}
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
