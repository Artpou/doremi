import { Module } from '@nestjs/common';
import { SpotifyModule } from 'src/spotify/spotify.module';
import { ProviderModule } from 'src/provider/provider.module';

import { UserService } from './user.service';
import { UserController } from './user.controller';

@Module({
  imports: [SpotifyModule, ProviderModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
