import { Module } from '@nestjs/common';
import { SpotifyModule } from 'src/spotify/spotify.module';
import { ProviderModule } from 'src/provider/provider.module';

import { MeController } from './me.controller';

@Module({
  imports: [SpotifyModule, ProviderModule],
  controllers: [MeController],
})
export class MeModule {}
