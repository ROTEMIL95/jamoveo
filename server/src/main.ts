import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // הפעלת Pipeline של ולידציה עבור DTOים (כמו @Body)
  app.useGlobalPipes(new ValidationPipe());

  // Environment-based CORS configuration
  const isDevelopment = process.env.NODE_ENV !== 'production';
  const allowedOrigins = isDevelopment 
    ? ['https://jamoveoil.netlify.app', 'http://localhost:5173', 'http://localhost:3000']
    : ['https://jamoveoil.netlify.app'];
  
  console.log(`CORS configured for: ${allowedOrigins.join(', ')}`);
  
  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
  });

  // מאזין על הפורט שהוגדר, או 3000 כברירת מחדל
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
