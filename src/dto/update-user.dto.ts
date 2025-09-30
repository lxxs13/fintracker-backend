import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class IUpdateUserDTO {
  @IsString()
  @IsOptional()
  userName: string;

  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
