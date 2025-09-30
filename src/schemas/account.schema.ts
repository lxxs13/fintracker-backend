import { HydratedDocument, Schema as MongooseSchema, Types } from 'mongoose';
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { EAccountType } from 'src/enums/acccount-type.enum';

@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class Account {
  _id: Types.ObjectId;

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
  accountName: string;

  @Prop({
    required: true,
    enum: Object.values(EAccountType).filter(v => typeof v === 'number'),
    index: true
  })
  accountType: EAccountType;

  @Prop({
    Type: Number,
    default: 0,
  })
  currentBalance: number;

  @Prop({
    default: false,
    index: true,
  })
  deleted: boolean;
}

export type AccountDocument = HydratedDocument<Account>;
export const AccountSchema = SchemaFactory.createForClass(Account);

AccountSchema.virtual('card', {
  ref: 'Card',
  localField: '_id',
  foreignField: 'accountId',
  justOne: true,
});
