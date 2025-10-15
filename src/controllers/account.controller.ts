import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { Types } from 'mongoose';
import { UserId } from 'src/decorators/user-id.decorator';
import { ICreateAccountCrediCardDTO } from 'src/dto/create-account-credit-card.dto';
import { ICreateEditAccountDebitCardDTO } from 'src/dto/create-account-debit-card.dto';
import { AccountService } from 'src/services/account.service';

@Controller('account')
export class AccountController {
  constructor(private _accoutService: AccountService) { }

  @Get()
  getDebitAccountsByUser(@UserId() userId: string) {
    return this._accoutService.getDebitAccountsById(userId);
  }

  @Get('summary')
  getSummary(@UserId() userId: string) {
    return this._accoutService.getSummary(userId);
  }

  @Post('debit')
  createDebitAccount(
    @UserId() userId: string,
    @Body() accountData: ICreateEditAccountDebitCardDTO,
  ) {
    return this._accoutService.createDebitAccount(userId, accountData);
  }

  @Post('credit')
  createCreditCard(
    @UserId() userId: string,
    @Body() accountData: ICreateAccountCrediCardDTO,
  ) {
    return this._accoutService.createCreditAccount(userId, accountData);
  }

  @Put('debit/:id')
  updateDebitAccount(
    @Param('id') id: string,
    @Body() accountData: ICreateEditAccountDebitCardDTO
  ) {
    return this._accoutService.updateDebitAccount(id, accountData);
  }

  @Put('credit/:id')
  updateCreditAccount(
    @Param('id') id: string,
    @Body() accountData: ICreateAccountCrediCardDTO
  ) {
    return this._accoutService.createCreditAccount(id, accountData);
  }

  @Delete(':id')
  deleteAccount(@Param('id') id: string) {
    return this._accoutService.deleteAccount(id);
  }
}
