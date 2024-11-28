import { Module, forwardRef } from '@nestjs/common';
import { ExplorerController } from './explorer.controller';
import { ExplorerService } from './explorer.service';
import { ContractService } from 'src/contract/contract.service';
import { AdminService } from '../cockroach/admin.service';
import { IpfsService } from 'src/ipfs/ipfs.service';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Admin } from '../cockroach/entities/admin.entity';
import { Student } from '../cockroach/entities/student.entity';
import { IpfsModule } from 'src/ipfs/ipfs.module';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([Admin, Student]),
    forwardRef(() => IpfsModule),
  ],
  controllers: [ExplorerController],
  providers: [ExplorerService, ContractService, AdminService],
  exports: [ExplorerService],
})
export class ExplorerModule {}
