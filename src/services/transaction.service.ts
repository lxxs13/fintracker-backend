import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PipelineStage, Types } from 'mongoose';
import { ICreateTransactionDTO } from 'src/dto/create-transaction.dto';
import { Transaction } from 'src/schemas/transaction.schema';
import { AccountService } from './account.service';
import { Category } from 'src/schemas/category.schema';

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

  async GetTransactions(req: any) {
    const userId = await this.getUserIdFromReq(req);

    if (!userId) return 'Error al obtener información del usuario';

    const owner = Types.ObjectId.isValid(userId) ? new Types.ObjectId(userId) : userId;
    const base = { deleted: false, userId: { $in: [owner, userId] } };

    const [total, transactionList] = await Promise.all([
      this._transactionModel.countDocuments(base),
      this._transactionModel.find(base)
        .select('_id balance amount description transactionDate categoryId accountId')
        .sort({ 'transactionDate': 'desc' })
        .populate({ path: 'category', select: 'categoryName iconLabel iconColor', options: { lean: true } })
        .populate({ path: 'account', select: 'accountName', options: { lean: true } })
        .lean({ virtuals: true })
        .exec()
    ]);

    const spentTotal = transactionList.reduce((sum, transaction) => sum += transaction.amount, 0)

    return { total, spentTotal, transactionList };
  }

  async TransactionsByMonth(req: any) {
    try {

      const userId = await this.getUserIdFromReq(req);

      if (!userId) return 'Error al obtener información del usuario';

      const { start, end } = this.getMonthBounds();

      const ownerOid = new Types.ObjectId(String(userId));

      const base = {
        deleted: false,
        $or: [
          { userId: ownerOid },
          { userId: String(userId) }
        ],
        transactionDate: { $gte: start, $lt: end },
      };

      const pipeline: PipelineStage[] = [
        { $match: base },
        {
          $group: {
            _id: '$categoryId',
            totalSpent: { $sum: '$amount' },
            txCount: { $sum: 1 },
          }
        },
        {
          //FIX: arreglar los schemas para que no haga la conversión de string a 
          $addFields: {
            _id: {
              $cond: [
                { $eq: [{ $type: '$_id' }, 'objectId'] },
                '$_id',
                { $toObjectId: '$_id' }
              ]
            }
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
          }
        },
        { $limit: 2 },
      ];

      let [totalDocuments, byCategory] = await Promise.all([
        this._transactionModel.find(base),
        this._transactionModel.aggregate(pipeline).exec(),
      ]);

      const totalSpend = totalDocuments.reduce((sum: number, transacction: Transaction) => sum += transacction.amount, 0);

      return {totalSpend, byCategory};
    } catch (err) {
      console.error(err);
      return false;
    }
  }

  async CreateTransaction(req: any, transactionInfo: ICreateTransactionDTO) {
    try {
      const userId = await this.getUserIdFromReq(req);

      if (!userId) return 'Error al obtener información del usuario';

      const currentBalance = await this._accountService.UpdateAccountBalance(userId, transactionInfo.accountId, transactionInfo.balance);

      const newTransaction = new this._transactionModel({
        balance: currentBalance,
        amount: transactionInfo.balance,
        categoryId: transactionInfo.categoryId,
        description: transactionInfo.description,
        transactionDate: transactionInfo.transactionDate,
        accountId: transactionInfo.accountId,
        userId,
      });

      await newTransaction.save();
      return true;
    } catch (err) {
      console.error(err);
    }
  }

  private async getUserIdFromReq(req: any): Promise<string> {
    const auth = req.headers?.['authorization'] ?? '';
    const [scheme, raw] = String(auth).split(' ');

    if (!raw || String(scheme).toLowerCase() !== 'bearer') {
      throw new UnauthorizedException(
        'Authorization header must be: Bearer <token>',
      );
    }

    const token = raw.replace(/^'|'$/g, '');

    try {
      const { sub } = await this._jwtService.verifyAsync<{ sub: string }>(
        token,
      );

      if (!sub) throw new UnauthorizedException('Token payload without sub');

      return sub;
    } catch (err: any) {
      // Opcional: distinguir errores
      if (err?.name === 'JsonWebTokenError') {
        throw new UnauthorizedException('Invalid token signature');
      }

      if (err?.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Token expired');
      }

      throw new UnauthorizedException('Invalid token');
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
}
