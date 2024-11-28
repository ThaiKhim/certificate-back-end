import { Module, forwardRef } from '@nestjs/common';
import { IpfsController } from './ipfs.controller';
import { IpfsService } from './ipfs.service';
import { MulterModule } from '@nestjs/platform-express';
import { ExplorerModule } from 'src/explorer/explorer.module';

@Module({
  imports: [
    MulterModule.register({ dest: './uploads' }),
    forwardRef(() => ExplorerModule),
  ],
  controllers: [IpfsController],
  providers: [IpfsService],
  exports: [IpfsService],
})
export class IpfsModule {}
