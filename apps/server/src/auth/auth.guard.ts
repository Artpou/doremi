import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor() {
    super();
  }

  handleRequest<AuthenticatedRequest>(
    err: Error,
    user: number,
  ): AuthenticatedRequest {
    if (err) throw new UnauthorizedException(err.message);
    if (!user) throw new UnauthorizedException('No user found');

    return { id: user } as AuthenticatedRequest;
  }
}
