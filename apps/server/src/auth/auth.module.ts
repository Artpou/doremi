import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { ProviderService } from '@/provider/provider.service';
import { SpotifyModule } from '@/spotify/spotify.module';
import { UserService } from '@/user/user.service';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: 'secreeet',
      signOptions: { expiresIn: '60s' },
    }),
    SpotifyModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, UserService, ProviderService],
})
export class AuthModule {}
