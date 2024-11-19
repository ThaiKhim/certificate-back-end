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

  private async getNftsAddresses(): Promise<any> {
    try {
      const response = await this.getNftCollections();

      const addresses = response.items.map((item: any) => item.address);

      return {
        addresses,
      };
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

  async getNftsPaginated(page: number, limit: number): Promise<any> {
    try {
      const { addresses } = await this.getNftsAddresses();

      let allItems: any[] = [];

      for (const address of addresses) {
        const response = await this.httpService
          .get(`${this.explorerApi}/tokens/${address}/instances`)
          .toPromise();

        const items = response.data.items
          .filter((item: any) => item.metadata)
          .map((item: any) => ({
            id: item.id,
            image_url: item.image_url,
            metadata: item.metadata,
            owner: item.owner.hash,
            token: {
              address: item.token.address,
              name: item.token.name,
            },
          }));

        allItems = allItems.concat(items);
      }

      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;

      const paginatedItems = allItems.slice(startIndex, endIndex);

      return {
        items: paginatedItems,
        pagination: {
          currentPage: page,
          totalItems: allItems.length,
          totalPages: Math.ceil(allItems.length / limit),
          hasMore: endIndex < allItems.length,
        },
      };
    } catch (error) {
      console.error('Error fetching paginated NFTs:', error.message);
      throw error;
    }
  }
}
