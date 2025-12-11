import { Module } from '@nestjs/common';
import { OutsourcingRequestsService } from './outsourcing_requests.service';
import { OutsourcingRequestsController } from './outsourcing_requests.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OutsourcingRequest } from './entities/outsourcing_request.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OutsourcingRequest])],
  controllers: [OutsourcingRequestsController],
  providers: [OutsourcingRequestsService],
})
export class OutsourcingRequestsModule {}
