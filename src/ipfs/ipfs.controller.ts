import {
  Controller,
  Post,
  UploadedFile,
  Body,
  UseInterceptors,
  Get,
  Query,
  Param,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { IpfsService } from './ipfs.service';

@Controller('ipfs')
export class IpfsController {
  constructor(private readonly ipfsService: IpfsService) {}

  @Post('upload-file')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body('buffer') buffer: string,
  ) {
    const bufferData = Buffer.from(buffer, 'base64');

    const response = await this.ipfsService.uploadFileToIPFS(file, bufferData);
    return response;
  }

  @Post('upload-metadata')
  async uploadMetadata(@Body() metadata: Record<string, any>) {
    const response = await this.ipfsService.uploadMetadataToIPFS(metadata);
    return response;
  }

  @Get('fetch')
  async fetchData(@Query('url') url: string) {
    return await this.ipfsService.fetchDataFromIPFS(url);
  }

  @Get('certificate/validate/:ipfsHash')
  async validateCertificate(@Param('ipfsHash') ipfsHash: any) {
    const response = await this.ipfsService.validateCertificate(ipfsHash);
    return response;
  }
}
