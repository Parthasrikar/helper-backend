import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { HelperService } from './helper.service';
import { CreateHelperDto } from './dto/createhelper.dto';
import { UpdateHelperDto } from './dto/updatehelper.dto';

@Controller('helper')
export class HelperController {
    constructor(private helperService : HelperService){}

    @Get() 
    getAllHelper()  {
        return this.helperService.getAllHelpers();
    }

    @Get(":id")
    getHelperById(@Param('id') id : string) {
        return this.helperService.getHelperById(id);
    }

    @Post()
    createNewHelper(@Body() createHelperDto : CreateHelperDto) {
        return this.helperService.createHelper(createHelperDto);
    }

    @Patch(":id") 
    updateHelperById(@Param('id') id : string, @Body() UpdateHelperDto : UpdateHelperDto) {
        return this.helperService.updateHelper(id, UpdateHelperDto);
    }

    @Delete(":id")
    deleteHelper(@Param('id') id : string) {
        return this.helperService.deleteHelper(id);
    }
}
