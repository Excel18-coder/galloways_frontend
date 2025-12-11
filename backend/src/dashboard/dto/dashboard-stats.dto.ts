export interface DashboardStats {
    totalUsers: number;
    totalClaims: number;
    totalConsultations: number;
    totalPayments: number;
    totalQuotes: number;
    totalOutsourcingRequests: number;
    totalDiasporaRequests: number;
    totalRevenue: number;
    monthlyRevenue: number;
    conversionRate: number;
    userGrowthRate: number;
    claimsGrowthRate: number;
    quoteGrowthRate: number;
    revenueGrowthRate: number;
    lastUpdated: string;
}

export class DashboardStatsResponseDto implements DashboardStats {
    totalUsers: number;
    totalClaims: number;
    totalConsultations: number;
    totalPayments: number;
    totalQuotes: number;
    totalOutsourcingRequests: number;
    totalDiasporaRequests: number;
    totalRevenue: number;
    monthlyRevenue: number;
    conversionRate: number;
    userGrowthRate: number;
    claimsGrowthRate: number;
    quoteGrowthRate: number;
    revenueGrowthRate: number;
    lastUpdated: string;
}