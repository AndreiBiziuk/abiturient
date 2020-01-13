import {
    Controller,
    Dependencies,
    Bind,
    Get,
    Put,
    Post,
    Delete,
    Req,
    Param,
    UseGuards,
    UseFilters,
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
    @Get(':entity/fields')
    @Bind(Param(), Req())
    getFields(params, req) {
        //console.log('abiturs/page ', params, req.query);
        return this.ormService.getFields(params, req);
    }

    @UseGuards(AuthGuard('jwt'))
    @Get(':entity/page/:page/:size/:sort/:filter')
    @Bind(Param(), Req())
    getPage(params, req) {
        //console.log('abiturs/page ', params, req.query);
        return this.ormService.getPage(params, req);
    }

    @UseGuards(AuthGuard('jwt'))
    @Get(':entity/count/:filter')
    @Bind(Param(), Req())
    getLinesCount(params, req) {
        return this.ormService.getLinesCount(params, req);
    }

    @UseGuards(AuthGuard('jwt'))
    @Get(':entity/count')
    @Bind(Param(), Req())
    getLinesCountWithoutFilter(params, req) {
        return this.ormService.getLinesCount(params, req);
    }

    @UseGuards(AuthGuard('jwt'))
    @Get(':entity/:keyvalue')
    @Bind(Param(), Req())
    getOneRow(params, req) {
        return this.ormService.getOneRow(params, req);
    }

    @UseGuards(AuthGuard('jwt'))
    @Put(':entity/:keyvalue')
    @Bind(Param(), Req())
    updateValues(params, req) {
        //console.log('abiturs/page ', params, req.query);
        return this.ormService.updateValues(params, req);
    }

    @UseGuards(AuthGuard('jwt'))
    @Post(':entity')
    @Bind(Param(), Req())
    insertValues(params, req) {
        //console.log('abiturs/page ', params, req.query);
        return this.ormService.insertValues(params, req);
    }

    @UseGuards(AuthGuard('jwt'))
    @Delete(':entity/:keyvalue')
    @Bind(Param(), Req())
    deleteValues(params, req) {
        //console.log('abiturs/page ', params, req.query);
        return this.ormService.deleteValues(params, req);
    }
}
