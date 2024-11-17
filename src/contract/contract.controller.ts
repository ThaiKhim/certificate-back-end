import { Controller, Post, Body } from '@nestjs/common';
import { ContractService } from './contract.service';
import { DeployCertificateDto } from './dto/deploy.dto';
import { CreateNfttDto } from './dto/create.dto';

@Controller('contract')
export class ContractController {
  constructor(private readonly contractService: ContractService) {}

  @Post('deploy')
  async deployCertificate(@Body() deployCertificateData: DeployCertificateDto) {
    const response = await this.contractService.deployCertificate(
      deployCertificateData,
    );
    return response;
  }

  @Post('create')
  async writeContract(@Body() createNfttDto: CreateNfttDto) {
    const response = await this.contractService.createNft(createNfttDto);
    return response;
  }
}
