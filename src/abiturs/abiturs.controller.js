import { Controller, Dependencies, Bind, Get, Req, Param } from '@nestjs/common';
import { AbitursService } from './abiturs.service';

@Controller('abiturs')
@Dependencies(AbitursService)
export class AbitursController {
  constructor(abitursService) {
    this.abitursService = abitursService;
  }

  @Get('all')
  @Bind(Req())
  getAll(request) {
    console.log('abiturs/all ');
    return this.abitursService.getAll(request);
  }

  @Get('page/:page/:size/:sort/:filter')
  @Bind(Param(), Req())
  getPage(params, req) {
    console.log('abiturs/page ', params, req.query);
    return this.abitursService.getPage(
      '(select idAbitur, Фамилия from tAbitur) as q1',
      params.page,
      params.size,
      params.sort,
      params.filter,
    );
  }

  @Get('page/:page/:size/:sort')
  @Bind(Param(), Req())
  getPageWihtoutFilter(params, req) {
    console.log('abiturs/page ', params, req.query);
    return this.abitursService.getPage(
      '(select idAbitur, Фамилия from tAbitur) as q1',
      params.page,
      params.size,
      params.sort,
    );
  }

  @Get(':id')
  @Bind(Param())
  getOne(params) {
    console.log('abiturs/id ', params);
    return this.abitursService.getOne(params.id);
  }
}
