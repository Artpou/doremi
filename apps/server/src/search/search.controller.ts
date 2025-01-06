import { Controller, Get, Query, Request, UseGuards } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { createZodDto } from 'nestjs-zod';

import type { AuthenticatedRequest } from '@/auth/auth';
import { JwtAuthGuard } from '@/auth/auth.guard';
import { ProviderGuard } from '@/provider/provider.guard';

import { SearchResponseSchema, SearchResponse } from './search.schema';
import { SearchService } from './search.service';

class SearchResponseDto extends createZodDto(SearchResponseSchema) {}

@ApiTags('search')
@Controller('search')
@UseGuards(JwtAuthGuard, ProviderGuard)
export class SearchController {
  constructor(private searchService: SearchService) {}

  @Get()
  @ApiOkResponse({ type: SearchResponseDto })
  async search(
    @Request() req: AuthenticatedRequest,
    @Query('search') search: string,
    @Query('type') type: 'artist' | 'album' | 'track',
  ): Promise<SearchResponse> {
    return await this.searchService.search(req, { search, type });
  }
}
