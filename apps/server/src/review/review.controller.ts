import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Query,
  Req,
  NotFoundException,
} from '@nestjs/common';
import { ApiOkResponse, ApiQuery, ApiTags } from '@nestjs/swagger';
import { createZodDto } from 'nestjs-zod';

import {
  CreateReviewSchema,
  ListReviewsQuerySchema,
  type ListReviewsQuery,
} from '@workspace/request/review.request';

import type { AuthenticatedRequest } from '@/auth/auth';
import { JwtAuthGuard } from '@/auth/auth.guard';

import { ReviewGuard } from './review.guard';
import {
  ReviewResponse,
  ReviewResponseSchema,
  SimpleReviewResponse,
} from './review.schema';
import { ReviewService } from './review.service';

class ListReviewsQueryDto extends createZodDto(ListReviewsQuerySchema) {}

class CreateReviewDto extends createZodDto(CreateReviewSchema) {}

class ReviewResponseDto extends createZodDto(ReviewResponseSchema) {}

@ApiTags('reviews')
@Controller('reviews')
@UseGuards(JwtAuthGuard)
export class ReviewController {
  constructor(private reviewService: ReviewService) {}

  @Get()
  @ApiQuery({ type: ListReviewsQueryDto })
  @ApiOkResponse({ type: [ReviewResponseDto], description: 'List of reviews' })
  async list(
    @Req() req: AuthenticatedRequest,
    @Query() query: ListReviewsQuery,
  ): Promise<ReviewResponse[]> {
    if (query.feed === 'friends')
      return await this.reviewService.findMany({
        creatorId: -1,
      });
    if (query.feed === 'you')
      return await this.reviewService.findMany({
        creatorId: req.user.id,
      });
    return await this.reviewService.findMany({});
  }

  @Get(':id')
  @ApiOkResponse({ type: ReviewResponseDto })
  async get(@Param('id') id: number): Promise<ReviewResponse> {
    const review = await this.reviewService.findById(id);
    if (!review) throw new NotFoundException('Review not found');
    return review;
  }

  @Post()
  @ApiOkResponse({ type: ReviewResponseDto })
  async create(
    @Req() req: AuthenticatedRequest,
    @Body() body: CreateReviewDto,
  ): Promise<SimpleReviewResponse> {
    const [response] = await this.reviewService.create({
      ...body,
      creatorId: req.user.id,
    });

    if (!response) throw new NotFoundException('Review not found');
    return response;
  }

  @Put(':id')
  @UseGuards(ReviewGuard)
  @ApiOkResponse({ type: ReviewResponseDto })
  async update(
    @Param('id') id: number,
    @Req() req: AuthenticatedRequest,
    @Body() body: CreateReviewDto,
  ): Promise<SimpleReviewResponse> {
    const [review] = await this.reviewService.update(id, {
      ...body,
      creatorId: req.user.id,
    });

    if (!review) throw new NotFoundException('Review not found');
    return review;
  }

  @Delete(':id')
  @UseGuards(ReviewGuard)
  @ApiOkResponse({ type: ReviewResponseDto })
  async delete(@Param('id') id: number): Promise<SimpleReviewResponse> {
    const [response] = await this.reviewService.delete(id);

    if (!response) throw new NotFoundException('Review not found');
    return response;
  }
}
