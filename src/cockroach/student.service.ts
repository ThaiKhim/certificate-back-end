import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from './entities/student.entity';

@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
  ) {}

  async createStudent(data: Partial<Student>): Promise<Student> {
    const student = this.studentRepository.create(data);
    return this.studentRepository.save(student);
  }

  async findAll(): Promise<Student[]> {
    return this.studentRepository.find();
  }

  async findById(id: number): Promise<Student> {
    const student = await this.studentRepository.findOne({ where: { id } });
    if (!student) {
      throw new NotFoundException(`Student with ID ${id} not found`);
    }
    return student;
  }

  async findByEmail(email: string): Promise<Student> {
    const student = await this.studentRepository.findOne({ where: { email } });
    if (!student) {
      throw new NotFoundException(`Student with email ${email} not found`);
    }
    return student;
  }

  async findByStudentId(studentId: string): Promise<Student> {
    const student = await this.studentRepository.findOne({
      where: { studentId },
    });
    if (!student) {
      throw new NotFoundException(
        `Student with studentId ${studentId} not found`,
      );
    }
    return student;
  }

  async updateStudent(id: number, data: Partial<Student>): Promise<Student> {
    const student = await this.findById(id);
    const updatedStudent = this.studentRepository.merge(student, data);
    return this.studentRepository.save(updatedStudent);
  }

  async updateAddressByEmail(
    email: string,
    newAddress: string,
  ): Promise<Student> {
    const student = await this.findByEmail(email);
    student.address = newAddress;
    return this.studentRepository.save(student);
  }

  async deleteStudent(id: number): Promise<void> {
    const student = await this.findById(id);
    await this.studentRepository.remove(student);
  }
}
