import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AccountController } from 'src/controllers/account.controller';
import { Account, AccountSchema } from 'src/schemas/account.schema';
import { Card, CardSchema } from 'src/schemas/card.schema';
import { AccountService } from 'src/services/account.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Account.name,
        schema: AccountSchema,
      },
      {
        name: Card.name,
        schema: CardSchema,
      }
    ]),
  ],
  controllers: [AccountController],
  providers: [AccountService],
  exports: [AccountService],
})
export class AccountModule {}
