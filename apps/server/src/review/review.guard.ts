import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  NotFoundException,
  Inject,
} from '@nestjs/common';
import { eq } from 'drizzle-orm';

import { AuthenticatedRequest } from '@/auth/auth';
import { reviews } from '@/db/db.schema';
import { DRIZZLE } from '@/drizzle/drizzle.module';
import type { DrizzleDB } from '@/drizzle/types/drizzle';

@Injectable()
export class ReviewGuard implements CanActivate {
  constructor(@Inject(DRIZZLE) private db: DrizzleDB) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: AuthenticatedRequest = context.switchToHttp().getRequest();
    const userId = request.user.id;
    const id = Number(context.switchToHttp().getRequest().params.id);

    const [review] = await this.db
      .select({ creatorId: reviews.creatorId })
      .from(reviews)
      .where(eq(reviews.id, id));

    if (!review) throw new NotFoundException('Review not found');
    if (review.creatorId !== userId)
      throw new UnauthorizedException('Not authorized to modify this review');

    return true;
  }
}
