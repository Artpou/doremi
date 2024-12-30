import type { AuthenticatedRequest } from 'src/auth/auth';
import type { Cache } from 'cache-manager';

import { Controller, Get, Inject, Req, UseGuards } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { SpotifyService } from 'src/spotify/spotify.service';
import { ProviderGuard } from 'src/provider/provider.guard';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { ApiOkResponse } from '@nestjs/swagger';
import { TrackDto, TrackResults } from 'src/spotify/spotify.dto';
@Controller('user')
export class UserController {
  constructor(
    private readonly spotifyService: SpotifyService,
    @Inject(CACHE_MANAGER) private cacheService: Cache,
  ) {}

  @Get('top')
  @UseGuards(JwtAuthGuard, ProviderGuard)
  @ApiOkResponse({ type: TrackDto })
  async getTop(@Req() req: AuthenticatedRequest): Promise<TrackResults> {
    const user = req.user;

    const cachedData = (await this.cacheService.get(
      `user/top/${user.id}`,
    )) as TrackResults;
    if (cachedData) return cachedData;

    const data = await this.spotifyService.userTop(
      req.provider!.access_token,
      'tracks',
    );

    await this.cacheService.set(`user/top/${user.id}`, data);
    return data;
  }
}
