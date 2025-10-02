import { IsDate,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsString 
} from 'class-validator';

export class ICreateTransactionDTO {
  @IsNumber()
  @IsNotEmpty()
  balance: number;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsDateString()
  @IsNotEmpty()
  transactionDate: Date;

  @IsString()
  @IsNotEmpty()
  categoryId: string;

  @IsString()
  @IsNotEmpty()
  accountId: string;

  @IsNumber()
  @IsNotEmpty()
  transactionType: number;

  @IsString()
  notes: string;
}
