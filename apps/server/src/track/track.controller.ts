import {
  Controller,
  Get,
  Param,
  UseGuards,
  NotFoundException,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { ReviewResponse } from 'src/review/review.response';

import { TrackService } from './track.service';
import { TrackResponse } from './track.response';

@ApiTags('tracks')
@Controller('tracks')
@UseGuards(JwtAuthGuard)
export class TrackController {
  constructor(private trackService: TrackService) {}

  @Get()
  @ApiOkResponse({ type: [TrackResponse] })
  async list(): Promise<TrackResponse[]> {
    return await this.trackService.list();
  }

  @Get(':id')
  @ApiOkResponse({ type: TrackResponse })
  async get(@Param('id') id: number): Promise<TrackResponse> {
    const track = await this.trackService.get(id);
    if (!track) throw new NotFoundException('Track not found');

    return track;
  }

  @Get(':id/reviews')
  @ApiOkResponse({ type: [ReviewResponse] })
  async reviews(@Param('id') id: number): Promise<ReviewResponse[]> {
    return await this.trackService.reviews(id);
  }
}
