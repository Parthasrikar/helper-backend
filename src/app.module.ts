import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { HelperModule } from './helper/helper.module';
import { S3Service } from './s3/s3.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env', 
    }),
    
    MongooseModule.forRoot(process.env.MONGODB_URI || ''),
    HelperModule,
  ],
  controllers: [AppController],
  providers: [AppService, S3Service],
})
export class AppModule {
  constructor() {
  }
}