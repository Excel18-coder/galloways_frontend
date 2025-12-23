import { Module } from '@nestjs/common';
import { DiasporaRequestsService } from './diaspora_requests.service';
import { DiasporaRequestsController } from './diaspora_requests.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiasporaRequest } from './entities/diaspora_request.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DiasporaRequest])],
  controllers: [DiasporaRequestsController],
  providers: [DiasporaRequestsService],
})
export class DiasporaRequestsModule {}
