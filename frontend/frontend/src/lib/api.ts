const API_BASE_URL =
  import.meta.env.VITE_API_URL || "https://gallo-api.onrender.com/api/v1";
const DEBUG = import.meta.env.VITE_DEBUG === "true" || true;

// Types
interface ApiResponse<T = any> {
  success: boolean;
  data: T | null;
  message: string;
  error?: string;
}

interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    total: number;
    perPage: number;
  };
}

interface ClaimData {
  id?: number;
  claimType: string;
  description: string;
  amount: number;
  status?: string;
  userId?: number;
  createdAt?: string;
  updatedAt?: string;
}
export type ConsultType =
  | "Risk Assessment"
  | "Corporate Structuring"
  | "Claims Audit"
  | "Policy Review"
  | "Insurance Training"
  | "General Consultation";
interface ConsultationData {
  id?: number;
  full_name: string;
  email: string;
  phone: string;
  organization: string;
  consult_type: ConsultType;
  preferred_date: string;
  preferred_time: string;
  // description: string;
  status?: string;
  consultationTime: string;
  message: string;
  consultationDate: string;
  createdAt?: string;
  updatedAt?: string;
}

interface OutsourcingData {
  organization_name: string;
  core_functions: string;
  location: string;
  address: string;
  email: string;
  services: string[];
  nature_of_outsourcing: string;
  budget_range: string;
}

