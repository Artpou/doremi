import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { createZodDto } from 'nestjs-zod';

import { JwtAuthGuard } from '@/auth/auth.guard';

import { TrackResponse, TrackResponseSchema } from './track.schema';
import { TrackService } from './track.service';

class TrackResponseDto extends createZodDto(TrackResponseSchema) {}

@ApiTags('tracks')
@Controller('tracks')
@UseGuards(JwtAuthGuard)
export class TrackController {
  constructor(private trackService: TrackService) {}

  @Get()
  @ApiOkResponse({ type: [TrackResponseDto] })
  async list(): Promise<TrackResponse[]> {
    return await this.trackService.findMany({});
  }
}
