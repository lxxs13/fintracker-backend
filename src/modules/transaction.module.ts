import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TransactionController } from 'src/controllers/transaction.controller';
import { Transaction } from 'src/schemas/transaction.schema';
import { TransactionService } from 'src/services/transaction.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Transaction.name,
        schema: Transaction,
      },
    ]),
  ],
  controllers: [TransactionController],
  providers: [TransactionService],
})
export class AccountModule {}