async function request<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}${endpoint}`;

  // Don't stringify if it's FormData
  if (!(options.body instanceof FormData)) {
    options.headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };
    if (options.body) {
      options.body = JSON.stringify(options.body);
    }
  }

  try {
    const res = await fetch(url, {
      headers: {
        Accept: "application/json",
        ...options.headers,
      },
      mode: "cors",
      credentials: "omit",
      ...options,
    });


    if (DEBUG) {
      console.log(`API Response: ${res.status} ${res.statusText}`);
    }

    // Handle different response types
    const contentType = res.headers.get("content-type");
    let data: any;

    if (contentType && contentType.includes("application/json")) {
      data = await res.json();
    } else {
      data = await res.text();
    }

    if (!res.ok) {
      const errorMessage =
        data?.message || data?.error || `HTTP ${res.status}: ${res.statusText}`;
      if (DEBUG) {
        console.error("API Error:", errorMessage);
      }
      throw new Error(errorMessage);
    }

    if (DEBUG) {
      console.log("API Success:", data);
    }

    return {
      success: true,
      data: data?.data || data,
      message: data?.message || "Request successful",
    };
  } catch (error: any) {
    if (DEBUG) {
      console.error("API Request failed:", error);
    }
    throw new Error(
      error.message || "Network error - could not connect to server"
    );
  }
}

// Auth Service
const authService = {
  login: async (data: {
    email: string;
    password: string;
  }): Promise<ApiResponse> =>
    request("/auth/login", { method: "POST", body: JSON.stringify(data) }),

  register: async (data: {
    fullName: string;
    email: string;
    password: string;
  }): Promise<ApiResponse> =>
    request("/auth/register", { method: "POST", body: JSON.stringify(data) }),

  logout: async (): Promise<ApiResponse> =>
    request("/auth/logout", { method: "POST" }),

  getProfile: async (): Promise<ApiResponse> =>
    request("/auth/profile", { method: "GET" }),
};

// Claims Service
const claimsService = {
  createClaim: async (data: FormData): Promise<ApiResponse> => {
    try {
      const response = await fetch(`${API_BASE_URL}/claims`, {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
        body: data,
      });

      const contentType = response.headers.get("content-type");
      let responseData: any = null;

      try {
        if (contentType && contentType.includes("application/json")) {
          responseData = await response.json();
        } else {
          const text = await response.text();
          responseData = text ? { message: text } : null;
        }
      } catch (_) {
        responseData = null;
      }

      if (!response.ok) {
        const errorMessage =
          responseData?.message ||
          responseData?.error ||
          `HTTP ${response.status}: ${response.statusText}`;
        throw new Error(errorMessage);
      }

      const success =
        response.ok &&
        !(
          responseData &&
          (responseData.error || responseData.success === false)
        );
      let message = responseData?.message || responseData?.error || "";

      if (
        !message &&
        responseData?.errors &&
        typeof responseData.errors === "object"
      ) {
        const parts: string[] = [];
        for (const [field, errs] of Object.entries<any>(responseData.errors)) {
          if (Array.isArray(errs)) parts.push(`${field}: ${errs.join(", ")}`);
          else if (typeof errs === "string") parts.push(`${field}: ${errs}`);
        }
        if (parts.length) message = parts.join("\n");
      }

      if (!message) {
        message = response.ok
          ? "Claim created successfully"
          : "Failed to create claim";
      }

      return {
        success,
        data: responseData?.data || responseData || null,
        message,
        error: responseData?.error || null,
      };
    } catch (error: any) {
      throw new Error(error.message || "Failed to create claim");
    }
  },

  getClaims: async (): Promise<ApiResponse> =>
    request("/claims", { method: "GET" }),

  getClaim: async (id: string): Promise<ApiResponse> =>
    request(`/claims/${id}`, { method: "GET" }),

  updateClaimStatus: async (id: string, status: string): Promise<ApiResponse> =>
    request(`/claims/${id}/status`, {
      method: "PUT",
      body: JSON.stringify({ status }),
    }),
};

// Quotes Service
const quotesService = {
  createQuote: async (formData: any): Promise<ApiResponse> =>
    request("/quotes", {
      method: "POST",
      body: formData,
      headers: {
        Accept: "application/json",
      },
    }),

  getQuotes: async (): Promise<ApiResponse> =>
    request("/quotes", { method: "GET" }),

  getQuote: async (id: string): Promise<ApiResponse> =>
    request(`/quotes/${id}`, { method: "GET" }),

  updateQuoteStatus: async (id: string, status: string): Promise<ApiResponse> =>
    request(`/quotes/${id}/status`, {
      method: "PUT",
      body: JSON.stringify({ status }),
    }),
};

// Payments Service
const paymentsService = {
  createPayment: async (data: any): Promise<ApiResponse> =>
    request("/payments", { method: "POST", body: JSON.stringify(data) }),

  getPayments: async (): Promise<ApiResponse> =>
    request("/payments", { method: "GET" }),

  getPayment: async (id: string): Promise<ApiResponse> =>
    request(`/payments/${id}`, { method: "GET" }),

  processPayment: async (id: string, data: any): Promise<ApiResponse> =>
    request(`/payments/${id}/process`, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // M-Pesa STK Push
  initiateSTKPush: async (data: {
    phoneNumber: string;
    amount: number;
    accountReference: string;
    transactionDesc: string;
    userId?: number;
    consultationId?: number;
  }): Promise<ApiResponse> =>
    request("/payments/mpesa/stkpush", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  querySTKPushStatus: async (checkoutRequestId: string): Promise<ApiResponse> =>
    request(`/payments/mpesa/status/${checkoutRequestId}`, { method: "GET" }),

  getPaymentByCheckoutRequestId: async (checkoutRequestId: string): Promise<ApiResponse> =>
    request(`/payments/mpesa/payment/${checkoutRequestId}`, { method: "GET" }),
};

// Outsourcing Service

const outsourcingRequests = {
  createOutsourcingRequest: async (
    data: OutsourcingData
  ): Promise<ApiResponse> => {
    try {
      const response = await fetch(`${API_BASE_URL}/outsourcing-requests`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(data),
      });

      const contentType = response.headers.get("content-type");
      let responseData: any = null;

      try {
        if (contentType && contentType.includes("application/json")) {
          responseData = await response.json();
        } else {
          const text = await response.text();
          responseData = text ? { message: text } : null;
        }
      } catch (_) {
        responseData = null;
      }

      if (!response.ok) {
        const errorMessage =
          responseData?.message ||
          responseData?.error ||
          `HTTP ${response.status}: ${response.statusText}`;
        throw new Error(errorMessage);
      }

      const success =
        response.ok &&
        !(
          responseData &&
          (responseData.error || responseData.success === false)
        );
      let message = responseData?.message || responseData?.error || "";

      if (
        !message &&
        responseData?.errors &&
        typeof responseData.errors === "object"
      ) {
        const parts: string[] = [];
        for (const [field, errs] of Object.entries<any>(responseData.errors)) {
          if (Array.isArray(errs)) parts.push(`${field}: ${errs.join(", ")}`);
          else if (typeof errs === "string") parts.push(`${field}: ${errs}`);
        }
        if (parts.length) message = parts.join("\n");
      }

      if (!message) {
        message = response.ok
          ? "Outsourcing created successfully"
          : "Failed to create outsourcing";
      }

      return {
        success,
        data: responseData?.data || responseData || null,
        message,
        error: responseData?.error || null,
      };
    } catch (error: any) {
      throw new Error(error.message || "Failed to create outsourcing");
    }
  },
  getClaims: async (): Promise<ApiResponse> =>
    request("outsourcing-requests-requests", { method: "GET" }),

  getRequests: async (): Promise<ApiResponse> =>
    request("outsourcing-requests-requests", { method: "GET" }),

  getRequest: async (id: string): Promise<ApiResponse> =>
    request(`/outsourcing-requests-requests/${id}`, { method: "GET" }),

  updateRequestStatus: async (
    id: string,
    status: string
  ): Promise<ApiResponse> =>
    request(`/outsourcing-requests-requests/${id}/status`, {
      method: "PUT",
      body: JSON.stringify({ status }),
    }),
};

// Diaspora Service
const diasporaService = {
  createRequest: async (data: any): Promise<ApiResponse> =>
    request("/diaspora-requests", { method: "POST", body: data }),

  getRequests: async (): Promise<ApiResponse> =>
    request("/diaspora-requests", { method: "GET" }),

  getRequest: async (id: string): Promise<ApiResponse> =>
    request(`/diaspora-requests/${id}`, { method: "GET" }),

  updateRequestStatus: async (
    id: string,
    status: string
  ): Promise<ApiResponse> =>
    request(`/diaspora-requests/${id}/status`, {
      method: "PUT",
      body: JSON.stringify({ status }),
    }),
};

// Consultations Service
const bookingConsultantsService = {
  createConsultation: async (data: ConsultationData): Promise<ApiResponse> => {
    try {
      const response = await fetch(`${API_BASE_URL}/booking-consultants`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(data),
      });

      const contentType = response.headers.get("content-type");
      let responseData: any = null;

      try {
        if (contentType && contentType.includes("application/json")) {
          responseData = await response.json();
        } else {
          const text = await response.text();
          responseData = text ? { message: text } : null;
        }
      } catch (_) {
        responseData = null;
      }

      if (DEBUG) {
        console.log("CreateConsultation response raw:", {
          status: response.status,
          data: responseData,
        });
      }

      if (!response.ok) {
        const errorMessage =
          responseData?.message ||
          responseData?.error ||
          `HTTP ${response.status}: ${response.statusText}`;
        throw new Error(errorMessage);
      }

      const success =
        response.ok &&
        !(
          responseData &&
          (responseData.error || responseData.success === false)
        );
      let message = responseData?.message || responseData?.error || "";

      if (!message && responseData && Array.isArray(responseData.message)) {
        message = responseData.message.join("\n");
      }

      if (
        !message &&
        responseData?.errors &&
        typeof responseData.errors === "object"
      ) {
        const parts: string[] = [];
        for (const [field, errs] of Object.entries<any>(responseData.errors)) {
          if (Array.isArray(errs)) parts.push(`${field}: ${errs.join(", ")}`);
          else if (typeof errs === "string") parts.push(`${field}: ${errs}`);
        }
        if (parts.length) message = parts.join("\n");
      }

      if (!message) {
        message = response.ok
          ? "Consultation created successfully"
          : "Failed to create consultation";
      }

      return {
        success,
        data: responseData?.data || responseData || null,
        message,
        error: responseData?.error || null,
      };
    } catch (error: any) {
      throw new Error(error.message || "Failed to create consultation");
    }
  },

  getConsultations: async (): Promise<ApiResponse> =>
    request("/booking-consultants", { method: "GET" }),

  getConsultation: async (id: number): Promise<ApiResponse> =>
    request(`/booking-consultants/${id}`, { method: "GET" }),

  updateConsultationStatus: async (
    id: string,
    status: string
  ): Promise<ApiResponse> =>
    request(`/booking-consultants/${id}/status`, {
      method: "PUT",
      body: JSON.stringify({ status }),
    }),

  testConnection: async (): Promise<ApiResponse> =>
    request("/booking-consultants/test", { method: "GET" }),
};

const consultationsService = {
  createConsultation: async (data: ConsultationData): Promise<ApiResponse> => {
    try {
      const response = await fetch(`${API_BASE_URL}/consultations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(data),
      });

      const contentType = response.headers.get("content-type");
      let responseData: any = null;

      try {
        if (contentType && contentType.includes("application/json")) {
          responseData = await response.json();
        } else {
          const text = await response.text();
          responseData = text ? { message: text } : null;
        }
      } catch (_) {
        responseData = null;
      }

      if (DEBUG) {
        console.log("CreateConsultation response raw:", {
          status: response.status,
          data: responseData,
        });
      }

      if (!response.ok) {
        const errorMessage =
          responseData?.message ||
          responseData?.error ||
          `HTTP ${response.status}: ${response.statusText}`;
        throw new Error(errorMessage);
      }

      const success =
        response.ok &&
        !(
          responseData &&
          (responseData.error || responseData.success === false)
        );
      let message = responseData?.message || responseData?.error || "";

      if (!message && responseData && Array.isArray(responseData.message)) {
        message = responseData.message.join("\n");
      }

      if (
        !message &&
        responseData?.errors &&
        typeof responseData.errors === "object"
      ) {
        const parts: string[] = [];
        for (const [field, errs] of Object.entries<any>(responseData.errors)) {
          if (Array.isArray(errs)) parts.push(`${field}: ${errs.join(", ")}`);
          else if (typeof errs === "string") parts.push(`${field}: ${errs}`);
        }
        if (parts.length) message = parts.join("\n");
      }

      if (!message) {
        message = response.ok
          ? "Consultation created successfully"
          : "Failed to create consultation";
      }

      return {
        success,
        data: responseData?.data || responseData || null,
        message,
        error: responseData?.error || null,
      };
    } catch (error: any) {
      throw new Error(error.message || "Failed to create consultation");
    }
  },

  getConsultations: async (): Promise<ApiResponse> =>
    request("/consultations", { method: "GET" }),

  getConsultation: async (id: string): Promise<ApiResponse> =>
    request(`/consultations/${id}`, { method: "GET" }),

  updateConsultationStatus: async (
    id: string,
    status: string
  ): Promise<ApiResponse> =>
    request(`/consultations/${id}/status`, {
      method: "PUT",
      body: JSON.stringify({ status }),
    }),

  testConnection: async (): Promise<ApiResponse> =>
    request("/consultations/test", { method: "GET" }),
};

