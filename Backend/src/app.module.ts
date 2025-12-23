import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { typeOrmConfig } from './config/db.config';

import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
// import { SeedModule } from './seed/seed.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { AuthModule } from './auth/auth.module';
import { CustomThrottlerGuard } from './rate limiter/throttler.guard';

import { ClaimsModule } from './claims/claims.module';
import { ConsultationsModule } from './consultations/consultations.module';
import { QuotesModule } from './quotes/quotes.module';

import { BookingConsultantsModule } from './booking-consultants/booking-consultants.module';
import { DiasporaRequestsModule } from './diaspora_requests/diaspora_requests.module';
import { OutsourcingRequestsModule } from './outsourcing_requests/outsourcing_requests.module';
import { PaymentsModule } from './payments/payments.module';

import { BasedConsultationModule } from './based-consultation/based-consultation.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { ResourcesModule } from './resources/resources.module';

@Module({
  imports: [
    UsersModule,
    DatabaseModule,
    AuthModule,
    TypeOrmModule.forRoot(typeOrmConfig),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60_000, // 1 minute in milliseconds
        limit: 20, // 20 requests per minute
      },
    ]),
    // SeedModule,

    ClaimsModule,

    QuotesModule,

    ConsultationsModule,

    DiasporaRequestsModule,

    OutsourcingRequestsModule,

    PaymentsModule,

    BookingConsultantsModule,

    DashboardModule,

    BasedConsultationModule,

    ResourcesModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: CustomThrottlerGuard,
    },
  ],
})
export class AppModule {}
