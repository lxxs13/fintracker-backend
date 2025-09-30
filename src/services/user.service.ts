import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import * as bcrypt from 'bcrypt';

import { ICreateUserDTO } from 'src/dto/create-user.dto';
import { User, UserDocument } from 'src/schemas/user.schema';
import { IUpdateUserDTO } from 'src/dto/update-user.dto';
import { CategoriesService } from './categories.service';
import { initialCategories } from 'src/constants/categories.constants';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private _userModel: Model<User>,
    private readonly _categoriesService: CategoriesService,
  ) {}

  getUsers() {
    return this._userModel.find();
  }

  async createUser(user: ICreateUserDTO): Promise<boolean> {
    try {
      const { userName, email, password } = user;

      const saltRounds = 10;
      const salt = await bcrypt.genSalt(saltRounds);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = new this._userModel({
        userName,
        email,
        password: hashedPassword,
      });

      await newUser.save();

      this._categoriesService.CreateCategory(
        initialCategories,
        newUser._id.toString(),
      );
    } catch (error) {
      console.error('Error creating user:', error);
      return false;
    }

    return true;
  }

  async updateUser(id: string, user: IUpdateUserDTO) {
    return this._userModel.findByIdAndUpdate(id, user);
  }

  async getUserByEmail(email: string): Promise<UserDocument | null> {
    return this._userModel.findOne({ email }).exec();
  }
}