// Resources Service
const resourcesService = {
  getResources: async (): Promise<ApiResponse> =>
    request("/resources", { method: "GET" }),

  getResource: async (id: string): Promise<ApiResponse> =>
    request(`/resources/${id}`, { method: "GET" }),

  downloadResource: async (id: string): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE_URL}/resources/${id}/download`, {
        method: "GET",
        headers: {
          Accept: "application/octet-stream",
        },
        mode: "cors",
        credentials: "omit",
      });

      if (!response.ok) {
        throw new Error(`Download failed: ${response.statusText}`);
      }

      // Get filename from Content-Disposition header or use a default
      const contentDisposition = response.headers.get('Content-Disposition');
      let filename = `resource-${id}`;
      
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"/);
        if (filenameMatch) {
          filename = filenameMatch[1];
        }
      }

      // Create blob and trigger download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error: any) {
      throw new Error(error.message || "Failed to download resource");
    }
  },

  uploadResource: async (formData: FormData): Promise<ApiResponse> => {
    try {
      const response = await fetch(`${API_BASE_URL}/resources/upload`, {
        method: "POST",
        body: formData, // Send FormData directly, don't JSON.stringify it
        mode: "cors",
        credentials: "omit",
      });

      const contentType = response.headers.get("content-type");
      let data: any;

      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      if (!response.ok) {
        const errorMessage = data?.message || data?.error || `HTTP ${response.status}: ${response.statusText}`;
        throw new Error(errorMessage);
      }

      return {
        success: true,
        data: data?.data || data,
        message: data?.message || "Resource uploaded successfully",
      };
    } catch (error: any) {
      throw new Error(error.message || "Failed to upload resource");
    }
  },

  updateResource: async (id: string, data: any): Promise<ApiResponse> =>
    request(`/resources/${id}`, { method: "PATCH", body: JSON.stringify(data) }),

  deleteResource: async (id: string): Promise<ApiResponse> =>
    request(`/resources/${id}`, { method: "DELETE" }),

  getStats: async (): Promise<ApiResponse> =>
    request("/resources/stats", { method: "GET" }),

  // Template Management Endpoints
  getTemplates: async (): Promise<ApiResponse> => {
    const token = localStorage.getItem("token");
    return request("/resources/templates/list", { 
      method: "GET",
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    });
  },

  getTemplate: async (templateName: string): Promise<ApiResponse> => {
    const token = localStorage.getItem("token");
    return request(`/resources/templates/${templateName}`, { 
      method: "GET",
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    });
  },

  downloadTemplate: async (templateName: string): Promise<void> => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/resources/templates/${templateName}/download`, {
        method: "GET",
        headers: {
          'Accept': 'application/octet-stream',
          'Authorization': `Bearer ${token}`,
        },
        mode: "cors",
        credentials: "omit",
      });

      if (!response.ok) {
        throw new Error(`Download failed: ${response.statusText}`);
      }

      // Get filename from Content-Disposition header or use template name
      const contentDisposition = response.headers.get('Content-Disposition');
      let filename = templateName;
      
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"/);
        if (filenameMatch) {
          filename = filenameMatch[1];
        }
      }

      // Create blob and trigger download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error: any) {
      throw new Error(error.message || "Failed to download template");
    }
  },

  updateTemplate: async (templateName: string, content: string): Promise<ApiResponse> => {
    const token = localStorage.getItem("token");
    return request(`/resources/templates/${templateName}`, { 
      method: "PUT",
      body: JSON.stringify({ content }),
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    });
  },
};

