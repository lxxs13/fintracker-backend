import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { UserId } from 'src/decorators/user-id.decorator';
import { ICreateTransactionDTO } from 'src/dto/create-transaction.dto';
import { FiltersDTO } from 'src/dto/filters.dto';
import { TransactionService } from 'src/services/transaction.service';

@Controller('transaction')
export class TransactionController {
  constructor(private _transactionService: TransactionService) { }

  @Get()
  getTransactions(
    @UserId() userId: string, 
    @Query() query: FiltersDTO,
  ) {
    return this._transactionService.getTransactions(userId, query);
  }

  @Get('thisMonth')
  getTransactiónByMonth(@UserId() userId: string) {
    return this._transactionService.getTransactionsByMonth(userId);
  }

  @Post('incomeSpentTransaction')
  createIncomeSpentTransaction(
    @UserId() userId: string, 
    @Body() transactionInfo: ICreateTransactionDTO,
  ) {
    return this._transactionService.createIncomeSpentTransaction(userId, transactionInfo);
  }

  @Post('createTransferTransaction')
  createTransferTransaction(
    @UserId() userId: string, 
    @Body() transactionInfo: ICreateTransactionDTO,
  ) {
    return this._transactionService.createTransferTransaction(userId, transactionInfo);
  }
}
