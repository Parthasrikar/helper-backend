import { Module } from '@nestjs/common';
import { HelperService } from './helper.service';
import { HelperController } from './helper.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Helper, helperSchma } from 'src/schema/helper.schema';
import { S3Service } from 'src/s3/s3.service';

@Module({
  imports : [MongooseModule.forFeature([{
    name : Helper.name,
    schema : helperSchma
  }])],
  providers: [HelperService, S3Service],
  controllers: [HelperController]
})
export class HelperModule {}
