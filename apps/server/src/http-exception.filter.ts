import { Logger, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { ZodValidationException } from 'nestjs-zod';

@Catch(HttpException)
export class HttpExceptionFilter extends BaseExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost) {
    if (exception instanceof ZodValidationException) {
      const zodError = exception.getZodError();
      this.logger.error(`ZodValidation: ${zodError.message}`);
    } else {
      this.logger.error(exception.message);
    }

    super.catch(exception, host);
  }
}
