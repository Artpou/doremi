import { Module } from '@nestjs/common';

import { ProviderModule } from '@/provider/provider.module';
import { SpotifyModule } from '@/spotify/spotify.module';

import { MeController } from './me.controller';

@Module({
  imports: [SpotifyModule, ProviderModule],
  controllers: [MeController],
})
export class MeModule {}
