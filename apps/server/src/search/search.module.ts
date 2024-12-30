import { Module } from '@nestjs/common';
import { DrizzleModule } from 'src/drizzle/drizzle.module';
import { ProviderService } from 'src/provider/provider.service';
import { SpotifyModule } from 'src/spotify/spotify.module';

import { SearchController } from './search.controller';
import { SearchService } from './search.service';

@Module({
  imports: [DrizzleModule, SpotifyModule],
  controllers: [SearchController],
  providers: [SearchService, ProviderService],
})
export class SearchModule {}
