import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ContractService } from 'src/contract/contract.service';
import { IpfsService } from 'src/ipfs/ipfs.service';

@Injectable()
export class ExplorerService {
  private explorerApi: string;

  constructor(
    private readonly ipfsService: IpfsService,
    private readonly contractService: ContractService,
    private readonly httpService: HttpService,
  ) {
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
        .get(`${this.explorerApi}/tokens/${address}/instances`)
        .toPromise();
      return response.data;
    } catch (error) {
      console.error('Error fetching NFTs:', error.message);
      throw error;
    }
  }

  async getNftIds(
    address: string,
  ): Promise<{ nftIds: number[]; nftName: string }> {
    try {
      const response = await this.getNfts(address);

      const nftIds =
        response?.items
          ?.map((item: any) => parseInt(item.id, 10))
          .filter((id: number) => id !== 0) || [];

      const nftName = response?.items?.[0]?.token?.name || '';

      return { nftIds, nftName };
    } catch (error) {
      console.error('Error fetching NFT IDs:', error.message);
      throw error;
    }
  }

  async getNftById(address: string, id: number): Promise<any> {
    try {
      const baseUri = await this.contractService.getBaseUri(address, id);
      const metadata = await this.ipfsService.fetchDataFromIPFS(baseUri);

      const response = await this.httpService
        .get(`${this.explorerApi}/tokens/${address}/instances/${id}`)
        .toPromise();

      const data = response.data;

      const formattedNFT = {
        id: data.id,
        image_url: metadata.image,
        metadata: {
          ...metadata,
          attributes: metadata.attributes.map((attr: any) => ({
            trait_type: attr.trait_type,
            value: attr.value,
          })),
        },
        owner: data.owner.hash,
        token: {
          address: data.token.address,
          name: data.token.name,
        },
      };

      return formattedNFT;
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

      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;

      const allItems: any[] = [];

      await Promise.all(
        addresses.map(async (address) => {
          const { nftIds, nftName } = await this.getNftIds(address);

          const paginatedNftIds = nftIds.slice(startIndex, endIndex);

          const nftPromises = paginatedNftIds.map(async (id) => {
            const baseUriPromise = this.contractService.getBaseUri(address, id);
            const verifiersPromise =
              this.contractService.getVerifiersCertificate(address, id);

            const [baseUri, verifiers] = await Promise.all([
              baseUriPromise,
              verifiersPromise,
            ]);

            const metadata = await this.ipfsService.fetchDataFromIPFS(baseUri);

            return {
              id,
              image_url: metadata.image,
              metadata: {
                ...metadata,
                attributes: metadata.attributes.map((attr: any) => ({
                  trait_type: attr.trait_type,
                  value: attr.value,
                })),
              },
              owner: address,
              token: {
                address,
                name: nftName,
              },
              verifiers: verifiers.verifiedCount,
            };
          });

          const items = await Promise.all(nftPromises);
          allItems.push(...items);
        }),
      );

      const paginatedItems = allItems.slice(0, limit);

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
