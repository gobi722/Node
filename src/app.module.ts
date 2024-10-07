import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { DataModule } from './data/data.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, 
    }),
    MongooseModule.forRoot(process.env.MONGODB_URI),
    AuthModule,
    DataModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
