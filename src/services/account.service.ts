import { BadRequestException, ConflictException, ForbiddenException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types, ObjectId } from 'mongoose';
import { ICreateAccountCrediCardDTO } from 'src/dto/create-account-credit-card.dto';
import { ICreateEditAccountDebitCardDTO } from 'src/dto/create-account-debit-card.dto';
import { EAccountType } from 'src/enums/acccount-type.enum';
import { Account } from 'src/schemas/account.schema';
import { Card } from 'src/schemas/card.schema';

@Injectable()
export class AccountService {
  constructor(
    @InjectModel(Account.name) private _accountModel: Model<Account>,
    @InjectModel(Card.name) private _cardModel: Model<Card>,
  ) { }

  async getSummary(userId: string): Promise<number> {
    try {

      const base = { deleted: false, userId };

      const debitAccount = await this._accountModel
        .find({
          ...base,
          accountType: { $ne: EAccountType.CREDITO },
        })
        .select('currentBalance')
        .exec();

      const total = debitAccount.reduce((sum, debitAccount) => sum += debitAccount.currentBalance, 0);

      return total;
    } catch (error) {
      throw new InternalServerErrorException('Failed to get account summary');
    }
  }

  async getDebitAccountsById(userId: string) {
    try {
      const base = { deleted: false, userId };

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
      throw new InternalServerErrorException('Failed to get accounts list');
    }
  }

  async createDebitAccount(userId: string, accounData: ICreateEditAccountDebitCardDTO): Promise<Account> {
    try {
      const { balance, description, accountType } = accounData;

      const newAccount = new this._accountModel({
        userId,
        accountName: description,
        currentBalance: balance,
        accountType,
      });

      await newAccount.save();
      return newAccount;
    } catch (error) {
      throw new InternalServerErrorException('Failed to create debit account');
    }
  }

  async createCreditAccount(userId: string, accounData: ICreateAccountCrediCardDTO): Promise<{ newAccount: Account, newCard: Card }> {
    try {
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

      return { newAccount, newCard };
    } catch (error) {
      throw new InternalServerErrorException('Failed to create credit account');
    }
  }

  async updateAccountBalance(userId: string, accountId: string, amount: number): Promise<number> {
    try {
      let account = await this._accountModel.findOneAndUpdate(
        {
          userId,
          _id: new Types.ObjectId(accountId),
        },
        { $inc: { currentBalance: amount } },
        { new: true },
      ).exec();

      if (!account) throw new NotFoundException('Account not found');

      return account.currentBalance;
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException('Failed to update account balance');
    }
  }

  async updateDebitAccount(id: string, data: ICreateEditAccountDebitCardDTO): Promise<Account> {
    try {
      const { description, balance, accountType } = data;

      const debitAccount = await this._accountModel.findOneAndUpdate(
        { _id: id },
        {
          $set: {
            accountName: description,
            currentBalance: balance,
            accountType: accountType,
          },
        },
        {
          new: true,
        }).exec();

      if (!debitAccount) throw new NotFoundException('Account not found');

      return debitAccount;
    } catch (error) {
      throw new InternalServerErrorException('Failed to update debit account');
    }
  }

  async updateCreditAccount(id: string, data: ICreateAccountCrediCardDTO): Promise<{ debitAccount: Account; newCard: Card }> {
    try {
      const {
        balance,
        description,
        accountType,
        limitCreditCard,
        lastDigits,
        APR,
        paymentDay,
        statementCloseDay
      } = data;

      const debitAccount = await this._accountModel.findOneAndUpdate(
        { _id: id },
        {
          $set: {
            accountName: description,
            currentBalance: balance,
            accountType: accountType,
          },
        },
        {
          new: true,
        }).exec();

      if (!debitAccount) throw new NotFoundException('Account not found');

      const newCard = await this._cardModel.findOneAndUpdate(
        { _id: debitAccount?.id },
        {
          creditCardLimit: limitCreditCard,
          lastDigits,
          paymentDay,
          statementCloseDay,
          APR,
        });

      if (!newCard) throw new NotFoundException('Credit card not found');

      return { debitAccount, newCard };
    } catch (error) {
      throw new InternalServerErrorException('Failed to update credit account');
    }
  }

  async deleteAccount(id: string): Promise<void> {
    try {
      const account = await this._accountModel.updateOne(
        { _id: id },
        {
          $set: {
            deleted: true,
          }
        }
      );

      if (account.modifiedCount === 0) {
        throw new NotFoundException('Account not found or already deleted');
      }
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ForbiddenException) {
        throw error;
      }

      console.error('Error deleting account:', error);
      throw new InternalServerErrorException('Failed to delete account');
    }
  }
}
