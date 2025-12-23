import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { resourcesService } from "@/lib/api";
import {
  Archive,
  Download,
  Edit3,
  File,
  FileText,
  Filter,
  FolderOpen,
  Image,
  MoreVertical,
  Music,
  Plus,
  Search,
  Trash2,
  Video,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface Resource {
  id: number;
  filename: string;
  originalName: string;
  fileType: string;
  size: number;
  url: string;
  path?: string;
  description: string;
  category: string;
  isActive?: boolean;
  createdAt: string;
  updatedAt: string;
  publicId?: string;
  downloads?: number;
}

interface ResourceStats {
  totalResources: number;
  totalSize: number;
  totalDownloads: number;
  categoryStats: Array<{
    category: string;
    count: number;
    size: number;
  }>;
}

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "https://gallo-api.onrender.com/api/v1";

const categories = [
  { value: "general", label: "General" },
  { value: "documents", label: "Documents" },
  { value: "images", label: "Images" },
  { value: "videos", label: "Videos" },
  { value: "audio", label: "Audio" },
  { value: "templates", label: "Templates" },
  { value: "reports", label: "Reports" },
  { value: "policies", label: "Policies" },
  { value: "forms", label: "Forms" },
  { value: "presentations", label: "Presentations" },
];

const getFileIcon = (fileType?: string) => {
  if (!fileType) return <File className="w-5 h-5 text-gray-500" />;

  if (fileType.startsWith("image/"))
    return <Image className="w-5 h-5 text-blue-500" />;
  if (fileType.startsWith("video/"))
    return <Video className="w-5 h-5 text-purple-500" />;
  if (fileType.startsWith("audio/"))
    return <Music className="w-5 h-5 text-green-500" />;
  if (fileType.includes("pdf"))
    return <FileText className="w-5 h-5 text-red-500" />;
  if (fileType.includes("zip") || fileType.includes("rar"))
    return <Archive className="w-5 h-5 text-orange-500" />;
  return <File className="w-5 h-5 text-gray-500" />;
};

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export function AdminResources() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [stats, setStats] = useState<ResourceStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadDescription, setUploadDescription] = useState("");
  const [uploadCategory, setUploadCategory] = useState("general");
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [editingResource, setEditingResource] = useState<Resource | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  useEffect(() => {
    fetchResources();
    fetchStats();
  }, []);

  const fetchResources = async () => {
    try {
      const response = await resourcesService.getResources();

      if (response.success && response.data) {
        // Ensure data is an array
        const dataArray = Array.isArray(response.data) ? response.data : [];

        // Filter by category if not "all"
        const filteredResources =
          selectedCategory === "all"
            ? dataArray
            : dataArray.filter(
                (resource: Resource) => resource.category === selectedCategory
              );

        setResources(filteredResources);
      } else {
        console.error("Invalid response format:", response);
        setResources([]);
        toast.error("Failed to fetch resources");
      }
    } catch (error) {
      console.error("Error fetching resources:", error);
      setResources([]);
      toast.error("Failed to fetch resources");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await resourcesService.getStats();

      if (response.success && response.data) {
        // Ensure categoryStats is always an array
        const statsData = {
          ...response.data,
          categoryStats: response.data.categoryStats || [],
        };
        setStats(statsData);
      } else {
        // Set default stats on error
        setStats({
          totalResources: 0,
          totalSize: 0,
          totalDownloads: 0,
          categoryStats: [],
        });
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
      // Set default stats on error
      setStats({
        totalResources: 0,
        totalSize: 0,
        totalDownloads: 0,
        categoryStats: [],
      });
    }
  };

  const handleFileUpload = async () => {
    if (!selectedFile) {
      toast.error("Please select a file to upload");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("description", uploadDescription);
    formData.append("category", uploadCategory);

    try {
      // Use XMLHttpRequest for progress tracking
      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener("progress", (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100);
          setUploadProgress(progress);
        }
      });

      xhr.addEventListener("load", () => {
        try {
          const response = JSON.parse(xhr.responseText);
          if (xhr.status === 201 && response.success) {
            toast.success("File uploaded successfully!");
            setSelectedFile(null);
            setUploadDescription("");
            setUploadCategory("general");
            setIsUploadDialogOpen(false);
            fetchResources();
            fetchStats();
          } else {
            toast.error(
              "Upload failed: " + (response.message || "Unknown error")
            );
          }
        } catch (parseError) {
          console.error("Failed to parse response:", parseError);
          toast.error("Upload failed: Invalid response");
        }
        setIsUploading(false);
        setUploadProgress(0);
      });

      xhr.addEventListener("error", () => {
        toast.error("Upload failed: Network error");
        setIsUploading(false);
        setUploadProgress(0);
      });

      // Get auth token if exists
      const token = localStorage.getItem("token");

      xhr.open("POST", `${API_BASE_URL}/resources/upload`);

      // Add auth header if token exists
      if (token) {
        xhr.setRequestHeader("Authorization", `Bearer ${token}`);
      }

      xhr.send(formData);
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Upload failed");
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDownload = async (resource: Resource) => {
    try {
      await resourcesService.downloadResource(resource.id.toString());
      toast.success("File downloaded successfully!");
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Download failed");
    }
  };

  const handleDelete = async (resource: Resource) => {
    if (
      !confirm(`Are you sure you want to delete "${resource.originalName}"?`)
    ) {
      return;
    }

    try {
      const response = await resourcesService.deleteResource(
        resource.id.toString()
      );

      if (response.success) {
        toast.success("Resource deleted successfully!");
        fetchResources();
        fetchStats();
      } else {
        toast.error("Failed to delete resource");
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Delete failed");
    }
  };

  const handleEditResource = async () => {
    if (!editingResource) return;

    try {
      const response = await resourcesService.updateResource(
        editingResource.id.toString(),
        {
          description: editingResource.description,
          category: editingResource.category,
        }
      );

      if (response.success) {
        toast.success("Resource updated successfully!");
        setIsEditDialogOpen(false);
        setEditingResource(null);
        fetchResources();
      } else {
        toast.error("Failed to update resource");
      }
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Update failed");
    }
  };

  const filteredResources = Array.isArray(resources)
    ? resources.filter(
        (resource) =>
          resource.originalName
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          resource.description?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Resource Management
          </h1>
          <p className="text-gray-600 mt-1">
            Upload, organize, and manage your files
          </p>
        </div>

        <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Upload File
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Upload New File</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <Label htmlFor="file">Select File</Label>
                <Input
                  id="file"
                  type="file"
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                  disabled={isUploading}
                />
                {selectedFile && (
                  <p className="text-sm text-gray-600 mt-1">
                    {selectedFile.name} ({formatFileSize(selectedFile.size)})
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="category">Category</Label>
                <Select
                  value={uploadCategory}
                  onValueChange={setUploadCategory}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  value={uploadDescription}
                  onChange={(e) => setUploadDescription(e.target.value)}
                  placeholder="Brief description of the file..."
                  disabled={isUploading}
                />
              </div>

              {isUploading && (
                <div className="space-y-2">
                  <Label>Upload Progress</Label>
                  <Progress value={uploadProgress} className="w-full" />
                  <p className="text-sm text-gray-600">{uploadProgress}%</p>
                </div>
              )}
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsUploadDialogOpen(false)}
                disabled={isUploading}>
                Cancel
              </Button>
              <Button
                onClick={handleFileUpload}
                disabled={!selectedFile || isUploading}>
                {isUploading ? "Uploading..." : "Upload"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Files
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {stats.totalResources}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Size
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {formatFileSize(stats.totalSize)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Categories
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {stats?.categoryStats?.length || 0}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search files by name or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Select
                value={selectedCategory}
                onValueChange={(value) => {
                  setSelectedCategory(value);
                  setTimeout(fetchResources, 100);
                }}>
                <SelectTrigger className="w-48">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resources List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FolderOpen className="w-5 h-5" />
            Files ({filteredResources.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : filteredResources.length === 0 ? (
            <div className="text-center py-8">
              <FolderOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No files found</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredResources.map((resource) => (
                <div
                  key={resource.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-4 flex-1">
                    <div className="flex-shrink-0">
                      {getFileIcon(resource.fileType)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 truncate">
                        {resource.originalName}
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>{formatFileSize(resource.size)}</span>
                        <Badge variant="secondary">{resource.category}</Badge>
                        <span>{formatDate(resource.createdAt)}</span>
                      </div>
                      {resource.description && (
                        <p className="text-sm text-gray-600 mt-1 truncate">
                          {resource.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownload(resource)}>
                      <Download className="w-4 h-4" />
                    </Button>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => {
                            setEditingResource(resource);
                            setIsEditDialogOpen(true);
                          }}>
                          <Edit3 className="w-4 h-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(resource)}
                          className="text-red-600">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Resource</DialogTitle>
          </DialogHeader>

          {editingResource && (
            <div className="space-y-4">
              <div>
                <Label>File Name</Label>
                <Input value={editingResource.originalName} disabled />
              </div>

              <div>
                <Label htmlFor="edit-category">Category</Label>
                <Select
                  value={editingResource.category}
                  onValueChange={(value) =>
                    setEditingResource({ ...editingResource, category: value })
                  }>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={editingResource.description || ""}
                  onChange={(e) =>
                    setEditingResource({
                      ...editingResource,
                      description: e.target.value,
                    })
                  }
                  placeholder="Brief description of the file..."
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditResource}>Update</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
