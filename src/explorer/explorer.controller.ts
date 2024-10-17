import { Controller, Get, Param } from '@nestjs/common';
import { ExplorerService } from './explorer.service';

@Controller()
export class ExplorerController {
  constructor(private readonly explorerService: ExplorerService) {}

  @Get('nfts')
  async getNftCollections(): Promise<any> {
    return await this.explorerService.getNftCollections();
  }

  @Get('nfts/:address')
  async getNfts(@Param('address') address: string): Promise<any> {
    return await this.explorerService.getNfts(address);
  }

  @Get('nfts/:address/:id')
  async getNftById(
    @Param('address') address: string,
    @Param('id') id: number,
  ): Promise<any> {
    return await this.explorerService.getNftById(address, id);
  }
}
