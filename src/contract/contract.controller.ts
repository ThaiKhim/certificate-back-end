import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { ContractService } from './contract.service';
import { DeployCertificateDto } from './dto/deploy.dto';
import { CreateNfttDto } from './dto/create.dto';
import { VerifyCertificateDto } from './dto/verify.dto';

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
  async createNft(@Body() createNfttDto: CreateNfttDto) {
    const response = await this.contractService.createNft(createNfttDto);
    return response;
  }

  @Post('verify')
  async verifyCertificate(@Body() verifyCertificate: VerifyCertificateDto) {
    const response =
      await this.contractService.verifyCertificate(verifyCertificate);
    return response;
  }

  @Get('verifiers/:address/:id')
  async getVerifiersCertificate(
    @Param('address') address: string,
    @Param('id') id: number,
  ) {
    const response = await this.contractService.getVerifiersCertificate(
      address,
      id,
    );
    return response;
  }

  @Get('get-total-supply/:address')
  async getNftTotalSupply(@Param('address') contractAddress: string) {
    const response =
      await this.contractService.getNftTotalSupply(contractAddress);
    return response;
  }
}
