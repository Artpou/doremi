/* eslint-disable no-console */
import { exec } from 'child_process';

import fastifyCookie from '@fastify/cookie';
import helmet from '@fastify/helmet';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { Logger } from 'nestjs-pino';
import { patchNestJsSwagger } from 'nestjs-zod';

import { AppModule } from './app.module';

const PORT = 5002;
const IS_PROD = process.env.NODE_ENV === 'production';

async function bootstrap() {
  const startTime = Date.now();

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
    { logger: ['error', 'warn', 'debug', 'verbose'] },
  );

  await app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true,
  });

  await app.register(helmet, {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: [`'self'`],
        styleSrc: [`'self'`, `'unsafe-inline'`],
        imgSrc: [`'self'`, 'data:', 'validator.swagger.io'],
        scriptSrc: [`'self'`, `https: 'unsafe-inline'`],
      },
    },
  });
  await app.register(fastifyCookie, {
    secret: process.env.AUTH_SECRET,
  });

  patchNestJsSwagger();
  const config = new DocumentBuilder().setTitle('repo').build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(PORT, '0.0.0.0');

  await app.useLogger(app.get(Logger));
  const bootTime = Date.now() - startTime;
  console.log(`
  \x1b[31m⚡Nest.js 10.1.3\x1b[0m
  - Local:        http://localhost:${PORT}
  - Doc:          http://localhost:${PORT}/api
  - Environments: ${IS_PROD ? '.env' : '.env.local'}

 \x1b[32m✓\x1b[0m Ready in ${bootTime}ms`);

  await exec('pnpm run generate-openapi', (error) => {
    if (error) {
      console.error(`Error executing command: ${error.message}`);
      return;
    } else {
      console.log(' \x1b[32m✓\x1b[0m Schema generated');
    }
  });
}

bootstrap();
