import { Module } from '@nestjs/common';
import { IpfsController } from './ipfs.controller';
import { IpfsService } from './ipfs.service';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    MulterModule.register({ dest: './uploads' }),
    ConfigModule.forRoot(),
  ],
  controllers: [IpfsController],
  providers: [IpfsService],
})
export class IpfsModule {}
