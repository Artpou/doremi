import type {
  NewReleases,
  Page,
  PartialSearchResult,
  SimplifiedAlbum,
  Track,
} from 'types/spotify';

import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { SearchQueryDto } from 'src/search/search.dto';
import { AlbumWithRelationsResponse } from 'src/album/album.dto';
import { hashStringToNumber } from 'utils/string';
@Injectable()
export class SpotifyService {
  private readonly logger = new Logger(SpotifyService.name);
  private readonly API_URL = 'https://api.spotify.com/v1';
  private readonly REFRESH_URL = 'https://accounts.spotify.com/api/token';

  constructor(private readonly httpService: HttpService) {}

  private async spotifyRequest<T>(
    path: string,
    accessToken: string,
  ): Promise<T> {
    this.logger.log(`API REQUEST ${this.API_URL}${path}`);

    const { data } = await this.httpService.axiosRef
      .get(`${this.API_URL}${path}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .catch((error) => {
        this.logger.error(JSON.stringify(error.response?.data));
        throw error;
      });

    return data;
  }

  private convertAlbum(album: SimplifiedAlbum): AlbumWithRelationsResponse {
    return {
      id: hashStringToNumber(album.id),
      title: album.name,
      image: album.images[0]?.url ?? null,
      releaseYear: new Date(album.release_date).getFullYear(),
      createdAt: new Date(),
      updatedAt: new Date(),
      spotifyId: album.id,
      appleId: null,
      artists: album.artists.map((artist) => ({
        artist: {
          id: hashStringToNumber(artist.id),
          name: artist.name,
          bio: null,
          image: null,
          createdAt: new Date(),
          updatedAt: new Date(),
          spotifyId: artist.id,
          appleId: null,
        },
      })),
    };
  }

  async refreshToken(
    refreshToken: string,
  ): Promise<{ access_token: string; refresh_token: string }> {
    this.logger.log(`REFRESH TOKEN ${this.REFRESH_URL}`);

    const response = await this.httpService.axiosRef.post(
      this.REFRESH_URL,
      new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
        client_id: process.env.SPOTIFY_CLIENT_ID!,
      }).toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    );

    return response.data;
  }

  async search(accessToken: string, { search, type }: SearchQueryDto) {
    const { albums } = await this.spotifyRequest<PartialSearchResult>(
      `/search?${new URLSearchParams({
        q: search,
        type,
        limit: '20',
      }).toString()}`,
      accessToken,
    );

    return {
      albums: albums?.items.map(this.convertAlbum) ?? [],
    };
  }

  async userTop(accessToken: string, type?: 'tracks' | 'artists') {
    const { items } = await this.spotifyRequest<Page<Track>>(
      `/me/top/${type ?? 'tracks'}?time_range=short_term&limit=40`,
      accessToken,
    );

    return [
      ...new Map(
        items.map((track) => [track.album.id, this.convertAlbum(track.album)]),
      ).values(),
    ].slice(0, 20);
  }

  async newReleases(accessToken: string) {
    const result = await this.spotifyRequest<NewReleases>(
      `/browse/new-releases?limit=20`,
      accessToken,
    );

    return result.albums.items.map(this.convertAlbum);
  }
}
