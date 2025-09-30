import { Controller, Post, Req } from '@nestjs/common';
import { ICreateTransactionDTO } from 'src/dto/create-transaction.dto';
import { TransactionService } from 'src/services/transaction.service';

@Controller('transaction')
export class TransactionController {
  constructor(private _transactionService: TransactionService) {}

  @Post()
  CreateTransaction(@Req() req, transactionInfo: ICreateTransactionDTO) {
    return this._transactionService.CreateTransaction(req, transactionInfo);
  }
}
