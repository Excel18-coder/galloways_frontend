import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Briefcase,
  Eye,
  Edit,
  Trash2,
  Search,
  Filter,
  RefreshCw,
  Download,
  CheckCircle,
  Clock,
  AlertTriangle,
  XCircle,
  Plus,
  Users,
  Calendar,
  DollarSign,
  BarChart3
} from "lucide-react";
// API import disabled for build
import { toast } from "sonner";

interface OutsourcingRequest {
  id: string;
  organizationName: string;
  coreFunctions: string;
  services: string[] | string;
  location: string;
  address: string;
  budgetRange: string;
  natureOfOutsourcing: string;
  contactEmail?: string;
  contactPhone?: string;
  timeline?: string;
  specificRequirements?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface OutsourcingStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  inProgress: number;
  completed: number;
  totalValue: number;
  avgBudget: number;
}

export function AdminOutsourcing() {
  const [outsourcingRequests, setOutsourcingRequests] = useState<OutsourcingRequest[]>([]);
  const [stats, setStats] = useState<OutsourcingStats>({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    inProgress: 0,
    completed: 0,
    totalValue: 0,
    avgBudget: 0
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedRequest, setSelectedRequest] = useState<OutsourcingRequest | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const fetchOutsourcingRequests = useCallback(async () => {
    try {
      setLoading(true);
      
      const filterStatus = statusFilter === "all" ? undefined : statusFilter;
      const result = await console.log(
        currentPage, 
        20, 
        filterStatus, 
        searchTerm || undefined
      );

      if (result.success) {
        setOutsourcingRequests(result.data.outsourcingRequests || []);
        setTotalPages(result.data.pagination?.totalPages || 1);
      } else {
        console.error('API returned error:', result);
        setOutsourcingRequests([]);
        toast.error("Failed to fetch outsourcing requests");
      }
    } catch (error) {
      console.error('Failed to fetch outsourcing requests:', error);
      setOutsourcingRequests([]);
      toast.error("Failed to fetch outsourcing requests data");
    } finally {
      setLoading(false);
    }
  }, [currentPage, statusFilter, searchTerm]);

  const fetchOutsourcingStats = useCallback(async () => {
    try {
      const result = await console.log();
      if (result.success) {
        setStats(result.data);
      }
    } catch (error) {
      console.error('Failed to fetch outsourcing stats:', error);
      toast.error("Failed to fetch outsourcing statistics");
    }
  }, []);

  useEffect(() => {
    fetchOutsourcingRequests();
    fetchOutsourcingStats();
  }, [fetchOutsourcingRequests, fetchOutsourcingStats]);

    const handleStatusUpdate = async (requestId: string, newStatus: string) => {
    try {
      await console.log(parseInt(requestId), newStatus);
      await fetchOutsourcingRequests();
    } catch (error) {
      console.error('Error updating outsourcing status:', error);
    }
  };

    const handleDeleteRequest = async (requestId: string) => {
    if (window.confirm('Are you sure you want to delete this outsourcing request?')) {
      try {
        await console.log(parseInt(requestId));
        await fetchOutsourcingRequests();
      } catch (error) {
        console.error('Error deleting outsourcing request:', error);
      }
    }
  };

  const exportData = async (format: 'csv' | 'json') => {
    try {
      const result = await console.log(format);
      if (result.success) {
        const blob = new Blob([result.data], { 
          type: format === 'csv' ? 'text/csv' : 'application/json' 
        });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `outsourcing_requests_${new Date().toISOString().split('T')[0]}.${format}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        toast.success(`Outsourcing data exported as ${format.toUpperCase()}`);
      }
    } catch (error) {
      console.error('Export failed:', error);
      toast.error("Failed to export outsourcing data");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Outsourcing Management</h1>
        <div className="flex gap-2">
          <Button onClick={() => exportData('csv')} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Button onClick={() => exportData('json')} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export JSON
          </Button>
          <Button onClick={fetchOutsourcingRequests} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              {stats.pending} pending approval
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.inProgress}</div>
            <p className="text-xs text-muted-foreground">
              Active projects
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.totalValue)}</div>
            <p className="text-xs text-muted-foreground">
              Avg: {formatCurrency(stats.avgBudget)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.completed} completed
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="search">Search Requests</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search by business name, contact person, or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="status-filter">Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger id="status-filter">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="priority-filter">Priority</Label>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger id="priority-filter">
                  <SelectValue placeholder="All Priorities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Outsourcing Requests Table */}
      <Card>
        <CardHeader>
          <CardTitle>Outsourcing Requests</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <RefreshCw className="h-6 w-6 animate-spin mr-2" />
              Loading outsourcing requests...
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="p-3 text-left">Organization</th>
                      <th className="p-3 text-left">Location</th>
                      <th className="p-3 text-left">Services</th>
                      <th className="p-3 text-left">Budget Range</th>
                      <th className="p-3 text-left">Nature</th>
                      <th className="p-3 text-left">Status</th>
                      <th className="p-3 text-left">Created</th>
                      <th className="p-3 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {outsourcingRequests.length > 0 ? (
                      outsourcingRequests.map((request) => (
                        <tr key={request.id} className="border-b hover:bg-gray-50">
                          <td className="p-3">
                            <div>
                              <div className="font-medium">{request.organizationName}</div>
                              <div className="text-sm text-gray-500">{request.coreFunctions}</div>
                            </div>
                          </td>
                          <td className="p-3">
                            <div>
                              <div className="font-medium">{request.location}</div>
                              <div className="text-sm text-gray-500">{request.address}</div>
                            </div>
                          </td>
                          <td className="p-3">
                            <div className="text-sm">
                              {Array.isArray(request.services) 
                                ? request.services.slice(0, 2).join(', ')
                                : request.services}
                              {Array.isArray(request.services) && request.services.length > 2 && '...'}
                            </div>
                          </td>
                          <td className="p-3 font-medium">{request.budgetRange}</td>
                          <td className="p-3">
                            <div className="text-sm text-gray-600 truncate max-w-32" title={request.natureOfOutsourcing}>
                              {request.natureOfOutsourcing}
                            </div>
                          </td>
                          <td className="p-3">
                            <Badge className={getStatusColor(request.status)}>
                              {request.status.replace('_', ' ')}
                            </Badge>
                          </td>
                          <td className="p-3">{formatDate(request.createdAt)}</td>
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setSelectedRequest(request);
                                  setShowDetailsModal(true);
                                }}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setSelectedRequest(request);
                                  setShowEditModal(true);
                                }}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-600 hover:text-red-800"
                                onClick={() => handleDeleteRequest(request.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={8} className="p-8 text-center text-gray-500">
                          No outsourcing requests found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-6">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <span className="px-4 py-2">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Request Details Modal */}
      <Dialog open={showDetailsModal} onOpenChange={setShowDetailsModal}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Outsourcing Request Details</DialogTitle>
          </DialogHeader>
          {selectedRequest && (
            <div className="space-y-6">
              <Tabs defaultValue="details" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="requirements">Requirements</TabsTrigger>
                  <TabsTrigger value="actions">Actions</TabsTrigger>
                </TabsList>
                
                <TabsContent value="details" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium">Organization Name</Label>
                      <p className="text-sm text-gray-600">{selectedRequest.organizationName}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Core Functions</Label>
                      <p className="text-sm text-gray-600">{selectedRequest.coreFunctions}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Contact Email</Label>
                      <p className="text-sm text-gray-600">{selectedRequest.contactEmail}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Contact Phone</Label>
                      <p className="text-sm text-gray-600">{selectedRequest.contactPhone}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Location</Label>
                      <p className="text-sm text-gray-600">{selectedRequest.location}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Address</Label>
                      <p className="text-sm text-gray-600">{selectedRequest.address}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Budget Range</Label>
                      <p className="text-sm text-gray-600">{selectedRequest.budgetRange}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Timeline</Label>
                      <p className="text-sm text-gray-600">{selectedRequest.timeline}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Status</Label>
                      <Badge className={getStatusColor(selectedRequest.status)}>
                        {selectedRequest.status.replace('_', ' ')}
                      </Badge>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Services Required</Label>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {Array.isArray(selectedRequest.services) 
                          ? selectedRequest.services.map((service, index) => (
                              <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                                {service}
                              </span>
                            ))
                          : <p className="text-sm text-gray-600">{selectedRequest.services}</p>
                        }
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium">Nature of Outsourcing</Label>
                    <p className="text-sm text-gray-600 mt-1 p-3 bg-gray-50 rounded-lg">
                      {selectedRequest.natureOfOutsourcing}
                    </p>
                  </div>
                  
                  {selectedRequest.specificRequirements && (
                    <div>
                      <Label className="text-sm font-medium">Specific Requirements</Label>
                      <p className="text-sm text-gray-600 mt-1 p-3 bg-gray-50 rounded-lg whitespace-pre-wrap">
                        {selectedRequest.specificRequirements}
                      </p>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="requirements" className="space-y-4">
                  {selectedRequest.specificRequirements ? (
                    <div>
                      <Label className="text-sm font-medium">Specific Requirements</Label>
                      <p className="text-sm text-gray-600 mt-1 p-3 bg-gray-50 rounded-lg whitespace-pre-wrap">
                        {selectedRequest.specificRequirements}
                      </p>
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-8">No specific requirements provided</p>
                  )}
                </TabsContent>
                
                <TabsContent value="actions" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Button 
                      className="w-full"
                      onClick={() => handleStatusUpdate(selectedRequest.id, 'APPROVED')}
                      disabled={selectedRequest.status === 'approved'}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Approve Request
                    </Button>
                    <Button 
                      variant="destructive"
                      className="w-full"
                      onClick={() => handleStatusUpdate(selectedRequest.id, 'REJECTED')}
                      disabled={selectedRequest.status === 'rejected'}
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Reject Request
                    </Button>
                    <Button 
                      variant="outline"
                      className="w-full"
                      onClick={() => handleStatusUpdate(selectedRequest.id, 'IN_PROGRESS')}
                      disabled={selectedRequest.status === 'in_progress'}
                    >
                      <Clock className="h-4 w-4 mr-2" />
                      Mark In Progress
                    </Button>
                    <Button 
                      variant="outline"
                      className="w-full"
                      onClick={() => handleStatusUpdate(selectedRequest.id, 'COMPLETED')}
                      disabled={selectedRequest.status === 'completed'}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Mark Completed
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Request Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Outsourcing Request</DialogTitle>
          </DialogHeader>
          {selectedRequest && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select 
                    value={selectedRequest.status} 
                    onValueChange={(value) => setSelectedRequest({...selectedRequest, status: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="priority">Priority</Label>
                  <Select 
                    value={selectedRequest.status} 
                    onValueChange={(value) => setSelectedRequest({...selectedRequest, status: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setShowEditModal(false)}>
                  Cancel
                </Button>
                <Button onClick={() => handleStatusUpdate(selectedRequest.id, selectedRequest.status)}>
                  Save Changes
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
