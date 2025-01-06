import { Injectable, UnauthorizedException } from '@nestjs/common';
import z from 'zod';

import { SearchQuerySchema } from '@workspace/request/search.request';

import { AuthenticatedRequest } from '@/auth/auth';
import { SpotifyService } from '@/spotify/spotify.service';

import { SearchResponse } from './search.schema';

@Injectable()
export class SearchService {
  constructor(private spotifyService: SpotifyService) {}

  async search(
    req: AuthenticatedRequest,
    query: z.infer<typeof SearchQuerySchema>,
  ): Promise<SearchResponse> {
    if (req.provider!.name === 'spotify') {
      return await this.spotifyService.search(
        req.provider!.access_token,
        query,
      );
    }

    throw new UnauthorizedException('Unsupported provider');
  }
}
