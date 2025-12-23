import { useState, useEffect, useCallback } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Search,
  Eye,
  Filter,
  Calendar,
  Clock,
  User,
  Globe,
  Phone,
  Mail,
  RefreshCw,
  MessageSquare,
  CalendarPlus,
  AlertTriangle,
  Building,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { adminService, bookingConsultantsService } from "@/lib/api";

interface Consultation {
  id: number;
  user_id?: number;
  full_name: string;
  phone: string;
  email?: string;
  organization?: string;
  time?: string;
  consult_type: string;
  date?: string;
  preferred_date?: string;
  preferred_time?: string;
  service_type?: string;
  country?: string | null;
  details?: string;
  status?: string;
  created_at: string;
  updated_at?: string;
}

// Header Component
function HeaderSection({
  onRefresh,
  loading,
  consultationType,
}: {
  onRefresh: () => void;
  loading: boolean;
  consultationType: "booking" | "normal";
}) {
  const title =
    consultationType === "booking"
      ? "Booking Consultants Management"
      : "Consultations Management";

  return (
    <div className="flex justify-between items-center">
      <h1 className="text-3xl font-bold">{title}</h1>
      <Button
        onClick={onRefresh}
        variant="outline"
        size="sm"
        disabled={loading}
      >
        <RefreshCw
          className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
        />
        Refresh
      </Button>
    </div>
  );
}

// Filters Component
function FiltersSection({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  consultationType,
}: {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  consultationType: "booking" | "normal";
}) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex gap-4 items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search consultations..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
          {consultationType === "normal" && (
            <Select value={statusFilter} onValueChange={onStatusFilterChange}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="contacted">Contacted</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          )}
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Client Info Component
function ClientInfo({
  consultation,
  consultationType,
}: {
  consultation: Consultation;
  consultationType: "booking" | "normal";
}) {
  return (
    <div>
      <div className="font-medium">{consultation.full_name}</div>
      <div className="text-sm text-gray-500">{consultation.phone}</div>
      {consultationType === "booking" && consultation.email && (
        <div className="text-sm text-gray-500">{consultation.email}</div>
      )}
    </div>
  );
}

// Status Badge Component
function StatusBadge({ status }: { status: string }) {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "contacted":
        return "bg-orange-100 text-orange-800";
      case "scheduled":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "confirmed":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return <Badge className={getStatusColor(status)}>{status}</Badge>;
}

// Scheduled Time Component
function ScheduledTime({
  consultation,
  consultationType,
}: {
  consultation: Consultation;
  consultationType: "booking" | "normal";
}) {
  const formatTime = (timeString: string) => {
    try {
      const date = new Date(timeString);
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      return timeString; // Return as-is if parsing fails
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString();
    } catch (error) {
      return dateString; // Return as-is if parsing fails
    }
  };

  const dateField =
    consultationType === "booking"
      ? consultation.preferred_date
      : consultation.date;
  const timeField =
    consultationType === "booking"
      ? consultation.preferred_time
      : consultation.time;

  return (
    <div className="flex items-center gap-2">
      <Calendar className="h-4 w-4 text-gray-400" />
      <div>
        {dateField && <div className="text-sm">{formatDate(dateField)}</div>}
        {timeField && (
          <div className="text-xs text-gray-500">{formatTime(timeField)}</div>
        )}
      </div>
    </div>
  );
}

// Organization Info Component
function OrganizationInfo({ consultation }: { consultation: Consultation }) {
  return (
    <div className="flex items-center gap-2">
      <Building className="h-4 w-4 text-gray-400" />
      <span>{consultation.organization || "N/A"}</span>
    </div>
  );
}

// Country Info Component
function CountryInfo({ consultation }: { consultation: Consultation }) {
  return (
    <div className="flex items-center gap-2">
      <Globe className="h-4 w-4 text-gray-400" />
      <span>{consultation.country || "N/A"}</span>
    </div>
  );
}

// Consultation Actions Component
function ConsultationActions({
  consultation,
  consultationType,
  onViewDetails,
  onUpdateStatus,
}: {
  consultation: Consultation;
  consultationType: "booking" | "normal";
  onViewDetails: (id: number) => void;
  onUpdateStatus: (id: number, status: string) => void;
}) {
  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onViewDetails(consultation.id)}
      >
        <Eye className="h-4 w-4" />
      </Button>
      {consultationType === "normal" && consultation.status && (
        <Select
          onValueChange={(status) => onUpdateStatus(consultation.id, status)}
        >
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Update" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="contacted">Contacted</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="scheduled">Scheduled</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      )}
    </div>
  );
}

