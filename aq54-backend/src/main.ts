import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  DocumentBuilder,
  SwaggerDocumentOptions,
  SwaggerModule,
} from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('AQ54 API')
    .setDescription(
      'Provide collected data about Air Quality from two differents stations : <b>SMART188</b> and <b>SMART189</b>',
    )
    .setContact('Ibradi', null, 'ibradi.dev@gmail.com')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD',
    credentials: true,
  });

  await app.listen(8000);
}
bootstrap();
