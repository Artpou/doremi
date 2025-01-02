import {
  Controller,
  Get,
  Param,
  UseGuards,
  NotFoundException,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { ReviewResponse } from 'src/review/review.dto';
import { TrackResponse } from 'src/track/track.dto';

import { AlbumService } from './album.service';
import { AlbumResponse, AlbumWithRelationsResponse } from './album.dto';

@ApiTags('albums')
@Controller('albums')
@UseGuards(JwtAuthGuard)
export class AlbumController {
  constructor(private albumService: AlbumService) {}

  @Get()
  @ApiOkResponse({ type: [AlbumResponse] })
  async list(): Promise<AlbumResponse[]> {
    return await this.albumService.list();
  }

  @Get(':id')
  @ApiOkResponse({ type: AlbumWithRelationsResponse })
  async get(@Param('id') id: number): Promise<AlbumWithRelationsResponse> {
    const album = await this.albumService.get(id);
    if (!album) throw new NotFoundException('Album not found');

    return album;
  }

  @Get(':id/reviews')
  @ApiOkResponse({ type: [ReviewResponse] })
  async reviews(@Param('id') id: number): Promise<ReviewResponse[]> {
    return await this.albumService.reviews(id);
  }

  @Get(':id/tracks')
  @ApiOkResponse({ type: [TrackResponse] })
  async tracks(@Param('id') id: number): Promise<TrackResponse[]> {
    return await this.albumService.tracks(id);
  }
}
