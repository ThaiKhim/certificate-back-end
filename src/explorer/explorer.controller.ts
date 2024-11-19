import { Controller, Get, Param, Query } from '@nestjs/common';
import { ExplorerService } from './explorer.service';
import { ApiQuery } from '@nestjs/swagger';

@Controller('nfts') // Add a common prefix to avoid ambiguity
export class ExplorerController {
  constructor(private readonly explorerService: ExplorerService) {}

  // Most specific route comes first
  @Get('counters/:address')
  async getTokenCounters(
    @Param('address') contractAddress: string,
  ): Promise<any> {
    return await this.explorerService.getTokenCounters(contractAddress);
  }

  // Route for fetching an NFT by its ID
  @Get(':address/:id')
  async getNftById(
    @Param('address') address: string,
    @Param('id') id: number,
  ): Promise<any> {
    return await this.explorerService.getNftById(address, id);
  }

  // Route for fetching an NFT by its ID
  @Get('get-all-nfts')
  @ApiQuery({ name: 'page', required: true, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: true, type: Number, example: 10 })
  async getAllNfts(
    @Query('page') page: number,
    @Query('limit') limit: number,
  ): Promise<any> {
    return this.explorerService.getNftsPaginated(page, limit);
  }

  // Route for fetching NFTs by contract address
  @Get(':address')
  async getNfts(@Param('address') address: string): Promise<any> {
    return await this.explorerService.getNfts(address);
  }

  // General route for fetching NFT collections
  @Get()
  async getNftCollections(): Promise<any> {
    return await this.explorerService.getNftCollections();
  }
}
