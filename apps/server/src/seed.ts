/* eslint-disable no-console */
// @/seed/main.ts
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';

import { AlbumService } from './album/album.service';
import { AppModule } from './app.module';
import { ArtistService } from './artist/artist.service';
import { DRIZZLE } from './drizzle/drizzle.module';
import type { DrizzleDB } from './drizzle/types/drizzle';
import { ReviewService } from './review/review.service';
import { TrackService } from './track/track.service';
import { UserService } from './user/user.service';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
    { logger: false },
  );

  const db = app.get<DrizzleDB>(DRIZZLE);
  const userService = app.get(UserService);
  const albumService = app.get(AlbumService);
  const artistService = app.get(ArtistService);
  const reviewService = app.get(ReviewService);
  const trackService = app.get(TrackService);

  try {
    await db.transaction(async (tx) => {
      console.log('🌱 Creating artists...');

      const [daftPunk, theWeeknd] = await artistService.create(
        [
          {
            name: 'Daft Punk',
            image:
              'https://i.scdn.co/image/ab67616d0000b2739a88ea6c9da8bba49d38f28e',
            spotifyId: '4tZwfgrHOc3mvqYlEYSvVi',
          },
          {
            name: 'The Weeknd',
            image:
              'https://i.scdn.co/image/ab67616d0000b2734718e2b124f79258be7bc452',
            spotifyId: '1Xyo4u8uXC1ZmMpatF05PJ',
          },
        ],
        tx,
      );

      if (!daftPunk || !theWeeknd)
        throw new Error('❌ Failed to create artists');

      console.log('🌱 Creating albums...');

      const [ram, starboy] = await albumService.create(
        [
          {
            title: 'Random Access Memories',
            image:
              'https://i.scdn.co/image/ab67616d0000b2739b9b36b0e22870b9f542d937',
            spotifyId: '4m2880jivSbbyEGAKfITCa',
            artistIds: [daftPunk.id],
          },
          {
            title: 'Starboy',
            image:
              'https://i.scdn.co/image/ab67616d0000b2734718e2b124f79258be7bc452',
            spotifyId: '2ODvWsOgouMbaA5xf0RkJe',
            artistIds: [theWeeknd.id, daftPunk.id],
          },
        ],
        tx,
      );

      if (!ram || !starboy) throw new Error('❌ Failed to create albums');

      console.log('🌱 Creating tracks...');

      const [getLucky, instantCrush, starboyTrack, reminder] =
        await trackService.create(
          [
            {
              title: 'Get Lucky',
              duration: 369,
              spotifyId: '69kOkLUCkxIZYexIgSG8rq',
              albumId: ram.id,
              artistIds: [daftPunk.id],
            },
            {
              title: 'Instant Crush',
              duration: 337,
              spotifyId: '2cGxRwrMyEAp8dEbuZaVv6',
              albumId: ram.id,
              artistIds: [daftPunk.id],
            },
            {
              title: 'Starboy',
              duration: 230,
              spotifyId: '7MXVkk9YMctZqd1Srtv4MB',
              albumId: starboy.id,
              artistIds: [theWeeknd.id, daftPunk.id],
            },
            {
              title: 'Reminder',
              duration: 219,
              spotifyId: '37F0uwRSrdzkBiuj0D5UHI',
              albumId: starboy.id,
              artistIds: [theWeeknd.id],
            },
          ],
          tx,
        );

      console.log('🌱 Creating reviews...');

      if (!getLucky || !instantCrush || !starboyTrack || !reminder)
        throw new Error('❌ Failed to create tracks');

      const [user] = await userService.create(
        {
          email: 'test@test.com',
          password: 'test',
        },
        tx,
      );

      if (!user) throw new Error('❌ Failed to create user');

      console.log('🌱 Creating reviews...');

      await reviewService.create(
        [
          {
            note: 10,
            comment: 'A masterpiece of electronic music!',
            albumId: ram.id,
            creatorId: user.id,
          },
        ],
        tx,
      );
    });

    console.log('✅ Seed completed successfully');
  } catch (error) {
    console.error('❌ Seed failed:', error);
  } finally {
    await app.close();
    process.exit(0);
  }
}

bootstrap();
