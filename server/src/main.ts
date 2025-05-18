import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // הפעלת Pipeline של ולידציה עבור DTOים (כמו @Body)
  app.useGlobalPipes(new ValidationPipe());

  app.enableCors({
    origin: 'https://jamoveoil.netlify.app', 
    credentials: true,
  });

  // מאזין על הפורט שהוגדר, או 3000 כברירת מחדל
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
