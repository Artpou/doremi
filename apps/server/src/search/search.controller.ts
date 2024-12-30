import type { AuthenticatedRequest } from 'src/auth/auth';
import type { Cache } from 'cache-manager';

import {
  Controller,
  Get,
  Inject,
  Query,
  Req,
  Request,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
import {
  CACHE_MANAGER,
  CacheInterceptor,
  CacheTTL,
} from '@nestjs/cache-manager';
import ms from 'ms';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { ProviderGuard } from 'src/provider/provider.guard';
import { NewReleasesDto } from 'src/spotify/spotify.dto';
import { SpotifyService } from 'src/spotify/spotify.service';

import { SearchService } from './search.service';
import { SearchResponse } from './search.dto';

@Controller('search')
export class SearchController {
  constructor(
    private searchService: SearchService,
    private spotifyService: SpotifyService,
    @Inject(CACHE_MANAGER) private cacheService: Cache,
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard, ProviderGuard)
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(ms('3h'))
  @ApiOkResponse({ type: SearchResponse })
  async search(
    @Request() req: AuthenticatedRequest,
    @Query('search') search: string,
    @Query('type') type: 'artist' | 'album' | 'track',
  ): Promise<SearchResponse> {
    return await this.searchService.search(req, { search, type });
  }

  @Get('releases')
  @UseGuards(JwtAuthGuard, ProviderGuard)
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(ms('12h'))
  @ApiOkResponse({ type: NewReleasesDto })
  async getReleases(@Req() req: AuthenticatedRequest): Promise<NewReleasesDto> {
    const user = req.user;

    const cachedData = (await this.cacheService.get(
      `user/releases/${user.id}`,
    )) as NewReleasesDto;
    if (cachedData) return cachedData;

    const data = await this.spotifyService.newReleases(
      req.provider!.access_token,
    );

    await this.cacheService.set(`user/releases/${user.id}`, data);
    return data;
  }
}
