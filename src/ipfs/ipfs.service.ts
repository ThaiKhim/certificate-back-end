import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { PinataSDK } from 'pinata-web3';
import axios from 'axios';
import { ExplorerService } from 'src/explorer/explorer.service';

@Injectable()
export class IpfsService {
  private pinata: PinataSDK;

  constructor(
    @Inject(forwardRef(() => ExplorerService))
    private readonly explorerService: ExplorerService,
  ) {
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

  async fetchDataFromIPFS(url: string): Promise<any> {
    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching data from IPFS:', error);
      throw error;
    }
  }

  async validateCertificate(ipfsHash: string): Promise<boolean> {
    const qrUrl = `${this.pinata.config.pinataGateway}/ipfs/${ipfsHash}`;

    const qrData = await this.fetchDataFromIPFS(qrUrl);

    const nftData = await this.explorerService.getNftById(
      qrData.contract,
      qrData.id,
    );

    try {
      if (
        qrData.name === nftData.metadata.name &&
        this.compareAttributes(qrData.attributes, nftData.metadata.attributes)
      ) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error('Error validating certificate:', error);
      throw error;
    }
  }

  private compareAttributes(
    qrAttributes: Array<{ trait_type: string; value: any }>,
    nftAttributes: Array<{ trait_type: string; value: any }>,
  ): boolean {
    if (qrAttributes.length !== nftAttributes.length) {
      return false;
    }

    console.log(qrAttributes);
    console.log(nftAttributes);

    for (const qrAttr of qrAttributes) {
      const matchingNftAttr = nftAttributes.find(
        (nftAttr) =>
          nftAttr.trait_type === qrAttr.trait_type &&
          nftAttr.value === qrAttr.value,
      );

      if (!matchingNftAttr) {
        return false;
      }
    }

    return true;
  }
}
