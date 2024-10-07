
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DataService } from './data.service';
import { DataController } from './data.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule], // Add any necessary configuration
  providers: [DataService],
  controllers: [DataController],
})
export class DataModule {}
