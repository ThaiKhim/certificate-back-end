import { Module } from '@nestjs/common';
import { IpfsController } from './ipfs.controller';
import { IpfsService } from './ipfs.service';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [MulterModule.register({ dest: './uploads' })],
  controllers: [IpfsController],
  providers: [IpfsService],
})
export class IpfsModule {}
