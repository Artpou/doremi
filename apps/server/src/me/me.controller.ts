import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Controller, Get, Inject, Req, UseGuards } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import type { Cache } from 'cache-manager';
import ms from 'ms';
import { createZodDto } from 'nestjs-zod';

import { AlbumResponse, AlbumResponseSchema } from '@/album/album.schema';
import type { AuthenticatedRequest } from '@/auth/auth';
import { JwtAuthGuard } from '@/auth/auth.guard';
import { ProviderGuard } from '@/provider/provider.guard';
import { SpotifyService } from '@/spotify/spotify.service';

class AlbumResponseDto extends createZodDto(AlbumResponseSchema) {}

@ApiTags('me')
@Controller('me')
@UseGuards(JwtAuthGuard, ProviderGuard)
export class MeController {
  constructor(
    private readonly spotifyService: SpotifyService,
    @Inject(CACHE_MANAGER) private cacheService: Cache,
  ) {}

  @Get('top')
  @ApiOkResponse({ type: [AlbumResponseDto] })
  async getTop(@Req() req: AuthenticatedRequest): Promise<AlbumResponse[]> {
    const user = req.user;

    const cachedData = await this.cacheService.get(`/${user.id}/top`);
    if (cachedData) return cachedData as AlbumResponse[];

    const data = await this.spotifyService.userTop(req.provider!.access_token);

    await this.cacheService.set(`/${user.id}/top`, data, ms('24h'));

    return data;
  }

  @Get('releases')
  @ApiOkResponse({ type: [AlbumResponseDto] })
  async getReleases(
    @Req() req: AuthenticatedRequest,
  ): Promise<AlbumResponse[]> {
    const user = req.user;

    const cachedData = await this.cacheService.get(`/${user.id}/releases`);
    if (cachedData) return cachedData as AlbumResponse[];

    const data = await this.spotifyService.newReleases(
      req.provider!.access_token,
    );

    await this.cacheService.set(`/${user.id}/releases`, data, ms('24h'));

    return data;
  }
}
