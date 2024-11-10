import { Controller, Post, Body } from '@nestjs/common';
import { ContractService } from './contract.service';
import { DeployCertificateDto } from './dto/deploy.dto';

@Controller('contract')
export class ContractController {
  constructor(private readonly contractService: ContractService) {}

  @Post('deploy')
  async uploadMetadata(@Body() deployCertificateData: DeployCertificateDto) {
    const response = await this.contractService.deployCertificate(
      deployCertificateData,
    );
    return response;
  }
}
