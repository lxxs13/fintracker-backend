/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ICreateTransactionDTO } from 'src/dto/create-transaction.dto';
import { Transaction } from 'src/schemas/transaction.schema';

@Injectable()
export class TransactionService {
  constructor(
    @InjectModel(Transaction.name)
    private _transactionModel: Model<Transaction>,
    private readonly _jwtService: JwtService,
  ) {}

  async CreateTransaction(req: any, transactionInfo: ICreateTransactionDTO) {
    try {
      const userId = await this.getUserIdFromReq(req);

      if (!userId) return 'Error al obtener infromación del usuario';

      const newTransaction = new this._transactionModel({
        balance: transactionInfo.balance,
        categoryId: transactionInfo.categoryId,
        description: transactionInfo.description,
        transactionDate: transactionInfo.transactionDate,
        userId,
      });

      await newTransaction.save();
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

    const token = raw.replace(/^"|"$/g, '');

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
}
