import { Module } from '@nestjs/common';
import { ExplorerController } from './explorer.controller';
import { ExplorerService } from './explorer.service';
import { ContractService } from 'src/contract/contract.service';
import { AdminService } from '../cockroach/admin.service';
import { IpfsService } from 'src/ipfs/ipfs.service';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Admin } from '../cockroach/entities/admin.entity';
import { Student } from '../cockroach/entities/student.entity';

@Module({
  imports: [HttpModule, TypeOrmModule.forFeature([Admin, Student])],
  controllers: [ExplorerController],
  providers: [ExplorerService, ContractService, IpfsService, AdminService],
})
export class ExplorerModule {}
