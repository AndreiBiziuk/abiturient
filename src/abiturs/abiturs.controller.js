import {
  Controller,
  Dependencies,
  Bind,
  Get,
  Req,
  Param,
  UseGuards,
} from '@nestjs/common';
import { AbitursService } from './abiturs.service';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from '../auth/auth.service';

@Controller('abiturs')
@Dependencies(AbitursService, AuthService)
export class AbitursController {
  constructor(abitursService, authService) {
    this.abitursService = abitursService;
    this.authService = authService;
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('all')
  @Bind(Req())
  getAll(request) {
    //console.log('abiturs/all ');
    return this.abitursService.getAll(request);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('page/:page/:size/:sort/:filter')
  @Bind(Param(), Req())
  getPage(params, req) {
    //console.log('abiturs/page ', params, req.query);
    return this.abitursService.getPage(params, req);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('page/:page/:size/:sort')
  @Bind(Param(), Req())
  getPageWihtoutFilter(params, req) {
    //console.log('abiturs/page ', params, req.query);
    return this.abitursService.getPageWihtoutFilter(params, req);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  @Bind(Param())
  getOne(params) {
    //console.log('abiturs/id ', params);
    return this.abitursService.getOne(params.id);
  }
}
