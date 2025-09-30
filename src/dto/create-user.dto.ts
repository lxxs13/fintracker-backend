import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ICreateUserDTO {
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
