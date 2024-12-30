import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { ProviderService } from 'src/provider/provider.service';
import { SpotifyModule } from 'src/spotify/spotify.module';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
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
