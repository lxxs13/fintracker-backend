import { Controller, Get, Post, Body } from '@nestjs/common';
import { Public } from 'src/decorators/public.decorator';
import { ICreateUserDTO } from 'src/dto/create-user.dto';
import { UserService } from 'src/services/user.service';

@Controller('user')
export class UserController {
  constructor(private _userService: UserService) {}

  @Get()
  GetUsers() {
    return this._userService.getUsers();
  }

  @Public()
  @Post()
  CreateUser(@Body() body: ICreateUserDTO) {
    return this._userService.createUser(body);
  }
}
