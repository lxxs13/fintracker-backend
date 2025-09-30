import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { EAccountType } from 'src/enums/acccount-type.enum';

export class ICreateAccountCrediCardDTO {
  @IsNumber()
  @IsOptional()
  balance: number;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @IsNotEmpty()
  accountType: EAccountType;

  @IsNumber()
  @IsNotEmpty()
  APR: number;

  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  @Max(28)
  statementCloseDay: number;

  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  @Max(28)
  paymentDay: number;
}
