import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  NotFoundException,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';
import ms from 'ms';

import { ReviewService } from './review.service';
import {
  CreateReviewDto,
  ReviewResponse,
  ReviewWithRelationsResponse,
} from './review.dto';
import { ReviewGuard } from './review.guard';

@ApiTags('reviews')
@Controller('reviews')
@UseGuards(JwtAuthGuard)
export class ReviewController {
  constructor(private reviewService: ReviewService) {}

  @Get()
  @ApiOkResponse({ type: [ReviewWithRelationsResponse] })
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(ms('10m'))
  async list(): Promise<ReviewWithRelationsResponse[]> {
    return await this.reviewService.list();
  }

  @Get(':id')
  @ApiOkResponse({ type: ReviewResponse })
  async get(@Param('id') id: number): Promise<ReviewResponse> {
    const review = await this.reviewService.get(id);
    if (!review) throw new NotFoundException('Review not found');

    return review;
  }

  @Post()
  @ApiOkResponse({ type: ReviewResponse })
  async create(@Body() dto: CreateReviewDto): Promise<ReviewResponse> {
    const review = await this.reviewService.create(dto);
    if (!review) throw new Error('Review creation failed');
    return review;
  }

  @Put(':id')
  @UseGuards(ReviewGuard)
  @ApiOkResponse({ type: ReviewResponse })
  async update(
    @Param('id') id: number,
    @Body() dto: CreateReviewDto,
  ): Promise<ReviewResponse> {
    const review = await this.reviewService.update(id, dto);
    if (!review) throw new Error('Review update failed');
    return review;
  }

  @Delete(':id')
  @UseGuards(ReviewGuard)
  @ApiOkResponse({ type: ReviewResponse })
  async delete(@Param('id') id: number): Promise<ReviewResponse> {
    const review = await this.reviewService.delete(id);
    if (!review) throw new Error('Review deletion failed');
    return review;
  }
}
