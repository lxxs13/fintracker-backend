import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { ECategoryType } from 'src/enums/category-type.enum';

@Schema({
  timestamps: true,
})
export class Category {
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
    required: false,
    trim: true,
  })
  userId: string;

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
