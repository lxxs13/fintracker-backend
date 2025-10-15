import { ConflictException, forwardRef, HttpException, Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import * as bcrypt from 'bcrypt';

import { ICreateUserDTO } from 'src/dto/create-user.dto';
import { User, UserDocument } from 'src/schemas/user.schema';
import { IUpdateUserDTO } from 'src/dto/update-user.dto';
import { CategoriesService } from './categories.service';
import { initialCategories } from 'src/constants/categories.constants';
import { AuthService } from './auth.service';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private _userModel: Model<User>,
    @Inject(forwardRef(() => AuthService))
    private _authService: AuthService,
    private readonly _categoriesService: CategoriesService,
  ) { }

  getUsers() {
    return this._userModel.find();
  }

  async createUser(user: ICreateUserDTO) {
    try {
      const emailExist = await this._userModel.findOne(
        { email: user.email }
      ).where(
        { delete: false }
      ).exec();

      if (emailExist) {
        throw new ConflictException('El correo electrónico ingresado ya se encuentra registrado');
      }

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

      await this._categoriesService.createCategory(initialCategories, newUser._id.toString());

      const { userFullName, accessToken, expiresIn } = await this._authService.signIn({ email, password });

      const userResponse = {
        userFullName,
        accessToken,
        expiresIn
      };

      return userResponse;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException('Ocurrió un error al crear el usuario');
    }
  }


  async updateUser(id: string, user: IUpdateUserDTO) {
    return this._userModel.findByIdAndUpdate(id, user);
  }

  async getUserByEmail(email: string): Promise<UserDocument | null> {
    return this._userModel.findOne({ email }).exec();
  }
}
