import { Injectable, Dependencies, HttpException, HttpStatus, NotFoudException } from '@nestjs/common';
import { MySqlService } from '../my-sql/my-sql.service';

@Injectable()
@Dependencies(MySqlService)
export class OrmService {
    constructor(mySqlService) {
        this.db = mySqlService;
    }

    checkTableName(table){
        const pseudo = {
            users:"tUsers",
            abiturs:"tAbiturs",
            options:"options",
            docs:"tDocs",
            plan:"tPlanPriema",
            spec:"tSpec",
            predmet:"tPredmet"
        }

        return pseudo[table];
    }

    async getPageWithoutFilter(params, req) {
        //console.log('abiturs/page ', params, req.query);
        let table = "";
        if(!(table = this.checkTableName(params.entity))) throw new HttpException("Not Found", 404);

        return this.db.getPage(
            table,
            params.page,
            params.size,
            params.sort,
        );
        
    }

    async getPage(params, req) {
        //console.log('abiturs/page ', params, req.query);
        return this.db.getPage(
            params.entity,
            params.page,
            params.size,
            params.sort,
            params.filter
        );
    }
}