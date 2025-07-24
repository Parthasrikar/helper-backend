import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";

export enum GenderEnum {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
  PREFER_NOT_TO_SAY = 'prefer_not_to_say'
}

export enum DocType {
    ADHAAR = 'adhaar',
    PAN = 'pan',
    VOTER = 'voter',
    PASSPORT = 'passport'
}


export enum VehiclesType {
    NONE = 'none', 
    BIKE = 'bike',
    AUTO = 'auto',
    CAR = 'car'
}

export enum Roles {
    MAID = 'maid',
    COOK = 'cook',
    DRIVER = 'driver',
    NURSE = 'nurse'
}

@Schema({ timestamps: true })
export class Helper {
    @Prop({ type: String, default: () => new mongoose.Types.ObjectId().toString() })
  id: string;

  @Prop({ 
    required: true, 
    trim: true, 
    minlength: 2, 
    maxlength: 30,
    index: true
  })
  name: string;


  @Prop({ 
    required: true, 
    trim: true, 
    enum: Object.values(Roles),
    minlength: 2, 
    maxlength: 100 
  })
  typeOfService: Roles;

  @Prop({ 
    required: true, 
    trim: true, 
    minlength: 2, 
    maxlength: 100,
    index: true
  })
  organization: string;

  @Prop({ 
    required: true, 
    trim: true, 
    match: /^[+]?[1-9][\d]{0,15}$/
  })
  phone: string;

  @Prop({ 
    required: true, 
    unique: true, 
    lowercase: true,
    trim: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    index: true
  })
  email: string;

  @Prop({ 
    required: true, 
    enum: Object.values(GenderEnum),
    index: true
  })
  gender: GenderEnum;

  @Prop({ 
    type: [String], 
    required: true,
    validate: {
      validator: (arr: string[]) => arr && arr.length > 0,
      message: 'At least one language is required'
    }
  })
  languages: string[];

  @Prop({ 
    required: true, 
    unique: true,
    min: 1,
    index: true
  })
  employeeId: number;

  @Prop({ 
    required: true, 
    trim: true, 
    enum : Object.values(VehiclesType),
    minlength: 2, 
    maxlength: 50 
  })
  type: VehiclesType;

  @Prop({ 
    required: true, 
    enum: Object.values(DocType),
    default: DocType.ADHAAR,
    index: true
  })
  status: DocType;

  @Prop() 
  kycUrl : string;

    
}

export const helperSchma = SchemaFactory.createForClass(Helper);