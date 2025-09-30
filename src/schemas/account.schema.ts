import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { EAccountType } from 'src/enums/acccount-type.enum';

@Schema({
  timestamps: true,
})
export class Account {
  @Prop({
    required: true,
  })
  userId: string;

  @Prop({
    required: true,
    trim: true,
  })
  accountName: string;

  @Prop({
    required: true,
  })
  accountType: EAccountType;

  @Prop({
    required: true,
    trim: true,
  })
  balance: number;

  @Prop({
    default: false,
  })
  deleted: boolean;
}

export const AccountSchema = SchemaFactory.createForClass(Account);
