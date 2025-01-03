import type { AuthenticatedRequest } from 'src/auth/auth';
import type { Cache } from 'cache-manager';

import { Controller, Get, Inject, Req, UseGuards } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { SpotifyService } from 'src/spotify/spotify.service';
import { ProviderGuard } from 'src/provider/provider.guard';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import ms from 'ms';
import { AlbumWithRelationsResponse } from 'src/album/album.response';
import { ApiOkResponse } from '@nestjs/swagger';

@Controller('me')
@UseGuards(JwtAuthGuard, ProviderGuard)
export class MeController {
  constructor(
    private readonly spotifyService: SpotifyService,
    @Inject(CACHE_MANAGER) private cacheService: Cache,
  ) {}

  @Get('top')
  @ApiOkResponse({ type: [AlbumWithRelationsResponse] })
  async getTop(
    @Req() req: AuthenticatedRequest,
  ): Promise<AlbumWithRelationsResponse[]> {
    const user = req.user;

    const cachedData = await this.cacheService.get(`/${user.id}/top`);
    if (cachedData) return cachedData as AlbumWithRelationsResponse[];

    const data = await this.spotifyService.userTop(req.provider!.access_token);

    await this.cacheService.set(`/${user.id}/top`, data, ms('24h'));

    return data;
  }

  @Get('releases')
  @ApiOkResponse({ type: [AlbumWithRelationsResponse] })
  async getReleases(
    @Req() req: AuthenticatedRequest,
  ): Promise<AlbumWithRelationsResponse[]> {
    const user = req.user;

    const cachedData = await this.cacheService.get(`/${user.id}/releases`);
    if (cachedData) return cachedData as AlbumWithRelationsResponse[];

    const data = await this.spotifyService.newReleases(
      req.provider!.access_token,
    );

    await this.cacheService.set(`/${user.id}/releases`, data, ms('24h'));

    return data;
  }
}
