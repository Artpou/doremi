import { Injectable, NestMiddleware } from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';
import { Logger } from 'nestjs-pino';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(private readonly logger: Logger) {}

  use(req: FastifyRequest['raw'], res: FastifyReply['raw'], next: () => void) {
    const startTime = process.hrtime();

    res.on('finish', () => {
      try {
        const { method, url } = req;
        const { statusCode } = res;
        const isError = statusCode >= 400;
        const formatedStatus = isError
          ? `\x1b[31m${statusCode}\x1b[0m`
          : `\x1b[32m${statusCode}\x1b[0m`;

        const hrTime = process.hrtime(startTime);
        const timeTaken = (hrTime[0] * 1000 + hrTime[1] / 1000000).toFixed(0);

        const message = `${method} ${url} ${formatedStatus} in ${timeTaken}ms`;

        if (isError) {
          this.logger.error(message);
        } else {
          this.logger.log(message);
        }
      } catch (error) {
        this.logger.error('Error in LoggerMiddleware:', error);
      }
    });
    next();
  }
}
