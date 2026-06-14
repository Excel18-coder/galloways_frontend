import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as express from 'express';
import helmet from 'helmet';
import { join } from 'path';
import { AppModule } from './app.module';
import { AuthModule } from './auth/auth.module';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';
import { UsersModule } from './users/users.module';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    rawBody: true,
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
  });

  const configService = app.get(ConfigService);

  // Enable CORS with detailed logging and robust matching
  app.enableCors({
    origin: (origin, callback) => {
      const isDevelopment = process.env.NODE_ENV !== 'production';

      // Allow if no origin (like mobile apps or curl)
      if (!origin) {
        callback(null, true);
        return;
      }

      const rawAllowedOrigins = configService.get<string>('ALLOWED_ORIGINS') || '';
      const envAllowedOrigins = rawAllowedOrigins.split(',').map(o => o.trim()).filter(o => o);

      const defaultAllowedOrigins = [
        'https://galloways.onrender.com',
        'http://localhost:5173',
        'http://localhost:3000',
        /\.onrender\.com$/,
        'www.galloways.co.ke',
        'https://galloways.co.ke',
        'https://galloways-frontend.vercel.app/',
      ];

      const allAllowedOrigins = [...defaultAllowedOrigins, ...envAllowedOrigins];

      const isAllowed = allAllowedOrigins.some((allowed) => {
        if (allowed instanceof RegExp) return allowed.test(origin);
        if (typeof allowed === 'string' && allowed.includes('*')) {
          const regex = new RegExp('^' + allowed.replace(/\*/g, '.*') + '$');
          return regex.test(origin);
        }
        return allowed === origin;
      });

      if (isAllowed || isDevelopment) {
        if (isDevelopment && !isAllowed) {
          logger.debug(`CORS: Allowing origin ${origin} in development mode`);
        } else {
          logger.log(`CORS: Allowed origin ${origin}`);
        }
        callback(null, true);
      } else {
        logger.warn(`CORS: Denied origin ${origin}`);
        // Return null instead of error to avoid 500 but still deny CORS
        callback(null, false);
      }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    allowedHeaders: 'Content-Type, Accept, Authorization, X-Requested-With',
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });

  // Configure body parser for large file uploads
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));

  // NestJS built-in CORS is enabled in NestFactory.create

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  app.use(
    helmet({
      crossOriginResourcePolicy: false,
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", "'unsafe-inline'", 'cdn.tailwindcss.com', 'js.paystack.co'],
          styleSrc: ["'self'", "'unsafe-inline'", 'cdnjs.cloudflare.com', 'fonts.googleapis.com'],
          fontSrc: ["'self'", 'cdnjs.cloudflare.com', 'fonts.gstatic.com'],
          imgSrc: ["'self'", 'data:', '*', 'res.cloudinary.com'],
          connectSrc: ["'self'", '*', 'https://api.paystack.co'],
        },
      },
    }),
  );



  app.useGlobalFilters(new AllExceptionsFilter());

  // api versioning
  app.setGlobalPrefix('api/v1');
  // swagger documentation
  const config = new DocumentBuilder()
    .setTitle('Gallo API')

    .setVersion('1.0')
    .addBearerAuth()
    .addServer('http://localhost:8000', 'Local Development Server')
    .addServer('https://gallo-api.com', 'Production Server')
    .build();
  const document = SwaggerModule.createDocument(app, config, {
    include: [UsersModule, AuthModule],
  });
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      docExpansion: 'none',
      persistAuthorization: true,
      operationsSorter: 'alpha',
      showRequestDuration: true,
      tryItOutEnabled: true,
      filter: true,
      showTags: true,
    },
    customCss: `
      .swagger-ui .topbar { display: none; }
      .swagger-ui .info { margin-bottom: 20px; }
    `,
    customSiteTitle: 'Olive Groceries API Documentation',
  });

  app.use('/uploads', express.static(join(__dirname, '..', 'uploads')));

  const PORT = configService.get('PORT') || 8000;
  await app.listen(PORT);
  console.log(`Server is running on port ${PORT}`);
}
bootstrap();
