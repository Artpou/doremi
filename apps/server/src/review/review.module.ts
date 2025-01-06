import { Module } from '@nestjs/common';

import { ReviewController } from './review.controller';
import { ReviewGuard } from './review.guard';
import { ReviewService } from './review.service';

@Module({
  controllers: [ReviewController],
  providers: [ReviewService, ReviewGuard],
  exports: [ReviewService, ReviewGuard],
})
export class ReviewModule {}
