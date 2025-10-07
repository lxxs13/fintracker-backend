import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ICreateCategoryDTO } from 'src/dto/create-category.dto';
import { ECategoryType } from 'src/enums/category-type.enum';
import { Category } from 'src/schemas/category.schema';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category.name) private _categoryModel: Model<Category>,
    private readonly _jwtService: JwtService,
  ) {}

  async GetCategories(req: any) {
    const userId = await this.getUserIdFromReq(req);

    if (!userId) throw new Error('Error al obtener información del usuario');

    const owner = Types.ObjectId.isValid(userId) ? new Types.ObjectId(userId) : userId;
    const base = { deleted: false, userId: { $in: [owner, userId] } };

    const [spent, income] = await Promise.all([
      this._categoryModel
        .find({ ...base, categoryType: ECategoryType.SPENT })
        .sort({ 'categoryName': 1 })
        .select('_id categoryName iconLabel iconColor categoryType')
        .lean()
        .exec(),
      this._categoryModel
        .find({ ...base, categoryType: ECategoryType.INCOME })
        .select('_id categoryName iconLabel iconColor categoryType')
        .sort({ 'categoryName': 1 })
        .lean()
        .exec(),
    ]);

    return { categoriesSpent: spent, categoriesIncome: income };
  }

  CreateCategory(
    categoryList: ICreateCategoryDTO[],
    userId?: string,
    req?: any,
  ) {
    categoryList.forEach(async (category: ICreateCategoryDTO) => {
      const newCategory = new this._categoryModel({
        userId,
        categoryName: category.categoryName,
        categoryType: category.categoryType,
        iconLabel: category.iconLabel,
        iconColor: category.iconColor,
        categoryLimit: 0,
      });

      await newCategory.save();
    });
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
