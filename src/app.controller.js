import {
  Controller,
  Dependencies,
  Get,
  Bind,
  Req,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AppService } from './app.service';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth/auth.service';

@Controller()
@Dependencies(AppService, AuthService)
export class AppController {
  constructor(appService, authService) {
    this.appService = appService;
    this.authService = authService;
  }

  @Get()
  getHello() {
    return this.appService.getHello();
  }

  @UseGuards(AuthGuard('local'))
  @Post('auth/login')
  @Bind(Req())
  async login(req) {
    return this.authService.login(req.user);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  @Bind(Req())
  getProfile(req) {
    return req.user;
  }
}
