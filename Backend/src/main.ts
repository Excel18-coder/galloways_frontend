import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as express from 'express';
import helmet from 'helmet';
import { join } from 'path';
import { AppModule } from './app.module';
import { AuthModule } from './auth/auth.module';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';
import { UsersModule } from './users/users.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    rawBody: true,
  });

  // Enable CORS early with proper configuration
  app.enableCors({
    origin: (origin, callback) => {
      // Allow all origins in development or if origin is not provided (like curl)
      if (!origin || process.env.NODE_ENV !== 'production') {
        callback(null, true);
        return;
      }

      // List of allowed domains in production
      const allowedOrigins = [
        'https://galloways.onrender.com',
        'http://localhost:5173',
        'http://localhost:3000',
        /\.onrender\.com$/,
      ];

      const isAllowed = allowedOrigins.some((allowed) => {
        if (allowed instanceof RegExp) return allowed.test(origin);
        return allowed === origin;
      });

      if (isAllowed) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    allowedHeaders: 'Content-Type, Accept, Authorization',
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

  const configService = app.get(ConfigService);
  const PORT = configService.get('PORT') || 8000;
  await app.listen(PORT);
  console.log(`Server is running on port ${PORT}`);
}
bootstrap();
