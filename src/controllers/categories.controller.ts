import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { UserId } from 'src/decorators/user-id.decorator';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { CategoriesService } from 'src/services/categories.service';

@Controller('categories')
export class CategoriesController {
  constructor(private _categoriesService: CategoriesService) { }

  @Get()
  getCategories(@UserId() userId: string) {
    return this._categoriesService.getCategories(userId);
  }
}
