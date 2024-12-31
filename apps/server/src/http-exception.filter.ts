import {
  Logger,
  Catch,
  ArgumentsHost,
  HttpException,
  ConflictException,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { ZodValidationException } from 'nestjs-zod';
import { DatabaseError } from 'pg';

@Catch(HttpException)
export class HttpExceptionFilter extends BaseExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost) {
    if (exception instanceof DatabaseError && exception.code === '23505') {
      throw new ConflictException('Email already exists');
    }

    if (exception instanceof ZodValidationException) {
      const zodError = exception.getZodError();
      this.logger.error(`ZodValidation: ${zodError.message}`);
    } else {
      this.logger.error(exception.message);
    }

    super.catch(exception, host);
  }
}
