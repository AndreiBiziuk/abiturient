import {
    Controller,
    Dependencies,
    Bind,
    Get,
    Req,
    Param,
    UseGuards,
} from '@nestjs/common';
import { OrmService } from './orm.service';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from '../auth/auth.service';

@Controller('orm')
@Dependencies(OrmService, AuthService)
export class OrmController {
    constructor(ormService, authService){
        this.ormService = ormService;
        this.authService = authService;
    }

    @UseGuards(AuthGuard('jwt'))
    @Get(':entity/page/:page/:size/:sort')
    @Bind(Param(), Req())
    getPageWithoutFilter(params, req) {
        //console.log('abiturs/page ', params, req.query);
        return this.ormService.getPageWithoutFilter(params, req);
    }

    @UseGuards(AuthGuard('jwt'))
    @Get(':entity/page/:page/:size/:sort/:filter')
    @Bind(Param(), Req())
    getPage(params, req) {
        //console.log('abiturs/page ', params, req.query);
        return this.ormService.getPage(params, req);
    }
}
