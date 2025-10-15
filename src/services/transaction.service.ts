import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PipelineStage, Types } from 'mongoose';
import { ICreateTransactionDTO } from 'src/dto/create-transaction.dto';
import { Transaction } from 'src/schemas/transaction.schema';
import { Category } from 'src/schemas/category.schema';
import { ETransactionType } from 'src/enums/transaction-type.enum';
import { AccountService } from './account.service';
import { ECategoryType } from 'src/enums/category-type.enum';
import { FiltersDTO } from 'src/dto/filters.dto';

@Injectable()
export class TransactionService {
  constructor(
    @InjectModel(Transaction.name)
    private _transactionModel: Model<Transaction>,
    @InjectModel(Category.name)
    private _categoryModel: Model<Category>,
    private _accountService: AccountService,
    private readonly _jwtService: JwtService,
  ) { }

  async getTransactions(userId: string, query: FiltersDTO) {
    const { startDate, endDate } = query;

    const base: any = { deleted: false, userId };

    if (startDate && endDate) {
      const start = this.toDateStrict(startDate);
      const end = this.toDateStrict(endDate);

      base.transactionDate = {
        $gte: start,
        $lte: end,
      };
    }

    const pipeline: PipelineStage[] = [
      { $match: base },
      { $sort: { transactionDate: -1 } },
      {
        $project: {
          _id: 1,
          balance: '$balance',
          amount: '$amount',
          description: 1,
          transactionDate: 1,
          categoryId: 1,
          accountId: 1,
        },
      },
      {
        $lookup: {
          from: 'categories',
          localField: 'categoryId',
          foreignField: '_id',
          as: 'category',
          pipeline: [
            {
              $project: {
                _id: 1,
                categoryName: 1,
                iconLabel: 1,
                iconColor: 1,
              },
            },
          ],
        },
      },
      { $unwind: { path: '$category', preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: 'accounts',
          localField: 'accountId',
          foreignField: '_id',
          as: 'account',
          pipeline: [
            {
              $project: {
                _id: 1,
                accountName: 1,
              },
            },
          ],
        },
      },
      { $unwind: { path: '$account', preserveNullAndEmptyArrays: true } },
    ];

    const [totalDocuments, transactionList] = await Promise.all([
      this._transactionModel.countDocuments(base),
      this._transactionModel.aggregate(pipeline).exec(),
    ])

    const incomeTotal = transactionList
      .filter((element: Transaction) => element.amount > 0)
      .reduce((sum, transaction) => sum += Math.abs(transaction.amount), 0);

    const spentTotal = transactionList
      .filter((element: Transaction) => element.amount < 0)
      .reduce((sum, transaction) => sum += Math.abs(transaction.amount), 0);

    return { totalDocuments, incomeTotal, spentTotal, transactionList };
  }

  async getTransactionsByMonth(userId: string) {
    try {
      const { start, end } = this.getMonthBounds();

      const base = {
        deleted: false,
        userId,
        transactionDate: { $gte: start, $lt: end },
      };

      const pipeline: PipelineStage[] = [
        { $match: base },
        {
          $group: {
            _id: '$categoryId',
            totalSpent: { $sum: { $abs: '$amount' } },
            txCount: { $sum: 1 },
          }
        },
        {
          $lookup: {
            from: this._categoryModel.collection.name,
            localField: '_id',
            foreignField: '_id',
            as: 'category',
          },
        },
        { $unwind: { path: '$category', preserveNullAndEmptyArrays: true } },
        { $sort: { totalSpent: -1 } },
        {
          $project: {
            _id: 0,
            categoryId: '$_id',
            categoryName: '$category.categoryName',
            iconLabel: '$category.iconLabel',
            iconColor: '$category.iconColor',
            totalSpent: 1,
            txCount: 1,
          }
        },
        { $limit: 2 },
      ];

      let [totalDocuments, byCategory] = await Promise.all([
        this._transactionModel.find(base),
        this._transactionModel.aggregate(pipeline).exec(),
      ]);

      const totalSpend = totalDocuments
        .reduce((sum: number, transacction: Transaction) => sum += transacction.amount, 0);

      return { totalSpend, byCategory };
    } catch (err) {
      console.error(err);
      return false;
    }
  }

  async createIncomeSpentTransaction(userId: string, transactionInfo: ICreateTransactionDTO) {
    try {
      const amount = transactionInfo.transactionType === ETransactionType.INCOME ? transactionInfo.balance : -transactionInfo.balance;
      const currentBalance = await this._accountService.updateAccountBalance(userId, transactionInfo.accountId, amount);

      const newTransaction = new this._transactionModel({
        balance: currentBalance,
        amount,
        transactionType: transactionInfo.transactionType,
        categoryId: transactionInfo.categoryId,
        description: transactionInfo.description,
        transactionDate: transactionInfo.transactionDate,
        accountId: transactionInfo.accountId,
        userId,
      });

      await newTransaction.save();
      return newTransaction;
    } catch (error) {
      throw new Error(error.message)
    }
  }

  async createTransferTransaction(userId: string, transactionInfo: ICreateTransactionDTO) {
    try {
      const categoryId = await this._categoryModel.findOne({
        userId,
        categoryType: ECategoryType.TRANSACTION,
        deleted: false,
      })
        .select('_id')
        .lean()
        .exec();

      const currentOriginAccountBalance = await this._accountService.updateAccountBalance(userId, transactionInfo.originAccount, -transactionInfo.balance);

      const originTransaction = new this._transactionModel({
        balance: currentOriginAccountBalance,
        amount: -transactionInfo.balance,
        transactionType: transactionInfo.transactionType,
        categoryId: categoryId?._id,
        description: transactionInfo.description,
        transactionDate: transactionInfo.transactionDate,
        accountId: transactionInfo.originAccount,
        userId,
      });

      await originTransaction.save();

      const currentDestinyBalance = await this._accountService.updateAccountBalance(userId, transactionInfo.destinyAccount, transactionInfo.balance);

      const destinyTransaction = new this._transactionModel({
        balance: currentDestinyBalance,
        amount: transactionInfo.balance,
        transactionType: transactionInfo.transactionType,
        categoryId: categoryId?._id,
        description: transactionInfo.description,
        transactionDate: transactionInfo.transactionDate,
        accountId: transactionInfo.destinyAccount,
        userId,
      });

      await destinyTransaction.save();

      return [originTransaction, destinyTransaction];
    } catch (error) {
      console.error(error)
    }

  }

  monthRange({ year, month }: { year: number; month: number }) {
    const start = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0, 0));
    const end = new Date(Date.UTC(year, month, 1, 0, 0, 0, 0));

    return { start, end };
  }

  getMonthBounds() {
    const now = new Date();
    const year = now.getUTCFullYear();
    const month = (now.getUTCMonth() + 1);
    return this.monthRange({ year, month });
  }

  toDateStrict(input: string | Date): Date {
    if (input instanceof Date) return input;

    const normalized = input.replace(/\//g, '-');

    const d = new Date(normalized);
    if (Number.isNaN(d.getTime())) {
      throw new BadRequestException(`Fecha inválida: ${input}`);
    }
    return d;
  }
}
