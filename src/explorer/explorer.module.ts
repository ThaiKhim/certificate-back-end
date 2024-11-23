import { Module } from '@nestjs/common';
import { ExplorerController } from './explorer.controller';
import { ExplorerService } from './explorer.service';
import { ContractService } from 'src/contract/contract.service';
import { IpfsService } from 'src/ipfs/ipfs.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [ExplorerController],
  providers: [ExplorerService, ContractService, IpfsService],
})
export class ExplorerModule {}
