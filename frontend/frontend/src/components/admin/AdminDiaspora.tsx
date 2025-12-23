import { useState, useEffect } from "react";
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
import {
  Eye,
  Filter,
  Globe,
  Calendar,
  Clock,
  User,
  Mail,
  RefreshCw,
} from "lucide-react";
// API import disabled for build
import { useToast } from "@/hooks/use-toast";
import { adminService } from "@/lib/api";

interface DiasporaRequest {
  id: number;
  name: string;
  email: string;
  phone: string;
  country: string;
  consult_time: string;
  details: string;
  created_at?: string;
  status: string;
}

export function AdminDiaspora() {
  const [diasporaRequests, setDiasporaRequests] = useState<DiasporaRequest[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] =
    useState<DiasporaRequest | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { toast } = useToast();

  const fetchDiasporaRequests = async () => {
    try {
      setLoading(true);

      const filterStatus = statusFilter === "all" ? undefined : statusFilter;
      const result = await adminService.getAllDiasporaRequests();

      if (result.success) {
        setDiasporaRequests(result.data || []);
        setTotalPages(result.data.pagination || 1);
      } else {
        console.error("API returned error:", result);
        setDiasporaRequests([]);
        toast({
          title: "Error",
          description: "Failed to fetch diaspora requests.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Failed to fetch diaspora requests:", error);
      setDiasporaRequests([]);
      toast({
        title: "Error",
        description: "Failed to fetch diaspora requests.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiasporaRequests();
  }, [currentPage, statusFilter, searchTerm]);

  const handleRequestDetails = (request: DiasporaRequest) => {
    setSelectedRequest(request);
    setShowDetailsModal(true);
  };

  const updateRequestStatus = async (requestId: number, status: string) => {
    try {
      const result = await adminService.updateDiasporaStatus(
        requestId,
        status
      );

      if (result.success) {
        await fetchDiasporaRequests();
        toast({
          title: "Status Updated",
          description: `Diaspora request status updated to ${status}`,
        });
      } else {
        toast({
          title: "Update Failed",
          description: result.error || "Failed to update request status",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error("Update diaspora request status error:", error);
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update request status",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "contacted":
        return "bg-blue-100 text-blue-800";
      case "scheduled":
        return "bg-purple-100 text-purple-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getCountryFlag = (country: string) => {
    const flags: Record<string, string> = {
      USA: "🇺🇸",
      UK: "🇬🇧",
      Canada: "🇨🇦",
      Australia: "🇦🇺",
      Germany: "🇩🇪",
      France: "🇫🇷",
      Japan: "🇯🇵",
      "South Africa": "🇿🇦",
      UAE: "🇦🇪",
      "Saudi Arabia": "🇸🇦",
      Qatar: "🇶🇦",
      Kuwait: "🇰🇼",
    };
    return flags[country] || "🌍";
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <h2 className="text-2xl font-bold">Diaspora Services</h2>
        <Button
          onClick={fetchDiasporaRequests}
          variant="outline"
          size="sm"
          disabled={loading}
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search diaspora requests..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="contacted">Contacted</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Diaspora Requests List */}
      <Card>
        <CardHeader>
          <CardTitle>
            Diaspora Service Requests ({diasporaRequests.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : diasporaRequests.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Globe className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No diaspora requests found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {diasporaRequests.map((request) => (
                <div
                  key={request.id}
                  className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold">{request.name}</h3>
                        <Badge className={getStatusColor(request.status)}>
                          {request.status}
                        </Badge>
                        <span className="text-lg">
                          {getCountryFlag(request.country)}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Mail className="h-4 w-4" />
                          {request.email}
                        </div>
                        <div className="flex items-center gap-1">
                          <Globe className="h-4 w-4" />
                          {request.country}
                        </div>
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          {request.details}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(request.created_at).toLocaleDateString()}
                        </div>
                      </div>
                      {request.created_at && (
                        <div className="mt-2 text-sm text-green-600 flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          Scheduled:{" "}
                          {new Date(request.created_at).toLocaleString()}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRequestDetails(request)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Select
                        value={request.status}
                        onValueChange={(status) =>
                          updateRequestStatus(request.id, status)
                        }
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="contacted">Contacted</SelectItem>
                          <SelectItem value="scheduled">Scheduled</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <span className="px-4 py-2 text-sm">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Request Details Modal */}
      <Dialog open={showDetailsModal} onOpenChange={setShowDetailsModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Diaspora Service Request Details</DialogTitle>
          </DialogHeader>
          {selectedRequest && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold">Client Name:</label>
                  <p>{selectedRequest.name}</p>
                </div>
                <div>
                  <label className="font-semibold">Email:</label>
                  <p>{selectedRequest.email}</p>
                </div>
                <div>
                  <label className="font-semibold">Phone:</label>
                  <p>{selectedRequest.phone}</p>
                </div>
                <div>
                  <label className="font-semibold">Country:</label>
                  <p className="flex items-center gap-2">
                    <span>{getCountryFlag(selectedRequest.country)}</span>
                    {selectedRequest.country}
                  </p>
                </div>
                <div>
                  <label className="font-semibold">Timezone:</label>
                  <p>{selectedRequest.consult_time}</p>
                </div>
                <div>
                  <label className="font-semibold">Service Interest:</label>
                  <p>{selectedRequest.details}</p>
                </div>
              </div>

              {selectedRequest.created_at && (
                <div>
                  <label className="font-semibold">Created At:</label>
                  <p className="text-green-600">
                    {new Date(selectedRequest.created_at).toLocaleString()}
                  </p>
                </div>
              )}

              <div className="flex items-center gap-2">
                <label className="font-semibold">Status:</label>
                <Badge className={getStatusColor(selectedRequest.status)}>
                  {selectedRequest.status}
                </Badge>
              </div>

              <div>
                <label className="font-semibold">Submitted:</label>
                <p>{new Date(selectedRequest.created_at).toLocaleString()}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
