import { Module } from '@nestjs/common';
import { ExplorerController } from './explorer.controller';
import { ExplorerService } from './explorer.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [HttpModule, ConfigModule],
  controllers: [ExplorerController],
  providers: [ExplorerService],
})
export class ExplorerModule {}
