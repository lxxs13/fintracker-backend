import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  timestamps: true,
})
export class Transaction {
  @Prop({
    required: true,
  })
  userId: string;

  @Prop({
    required: true,
  })
  categoryId: string;

  @Prop({
    required: true,
  })
  balance: number;

  @Prop({
    required: true,
    trim: true,
  })
  description: string;

  @Prop({
    required: true,
  })
  transactionDate: Date;

  @Prop()
  notes: string;

  @Prop({
    default: false,
  })
  deleted: boolean;
}

export const AccountSchema = SchemaFactory.createForClass(Transaction);
