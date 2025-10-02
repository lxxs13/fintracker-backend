import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class Transaction {
    _id: Types.ObjectId;
  
  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  })
  userId: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: 'Category',
    required: true,
    index: true
  })
  categoryId: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: 'Account',
    required: true,
    index: true
  })
  accountId: Types.ObjectId;

  @Prop({
    required: true,
  })
  balance: number;

  @Prop({
    required: true,
  })
  amount: number;

  @Prop({
    required: true,
    trim: true,
  })
  description: string;

  @Prop({
    required: true,
    type: Date,
  })
  transactionDate: Date;

  @Prop({
    trim: true,
  })
  notes: string;

  @Prop({
    default: false,
  })
  deleted: boolean;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);

TransactionSchema.virtual('category', {
  ref: 'Category',
  localField: 'categoryId',
  foreignField: '_id',
  justOne: true,
});

TransactionSchema.virtual('account', {
  ref: 'Account',
  localField: 'accountId',
  foreignField: '_id',
  justOne: true,
});