// Dashboard Service
const dashboardService = {
  getStats: async (): Promise<ApiResponse> => {
    try {
      const response = await request("/dashboard/stats");
      return {
        success: !response.error,
        data: response.error ? {} : response.data,
        message: response.error || "Dashboard stats loaded successfully",
      };
    } catch (error: any) {
      throw new Error(error.message || "Failed to load dashboard stats");
    }
  },

  getActivities: async (): Promise<ApiResponse> => {
    try {
      const response = await request("/dashboard/activities");
      return {
        success: !response.error,
        data: response.error ? [] : response.data || [],
        message: response.error || "Activities loaded successfully",
      };
    } catch (error: any) {
      throw new Error(error.message || "Failed to load activities");
    }
  },

  getTopStats: async (): Promise<ApiResponse> => {
    try {
      const response = await request("/dashboard/top-stats");
      return {
        success: !response.error,
        data: response.error ? {} : response.data,
        message: response.error || "Top stats loaded successfully",
      };
    } catch (error: any) {
      throw new Error(error.message || "Failed to load top stats");
    }
  },
};

// Admin Service
const adminService = {
  // System Health Check
  getSystemHealth: async (): Promise<ApiResponse> => {
    try {
      const response = await request("/health");
      return {
        success: !response.error,
        data: response.error ? null : response.data,
        message: response.error || "System health check completed",
      };
    } catch (error: any) {
      throw new Error(error.message || "Failed to check system health");
    }
  },

  getSystemMetrics: async (): Promise<ApiResponse> => {
    try {
      const response = await request("/metrics");
      if (response.error) {
        return {
          success: false,
          data: {
            totalUsers: 0,
            totalClaims: 0,
            totalConsultations: 0,
            totalPayments: 0,
            totalQuotes: 0,
            totalOutsourcingRequests: 0,
            totalDiasporaRequests: 0,
            totalRevenue: 0,
            monthlyRevenue: 0,
            conversionRate: 0,
            userGrowthRate: 0,
            claimsGrowthRate: 0,
            quoteGrowthRate: 0,
            revenueGrowthRate: 0,
            lastUpdated: new Date().toISOString(),
          },
          message: response.error,
        };
      }
      return {
        success: true,
        data: response.data,
        message: "Metrics loaded successfully",
      };
    } catch (error: any) {
      throw new Error(error.message || "Failed to load metrics");
    }
  },

  getRecentActivities: async (limit = 50): Promise<ApiResponse> => {
    try {
      const response = await request(`/activities?limit=${limit}`);
      return {
        success: !response.error,
        data: response.error ? [] : response.data || [],
        message: response.error || "Activities loaded successfully",
      };
    } catch (error: any) {
      throw new Error(error.message || "Failed to load activities");
    }
  },

  // Users
  getAllUsers: async (
    page = 1,
    limit = 50
  ): Promise<ApiResponse<PaginatedResponse<any>>> =>
    request(`/users?page=${page}&limit=${limit}`, { method: "GET" }),

  getUserStats: async (): Promise<ApiResponse> =>
    request("/users/stats", { method: "GET" }),

  updateUserStatus: async (id: number, status: string): Promise<ApiResponse> =>
    request(`/users/${id}/status`, {
      method: "PUT",
      body: JSON.stringify({ status }),
    }),

  // Claims Management
  getAllClaims: async (
    page = 1,
    limit = 50,
    status?: string,
    search?: string
  ): Promise<ApiResponse<PaginatedResponse<any>>> => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });
      if (status && status !== "all") params.append("status", status);
      if (search) params.append("search", search);

      const response = await request(`/claims?${params.toString()}`);
      return {
        success: !response.error,
        data: response.error
          ? {
            data: [],
            pagination: {
              totalPages: 1,
              currentPage: 1,
              total: 0,
              perPage: limit,
            },
          }
          : response.data,
        message: response.error || "Claims loaded successfully",
      };
    } catch (error: any) {
      throw new Error(error.message || "Failed to load claims");
    }
  },

  getClaimById: async (id: number): Promise<ApiResponse> => {
    try {
      const response = await request(`/claims/${id}`);
      return {
        success: !response.error,
        data: response.error ? null : response.data,
        message: response.error || "Claim loaded successfully",
      };
    } catch (error: any) {
      throw new Error(error.message || "Failed to load claim");
    }
  },

  getClaimsStats: async (): Promise<ApiResponse> => {
    try {
      const response = await request("/claims/stats");
      return {
        success: !response.error,
        data: response.error
          ? { total: 0, pending: 0, approved: 0, rejected: 0 }
          : response.data,
        message: response.error || "Claims stats loaded successfully",
      };
    } catch (error: any) {
      throw new Error(error.message || "Failed to load claims stats");
    }
  },

  updateClaimStatus: async (
    id: number,
    status: string
  ): Promise<ApiResponse> => {
    try {
      const response = await request(`/claims/${id}/status`, {
        method: "PUT",
        body: JSON.stringify({ status }),
      });
      return {
        success: !response.error,
        data: response.error ? null : response.data,
        message: response.error || "Claim status updated successfully",
      };
    } catch (error: any) {
      throw new Error(error.message || "Failed to update claim status");
    }
  },

  // Consultations
  getAllConsultations: async (): Promise<
    ApiResponse<PaginatedResponse<any>>
  > => {
    return request(`/consultations`, { method: "GET" });
  },
  // create consultation
  createConsultation: async (data: any): Promise<ApiResponse> => {
    try {
      const response = await request(`/consultations`, {
        method: "POST",
        body: JSON.stringify(data),
      });
      return {
        success: !response.error,
        data: response.error ? null : response.data,
        message: response.error || "Consultation created successfully",
      };
    } catch (error: any) {
      throw new Error(error.message || "Failed to create consultation");
    }
  },

  getConsultationById: async (id: number): Promise<ApiResponse> =>
    request(`/consultations/${id}`, { method: "GET" }),

  updateConsultationStatus: async (
    id: number,
    status: string
  ): Promise<ApiResponse> =>
    request(`/consultations/${id}/status`, {
      method: "PUT",
      body: JSON.stringify({ status }),
    }),

  // Quotes
  getAllQuotes: async (
    page = 1,
    limit = 50
  ): Promise<ApiResponse<PaginatedResponse<any>>> =>
    request(`/quotes?page=${page}&limit=${limit}`, { method: "GET" }),

  getQuoteById: async (id: number): Promise<ApiResponse> =>
    request(`/quotes/${id}`, { method: "GET" }),

  updateQuoteStatus: async (id: number, status: string): Promise<ApiResponse> =>
    request(`/quotes/${id}/status`, {
      method: "PUT",
      body: JSON.stringify({ status }),
    }),

  // Diaspora
  getAllDiasporaRequests: async (
    page = 1,
    limit = 50
  ): Promise<ApiResponse<PaginatedResponse<any>>> =>
    request(`/diaspora-requests?page=${page}&limit=${limit}`, { method: "GET" }),

  getDiasporaById: async (id: number): Promise<ApiResponse> =>
    request(`/diaspora-requests/${id}`, { method: "GET" }),

  updateDiasporaStatus: async (
    id: number,
    status: string
  ): Promise<ApiResponse> =>
    request(`/diaspora-requests/${id}/status`, {
      method: "PUT",
      body: JSON.stringify({ status }),
    }),

  // Outsourcing
  getAllOutsourcingRequests: async (
    page = 1,
    limit = 50
  ): Promise<ApiResponse<PaginatedResponse<any>>> =>
    request(`/outsourcing-requests?page=${page}&limit=${limit}`, {
      method: "GET",
    }),

  getOutsourcingById: async (id: number): Promise<ApiResponse> =>
    request(`/outsourcing-requests/${id}`, { method: "GET" }),

  updateOutsourcingStatus: async (
    id: number,
    status: string
  ): Promise<ApiResponse> =>
    request(`/outsourcing-requests/${id}/status`, {
      method: "PUT",
      body: JSON.stringify({ status }),
    }),

  deleteOutsourcingRequest: async (id: number): Promise<ApiResponse> =>
    request(`/outsourcing-requests/${id}`, { method: "DELETE" }),

  // Payments
  getAllPayments: async (
    page = 1,
    limit = 50
  ): Promise<ApiResponse<PaginatedResponse<any>>> =>
    request(`/payments?page=${page}&limit=${limit}`, { method: "GET" }),

  getPaymentStats: async (): Promise<ApiResponse> =>
    request("/payments/stats", { method: "GET" }),

  // Documents
  downloadDocument: async (
    documentId: number,
    filename: string
  ): Promise<ApiResponse> => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/documents/${documentId}/download`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to download document");
      }

      // Create blob from response
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      return {
        success: true,
        data: null,
        message: "Document downloaded successfully",
      };
    } catch (error: any) {
      throw new Error(error.message || "Failed to download document");
    }
  },

  // Export and Real-time
  exportData: async (type: string, options: any): Promise<ApiResponse> =>
    request("/export", {
      method: "POST",
      body: JSON.stringify({ type, ...options }),
    }),

  subscribeToRealTimeUpdates: (callback: (payload: any) => void): any[] => {
    // Placeholder for real-time subscriptions
    console.log("Real-time subscriptions not implemented for Laravel backend");
    return [];
  },

  unsubscribeFromRealTimeUpdates: (channels: any[]): void => {
    console.log("Unsubscribing from real-time updates");
  },
};

// Test connection functions
const testSupabaseConnection = async (): Promise<ApiResponse> => {
  try {
    const response = await request("/health");
    return {
      success: !response.error,
      data: response.error ? null : response.data,
      message: response.error || "Connected to Laravel backend successfully",
    };
  } catch (error: any) {
    throw new Error(error.message || "Failed to connect to Laravel backend");
  }
};

const testLaravelConnection = async (): Promise<ApiResponse> => {
  try {
    const startTime = Date.now();
    const response = await request("/health");
    const endTime = Date.now();

    return {
      success: !response.error,
      data: {
        status: response.error ? "disconnected" : "connected",
        latency: endTime - startTime,
        timestamp: new Date().toISOString(),
        backend: "Laravel/PostgreSQL",
        endpoint: API_BASE_URL,
        ...response.data,
      },
      message:
        response.error ||
        `Connected to Laravel backend (${endTime - startTime}ms)`,
    };
  } catch (error: any) {
    throw new Error(error.message || "Failed to connect to Laravel backend");
  }
};

// Export all services
export {
  authService,
  claimsService,
  quotesService,
  paymentsService,
  outsourcingRequests,
  diasporaService,
  consultationsService,
  resourcesService,
  dashboardService,
  adminService,
  testSupabaseConnection,
  testLaravelConnection,
  bookingConsultantsService,
};

// Default API object
const api = {
  authService,
  claimsService,
  quotesService,
  paymentsService,
  outsourcingRequests,
  diasporaService,
  consultationsService,
  resourcesService,
  dashboardService,
  adminService,
  bookingConsultantsService,
  testSupabaseConnection,
  testLaravelConnection,
};

export default api;
