import { IsDate, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ICreateTransactionDTO {
  @IsNumber()
  @IsNotEmpty()
  balance: number;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsDate()
  @IsNotEmpty()
  transactionDate: Date;

  @IsString()
  @IsNotEmpty()
  categoryId: string;

  @IsString()
  @IsNotEmpty()
  notes: string;
}
