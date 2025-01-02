import type { AuthenticatedRequest } from 'src/auth/auth';

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
  Query,
  Req,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/auth.guard';

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
  // @UseInterceptors(CacheInterceptor)
  // @CacheTTL(ms('10m'))
  async list(
    @Req() req: AuthenticatedRequest,
    @Query('feed') feed: 'trending' | 'friends' | 'you' = 'trending',
  ): Promise<ReviewWithRelationsResponse[]> {
    if (feed === 'friends')
      return await this.reviewService.list({
        creatorId: -1,
      });
    if (feed === 'you')
      return await this.reviewService.list({
        creatorId: req.user.id,
      });
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
