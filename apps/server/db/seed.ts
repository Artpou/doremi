/* eslint-disable no-console */
import { NestFactory } from '@nestjs/core';

import { AppModule } from '../src/app.module';
import { UserService } from '../src/user/user.service';

async function seed() {
  const app = await NestFactory.create(AppModule);
  const usersService = app.get(UserService);

  try {
    // Créer un utilisateur de test
    await usersService.create({
      email: 'test@test.com',
      password: 'password123',
    });
    console.log('Seed complete');
  } catch (error) {
    console.error('Seed error:', error);
  } finally {
    await app.close();
  }
}

seed();