// No Consultations Found Component
function NoConsultationsFound() {
  return (
    <div className="text-gray-500">
      <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
      <h3 className="text-lg font-medium mb-2">No consultations found</h3>
      <p>No consultations match your current filters.</p>
    </div>
  );
}

// Pagination Controls Component
function PaginationControls({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  return (
    <div className="flex justify-center gap-2 mt-4">
      <Button
        variant="outline"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        Previous
      </Button>
      <span className="flex items-center px-4">
        Page {currentPage} of {totalPages}
      </span>
      <Button
        variant="outline"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        Next
      </Button>
    </div>
  );
}

// Consultation Details Modal Component
function ConsultationDetailsModal({
  consultation,
  consultationType,
  open,
  onOpenChange,
  onSendWhatsApp,
  onScheduleMeeting,
  onSendEmail,
  onCallClient,
}: {
  consultation: Consultation | null;
  consultationType: "booking" | "normal";
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSendWhatsApp: (consultation: Consultation) => void;
  onScheduleMeeting: (consultation: Consultation) => void;
  onSendEmail: (email: string) => void;
  onCallClient: (phone: string) => void;
}) {
  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const formatTime = (timeString: string) => {
    try {
      const date = new Date(timeString);
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      return timeString; // Return as-is if parsing fails
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString();
    } catch (error) {
      return dateString; // Return as-is if parsing fails
    }
  };

  if (!consultation) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Consultation Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Client Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Name
                  </label>
                  <p>{consultation.full_name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Phone
                  </label>
                  <p className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-400" />
                    {consultation.phone}
                  </p>
                </div>
                {consultationType === "booking" && consultation.email && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Email
                    </label>
                    <p className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      {consultation.email}
                    </p>
                  </div>
                )}
                {consultationType === "booking" &&
                  consultation.organization && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Organization
                      </label>
                      <p className="flex items-center gap-2">
                        <Building className="h-4 w-4 text-gray-400" />
                        {consultation.organization}
                      </p>
                    </div>
                  )}
                {consultationType === "normal" && consultation.country && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Country
                    </label>
                    <p className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-gray-400" />
                      {consultation.country}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Consultation Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {consultationType === "normal" && consultation.service_type && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Service Type
                    </label>
                    <p>{consultation.service_type}</p>
                  </div>
                )}
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Consultation Type
                  </label>
                  <p>{consultation.consult_type}</p>
                </div>
                {consultationType === "normal" && consultation.date && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Scheduled Date
                    </label>
                    <p>{formatDate(consultation.date)}</p>
                  </div>
                )}
                {consultationType === "booking" &&
                  consultation.preferred_date && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Preferred Date
                      </label>
                      <p>{formatDate(consultation.preferred_date)}</p>
                    </div>
                  )}
                {consultationType === "normal" && consultation.time && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Scheduled Time
                    </label>
                    <p className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-400" />
                      {formatTime(consultation.time)}
                    </p>
                  </div>
                )}
                {consultationType === "booking" &&
                  consultation.preferred_time && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Preferred Time
                      </label>
                      <p className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-400" />
                        {formatTime(consultation.preferred_time)}
                      </p>
                    </div>
                  )}
                {consultationType === "normal" && consultation.status && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Status
                    </label>
                    <StatusBadge status={consultation.status} />
                  </div>
                )}
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Requested On
                  </label>
                  <p>{formatDateTime(consultation.created_at)}</p>
                </div>
                {consultationType === "booking" && consultation.details && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Additional Details
                    </label>
                    <p className="text-sm mt-1 p-2 bg-gray-50 rounded-md">
                      {consultation.details}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          {consultationType === "normal" && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-3 flex-wrap">
                  <Button
                    onClick={() => onCallClient(consultation.phone)}
                    variant="outline"
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    Call Client
                  </Button>
                  <Button
                    onClick={() => onSendWhatsApp(consultation)}
                    variant="outline"
                    className="bg-green-50 hover:bg-green-100 border-green-200"
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    WhatsApp Client
                  </Button>
                  <Button
                    onClick={() => onScheduleMeeting(consultation)}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <CalendarPlus className="h-4 w-4 mr-2" />
                    Schedule Meeting
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Schedule Meeting Modal Component
function ScheduleMeetingModal({
  consultation,
  open,
  onOpenChange,
  onScheduleMeeting,
  onSendWhatsAppDetails,
}: {
  consultation: Consultation | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onScheduleMeeting: (
    consultationId: number,
    scheduleData: any
  ) => Promise<boolean>;
  onSendWhatsAppDetails: (consultationId: number) => Promise<boolean>;
}) {
  const [scheduleForm, setScheduleForm] = useState({
    meetingDate: "",
    meetingTime: "",
    meetingType: "online",
    meetingLink: "",
    notes: "",
    duration: "60",
  });
  const [isMeetingScheduled, setIsMeetingScheduled] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (consultation && open) {
      setIsMeetingScheduled(false);

      // Format the date from consultation
      let formattedDate = "";
      if (consultation.preferred_date) {
        try {
          const date = new Date(consultation.preferred_date);
          if (!isNaN(date.getTime())) {
            formattedDate = date.toISOString().split("T")[0];
          }
        } catch (error) {
          console.log("Date parsing error:", error);
        }
      }

      // Format the time from consultation
      let formattedTime = "";
      if (consultation.preferred_time) {
        try {
          const date = new Date(consultation.preferred_time);
          if (!isNaN(date.getTime())) {
            formattedTime = date.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            });
          }
        } catch (error) {
          console.log("Time parsing error:", error);
        }
      }

      setScheduleForm({
        meetingDate: formattedDate,
        meetingTime: formattedTime,
        meetingType: "online",
        meetingLink: "",
        notes: "",
        duration: "60",
      });
    }
  }, [consultation, open]);

  const handleScheduleSubmit = async () => {
    if (!consultation) return;

    setIsSubmitting(true);
    try {
      const success = await onScheduleMeeting(consultation.id, scheduleForm);
      if (success) {
        setIsMeetingScheduled(true);
        toast({
          title: "Meeting Scheduled Successfully",
          description: `Meeting scheduled for ${scheduleForm.meetingDate} at ${scheduleForm.meetingTime}. Use the button below to send WhatsApp details.`,
        });
      }
    } catch (error: any) {
      console.error("Failed to schedule meeting:", error);
      toast({
        title: "Error",
        description:
          error.message || "Failed to schedule meeting. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendWhatsAppDetails = async () => {
    if (!consultation) return;

    setIsSubmitting(true);
    try {
      const success = await onSendWhatsAppDetails(consultation.id);
      if (success) {
        toast({
          title: "WhatsApp Details Sent Successfully",
          description: `Meeting details sent to ${consultation.full_name}`,
        });
        onOpenChange(false);
      }
    } catch (error: any) {
      console.error("Failed to send WhatsApp details:", error);
      toast({
        title: "Error",
        description:
          error.message || "Failed to send WhatsApp details. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!consultation) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Schedule Meeting</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900">
              Client: {consultation.full_name}
            </h4>
            <p className="text-sm text-blue-700">{consultation.phone}</p>
            <p className="text-sm text-blue-600">
              Consultation Type: {consultation.consult_type}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="meetingDate">Meeting Date *</Label>
              <Input
                id="meetingDate"
                type="date"
                value={scheduleForm.meetingDate}
                onChange={(e) =>
                  setScheduleForm({
                    ...scheduleForm,
                    meetingDate: e.target.value,
                  })
                }
                min={new Date().toISOString().split("T")[0]}
                required
                className={
                  scheduleForm.meetingDate
                    ? "border-green-300"
                    : "border-amber-300"
                }
              />
              {scheduleForm.meetingDate && (
                <p className="text-xs text-green-600">✓ Date selected</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="meetingTime">Meeting Time *</Label>
              <Input
                id="meetingTime"
                type="time"
                value={scheduleForm.meetingTime}
                onChange={(e) =>
                  setScheduleForm({
                    ...scheduleForm,
                    meetingTime: e.target.value,
                  })
                }
                required
                className={
                  scheduleForm.meetingTime
                    ? "border-green-300"
                    : "border-amber-300"
                }
              />
              {scheduleForm.meetingTime && (
                <p className="text-xs text-green-600">✓ Time selected</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="meetingType">Meeting Type *</Label>
              <Select
                value={scheduleForm.meetingType}
                onValueChange={(value) =>
                  setScheduleForm({ ...scheduleForm, meetingType: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select meeting type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="online">
                    Online (Zoom/Teams/Meet)
                  </SelectItem>
                  <SelectItem value="phone">Phone Call</SelectItem>
                  <SelectItem value="in-person">In-Person Meeting</SelectItem>
                  <SelectItem value="whatsapp">WhatsApp Video Call</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">Duration (minutes) *</Label>
              <Select
                value={scheduleForm.duration}
                onValueChange={(value) =>
                  setScheduleForm({ ...scheduleForm, duration: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="60">60 minutes</SelectItem>
                  <SelectItem value="90">90 minutes</SelectItem>
                  <SelectItem value="120">2 hours</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {scheduleForm.meetingType === "online" && (
            <div className="space-y-2">
              <Label htmlFor="meetingLink">Meeting Link</Label>
              <Input
                id="meetingLink"
                type="url"
                placeholder="https://zoom.us/j/... or https://teams.microsoft.com/..."
                value={scheduleForm.meetingLink}
                onChange={(e) =>
                  setScheduleForm({
                    ...scheduleForm,
                    meetingLink: e.target.value,
                  })
                }
              />
              <p className="text-sm text-gray-500">
                If no link is provided, we'll create a Zoom meeting
                automatically.
              </p>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              placeholder="Any specific agenda items, preparation requirements, or special instructions..."
              value={scheduleForm.notes}
              onChange={(e) =>
                setScheduleForm({ ...scheduleForm, notes: e.target.value })
              }
              rows={3}
            />
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 text-green-800">
              <MessageSquare className="h-4 w-4" />
              <span className="font-medium">WhatsApp Confirmation</span>
            </div>
            <p className="text-sm text-green-700 mt-1">
              After scheduling, a WhatsApp confirmation message will be
              automatically sent to the client with all meeting details.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            {(!scheduleForm.meetingDate || !scheduleForm.meetingTime) && (
              <p className="text-sm text-amber-600 bg-amber-50 p-2 rounded-md border border-amber-200">
                <AlertTriangle className="h-4 w-4 inline mr-1" />
                Please fill in both meeting date and time to enable scheduling.
              </p>
            )}

            <div className="flex flex-col gap-3">
              {/* Main Action Buttons */}
              <div className="flex gap-3 justify-end">
                <Button
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  disabled={isSubmitting}
                >
                  {isMeetingScheduled ? "Close" : "Cancel"}
                </Button>
                {!isMeetingScheduled && (
                  <Button
                    onClick={handleScheduleSubmit}
                    disabled={
                      !scheduleForm.meetingDate ||
                      !scheduleForm.meetingTime ||
                      isSubmitting
                    }
                    className={`${
                      !scheduleForm.meetingDate || !scheduleForm.meetingTime
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed hover:bg-gray-300"
                        : "bg-blue-600 hover:bg-blue-700 text-white"
                    }`}
                  >
                    <CalendarPlus className="h-4 w-4 mr-2" />
                    {isSubmitting ? "Scheduling..." : "Schedule Meeting"}
                  </Button>
                )}
              </div>

              {/* Manual WhatsApp Send Button - Show only after meeting is scheduled */}
              {isMeetingScheduled && (
                <div className="border-t pt-3">
                  <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                    <div>
                      <p className="text-sm font-semibold text-green-800">
                        ✅ Meeting Successfully Scheduled!
                      </p>
                      <p className="text-xs text-green-600 mt-1">
                        📅 {scheduleForm.meetingDate} at{" "}
                        {scheduleForm.meetingTime}
                      </p>
                      <p className="text-xs text-green-600">
                        Click below to send meeting details to client via
                        WhatsApp
                      </p>
                    </div>
                    <Button
                      onClick={handleSendWhatsAppDetails}
                      className="bg-green-600 hover:bg-green-700 text-white"
                      size="sm"
                      disabled={isSubmitting}
                    >
                      <MessageSquare className="h-4 w-4 mr-2" />
                      {isSubmitting ? "Sending..." : "Send WhatsApp Details"}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Main AdminConsultations Component
export function AdminConsultations({
  consultationType = "normal",
}: {
  consultationType?: "booking" | "normal";
}) {
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedConsultation, setSelectedConsultation] =
    useState<Consultation | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { toast } = useToast();

  const fetchConsultations = useCallback(async () => {
    try {
      setLoading(true);
      const response =
        consultationType === "booking"
          ? await bookingConsultantsService.getConsultations()
          : await adminService.getAllConsultations();

      if (response.success) {
        setConsultations(response.data || []);
        setTotalPages(response.data?.pagination?.totalPages || 1);
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to fetch consultations",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Failed to fetch consultations:", error);
      toast({
        title: "Error",
        description: "Failed to fetch consultations",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [currentPage, statusFilter, searchTerm, toast, consultationType]);

  useEffect(() => {
    fetchConsultations();
  }, [fetchConsultations]);

  const viewConsultationDetails = async (consultationId: number) => {
    try {
      const response =
        consultationType === "booking"
          ? await bookingConsultantsService.getConsultation(consultationId)
          : await adminService.getConsultationById(consultationId);

      if (response.success) {
        setSelectedConsultation(response.data);
        setShowDetailsModal(true);
      } else {
        toast({
          title: "Error",
          description:
            response.message || "Failed to fetch consultation details.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Failed to fetch consultation details:", error);
      toast({
        title: "Error",
        description: "Failed to fetch consultation details.",
        variant: "destructive",
      });
    }
  };

  const updateConsultationStatus = async (
    consultationId: number,
    newStatus: string
  ) => {
    try {
      if (consultationType !== "normal") return;

      const response = await adminService.updateConsultationStatus(
        consultationId,
        newStatus
      );

      if (response.success) {
        fetchConsultations(); // Refresh the list
        if (
          selectedConsultation &&
          selectedConsultation.id === consultationId
        ) {
          setSelectedConsultation({
            ...selectedConsultation,
            status: newStatus,
          });
        }
        toast({
          title: "Success",
          description: "Consultation status updated successfully.",
        });
      } else {
        toast({
          title: "Error",
          description:
            response.message || "Failed to update consultation status.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Failed to update consultation status:", error);
      toast({
        title: "Error",
        description: "Failed to update consultation status.",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  // WhatsApp messaging functionality
  const sendWhatsAppMessage = (consultation: Consultation) => {
    const whatsappNumber =
      import.meta.env.VITE_WHATSAPP_NUMBER || "+254712345678";

    // Extract phone number from consultation
    let clientPhone = consultation.phone;

    if (!clientPhone) {
      toast({
        title: "Error",
        description: "No phone number found for this client.",
        variant: "destructive",
      });
      return;
    }

    // Clean and format phone number
    clientPhone = clientPhone.replace(/\s+/g, "").replace(/[-()]/g, "");

    // Handle Kenyan phone number formats
    if (clientPhone.startsWith("0")) {
      clientPhone = "+254" + clientPhone.slice(1);
    } else if (clientPhone.startsWith("254")) {
      clientPhone = "+" + clientPhone;
    } else if (!clientPhone.startsWith("+")) {
      clientPhone = "+254" + clientPhone;
    }

    const message = encodeURIComponent(
      `Hello ${consultation.full_name}, this is regarding your consultation request for ${consultation.consult_type}. ` +
        `We would like to discuss the details of your consultation. ` +
        `Please let us know if you have any questions or need to reschedule. Best regards, Galloways Kenya Team.`
    );

    // Open WhatsApp with the message to client's number
    window.open(
      `https://wa.me/${clientPhone.replace("+", "")}?text=${message}`,
      "_blank"
    );

    toast({
      title: "WhatsApp Message Sent",
      description: `Message sent to ${consultation.full_name} at ${clientPhone}`,
    });

    // Update consultation status to indicate contact was made (only for normal consultations)
    if (consultationType === "normal" && consultation.status) {
      updateConsultationStatus(consultation.id, "contacted");
    }
  };

  // Schedule meeting functionality
  const openScheduleModal = (consultation: Consultation) => {
    setSelectedConsultation(consultation);
    setShowScheduleModal(true);
  };

  const handleScheduleMeeting = async (
    consultationId: number,
    scheduleData: any
  ): Promise<boolean> => {
    try {
      // TODO: Replace this with your actual API call to schedule the meeting
      // Example:
      // const response = await adminService.scheduleConsultation(consultationId, scheduleData);
      // return response.success;

      // Temporary mock result for demonstration
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call
      return true;
    } catch (error: any) {
      console.error("Failed to schedule meeting:", error);
      toast({
        title: "Error",
        description:
          error.message || "Failed to schedule meeting. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  const handleSendWhatsAppDetails = async (
    consultationId: number
  ): Promise<boolean> => {
    try {
      // TODO: Replace this with your actual API call to send WhatsApp details
      // Example:
      // const response = await adminService.sendWhatsAppDetails(consultationId);
      // return response.success;

      // Temporary mock result for demonstration
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call
      return true;
    } catch (error: any) {
      console.error("Failed to send WhatsApp details:", error);
      toast({
        title: "Error",
        description:
          error.message || "Failed to send WhatsApp details. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  const handleCallClient = (phone: string) => {
    window.open(`tel:${phone}`, "_blank");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading consultations...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <HeaderSection
        onRefresh={fetchConsultations}
        loading={loading}
        consultationType={consultationType}
      />

      <FiltersSection
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        consultationType={consultationType}
      />

      {/* Consultations Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            {consultationType === "booking"
              ? "Booking Consultants"
              : "Consultations"}{" "}
            List ({consultations.length} records)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 font-medium">Client</th>
                  {consultationType === "booking" && (
                    <th className="text-left p-3 font-medium">Organization</th>
                  )}
                  <th className="text-left p-3 font-medium">
                    Consultation Type
                  </th>
                  {consultationType === "normal" && (
                    <th className="text-left p-3 font-medium">Service Type</th>
                  )}
                  <th className="text-left p-3 font-medium">
                    {consultationType === "booking" ? "Preferred" : "Scheduled"}
                  </th>
                  {consultationType === "normal" && (
                    <th className="text-left p-3 font-medium">Country</th>
                  )}
                  {consultationType === "normal" && (
                    <th className="text-left p-3 font-medium">Status</th>
                  )}
                  <th className="text-left p-3 font-medium">Requested</th>
                  <th className="text-left p-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {consultations.length > 0 ? (
                  consultations.map((consultation) => (
                    <tr
                      key={consultation.id}
                      className="border-b hover:bg-gray-50"
                    >
                      <td className="p-3">
                        <ClientInfo
                          consultation={consultation}
                          consultationType={consultationType}
                        />
                      </td>
                      {consultationType === "booking" && (
                        <td className="p-3">
                          <OrganizationInfo consultation={consultation} />
                        </td>
                      )}
                      <td className="p-3">{consultation.consult_type}</td>
                      {consultationType === "normal" && (
                        <td className="p-3">
                          {consultation.service_type || "General"}
                        </td>
                      )}
                      <td className="p-3">
                        <ScheduledTime
                          consultation={consultation}
                          consultationType={consultationType}
                        />
                      </td>
                      {consultationType === "normal" && (
                        <td className="p-3">
                          <CountryInfo consultation={consultation} />
                        </td>
                      )}
                      {consultationType === "normal" && (
                        <td className="p-3">
                          <StatusBadge
                            status={consultation.status || "pending"}
                          />
                        </td>
                      )}
                      <td className="p-3">
                        {formatDate(consultation.created_at)}
                      </td>
                      <td className="p-3">
                        <ConsultationActions
                          consultation={consultation}
                          consultationType={consultationType}
                          onViewDetails={viewConsultationDetails}
                          onUpdateStatus={updateConsultationStatus}
                        />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={consultationType === "booking" ? 7 : 8}
                      className="text-center py-12"
                    >
                      <NoConsultationsFound />
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <PaginationControls
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </CardContent>
      </Card>

      <ConsultationDetailsModal
        consultation={selectedConsultation}
        consultationType={consultationType}
        open={showDetailsModal}
        onOpenChange={setShowDetailsModal}
        onSendWhatsApp={sendWhatsAppMessage}
        onScheduleMeeting={openScheduleModal}
        onSendEmail={() => {}}
        onCallClient={handleCallClient}
      />

      {consultationType === "normal" && (
        <ScheduleMeetingModal
          consultation={selectedConsultation}
          open={showScheduleModal}
          onOpenChange={setShowScheduleModal}
          onScheduleMeeting={handleScheduleMeeting}
          onSendWhatsAppDetails={handleSendWhatsAppDetails}
        />
      )}
    </div>
  );
}
