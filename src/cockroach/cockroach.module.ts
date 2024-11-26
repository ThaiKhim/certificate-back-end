import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { StudentService } from './student.service';
import { StudentController } from './student.controller';
import { HttpModule } from '@nestjs/axios';
import { Admin } from './entities/admin.entity';
import { Student } from './entities/student.entity';

@Module({
  imports: [HttpModule, TypeOrmModule.forFeature([Admin, Student])],
  controllers: [AdminController, StudentController],
  providers: [AdminService, StudentService],
})
export class CockroachModule {}
