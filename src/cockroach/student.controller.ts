import { Controller, Put, Param, Body, Get } from '@nestjs/common';
import { StudentService } from './student.service';

@Controller('students')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Put('update-address/:email')
  async updateAddress(
    @Param('email') email: string,
    @Body('address') newAddress: string,
  ) {
    return this.studentService.updateAddressByEmail(email, newAddress);
  }

  @Get(':studentId')
  async getStudentByStudentId(@Param('studentId') studentId: string) {
    return this.studentService.findByStudentId(studentId);
  }
}
