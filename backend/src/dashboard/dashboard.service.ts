import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Claim } from '../claims/entities/claim.entity';
import { Consultation } from '../consultations/entities/consultation.entity';
import { OutsourcingRequest } from '../outsourcing_requests/entities/outsourcing_request.entity';
import { DashboardStats } from './dto/dashboard-stats.dto';

@Injectable()
export class DashboardService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,

        @InjectRepository(Claim)
        private claimRepository: Repository<Claim>,

        @InjectRepository(Consultation)
        private consultationRepository: Repository<Consultation>,

        @InjectRepository(OutsourcingRequest)
        private outsourcingRequestRepository: Repository<OutsourcingRequest>,

        // Add other repositories as needed
        // @InjectRepository(Payment)
        // private paymentRepository: Repository<Payment>,

        // @InjectRepository(Quote)
        // private quoteRepository: Repository<Quote>,

        // @InjectRepository(DiasporaRequest)
        // private diasporaRequestRepository: Repository<DiasporaRequest>,
    ) { }

    async getComprehensiveDashboard(): Promise<{ success: boolean, data: DashboardStats }> {
        console.log('📊 Generating comprehensive dashboard data...');

        try {
            // Get current date ranges
            const now = new Date();
            const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
            const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
            const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

            // Parallel execution of all database queries for better performance
            const [
                totalUsers,
                totalClaims,
                totalConsultations,
                totalOutsourcingRequests,
                currentMonthUsers,
                lastMonthUsers,
                currentMonthClaims,
                lastMonthClaims,
                // Add more queries as needed based on your entities
            ] = await Promise.all([
                // Total counts
                this.userRepository.count(),
                this.claimRepository.count(),
                this.consultationRepository.count(),
                this.outsourcingRequestRepository.count(),

                // Current month data for growth calculations
                this.userRepository
                    .createQueryBuilder('user')
                    .where('user.created_at >= :start', { start: currentMonthStart })
                    .getCount(),

                // Last month data for growth calculations
                this.userRepository
                    .createQueryBuilder('user')
                    .where('user.created_at >= :start', { start: lastMonthStart })
                    .andWhere('user.created_at <= :end', { end: lastMonthEnd })
                    .getCount(),

                this.claimRepository
                    .createQueryBuilder('claim')
                    .where('claim.created_at >= :start', { start: currentMonthStart })
                    .getCount(),

                this.claimRepository
                    .createQueryBuilder('claim')
                    .where('claim.created_at >= :start', { start: lastMonthStart })
                    .andWhere('claim.created_at <= :end', { end: lastMonthEnd })
                    .getCount(),
            ]);

            // Calculate growth rates
            const userGrowthRate = this.calculateGrowthRate(currentMonthUsers, lastMonthUsers);
            const claimsGrowthRate = this.calculateGrowthRate(currentMonthClaims, lastMonthClaims);

            // TODO: Implement these queries based on your actual entities and requirements
            const totalPayments = 0; // await this.paymentRepository.count();
            const totalQuotes = 0; // await this.quoteRepository.count();
            const totalDiasporaRequests = 0; // await this.diasporaRequestRepository.count();

            // Revenue calculations (implement based on your payment/order entities)
            const totalRevenue = 0; // await this.calculateTotalRevenue();
            const monthlyRevenue = 0; // await this.calculateMonthlyRevenue(currentMonthStart);

            // Conversion rate (customize based on your business logic)
            const conversionRate = totalUsers > 0 ? (totalClaims / totalUsers) * 100 : 0;

            // Placeholder growth rates (implement based on actual data)
            const quoteGrowthRate = 0;
            const revenueGrowthRate = 0;

            const dashboardStats: DashboardStats = {
                totalUsers,
                totalClaims,
                totalConsultations,
                totalPayments,
                totalQuotes,
                totalOutsourcingRequests,
                totalDiasporaRequests,
                totalRevenue,
                monthlyRevenue,
                conversionRate: Number(conversionRate.toFixed(2)),
                userGrowthRate: Number(userGrowthRate.toFixed(2)),
                claimsGrowthRate: Number(claimsGrowthRate.toFixed(2)),
                quoteGrowthRate,
                revenueGrowthRate,
                lastUpdated: now.toISOString(),
            };

            console.log('✅ Dashboard data generated successfully');
            return { success: true, data: dashboardStats };

        } catch (error) {
            console.error('❌ Error generating dashboard data:', error);
            throw new Error('Failed to generate dashboard statistics');
        }
    }

    private calculateGrowthRate(current: number, previous: number): number {
        if (previous === 0) {
            return current > 0 ? 100 : 0;
        }
        return ((current - previous) / previous) * 100;
    }

    // Helper method to get user statistics by date range
    async getUserStatsByDateRange(startDate: Date, endDate: Date) {
        return await this.userRepository
            .createQueryBuilder('user')
            .where('user.createdAt >= :start', { start: startDate })
            .andWhere('user.createdAt <= :end', { end: endDate })
            .getCount();
    }

    // Helper method to get claims statistics by status
    async getClaimsStatsByStatus() {
        return await this.claimRepository
            .createQueryBuilder('claim')
            .select('claim.status, COUNT(*) as count')
            .groupBy('claim.status')
            .getRawMany();
    }

    // Add more helper methods as needed for specific dashboard widgets

    // TODO: Implement these methods based on your actual entities

    // private async calculateTotalRevenue(): Promise<number> {
    //   const result = await this.paymentRepository
    //     .createQueryBuilder('payment')
    //     .select('SUM(payment.amount)', 'total')
    //     .where('payment.status = :status', { status: 'completed' })
    //     .getRawOne();
    //   return result?.total || 0;
    // }

    // private async calculateMonthlyRevenue(monthStart: Date): Promise<number> {
    //   const result = await this.paymentRepository
    //     .createQueryBuilder('payment')
    //     .select('SUM(payment.amount)', 'total')
    //     .where('payment.status = :status', { status: 'completed' })
    //     .andWhere('payment.createdAt >= :start', { start: monthStart })
    //     .getRawOne();
    //   return result?.total || 0;
    // }
}