import {
  Controller,
  Post,
  UploadedFile,
  Body,
  UseInterceptors,
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

    console.log(bufferData);

    const response = await this.ipfsService.uploadFileToIPFS(file, bufferData);
    return response;
  }

  @Post('upload-metadata')
  async uploadMetadata(@Body() metadata: Record<string, any>) {
    const response = await this.ipfsService.uploadMetadataToIPFS(metadata);
    return response;
  }
}
