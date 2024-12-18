import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { FirebaseAuthGuard } from './firebase/firebase-auth.guard';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // SWAGGER CONFIGURATION
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

  app.useGlobalGuards(new FirebaseAuthGuard());
  app.useGlobalPipes(new ValidationPipe());

  app.use((_req, res, next) => {
    res.header('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
    next();
  });

  app.enableCors({
    origin: '*',
    methods: 'GET,OPTIONS',
    credentials: true,
  });

  await app.listen(8000);
}

bootstrap();
