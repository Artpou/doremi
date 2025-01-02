import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';
import { ZodValidationPipe } from 'nestjs-zod';
import { CacheModule } from '@nestjs/cache-manager';
import { ThrottlerModule } from '@nestjs/throttler';
import { redisStore } from 'cache-manager-redis-yet';
import ms from 'ms';

import { LoggerMiddleware } from './logger.middleware';
import { AuthModule } from './auth/auth.module';
import { DrizzleModule } from './drizzle/drizzle.module';
import { HttpExceptionFilter } from './http-exception.filter';
import { SearchModule } from './search/search.module';
import { SpotifyModule } from './spotify/spotify.module';
import { ProviderModule } from './provider/provider.module';
import { MeModule } from './me/me.module';
import { ReviewModule } from './review/review.module';
import { AlbumModule } from './album/album.module';
import { TrackModule } from './track/track.module';
import { ArtistModule } from './artist/artist.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: async () => ({
        store: await redisStore({
          url: process.env.REDIS_URL,
          ttl: ms('1h'),
        }),
      }),
    }),
    DrizzleModule,
    LoggerModule.forRoot({
      pinoHttp: {
        transport: {
          target: 'pino-pretty',
          options: {
            colorize: true,
            singleLine: true,
            ignore: 'pid,hostname,req,res',
          },
        },
        autoLogging: false,
      },
    }),
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 1000,
        limit: 10,
      },
    ]),
    AuthModule,
    SearchModule,
    SpotifyModule,
    ProviderModule,
    MeModule,
    ReviewModule,
    AlbumModule,
    TrackModule,
    ArtistModule,
  ],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ZodValidationPipe,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
