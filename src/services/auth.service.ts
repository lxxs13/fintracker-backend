/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, UnauthorizedException } from '@nestjs/common';

import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { IAuthDTO } from 'src/dto/auth.dto';

import { UserService } from './user.service';

@Injectable()
export class AuthService {
  constructor(
    private _userService: UserService,
    private _jwtService: JwtService,
  ) {}

  async signIn(authInfo: IAuthDTO) {
    const { email, password } = authInfo;
    const user = await this._userService.getUserByEmail(email);

    const validPassword = await bcrypt.compare(password, user!.password);

    if (!validPassword) throw new UnauthorizedException();

    const payload = { sub: user!.id ?? user!._id.toString() };

    const accessToken = await this._jwtService.signAsync(payload);

    const decoded = this._jwtService.decode(accessToken);
    const secondsLeft = decoded?.exp
      ? decoded.exp - Math.floor(Date.now() / 1000)
      : 0;

    return {
      userFullName: user!.userName,
      accessToken,
      expiresIn: Math.max(0, secondsLeft),
    };
  }
}
