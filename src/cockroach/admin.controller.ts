import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { Admin } from './entities/admin.entity';

@Controller('admins')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post()
  async createAdmin(@Body() adminData: Partial<Admin>): Promise<Admin> {
    return this.adminService.createAdmin(adminData);
  }

  @Get()
  async findAll(): Promise<Admin[]> {
    return this.adminService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: number): Promise<Admin> {
    return this.adminService.findById(id);
  }

  @Get('email/:email')
  async findByEmail(@Param('email') email: string): Promise<Admin> {
    return this.adminService.findByEmail(email);
  }

  @Get('address/:address')
  async findByAddress(@Param('address') address: string): Promise<Admin[]> {
    return this.adminService.findByAddress(address);
  }

  @Put(':id')
  async updateAdmin(
    @Param('id') id: number,
    @Body() adminData: Partial<Admin>,
  ): Promise<Admin> {
    return this.adminService.updateAdmin(id, adminData);
  }

  @Put('update-address/:email')
  async updateAddressByEmail(
    @Param('email') email: string,
    @Body('address') newAddress: string,
  ): Promise<Admin> {
    return this.adminService.updateAddressByEmail(email, newAddress);
  }

  @Delete(':id')
  async deleteAdmin(@Param('id') id: number): Promise<void> {
    return this.adminService.deleteAdmin(id);
  }
}
