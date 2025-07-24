import { Module } from '@nestjs/common';
import { HelperService } from './helper.service';
import { HelperController } from './helper.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Helper, helperSchma } from 'src/schema/helper.schema';

@Module({
  imports : [MongooseModule.forFeature([{
    name : Helper.name,
    schema : helperSchma
  }])],
  providers: [HelperService],
  controllers: [HelperController]
})
export class HelperModule {}
