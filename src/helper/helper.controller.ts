import { 
  Body, 
  Controller, 
  Delete, 
  Get, 
  Param, 
  Patch, 
  Post, 
  Query, 
  UploadedFile, 
  UseInterceptors, 
  BadRequestException 
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { HelperService } from './helper.service';
import { CreateHelperDto } from './dto/createhelper.dto';
import { UpdateHelperDto } from './dto/updatehelper.dto';

@Controller('helper')
export class HelperController {
  constructor(private helperService: HelperService) {}

  @Get()
  async getHelpers(@Query('search') search?: string) {
    console.log("🔍 Search param received:", search);
    return this.helperService.getHelperswithparam(search);
  }

  @Get(':id')
  getHelperById(@Param('id') id: string) {
    return this.helperService.getHelperById(id);
  }

  @Post()
  createNewHelper(@Body() createHelperDto: CreateHelperDto) {
    return this.helperService.createHelper(createHelperDto);
  }

  @Patch(':id')
  updateHelperById(
    @Param('id') id: string, 
    @Body() updateHelperDto: UpdateHelperDto
  ) {
    return this.helperService.updateHelper(id, updateHelperDto);
  }

  @Delete(':id')
  deleteHelper(@Param('id') id: string) {
    return this.helperService.deleteHelper(id);
  }

  // ✅ Added KYC upload endpoint (same as first controller)
  @Post(':id/upload-kyc')
  @UseInterceptors(FileInterceptor('kycDocument', {
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB limit
    },
    fileFilter: (req, file, callback) => {
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
      if (allowedTypes.includes(file.mimetype)) {
        callback(null, true);
      } else {
        callback(
          new BadRequestException('Only PDF, JPG, JPEG, and PNG files are allowed'), 
          false
        );
      }
    },
  }))
  async uploadKycDocument(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    return this.helperService.uploadKycDocument(id, file);
  }
}
