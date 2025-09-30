import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { EAccountType } from 'src/enums/acccount-type.enum';

export class ICreateAccountDebitCardDTO {
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
