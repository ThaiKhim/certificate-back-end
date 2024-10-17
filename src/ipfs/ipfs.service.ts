import { Injectable } from '@nestjs/common';
import { PinataSDK } from 'pinata-web3';

@Injectable()
export class IpfsService {
  private pinata: PinataSDK;

  constructor() {
    this.pinata = new PinataSDK({
      pinataJwt: process.env.PINATA_JWT!,
      pinataGateway: 'example-gateway.mypinata.cloud',
    });
  }

  async uploadFileToIPFS(file: Express.Multer.File): Promise<any> {
    try {
      const upload = await this.pinata.upload.file(
        new File([file.buffer], file.originalname, { type: file.mimetype }),
      );
      return {
        cid: upload.IpfsHash,
        url: `${this.pinata.gateways}/ipfs/${upload.IpfsHash}`,
      };
    } catch (error) {
      console.error('Error uploading file to IPFS:', error);
      throw error;
    }
  }

  async uploadMetadataToIPFS(metadata: Record<string, any>): Promise<any> {
    try {
      const jsonBlob = new Blob([JSON.stringify(metadata)], {
        type: 'application/json',
      });
      const upload = await this.pinata.upload.file(
        new File([jsonBlob], 'metadata.json', { type: 'application/json' }),
      );
      return {
        cid: upload.IpfsHash,
        url: `${this.pinata.gateways}/ipfs/${upload.IpfsHash}`,
      };
    } catch (error) {
      console.error('Error uploading metadata to IPFS:', error);
      throw error;
    }
  }
}
