import {
  Controller,
  Get,
  NotFoundException,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { createZodDto } from 'nestjs-zod';

import { JwtAuthGuard } from '@/auth/auth.guard';

import { AlbumResponse, AlbumResponseSchema } from './album.schema';
import { AlbumService } from './album.service';

class AlbumResponseDto extends createZodDto(AlbumResponseSchema) {}

@ApiTags('albums')
@Controller('albums')
@UseGuards(JwtAuthGuard)
export class AlbumController {
  constructor(private albumService: AlbumService) {}

  @Get()
  @ApiOkResponse({ type: [AlbumResponseDto], description: 'List of albums' })
  async list(): Promise<AlbumResponse[]> {
    return await this.albumService.findMany({});
  }

  @Get(':id')
  @ApiOkResponse({ type: AlbumResponseDto })
  async get(@Param('id') id: number): Promise<AlbumResponse> {
    const album = await this.albumService.findById(id);
    if (!album) throw new NotFoundException('Album not found');
    return album;
  }
}
