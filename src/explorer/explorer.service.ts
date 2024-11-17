import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class ExplorerService {
  private explorerApi: string;

  constructor(private readonly httpService: HttpService) {
    this.explorerApi = process.env.EXPLORER_URL;
  }

  async getNftCollections(): Promise<any> {
    try {
      const response = await this.httpService
        .get(`${this.explorerApi}/tokens?type=ERC-721`)
        .toPromise();
      return response.data;
    } catch (error) {
      console.error('Error fetching NFT Collection:', error.message);
      throw error;
    }
  }

  async getNfts(address: string): Promise<any> {
    try {
      const response = await this.httpService
        .get(`${this.explorerApi}/${address}/instances`)
        .toPromise();
      return response.data;
    } catch (error) {
      console.error('Error fetching NFTs:', error.message);
      throw error;
    }
  }

  async getNftById(address: string, id: number): Promise<any> {
    try {
      const response = await this.httpService
        .get(`${this.explorerApi}/tokens/${address}/instances/${id}`)
        .toPromise();
      return response.data;
    } catch (error) {
      console.error('Error fetching NFT by Id:', error.message);
      throw error;
    }
  }

  async getTokenCounters(contractAddress: string): Promise<any> {
    try {
      const url = `${this.explorerApi}/tokens/${contractAddress}/counters`;
      const response = await this.httpService.get(url).toPromise();
      return response.data;
    } catch (error) {
      console.error('Error fetching token counters:', error.message);
      throw error;
    }
  }
}
