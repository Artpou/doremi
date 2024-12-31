import { Module } from '@nestjs/common';

import { ReviewController } from './review.controller';
import { ReviewService } from './review.service';
import { ReviewGuard } from './review.guard';

@Module({
  controllers: [ReviewController],
  providers: [ReviewService, ReviewGuard],
  exports: [ReviewGuard],
})
export class ReviewModule {}
