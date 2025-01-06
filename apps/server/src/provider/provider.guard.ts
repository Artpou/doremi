import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

import { AuthenticatedRequest } from '@/auth/auth';

import { ProviderService } from './provider.service';

@Injectable()
export class ProviderGuard implements CanActivate {
  constructor(private providerService: ProviderService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: AuthenticatedRequest = context.switchToHttp().getRequest();

    if (!request.user) throw new UnauthorizedException('No user found');

    const provider = await this.providerService.find({
      userId: request.user.id,
    });

    if (!provider) throw new UnauthorizedException('No provider found');

    if (!provider.access_token)
      throw new UnauthorizedException('No access token found');

    request.provider = provider;
    return true;
  }
}
