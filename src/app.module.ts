import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ExplorerModule } from './explorer/explorer.module';
import { IpfsModule } from './ipfs/ipfs.module';
import { ContractModule } from './contract/contract.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot(), ExplorerModule, IpfsModule, ContractModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
