import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import * as Sentry from '@sentry/node';
import { Response } from 'express';

@Catch()
export class SentryExceptionFilter implements ExceptionFilter {
  async catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();

    const isHttp = exception instanceof HttpException;
    const status = isHttp
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    if (!isHttp || status >= 500) {
      Sentry.captureException(exception);
      // Ensure the event is sent before the response closes (helps in Docker / Nest).
      if (process.env.SENTRY_DSN) {
        await Sentry.flush(2000);
      }
    }

    const body = isHttp
      ? exception.getResponse()
      : {
          statusCode: status,
          message:
            exception instanceof Error ? exception.message : 'Internal server error',
        };

    res.status(status).json(
      typeof body === 'string' ? { statusCode: status, message: body } : body,
    );
  }
}
