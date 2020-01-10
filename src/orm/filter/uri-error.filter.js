import { Catch, Error } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';

@Catch()
export class UriErrorFilter extends BaseExceptionFilter {
  catch(exception, host) {
    //console.log("====================Error=================");
    //console.log(exception);
    super.catch(exception, host);
  }
}
