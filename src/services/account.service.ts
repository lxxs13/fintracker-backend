import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ICreateAccountCrediCardDTO } from 'src/dto/create-account-credit-card.dto';
import { ICreateAccountDebitCardDTO } from 'src/dto/create-account-debit-card.dto';
import { EAccountType } from 'src/enums/acccount-type.enum';
import { Account } from 'src/schemas/account.schema';
import { Card } from 'src/schemas/card.schema';

@Injectable()
export class AccountService {
  constructor(
    @InjectModel(Account.name) private _accountModel: Model<Account>,
    @InjectModel(Card.name) private _cardModel: Model<Card>,
    private readonly _jwtService: JwtService,
  ) { }

  async GetSummary(req: any) {
    let total = 0;

    try {
      const userId = await this.getUserIdFromReq(req);

      if (!userId) return 'Error al obtener infromación del usuario';

      const products = await this._accountModel
        .find({
          userId,
          deleted: false,
          accountType: { $ne: EAccountType.CREDITO },
        })
        .select('balance')
        .exec();

      products.forEach((element) => {
        total += element.currentBalance;
      });

      return total;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async GetDebitAccountsById(req: any) {
    try {
      const userId = await this.getUserIdFromReq(req);

      if (!userId) return 'Error al obtener infromación del usuario';

      const owner = Types.ObjectId.isValid(userId) ? new Types.ObjectId(userId) : userId;
      const base = { deleted: false, userId: { $in: [owner, userId] } };

      const [debitAccounts, creditAccounts] = await Promise.all([
        this._accountModel
          .find({ ...base, accountType: { $ne: EAccountType.CREDITO } }) //excluye tarjetas de credito
          .select('_id accountName accountType currentBalance')
          .lean()
          .exec(),
        this._accountModel
          .find({ ...base, accountType: EAccountType.CREDITO })
          .select('_id accountName accountType currentBalance')
          .populate({
            path: 'card',
            select: '_id creditCardLimit statementCloseDay paymentDay lastDigits APR',
            options: { lean: true },
          })
          .lean({ virtuals: true })
          .exec(),
      ]);

      return { debitAccounts, creditAccounts };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async CreateDebitAccount(
    req: any,
    accounData: ICreateAccountDebitCardDTO,
  ): Promise<boolean | string> {
    try {
      const userId = await this.getUserIdFromReq(req);
      if (!userId) return 'Error al obtener infromación del usuario';

      const { balance, description, accountType } = accounData;

      const newAccount = new this._accountModel({
        userId: userId,
        accountName: description,
        currentBalance: balance,
        accountType,
      });

      await newAccount.save();
    } catch (error) {
      console.error('Error creating user:', error);
      return false;
    }

    return true;
  }

  async CreateCreditAccount(
    req: any,
    accounData: ICreateAccountCrediCardDTO,
  ): Promise<boolean | string> {
    try {
      const userId = await this.getUserIdFromReq(req);
      if (!userId) return 'Error al obtener infromación del usuario';

      const {
        balance,
        description,
        accountType,
        limitCreditCard,
        lastDigits,
        APR,
        paymentDay,
        statementCloseDay
      } = accounData;

      const newAccount = new this._accountModel({
        userId: userId,
        accountName: description,
        currentBalance: balance,
        accountType,
      });

      const newCard = new this._cardModel({
        userId,
        accountId: newAccount._id,
        creditCardLimit: limitCreditCard,
        lastDigits,
        paymentDay,
        statementCloseDay,
        APR,
      });

      await newAccount.save();
      await newCard.save();
    } catch (error) {
      console.error('Error creating user:', error);
      return false;
    }

    return true;
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
