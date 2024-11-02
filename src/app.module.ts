import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ExplorerModule } from './explorer/explorer.module';
import { IpfsModule } from './ipfs/ipfs.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot(), ExplorerModule, IpfsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
