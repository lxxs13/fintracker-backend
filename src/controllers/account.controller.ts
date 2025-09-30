import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { ICreateAccountCrediCardDTO } from 'src/dto/create-account-credit-card.dto';
import { ICreateAccountDebitCardDTO } from 'src/dto/create-account-debit-card.dto';
import { AccountService } from 'src/services/account.service';

@Controller('account')
export class AccountController {
  constructor(private _accoutService: AccountService) {}

  @Get()
  GetDebitAccountsByUser(@Req() req) {
    return this._accoutService.GetDebitAccountsById(req);
  }

  @Get('summary')
  GetSummary(@Req() req) {
    return this._accoutService.GetSummary(req);
  }

  @Post('debit')
  CreateDebitAccount(
    @Req() req,
    @Body() accountData: ICreateAccountDebitCardDTO,
  ) {
    return this._accoutService.CreateDebitAccount(req, accountData);
  }

  @Post('credit')
  CreateCreditCard(
    @Req() req,
    @Body() accountData: ICreateAccountCrediCardDTO,
  ) {
    return this._accoutService.CreateCreditAccount(req, accountData);
  }
}
