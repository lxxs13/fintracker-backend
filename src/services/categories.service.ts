import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ICreateCategoryDTO } from 'src/dto/create-category.dto';
import { ECategoryType } from 'src/enums/category-type.enum';
import { Category } from 'src/schemas/category.schema';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category.name) private _categoryModel: Model<Category>
  ) {}

  async getCategories(userId: string) {
    const base = { deleted: false, userId };

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

  async createCategory(categoryList: ICreateCategoryDTO[], userId?: string) {
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
}