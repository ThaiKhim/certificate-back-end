import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Admin } from './entities/admin.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
  ) {}

  // Create a new admin
  async createAdmin(data: Partial<Admin>): Promise<Admin> {
    const admin = this.adminRepository.create(data);
    return this.adminRepository.save(admin);
  }

  // Find all admins
  async findAll(): Promise<Admin[]> {
    return this.adminRepository.find();
  }

  // Get all admin addresses
  async findAllAddresses(): Promise<string[]> {
    const admins = await this.adminRepository.find();
    return admins.map((admin) => admin.address).filter((address) => !!address);
  }

  // Find an admin by ID
  async findById(id: number): Promise<Admin> {
    const admin = await this.adminRepository.findOne({ where: { id } });
    if (!admin) {
      throw new NotFoundException(`Admin with ID ${id} not found`);
    }
    return admin;
  }

  // Find an admin by email
  async findByEmail(email: string): Promise<Admin> {
    const admin = await this.adminRepository.findOne({ where: { email } });
    if (!admin) {
      return null;
    }
    return admin;
  }

  // Find an admin by address
  async findByAddress(address: string): Promise<Admin[]> {
    const admins = await this.adminRepository.find({ where: { address } });
    if (admins.length === 0) {
      throw new NotFoundException(`No admins found with address ${address}`);
    }
    return admins;
  }

  // Update an admin by ID
  async updateAdmin(id: number, data: Partial<Admin>): Promise<Admin> {
    const admin = await this.findById(id);
    const updatedAdmin = this.adminRepository.merge(admin, data);
    return this.adminRepository.save(updatedAdmin);
  }

  // Update admin address by email
  async updateAddressByEmail(
    email: string,
    newAddress: string,
  ): Promise<Admin> {
    const admin = await this.findByEmail(email);
    admin.address = newAddress;
    return this.adminRepository.save(admin);
  }

  // Delete an admin by ID
  async deleteAdmin(id: number): Promise<void> {
    const admin = await this.findById(id);
    await this.adminRepository.remove(admin);
  }
}
