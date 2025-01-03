import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthenticatedRequest } from 'src/auth/auth';
import { SpotifyService } from 'src/spotify/spotify.service';
import { SearchQuerySchema } from '@workspace/dto/search.dto';
import z from 'zod';

import { SearchResponse } from './search.response';

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
