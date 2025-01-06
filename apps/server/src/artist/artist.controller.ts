import {
  Controller,
  Get,
  Param,
  UseGuards,
  NotFoundException,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { createZodDto } from 'nestjs-zod';

import { JwtAuthGuard } from '@/auth/auth.guard';

import { ArtistResponseSchema, ArtistResponse } from './artist.schema';
import { ArtistService } from './artist.service';

const ArtistResponseDto = createZodDto(ArtistResponseSchema);

@ApiTags('artists')
@Controller('artists')
@UseGuards(JwtAuthGuard)
export class ArtistController {
  constructor(private artistService: ArtistService) {}

  @Get()
  @ApiOkResponse({ type: [ArtistResponseDto] })
  async list(): Promise<ArtistResponse[]> {
    return await this.artistService.findMany({});
  }

  @Get(':id')
  @ApiOkResponse({ type: ArtistResponseDto })
  async get(@Param('id') id: number): Promise<ArtistResponse> {
    const artist = await this.artistService.findById(id);
    if (!artist) throw new NotFoundException('Artist not found');

    return artist;
  }
}
