import { Schema as MongooseSchema, Types } from 'mongoose';
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';

@Schema({
    timestamps: true,
})
export class Card {
  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: true,
  })
  userId: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: 'Account',
    required: true,
  })
  accountId: Types.ObjectId;

  @Prop({
    type: Number, 
    required: true,
  })
  creditCardLimit: number;

  @Prop({
    type: String,
    required: true,
  })
  lastDigits: string;

  @Prop({
    type: Number,
    required: true,
  })
  APR: number;

  @Prop({
    required: true,
    min: 1,
    max: 28,
  })
  statementCloseDay: number;

  @Prop({
    required: true,
    min: 1,
    max: 28,
  })
  paymentDay: number;

  @Prop({
    default: false,
  })
  deleted: boolean;
}

export const CardSchema = SchemaFactory.createForClass(Card);
