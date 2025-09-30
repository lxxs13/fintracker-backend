import { Body, Controller, Post } from '@nestjs/common';
import { IAuthDTO } from 'src/dto/auth.dto';
import { AuthService } from 'src/services/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private _authService: AuthService) {}

  @Post()
  Login(@Body() login: IAuthDTO) {
    return this._authService.signIn(login);
  }
}
