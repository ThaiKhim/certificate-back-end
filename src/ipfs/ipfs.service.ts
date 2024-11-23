import { Injectable } from '@nestjs/common';
import { PinataSDK } from 'pinata-web3';
import axios from 'axios';

@Injectable()
export class IpfsService {
  private pinata: PinataSDK;

  constructor() {
    this.pinata = new PinataSDK({
      pinataJwt: process.env.PINATA_JWT!,
      pinataGateway: 'https://amber-parallel-falcon-815.mypinata.cloud',
    });
  }

  async uploadFileToIPFS(
    file: Express.Multer.File,
    buffer: Buffer,
  ): Promise<any> {
    try {
      const upload = await this.pinata.upload.file(
        new File([buffer], file.originalname, { type: file.mimetype }),
      );

      return {
        cid: upload.IpfsHash,
        url: `${this.pinata.config.pinataGateway}/ipfs/${upload.IpfsHash}`,
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
        new File([jsonBlob], 'certificate.json', { type: 'application/json' }),
      );

      return {
        cid: upload.IpfsHash,
        url: `${this.pinata.config.pinataGateway}/ipfs/${upload.IpfsHash}`,
      };
    } catch (error) {
      console.error('Error uploading metadata to IPFS:', error);
      throw error;
    }
  }

  /**
   * Fetch data from an IPFS URL.
   * @param url - The IPFS URL to fetch data from.
   * @returns Parsed JSON or raw data from the IPFS URL.
   */
  async fetchDataFromIPFS(url: string): Promise<any> {
    try {
      const response = await axios.get(url);
      return response.data; // Return parsed JSON or raw data.
    } catch (error) {
      console.error('Error fetching data from IPFS:', error);
      throw error;
    }
  }
}
