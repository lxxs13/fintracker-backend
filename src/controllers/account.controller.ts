import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Req, Type } from '@nestjs/common';
import { Types } from 'mongoose';
import { ICreateAccountCrediCardDTO } from 'src/dto/create-account-credit-card.dto';
import { ICreateEditAccountDebitCardDTO } from 'src/dto/create-account-debit-card.dto';
import { AccountService } from 'src/services/account.service';

@Controller('account')
export class AccountController {
  constructor(private _accoutService: AccountService) {}

  @Get()
  GetDebitAccountsByUser(@Req() req: Request) {
    return this._accoutService.GetDebitAccountsById(req);
  }

  @Get('summary')
  GetSummary(@Req() req: Request) {
    return this._accoutService.GetSummary(req);
  }

  @Post('debit')
  CreateDebitAccount(
    @Req() req: Request,
    @Body() accountData: ICreateEditAccountDebitCardDTO,
  ) {
    return this._accoutService.CreateDebitAccount(req, accountData);
  }

  @Post('credit')
  CreateCreditCard(
    @Req() req: Request,
    @Body() accountData: ICreateAccountCrediCardDTO,
  ) {
    return this._accoutService.CreateCreditAccount(req, accountData);
  }

  @Put('debit/:id')
  UpdateDebitAccount(@Param('id') id: string, @Body() accountData: ICreateEditAccountDebitCardDTO) {
    return this._accoutService.UpdateDebitAccount(id, accountData);
  }

  @Put('credit/:id')
  UpdateCreditAccount(@Param('id') id: string, @Body() accountData: ICreateAccountCrediCardDTO) {
    return this._accoutService.CreateCreditAccount(id, accountData);
  }

  @Delete(':id')
  DeleteAccount(@Param('id') id: string) {
    return this._accoutService.DeleteAccount(id);
  }
}
