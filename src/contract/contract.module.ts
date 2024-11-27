import { Module } from '@nestjs/common';
import { ContractController } from './contract.controller';
import { ContractService } from './contract.service';
import { AdminService } from '../cockroach/admin.service';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Admin } from '../cockroach/entities/admin.entity';
import { Student } from '../cockroach/entities/student.entity';

@Module({
  imports: [HttpModule, TypeOrmModule.forFeature([Admin, Student])],
  controllers: [ContractController],
  providers: [ContractService, AdminService],
})
export class ContractModule {}
