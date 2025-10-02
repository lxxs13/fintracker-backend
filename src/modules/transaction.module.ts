import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TransactionController } from 'src/controllers/transaction.controller';
import { Transaction, TransactionSchema } from 'src/schemas/transaction.schema';
import { TransactionService } from 'src/services/transaction.service';
import { AccountModule } from './account.module';
import { Category, CategorySchema } from 'src/schemas/category.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Transaction.name,
        schema: TransactionSchema,
      },
      {
        name: Category.name,
        schema: CategorySchema,
      }
    ]),
    AccountModule,
  ],
  controllers: [TransactionController],
  providers: [TransactionService],
})
export class TransactionModule {}
