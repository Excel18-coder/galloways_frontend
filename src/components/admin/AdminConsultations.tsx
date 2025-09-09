import { useState, useEffect, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Search, Eye, Filter, Calendar, Clock, User, Globe, Phone, Mail, RefreshCw, MessageSquare, CalendarPlus, AlertTriangle } from 'lucide-react';
import { adminRealtimeService } from '@/lib/admin-realtime';
// API import disabled for build
import { useToast } from '@/hooks/use-toast';

interface Consultation {
  id: number;
  name: string;
  email: string;
  phone: string;
  country?: string;
  timezone?: string;
  scheduledAt?: string;
  status: string;
  createdAt: string;
  company?: string;
  consultationDate: string;
  consultationTime: string;
  message: string;
  serviceType: string;
  user?: {
    id: number;
    name: string;
    email: string;
    profile?: {
      phone: string;
    };
  };
}

export function AdminConsultations() {
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedConsultation, setSelectedConsultation] = useState<Consultation | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [isMeetingScheduled, setIsMeetingScheduled] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [scheduleForm, setScheduleForm] = useState({
    meetingDate: '',
    meetingTime: '',
    meetingType: 'online',
    meetingLink: '',
    notes: '',
    duration: '60'
  });
  const { toast } = useToast();

  const handleConsultationsData = useCallback((data: { consultations: Consultation[] }) => {
    console.log('Received consultations data:', data);
    setConsultations(data.consultations || []);
    setLoading(false);
  }, []);

  const handleConsultationUpdate = useCallback((data: any) => {
    console.log('Received consultation update:', data);
    setConsultations(prev => prev.map(consultation => 
      consultation.id === data.id ? { ...consultation, ...data } : consultation
    ));
    toast({
      title: "Consultation Updated",
      description: `Consultation ${data.id} has been updated.`,
    });
  }, [toast]);

  const handleMockDataWarning = useCallback((data: { message: string }) => {
    toast({
      title: "Using Demo Data",
      description: data.message,
      variant: "default",
    });
  }, [toast]);

  useEffect(() => {
    // Connect to real-time service
    console.log();

    // Subscribe to consultations updates
    console.log('consultations-data', handleConsultationsData);
    console.log('consultation-update', handleConsultationUpdate);
    console.log('mock-data-warning', handleMockDataWarning);

    // Fetch data immediately from API
    fetchConsultations();

    return () => {
      console.log('consultations-data', handleConsultationsData);
      console.log('consultation-update', handleConsultationUpdate);
      console.log('mock-data-warning', handleMockDataWarning);
    };
  }, [handleConsultationsData, handleConsultationUpdate, handleMockDataWarning]);

  // Refetch when filters change
  useEffect(() => {
    fetchConsultations();
  }, [currentPage, statusFilter, searchTerm]);

  const fetchConsultations = async () => {
    try {
      setLoading(true);
      console.log('📋 Fetching real consultations data from API...');
      
      // Build API URL with parameters
      const params = new URLSearchParams();
      params.append('page', currentPage.toString());
      params.append('limit', '20');
      if (statusFilter !== "all") params.append('status', statusFilter);
      if (searchTerm) params.append('search', searchTerm);
      
      const url = `${import.meta.env.VITE_API_URL || 'https://galloways.co.ke/api'}/admin/consultations?${params.toString()}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('📋 Real consultations data received:', result);

      if (result.success) {
        const consultationsData = result.data?.consultations || result.data || [];
        setConsultations(consultationsData);
        setTotalPages(result.data?.pagination?.totalPages || 1);
        
        toast({
          title: "Consultations Loaded",
          description: `Found ${consultationsData.length} consultations from database`,
        });
      } else {
        console.error('API returned error:', result);
        setConsultations([]);
        toast({
          title: "API Error",
          description: result?.message || "Backend returned error",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Failed to fetch consultations:', error);
      
      // Fallback to demo data if API fails
      const fallbackData = [{
        id: 1,
        client_name: 'John Doe',
        client_email: 'john@example.com',
        client_phone: '+254700000000',
        consultation_type: 'Insurance Consultation',
        preferred_date: '2025-09-10',
        preferred_time: '14:00',
        description: 'Need consultation on motor insurance',
        status: 'pending',
        created_at: '2025-09-01T10:00:00Z',
        updated_at: '2025-09-01T10:00:00Z'
      }];

      // Map fallbackData to match Consultation interface
      setConsultations(
        fallbackData.map((item) => ({
          id: item.id,
          name: item.client_name,
          email: item.client_email,
          phone: item.client_phone,
          country: undefined,
          timezone: undefined,
          scheduledAt: undefined,
          status: item.status,
          createdAt: item.created_at,
          company: undefined,
          consultationDate: item.preferred_date,
          consultationTime: item.preferred_time,
          message: item.description,
          serviceType: item.consultation_type,
          user: undefined,
        }))
      );
      setTotalPages(1);
      
      toast({
        title: "Connection Error",
        description: "Using demo data - check API connection",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const viewConsultationDetails = async (consultationId: number) => {
    try {
      const url = `${import.meta.env.VITE_API_URL || 'https://galloways.co.ke/api'}/admin/consultations/${consultationId}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();

      if (result.success) {
        setSelectedConsultation(result.data);
        setShowDetailsModal(true);
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to fetch consultation details.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Failed to fetch consultation details:', error);
      toast({
        title: "Error",
        description: "Failed to fetch consultation details.",
        variant: "destructive",
      });
    }
  };

  const updateConsultationStatus = async (consultationId: number, newStatus: string) => {
    try {
      const url = `${import.meta.env.VITE_API_URL || 'https://galloways.co.ke/api'}/admin/consultations/${consultationId}/status`;
      
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();

      if (result.success) {
        fetchConsultations(); // Refresh the list
        if (selectedConsultation && selectedConsultation.id === consultationId) {
          setSelectedConsultation({ ...selectedConsultation, status: newStatus });
        }
        toast({
          title: "Success",
          description: "Consultation status updated successfully.",
        });
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to update consultation status.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Failed to update consultation status:', error);
      toast({
        title: "Error",
        description: "Failed to update consultation status.",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'contacted': return 'bg-orange-100 text-orange-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'confirmed': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  // WhatsApp messaging functionality
  const sendWhatsAppMessage = (consultation: Consultation) => {
    const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER || "+254712345678";
    
    // Extract phone number from consultation
    let clientPhone = consultation.phone || consultation.user?.profile?.phone;
    
    if (!clientPhone) {
      toast({
        title: "Error",
        description: "No phone number found for this client.",
        variant: "destructive",
      });
      return;
    }

    // Clean and format phone number
    clientPhone = clientPhone.replace(/\s+/g, '').replace(/[-()]/g, '');
    
    // Handle Kenyan phone number formats
    if (clientPhone.startsWith('0')) {
      clientPhone = '+254' + clientPhone.slice(1);
    } else if (clientPhone.startsWith('254')) {
      clientPhone = '+' + clientPhone;
    } else if (!clientPhone.startsWith('+')) {
      clientPhone = '+254' + clientPhone;
    }

    const message = encodeURIComponent(
      `Hello ${consultation.name}, this is regarding your consultation request for ${consultation.serviceType}. ` +
      `We would like to discuss the details of your consultation scheduled for ${consultation.consultationDate} at ${consultation.consultationTime}. ` +
      `Please let us know if you have any questions or need to reschedule. Best regards, Galloways Kenya Team.`
    );

    // Open WhatsApp with the message to client's number
    window.open(`https://wa.me/${clientPhone.replace('+', '')}?text=${message}`, '_blank');
    
    toast({
      title: "WhatsApp Message Sent",
      description: `Message sent to ${consultation.name} at ${clientPhone}`,
    });

    // Update consultation status to indicate contact was made
    updateConsultationStatus(consultation.id, 'contacted');
  };

  // Schedule meeting functionality
  const openScheduleModal = (consultation: Consultation) => {
    setSelectedConsultation(consultation);
    setIsMeetingScheduled(false);
    
    // Convert consultation date to proper format for date input (YYYY-MM-DD)
    let formattedDate = '';
    if (consultation.consultationDate) {
      // Handle various date formats
      const dateStr = consultation.consultationDate;
      try {
        if (dateStr.includes('/')) {
          // Format like "12/25/2024" or "25/12/2024"
          const parts = dateStr.split('/');
          if (parts.length === 3) {
            // Assume MM/DD/YYYY or DD/MM/YYYY - let's try both
            const date1 = new Date(`${parts[2]}-${parts[0].padStart(2, '0')}-${parts[1].padStart(2, '0')}`);
            const date2 = new Date(`${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`);
            
            // Use the date that's not invalid
            const useDate = !isNaN(date1.getTime()) ? date1 : date2;
            if (!isNaN(useDate.getTime())) {
              formattedDate = useDate.toISOString().split('T')[0];
            }
          }
        } else if (dateStr.includes('-')) {
          // Already in YYYY-MM-DD or similar format
          const date = new Date(dateStr);
          if (!isNaN(date.getTime())) {
            formattedDate = date.toISOString().split('T')[0];
          }
        } else {
          // Try direct date parsing
          const date = new Date(dateStr);
          if (!isNaN(date.getTime())) {
            formattedDate = date.toISOString().split('T')[0];
          }
        }
      } catch (error) {
        console.log('Date parsing error:', error);
      }
    }

    // Convert consultation time to proper format for time input (HH:MM)
    let formattedTime = '';
    if (consultation.consultationTime) {
      const timeStr = consultation.consultationTime;
      try {
        // Handle formats like "2:00 PM", "14:00", "02:00", etc.
        if (timeStr.includes('AM') || timeStr.includes('PM')) {
          // 12-hour format
          const [time, period] = timeStr.split(' ');
          const [hours, minutes] = time.split(':');
          let hour = parseInt(hours);
          
          if (period === 'PM' && hour !== 12) hour += 12;
          if (period === 'AM' && hour === 12) hour = 0;
          
          formattedTime = `${hour.toString().padStart(2, '0')}:${minutes || '00'}`;
        } else {
          // 24-hour format - just ensure proper formatting
          const [hours, minutes] = timeStr.split(':');
          formattedTime = `${hours.padStart(2, '0')}:${minutes || '00'}`;
        }
      } catch (error) {
        console.log('Time parsing error:', error);
      }
    }

    setScheduleForm({
      meetingDate: formattedDate,
      meetingTime: formattedTime,
      meetingType: 'online',
      meetingLink: '',
      notes: '',
      duration: '60'
    });
    setShowScheduleModal(true);
  };

  const handleScheduleSubmit = async () => {
    if (!selectedConsultation) return;

    try {
      // TODO: Replace this with your actual API call to schedule the meeting
      // Example:
      // const response = await fetch(`${import.meta.env.VITE_API_URL || 'https://galloways.co.ke/api'}/admin/consultations/${selectedConsultation.id}/schedule`, {
      //   method: 'POST',
      //   headers: {
      //     'Accept': 'application/json',
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(scheduleForm)
      // });
      // const result = await response.json();

      // Temporary mock result for demonstration
      const result = { success: true, message: "Meeting scheduled (mock)" };

      if (result.success) {
        setIsMeetingScheduled(true);
        toast({
          title: "Meeting Scheduled Successfully",
          description: result.message || `Meeting scheduled for ${scheduleForm.meetingDate} at ${scheduleForm.meetingTime}. Use the button below to send WhatsApp details.`,
        });

        // Refresh the consultations list
        fetchConsultations();
        // Keep modal open so user can send WhatsApp details
      } else {
        throw new Error(result.message || 'Failed to schedule meeting');
      }
      
    } catch (error: any) {
      console.error('Failed to schedule meeting:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to schedule meeting. Please try again.",
        variant: "destructive",
      });
    }
  };

  const sendMeetingDetailsWhatsApp = async () => {
    if (!selectedConsultation) return;

    try {
      // TODO: Replace this with your actual API call to send WhatsApp details
      // Example:
      // const response = await fetch(`${import.meta.env.VITE_API_URL || 'https://galloways.co.ke/api'}/admin/consultations/${selectedConsultation.id}/send-whatsapp`, {
      //   method: 'POST',
      //   headers: {
      //     'Accept': 'application/json',
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     includeLink: !!scheduleForm.meetingLink,
      //     message: undefined
      //   })
      // });
      // const result = await response.json();

      // Temporary mock result for demonstration
      const result = { success: true, message: "WhatsApp details sent (mock)" };

      if (result.success) {
        toast({
          title: "WhatsApp Details Sent Successfully",
          description: `Meeting details sent to ${selectedConsultation.name}`,
        });

        // Close modal after successful send
        setShowScheduleModal(false);
        setSelectedConsultation(null);
        setIsMeetingScheduled(false);
      } else {
        throw new Error(result.message || 'Failed to send WhatsApp details');
      }
    } catch (error: any) {
      console.error('Failed to send WhatsApp details:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to send WhatsApp details. Please try again.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchConsultations();
  }, [currentPage, searchTerm, statusFilter]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading consultations...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Consultations Management</h1>
        <Button onClick={fetchConsultations} variant="outline" size="sm" disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search consultations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
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
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Consultations Table */}
      <Card>
        <CardHeader>
          <CardTitle>Consultations List ({consultations.length} records)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 font-medium">Client</th>
                  <th className="text-left p-3 font-medium">Service Type</th>
                  <th className="text-left p-3 font-medium">Scheduled</th>
                  <th className="text-left p-3 font-medium">Country</th>
                  <th className="text-left p-3 font-medium">Status</th>
                  <th className="text-left p-3 font-medium">Requested</th>
                  <th className="text-left p-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {consultations.length > 0 ? (
                  consultations.map((consultation) => (
                    <tr key={consultation.id} className="border-b hover:bg-gray-50">
                      <td className="p-3">
                        <div>
                          <div className="font-medium">{consultation.name}</div>
                          <div className="text-sm text-gray-500">{consultation.email}</div>
                          {consultation.company && (
                            <div className="text-xs text-gray-400">{consultation.company}</div>
                          )}
                        </div>
                      </td>
                      <td className="p-3">{consultation.serviceType}</td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <div>
                            <div className="text-sm">{consultation.consultationDate}</div>
                            <div className="text-xs text-gray-500">{consultation.consultationTime}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <Globe className="h-4 w-4 text-gray-400" />
                          <span>{consultation.country || 'N/A'}</span>
                        </div>
                      </td>
                      <td className="p-3">
                        <Badge className={getStatusColor(consultation.status)}>
                          {consultation.status}
                        </Badge>
                      </td>
                      <td className="p-3">{formatDate(consultation.createdAt)}</td>
                      <td className="p-3">
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => viewConsultationDetails(consultation.id)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Select onValueChange={(status) => updateConsultationStatus(consultation.id, status)}>
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
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="text-center py-12">
                      <div className="text-gray-500">
                        <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                        <h3 className="text-lg font-medium mb-2">No consultations found</h3>
                        <p>No consultations match your current filters.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-4">
              <Button
                variant="outline"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                Previous
              </Button>
              <span className="flex items-center px-4">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Consultation Details Modal */}
      <Dialog open={showDetailsModal} onOpenChange={setShowDetailsModal}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Consultation Details</DialogTitle>
          </DialogHeader>
          
          {selectedConsultation && (
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
                      <label className="text-sm font-medium text-gray-500">Name</label>
                      <p>{selectedConsultation.name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Email</label>
                      <p className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-gray-400" />
                        {selectedConsultation.email}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Phone</label>
                      <p className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-gray-400" />
                        {selectedConsultation.phone}
                      </p>
                    </div>
                    {selectedConsultation.company && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">Company</label>
                        <p>{selectedConsultation.company}</p>
                      </div>
                    )}
                    {selectedConsultation.country && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">Country</label>
                        <p className="flex items-center gap-2">
                          <Globe className="h-4 w-4 text-gray-400" />
                          {selectedConsultation.country}
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
                    <div>
                      <label className="text-sm font-medium text-gray-500">Service Type</label>
                      <p>{selectedConsultation.serviceType}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Preferred Date</label>
                      <p>{selectedConsultation.consultationDate}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Preferred Time</label>
                      <p className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-400" />
                        {selectedConsultation.consultationTime}
                      </p>
                    </div>
                    {selectedConsultation.timezone && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">Timezone</label>
                        <p>{selectedConsultation.timezone}</p>
                      </div>
                    )}
                    <div>
                      <label className="text-sm font-medium text-gray-500">Status</label>
                      <Badge className={getStatusColor(selectedConsultation.status)}>
                        {selectedConsultation.status}
                      </Badge>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Requested On</label>
                      <p>{formatDateTime(selectedConsultation.createdAt)}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Message */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Client Message</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 whitespace-pre-wrap bg-gray-50 p-4 rounded-lg">
                    {selectedConsultation.message || 'No message provided'}
                  </p>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-3 flex-wrap">
                    <Button 
                      onClick={() => window.open(`mailto:${selectedConsultation.email}`, '_blank')}
                      variant="outline"
                    >
                      <Mail className="h-4 w-4 mr-2" />
                      Send Email
                    </Button>
                    <Button 
                      onClick={() => sendWhatsAppMessage(selectedConsultation)}
                      variant="outline"
                      className="bg-green-50 hover:bg-green-100 border-green-200"
                    >
                      <MessageSquare className="h-4 w-4 mr-2" />
                      WhatsApp Client
                    </Button>
                    <Button 
                      onClick={() => openScheduleModal(selectedConsultation)}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <CalendarPlus className="h-4 w-4 mr-2" />
                      Schedule Meeting
                    </Button>
                    <Button 
                      onClick={() => window.open(`tel:${selectedConsultation.phone}`, '_blank')}
                      variant="outline"
                    >
                      <Phone className="h-4 w-4 mr-2" />
                      Call Client
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Schedule Meeting Modal */}
      <Dialog open={showScheduleModal} onOpenChange={setShowScheduleModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Schedule Meeting</DialogTitle>
          </DialogHeader>
          
          {selectedConsultation && (
            <div className="space-y-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900">Client: {selectedConsultation.name}</h4>
                <p className="text-sm text-blue-700">{selectedConsultation.email} • {selectedConsultation.phone}</p>
                <p className="text-sm text-blue-600">Service: {selectedConsultation.serviceType}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="meetingDate">Meeting Date *</Label>
                  <Input
                    id="meetingDate"
                    type="date"
                    value={scheduleForm.meetingDate}
                    onChange={(e) => {
                      console.log('Date changed to:', e.target.value);
                      setScheduleForm({...scheduleForm, meetingDate: e.target.value});
                    }}
                    min={new Date().toISOString().split('T')[0]}
                    required
                    className={scheduleForm.meetingDate ? 'border-green-300' : 'border-amber-300'}
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
                    onChange={(e) => {
                      console.log('Time changed to:', e.target.value);
                      setScheduleForm({...scheduleForm, meetingTime: e.target.value});
                    }}
                    required
                    className={scheduleForm.meetingTime ? 'border-green-300' : 'border-amber-300'}
                  />
                  {scheduleForm.meetingTime && (
                    <p className="text-xs text-green-600">✓ Time selected</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="meetingType">Meeting Type *</Label>
                  <Select value={scheduleForm.meetingType} onValueChange={(value) => setScheduleForm({...scheduleForm, meetingType: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select meeting type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="online">Online (Zoom/Teams/Meet)</SelectItem>
                      <SelectItem value="phone">Phone Call</SelectItem>
                      <SelectItem value="in-person">In-Person Meeting</SelectItem>
                      <SelectItem value="whatsapp">WhatsApp Video Call</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (minutes) *</Label>
                  <Select value={scheduleForm.duration} onValueChange={(value) => setScheduleForm({...scheduleForm, duration: value})}>
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

              {(scheduleForm.meetingType === 'online') && (
                <div className="space-y-2">
                  <Label htmlFor="meetingLink">Meeting Link</Label>
                  <Input
                    id="meetingLink"
                    type="url"
                    placeholder="https://zoom.us/j/... or https://teams.microsoft.com/..."
                    value={scheduleForm.meetingLink}
                    onChange={(e) => setScheduleForm({...scheduleForm, meetingLink: e.target.value})}
                  />
                  <p className="text-sm text-gray-500">
                    If no link is provided, we'll create a Zoom meeting automatically.
                  </p>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="notes">Additional Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Any specific agenda items, preparation requirements, or special instructions..."
                  value={scheduleForm.notes}
                  onChange={(e) => setScheduleForm({...scheduleForm, notes: e.target.value})}
                  rows={3}
                />
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 text-green-800">
                  <MessageSquare className="h-4 w-4" />
                  <span className="font-medium">WhatsApp Confirmation</span>
                </div>
                <p className="text-sm text-green-700 mt-1">
                  After scheduling, a WhatsApp confirmation message will be automatically sent to the client with all meeting details.
                </p>
              </div>

              {/* Debug Section - Remove after testing */}
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                <p className="text-sm font-medium text-blue-800 mb-2">Debug Info:</p>
                <div className="text-xs text-blue-700 space-y-1">
                  <p>Meeting Date: "{scheduleForm.meetingDate}" (Length: {scheduleForm.meetingDate.length})</p>
                  <p>Meeting Time: "{scheduleForm.meetingTime}" (Length: {scheduleForm.meetingTime.length})</p>
                  <p>Button Enabled: {(!scheduleForm.meetingDate || !scheduleForm.meetingTime) ? 'NO' : 'YES'}</p>
                </div>
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
                    <Button variant="outline" onClick={() => {
                      setShowScheduleModal(false);
                      setSelectedConsultation(null);
                      setIsMeetingScheduled(false);
                    }}>
                      {isMeetingScheduled ? 'Close' : 'Cancel'}
                    </Button>
                    {!isMeetingScheduled && (
                      <Button 
                        onClick={handleScheduleSubmit}
                        disabled={!scheduleForm.meetingDate || !scheduleForm.meetingTime}
                        className={`${
                          !scheduleForm.meetingDate || !scheduleForm.meetingTime 
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed hover:bg-gray-300' 
                            : 'bg-blue-600 hover:bg-blue-700 text-white'
                        }`}
                      >
                        <CalendarPlus className="h-4 w-4 mr-2" />
                        Schedule Meeting
                      </Button>
                    )}
                  </div>

                  {/* Manual WhatsApp Send Button - Show only after meeting is scheduled */}
                  {isMeetingScheduled && (
                    <div className="border-t pt-3">
                      <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                        <div>
                          <p className="text-sm font-semibold text-green-800">✅ Meeting Successfully Scheduled!</p>
                          <p className="text-xs text-green-600 mt-1">
                            📅 {scheduleForm.meetingDate} at {scheduleForm.meetingTime}
                          </p>
                          <p className="text-xs text-green-600">Click below to send meeting details to client via WhatsApp</p>
                        </div>
                        <Button 
                          onClick={sendMeetingDetailsWhatsApp}
                          className="bg-green-600 hover:bg-green-700 text-white"
                          size="sm"
                        >
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Send WhatsApp Details
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
