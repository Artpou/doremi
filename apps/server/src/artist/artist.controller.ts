import {
  Controller,
  Get,
  Param,
  UseGuards,
  NotFoundException,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/auth.guard';

import { ArtistService } from './artist.service';
import { ArtistResponse } from './artist.response';

@ApiTags('artists')
@Controller('artists')
@UseGuards(JwtAuthGuard)
export class ArtistController {
  constructor(private artistService: ArtistService) {}

  @Get()
  @ApiOkResponse({ type: [ArtistResponse] })
  async list(): Promise<ArtistResponse[]> {
    return await this.artistService.list();
  }

  @Get(':id')
  @ApiOkResponse({ type: ArtistResponse })
  async get(@Param('id') id: number): Promise<ArtistResponse> {
    const artist = await this.artistService.get(id);
    if (!artist) throw new NotFoundException('Artist not found');

    return artist;
  }
}
