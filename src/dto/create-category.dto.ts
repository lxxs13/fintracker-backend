import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ECategoryType } from 'src/enums/category-type.enum';

export class ICreateCategoryDTO {
  @IsString()
  @IsNotEmpty()
  categoryName: string;

  @IsString()
  @IsNotEmpty()
  iconLabel: string;

  @IsNumber()
  @IsNotEmpty()
  categoryType: ECategoryType;

  @IsString()
  @IsNotEmpty()
  iconColor: string;
}
