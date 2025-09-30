import { Controller, Get, Req } from '@nestjs/common';
import { CategoriesService } from 'src/services/categories.service';

@Controller('categories')
export class CategoriesController {
  constructor(private _categoriesService: CategoriesService) {}

  @Get()
  getCategories(@Req() req: Request) {
    return this._categoriesService.GetCategories(req);
  }
}
