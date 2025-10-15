import { IsOptional, IsString } from "class-validator";

export class FiltersDTO {
  @IsOptional()
  @IsString()
  startDate?: string;

  @IsOptional()
  @IsString()
  endDate?: string;
  
}