/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Helper } from 'src/schema/helper.schema';
import { CreateHelperDto } from './dto/createhelper.dto';
import { UpdateHelperDto } from './dto/updatehelper.dto';
import { S3Service } from '../s3/s3.service';  // ✅ Added

@Injectable()
export class HelperService {
  constructor(
    @InjectModel(Helper.name) private helperModel: Model<Helper>,
    private s3Service: S3Service   // ✅ Added
  ) { }

  async getHelperswithparam(search: string = '') {
    if (search && search.trim() !== '') {
      const query = {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          {
            $expr: {
              $regexMatch: {
                input: { $toString: "$employeeId" },
                regex: search,
                options: "i"
              }
            }
          },
          { email: { $regex: search, $options: 'i' } }
        ]
      };
      return await this.helperModel.find(query);
    }

    return await this.helperModel.find();
  }

  async getAllHelpers() {
    try {
      return await this.helperModel.find();
    } catch (err) {
      throw new BadRequestException('Failed to fetch helpers', err);
    }
  }

  async getHelperById(id: string) {
    const isValidId: boolean = mongoose.Types.ObjectId.isValid(id);

    if (!isValidId) {
      throw new BadRequestException('Invalid ID format');
    }

    try {
      const helper = await this.helperModel.findById(id);

      if (!helper) {
        throw new NotFoundException(`No helper found with ID ${id}`);
      }

      return helper;
    } catch (err) {
      throw new BadRequestException(err.message || 'Error retrieving helper');
    }
  }

  async createHelper(createhelperdto: CreateHelperDto) {
    try {
      const newHelper = new this.helperModel(createhelperdto);
      if (!newHelper) {
        throw new NotFoundException(`No helper created`);
      }
      return newHelper.save();
    }
    catch (err) {
      throw new BadRequestException(err.message || 'Error retrieving helper');
    }
  }

  async updateHelper(id: string, updateHelperDto: UpdateHelperDto) {
    const isValidId: boolean = mongoose.Types.ObjectId.isValid(id);

    if (!isValidId) {
      throw new BadRequestException('Invalid ID format');
    }
    try {
      const helper = await this.helperModel.findByIdAndUpdate(id, updateHelperDto, { new: true });

      if (!helper) {
        throw new NotFoundException(`No helper found with ID ${id}`);
      }

      return helper;
    } catch (err) {
      throw new BadRequestException(err.message || 'Error retrieving helper');
    }
  }

  async deleteHelper(id: string) {
    const isValidId: boolean = mongoose.Types.ObjectId.isValid(id);

    if (!isValidId) {
      throw new BadRequestException('Invalid ID format');
    }
    try {
      const helper = await this.helperModel.findByIdAndDelete(id);

      if (!helper) {
        throw new NotFoundException(`No helper found with ID ${id}`);
      }

      // ✅ Delete KYC from S3 if exists
      if (helper.kycUrl) {
        await this.s3Service.deleteFile(helper.kycUrl);
      }

      return helper;
    } catch (err) {
      throw new BadRequestException(err.message || 'Error retrieving helper');
    }
  }

  // ✅ New method for uploading KYC document
  async uploadKycDocument(id: string, file: Express.Multer.File) {
    const isValidId: boolean = mongoose.Types.ObjectId.isValid(id);

    if (!isValidId) {
      throw new BadRequestException('Invalid ID format');
    }

    try {
      const helper = await this.helperModel.findById(id);
      if (!helper) {
        throw new NotFoundException(`No helper found with ID ${id}`);
      }

      // Delete old file if exists
      if (helper.kycUrl) {
        await this.s3Service.deleteFile(helper.kycUrl);
      }

      // Upload new file
      const fileUrl = await this.s3Service.uploadFile(file, id);

      // Update helper with new file info
      const updatedHelper = await this.helperModel.findByIdAndUpdate(
        id,
        {
          kycUrl: fileUrl,
          kycFileName: file.originalname,
          kycUploadedAt: new Date(),
        },
        { new: true }
      );

      return updatedHelper;
    } catch (err) {
      throw new BadRequestException(err.message || 'Error uploading KYC document');
    }
  }
}
