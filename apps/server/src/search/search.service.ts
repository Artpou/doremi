import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthenticatedRequest } from 'src/auth/auth';
import { SpotifyService } from 'src/spotify/spotify.service';

import { SearchQueryDto, SearchResponse } from './search.dto';

@Injectable()
export class SearchService {
  constructor(private spotifyService: SpotifyService) {}

  async search(
    req: AuthenticatedRequest,
    query: SearchQueryDto,
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
