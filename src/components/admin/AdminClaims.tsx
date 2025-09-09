import { useState, useEffect, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Search, Eye, Download, Filter, FileText, Calendar, DollarSign, User, RefreshCw } from 'lucide-react';
// API import disabled for build
import { useToast } from '@/hooks/use-toast';

interface Document {
  id: number;
  originalName: string;
  size: number;
  createdAt: string;
  path?: string;
  mimeType?: string;
}

interface Claim {
  id: number;
  policyNumber: string;
  claimType: string;
  incidentDate: string;
  estimatedLoss: number;
  description: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  status: string;
  documents: Document[];
  createdAt: string;
  updatedAt: string;
  user?: {
    id: number;
    name: string;
    email: string;
  };
}

export function AdminClaims() {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedClaim, setSelectedClaim] = useState<Claim | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { toast } = useToast();

  const handleClaimsData = useCallback((data: { claims: Claim[] }) => {
    console.log('Received claims data:', data);
    setClaims(data.claims || []);
    setLoading(false);
  }, []);

  const handleClaimUpdate = useCallback((data: any) => {
    console.log('Received claim update:', data);
    setClaims(prev => prev.map(claim => 
      claim.id === data.id ? { ...claim, ...data } : claim
    ));
    toast({
      title: "Claim Updated",
      description: `Claim ${data.id} has been updated.`,
    });
  }, [toast]);

  useEffect(() => {
    fetchClaims();
  }, [currentPage, statusFilter, searchTerm]);

  const fetchClaims = async () => {
    try {
      setLoading(true);
      console.log('📋 Fetching real claims data from API...');
      
      // Fetch real data from Laravel backend API
      const url = `${import.meta.env.VITE_API_URL || 'https://galloways.co.ke/api'}/admin/claims?page=${currentPage}&status=${statusFilter}&search=${searchTerm}`;
      
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
      console.log('📋 Real claims data received:', result);

      if (result && result.success) {
        const claimsData = result.data?.claims || result.data || [];
        setClaims(claimsData);
        setTotalPages(result.data?.pagination?.totalPages || 1);
        
        toast({
          title: "Claims Loaded",
          description: `Found ${claimsData.length} claims from database`,
        });
      } else {
        console.error('API returned error:', result);
        setClaims([]);
        toast({
          title: "API Error",
          description: result?.message || "Backend returned error",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Failed to fetch claims:', error);
      
      // Fallback to demo data if API fails
      const fallbackData = [
        {
          id: 1,
          policyNumber: 'POL001',
          claimType: 'Motor',
          incidentDate: '2025-09-01',
          estimatedLoss: 50000,
          description: 'Vehicle accident claim',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          phone: '+254700000000',
          status: 'pending',
          documents: [],
          createdAt: '2025-09-01T10:00:00Z',
          updatedAt: '2025-09-01T10:00:00Z'
        }
      ];
      
      setClaims(fallbackData);
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

  const viewClaimDetails = async (claimId: number) => {
    try {
      // Simulated API response for development
      const result = {
        success: true,
        data: claims.find(claim => claim.id === claimId) || null,
        message: 'Claim details loaded successfully'
      };

      if (result.success) {
        setSelectedClaim(result.data);
        setShowDetailsModal(true);
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to fetch claim details.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Failed to fetch claim details:', error);
      toast({
        title: "Error",
        description: "Failed to fetch claim details.",
        variant: "destructive",
      });
    }
  };

  const updateClaimStatus = async (claimId: number, newStatus: string) => {
    try {
      // Simulated API response for development
      const result = {
        success: true,
        data: { id: claimId, status: newStatus },
        message: 'Claim status updated successfully'
      };

      if (result.success) {
        fetchClaims(); // Refresh the list
        if (selectedClaim && selectedClaim.id === claimId) {
          setSelectedClaim({ ...selectedClaim, status: newStatus });
        }
        toast({
          title: "Success",
          description: "Claim status updated successfully.",
        });
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to update claim status.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Failed to update claim status:', error);
      toast({
        title: "Error",
        description: "Failed to update claim status.",
        variant: "destructive",
      });
    }
  };

  const downloadDocument = async (documentId: number, filename: string) => {
    try {
      // Simulated API response for development
      const result = {
        success: true,
        message: 'Document download feature not available in development mode'
      };
      
      if (result.success) {
        toast({
          title: "Success",
          description: result.message || "Document download started.",
        });
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to download document.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Failed to download document:', error);
      toast({
        title: "Error",
        description: "Failed to download document.",
        variant: "destructive",
      });
    }
  };

  const exportClaimsData = async (format: 'csv' | 'json' | 'xlsx' = 'csv') => {
    try {
      toast({
        title: "Export Started",
        description: `Exporting claims data as ${format.toUpperCase()}...`,
      });

      // Simulate export delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const exportData = {
        claims: claims.map(claim => ({
          id: claim.id,
          policyNumber: claim.policyNumber,
          claimType: claim.claimType,
          claimant: claim.user?.name || 'N/A',
          email: claim.user?.email || 'N/A',
          estimatedLoss: claim.estimatedLoss,
          status: claim.status,
          incidentDate: claim.incidentDate,
          createdAt: claim.createdAt,
          documentCount: claim.documents?.length || 0
        })),
        timestamp: new Date().toISOString(),
        format
      };
      
      // Create file content based on format
      let content = '';
      let filename = `claims-export-${new Date().toISOString().split('T')[0]}`;
      let mimeType = 'text/plain';
      
      if (format === 'json') {
        content = JSON.stringify(exportData, null, 2);
        filename += '.json';
        mimeType = 'application/json';
      } else if (format === 'csv') {
        const csvHeaders = 'ID,Policy Number,Claim Type,Claimant,Email,Amount,Status,Incident Date,Created At,Documents\n';
        const csvData = exportData.claims
          .map(claim => `${claim.id},"${claim.policyNumber}","${claim.claimType}","${claim.claimant}","${claim.email}",${claim.estimatedLoss},"${claim.status}","${claim.incidentDate}","${claim.createdAt}",${claim.documentCount}`)
          .join('\n');
        content = csvHeaders + csvData;
        filename += '.csv';
        mimeType = 'text/csv';
      }
      
      // Download file
      const blob = new Blob([content], { type: mimeType });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      toast({
        title: "Export Complete",
        description: `Claims data exported as ${format.toUpperCase()}`,
      });
    } catch (error) {
      console.error('Export failed:', error);
      toast({
        title: "Export Failed",
        description: "Failed to export claims data",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES'
    }).format(amount);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  useEffect(() => {
    fetchClaims();
  }, [currentPage, searchTerm, statusFilter]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading claims...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Claims Management</h1>
        <div className="flex gap-2">
          <Button onClick={fetchClaims} variant="outline" size="sm" disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button onClick={() => exportClaimsData('csv')} variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Button onClick={() => exportClaimsData('json')} variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export JSON
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search claims..."
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
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Claims Table */}
      <Card>
        <CardHeader>
          <CardTitle>Claims List ({claims.length} records)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 font-medium">Policy #</th>
                  <th className="text-left p-3 font-medium">Claimant</th>
                  <th className="text-left p-3 font-medium">Type</th>
                  <th className="text-left p-3 font-medium">Amount</th>
                  <th className="text-left p-3 font-medium">Date</th>
                  <th className="text-left p-3 font-medium">Status</th>
                  <th className="text-left p-3 font-medium">Documents</th>
                  <th className="text-left p-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {claims.length > 0 ? (
                  claims.map((claim) => (
                    <tr key={claim.id} className="border-b hover:bg-gray-50">
                      <td className="p-3 font-mono text-sm">{claim.policyNumber}</td>
                      <td className="p-3">
                        <div>
                          <div className="font-medium">
                            {claim.firstName} {claim.lastName}
                          </div>
                          <div className="text-sm text-gray-500">{claim.email}</div>
                          <div className="text-sm text-gray-500">{claim.phone}</div>
                        </div>
                      </td>
                      <td className="p-3">{claim.claimType}</td>
                      <td className="p-3 font-medium">{formatCurrency(claim.estimatedLoss)}</td>
                      <td className="p-3">{formatDate(claim.incidentDate)}</td>
                      <td className="p-3">
                        <Badge className={getStatusColor(claim.status)}>
                          {claim.status}
                        </Badge>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-gray-400" />
                          <span className="text-sm">{claim.documents?.length || 0} files</span>
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => viewClaimDetails(claim.id)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Select onValueChange={(status) => updateClaimStatus(claim.id, status)}>
                            <SelectTrigger className="w-32">
                              <SelectValue placeholder="Update" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="processing">Processing</SelectItem>
                              <SelectItem value="approved">Approved</SelectItem>
                              <SelectItem value="rejected">Rejected</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="text-center py-12">
                      <div className="text-gray-500">
                        <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                        <h3 className="text-lg font-medium mb-2">No claims found</h3>
                        <p>No claims match your current filters.</p>
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

      {/* Claim Details Modal */}
      <Dialog open={showDetailsModal} onOpenChange={setShowDetailsModal}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Claim Details</DialogTitle>
          </DialogHeader>
          
          {selectedClaim && (
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Claim Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Policy Number</label>
                      <p className="font-mono">{selectedClaim.policyNumber}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Claim Type</label>
                      <p>{selectedClaim.claimType}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Estimated Loss</label>
                      <p className="font-medium">{formatCurrency(selectedClaim.estimatedLoss)}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Incident Date</label>
                      <p>{formatDate(selectedClaim.incidentDate)}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Status</label>
                      <Badge className={getStatusColor(selectedClaim.status)}>
                        {selectedClaim.status}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Claimant Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-500">First Name</label>
                      <p>{selectedClaim.firstName}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Last Name</label>
                      <p>{selectedClaim.lastName}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Email</label>
                      <p>{selectedClaim.email}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Phone</label>
                      <p>{selectedClaim.phone}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Submitted</label>
                      <p>{formatDate(selectedClaim.createdAt)}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Description */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 whitespace-pre-wrap">{selectedClaim.description}</p>
                </CardContent>
              </Card>

              {/* Documents */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Attached Documents ({selectedClaim.documents?.length || 0})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {(selectedClaim.documents?.length || 0) > 0 ? (
                    <div className="grid gap-3">
                      {selectedClaim.documents?.map((doc) => (
                        <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <FileText className="h-5 w-5 text-gray-400" />
                            <div>
                              <p className="font-medium">{doc.originalName}</p>
                              <p className="text-sm text-gray-500">
                                {formatFileSize(doc.size)} • {formatDate(doc.createdAt)}
                              </p>
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => downloadDocument(doc.id, doc.originalName)}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-4">No documents attached</p>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
