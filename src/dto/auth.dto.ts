import { IsNotEmpty, IsString } from 'class-validator';

export class IAuthDTO {
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
