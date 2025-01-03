import type { AuthenticatedRequest } from 'src/auth/auth';

import { Controller, Get, Query, Request, UseGuards } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { ProviderGuard } from 'src/provider/provider.guard';

import { SearchService } from './search.service';
import { SearchResponse } from './search.response';

@Controller('search')
@UseGuards(JwtAuthGuard, ProviderGuard)
export class SearchController {
  constructor(private searchService: SearchService) {}

  @Get()
  @ApiOkResponse({ type: SearchResponse })
  async search(
    @Request() req: AuthenticatedRequest,
    @Query('search') search: string,
    @Query('type') type: 'artist' | 'album' | 'track',
  ): Promise<SearchResponse> {
    return await this.searchService.search(req, { search, type });
  }
}
