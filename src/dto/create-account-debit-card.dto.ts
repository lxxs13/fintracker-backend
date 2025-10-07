import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Types } from 'mongoose';
import { EAccountType } from 'src/enums/acccount-type.enum';

export class ICreateEditAccountDebitCardDTO {
  _id?: Types.ObjectId

  @IsNumber()
  @IsNotEmpty()
  balance: number;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @IsNotEmpty()
  accountType: EAccountType;
}
