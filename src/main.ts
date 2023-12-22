import { NestFactory } from '@nestjs/core';
import { ValidationError, ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { AppModule } from './app.module';
import {
  version as pkVersion,
  name as pkName,
  description as pkDescription,
} from '../package.json';
import { CustomBadRequestException } from './common/exceptions';

const PORT: number = parseInt(`${process.env.SERVER_PORT}`, 10) | 3000;
const prefix = 'api';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  app.setGlobalPrefix(prefix);

  const options = new DocumentBuilder()
    .setTitle(pkName)
    .setDescription(pkDescription)
    .setVersion(pkVersion)
    .addTag(pkName, pkDescription)
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      name: 'JWT',
      description: 'Enter JWT token',
      in: 'header',
    })
    .build();

  const document = SwaggerModule.createDocument(app, options);

  SwaggerModule.setup(`${prefix}/apidoc`, app, document);
  app.use(`${prefix}/apidoc-json/`, (_: Request, res: Response) =>
    res.send(document),
  );

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      exceptionFactory: (
        errors: ValidationError[],
      ): CustomBadRequestException => {
        return CustomBadRequestException.fromValidationErrors(errors);
      },
    }),
  );

  await app.listen(PORT, () => {
    console.log('Server is runing port:..', PORT);
  });
}
bootstrap();
