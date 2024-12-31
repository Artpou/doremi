/* eslint-disable no-console */
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';

import { AppModule } from '../src/app.module';
import { UserService } from '../src/user/user.service';
import { DrizzleDB } from '../src/drizzle/types/drizzle';
import { DRIZZLE } from '../src/drizzle/drizzle.module';

import { artists, albums, tracks, reviews, albumsToArtists } from './schema';

async function seed() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
    { logger: false },
  );

  const usersService = app.get(UserService);
  const db = app.get<DrizzleDB>(DRIZZLE);

  try {
    // Create test user
    const user = await usersService.create({
      email: 'test@test.com',
      password: 'password123',
    });

    // Create artists
    const [daftPunk, theWeeknd] = await db
      .insert(artists)
      .values([
        {
          name: 'Daft Punk',
          bio: 'French electronic music duo formed in 1993',
          spotifyId: '4tZwfgrHOc3mvqYlEYSvVi',
        },
        {
          name: 'The Weeknd',
          bio: 'Canadian singer-songwriter and record producer',
          spotifyId: '1Xyo4u8uXC1ZmMpatF05PJ',
        },
      ])
      .returning();

    if (!daftPunk || !theWeeknd) {
      throw new Error('Failed to create artists');
    }

    // Create albums
    const [ram, starboy] = await db
      .insert(albums)
      .values([
        {
          title: 'Random Access Memories',
          image:
            'https://i.scdn.co/image/ab67616d0000b2739b9b36b0e22870b9f542d937',
          releaseYear: 2013,
          spotifyId: '4m2880jivSbbyEGAKfITCa',
        },
        {
          title: 'Starboy',
          image:
            'https://i.scdn.co/image/ab67616d0000b2734718e2b124f79258be7bc452',
          releaseYear: 2016,
          spotifyId: '2ODvWsOgouMbaA5xf0RkJe',
        },
      ])
      .returning();

    if (!ram || !starboy) {
      throw new Error('Failed to create albums');
    }

    // Create album-artist relationships
    await db.insert(albumsToArtists).values([
      {
        albumId: ram.id,
        artistId: daftPunk.id,
      },
      {
        albumId: starboy.id,
        artistId: theWeeknd.id,
      },
      {
        albumId: starboy.id,
        artistId: daftPunk.id,
      },
    ]);

    // Create tracks
    const [getlucky, instantCrush, starboySong, reminder] = await db
      .insert(tracks)
      .values([
        {
          title: 'Get Lucky',
          duration: 369,
          albumId: ram.id,
          spotifyId: '69kOkLUCkxIZYexIgSG8rq',
        },
        {
          title: 'Instant Crush',
          duration: 337,
          albumId: ram.id,
          spotifyId: '2cGxRwrMyEAp8dEbuZaVv6',
        },
        {
          title: 'Starboy',
          duration: 230,
          albumId: starboy.id,
          spotifyId: '7MXVkk9YMctZqd1Srtv4MB',
        },
        {
          title: 'Reminder',
          duration: 219,
          albumId: starboy.id,
          spotifyId: '37F0uwRSrdzkBiuj0D5UHI',
        },
      ])
      .returning();

    if (!getlucky || !instantCrush || !starboySong || !reminder) {
      throw new Error('Failed to create tracks');
    }

    // Create reviews
    await db.insert(reviews).values([
      {
        note: 5,
        comment: 'A masterpiece of electronic music!',
        creatorId: user.id,
        albumId: ram.id,
      },
      {
        note: 4,
        comment: 'Get Lucky is an instant classic',
        creatorId: user.id,
        trackId: getlucky.id,
      },
      {
        note: 4,
        comment: 'Great collaboration with Julian Casablancas',
        creatorId: user.id,
        trackId: instantCrush.id,
      },
      {
        note: 5,
        comment: 'One of the best albums of 2016',
        creatorId: user.id,
        albumId: starboy.id,
      },
      {
        note: 5,
        comment: 'The Weeknd and Daft Punk collaboration at its finest',
        creatorId: user.id,
        trackId: starboySong.id,
      },
      {
        note: 4,
        comment: 'Solid track with great production',
        creatorId: user.id,
        trackId: reminder.id,
      },
    ]);

    console.log('✅ Seed complete');
  } catch (error) {
    console.error('❌ Seed error:', error);
  } finally {
    await app.close();
    process.exit(0);
  }
}

seed();
