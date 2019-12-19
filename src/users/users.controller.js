import {
  Controller,
  Dependencies,
  Get,
  Bind,
  Req,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from '../auth/auth.service';

@Controller('users')
@Dependencies(UsersService, AuthService)
export class UsersController {
  constructor(usersService, authService) {
    this.usersService = usersService;
    this.authService = authService;
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('all')
  @Bind(Req())
  getAllUsers(req) {
    return this.usersService.getAll(req.user);
  }
}
