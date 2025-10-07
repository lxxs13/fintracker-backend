import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { ECategoryType } from 'src/enums/category-type.enum';

@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class Category {
  _id: Types.ObjectId;
  
  @Prop({
    required: true,
    trim: true,
  })
  categoryName: string;

  @Prop({
    required: true,
  })
  categoryType: ECategoryType;

  @Prop({
    required: true,
    default: 0
  })
  categoryLimit: number;

  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  })
  userId: Types.ObjectId;

  @Prop({
    required: true,
    trim: true,
  })
  iconLabel: string;

  @Prop({
    required: true,
    trim: true,
  })
  iconColor: string;

  @Prop({
    default: false,
  })
  deleted: boolean;
}

export const CategorySchema = SchemaFactory.createForClass(Category);