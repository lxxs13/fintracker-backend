import { Body, Controller, Get, Param, Post, Query, Req } from '@nestjs/common';
import { ICreateTransactionDTO } from 'src/dto/create-transaction.dto';
import { TransactionService } from 'src/services/transaction.service';

@Controller('transaction')
export class TransactionController {
  constructor(private _transactionService: TransactionService) { }

  @Get()
  GetTransactions(@Req() req, @Query() query) {
    return this._transactionService.GetTransactions(req, query);
  }

  @Get('thisMonth')
  GetTransactiónByMonth(@Req() req) {
    return this._transactionService.TransactionsByMonth(req);
  }

  @Post()
  CreateTransaction(@Req() req, @Body() transactionInfo: ICreateTransactionDTO) {
    return this._transactionService.CreateTransaction(req, transactionInfo);
  }
}
