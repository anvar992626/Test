import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as Sentry from '@sentry/node';
import type { NextFunction, Request, Response } from 'express';
import { Logger } from 'nestjs-pino';
import { AppModule } from './app.module';
import { SentryExceptionFilter } from './common/sentry-exception.filter';
import { MetricsService } from './metrics/metrics.service';

async function bootstrap() {
  if (process.env.SENTRY_DSN) {
    Sentry.init({
      dsn: process.env.SENTRY_DSN,
      environment: process.env.SENTRY_ENVIRONMENT ?? 'development',
      tracesSampleRate: 0.1,
    });
  }

  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  app.useLogger(app.get(Logger));

  const metrics = app.get(MetricsService);
  const httpServer = app.getHttpAdapter().getInstance() as {
    use: (fn: (req: Request, res: Response, next: NextFunction) => void) => void;
  };
  httpServer.use((req: Request, res: Response, next: NextFunction) => {
    res.on('finish', () => {
      const path = typeof req.path === 'string' && req.path.length > 0 ? req.path : '/';
      metrics.recordHttpRequest(req.method ?? 'GET', path, String(res.statusCode));
    });
    next();
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.useGlobalFilters(new SentryExceptionFilter());
  const origin = process.env.CORS_ORIGIN ?? 'http://localhost:3000';
  app.enableCors({ origin: [origin, /^http:\/\/127\.0\.0\.1:\d+$/], credentials: true });

  if (process.env.SWAGGER_ENABLED !== 'false') {
    const swaggerConfig = new DocumentBuilder()
      .setTitle('Signal Lab API')
      .setDescription('Observability playground — scenarios, metrics, logs')
      .setVersion('1.0')
      .addTag('health')
      .addTag('scenarios')
      .build();
    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('api/docs', app, document);
  }

  const port = Number(process.env.PORT ?? 3001);
  await app.listen(port, '0.0.0.0');
}

bootstrap();
