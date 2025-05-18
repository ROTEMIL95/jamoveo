import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { SongsModule } from './songs/songs.module';
import { SessionsModule } from './sessions/sessions.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { ScraperModule } from './scraper/scraper.module';


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule, 
    UsersModule, 
    SongsModule, 
    SessionsModule, 
    MongooseModule.forRoot(process.env.MONGO_URI!), 
    ScraperModule ,
  ],
  controllers: [AppController],
  providers: [AppService],  
})
export class AppModule {}
