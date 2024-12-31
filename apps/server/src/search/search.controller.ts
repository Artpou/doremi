import type { AuthenticatedRequest } from 'src/auth/auth';
import type { Cache } from 'cache-manager';

import {
  Controller,
  Get,
  Inject,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { ProviderGuard } from 'src/provider/provider.guard';
import { SpotifyService } from 'src/spotify/spotify.service';

import { SearchService } from './search.service';
import { SearchResponse } from './search.dto';

@Controller('search')
@UseGuards(JwtAuthGuard, ProviderGuard)
export class SearchController {
  constructor(
    private searchService: SearchService,
    private spotifyService: SpotifyService,
    @Inject(CACHE_MANAGER) private cacheService: Cache,
  ) {}

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
