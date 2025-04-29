/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new ConfigService();
  const globalPrefix = 'api';
  const document = new DocumentBuilder()
    .setTitle('TalentTrak API Documentation')
    .setDescription('API description')
    .setVersion('1.0')
    .addOAuth2(
      {
        type: 'oauth2',
        flows: {
          implicit: {
            authorizationUrl: `${config.get(
              'AUTH0_ISSUER_URL'
            )}authorize?audience=${config.get('AUTH0_AUDIENCE')}`,
            tokenUrl: `${config.get('AUTH0_AUDIENCE')}`,
            scopes: {
              openid: 'openid',
              profile: 'profile',
              email: 'email',
              roles: 'roles',
            },
          },
        },
        scheme: 'bearer',
        bearerFormat: 'JWT',
        in: 'header',
      },
      'Auth0'
    )
    .addSecurityRequirements('Auth0')

    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, document);

  SwaggerModule.setup('api/docs', app, documentFactory, {
    swaggerOptions: {
      oauth2RedirectUrl: `http://localhost:3000/api/docs/oauth2-redirect.html`,
      initOAuth: {
        clientId: config.get('AUTH0_CLIENT_ID'),
      },
    },
  });
  app.setGlobalPrefix(globalPrefix);
  const port = process.env.PORT || 3000;
  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  );
}

bootstrap();
