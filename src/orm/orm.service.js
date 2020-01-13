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
            abitursFull:"tAbiturs",
            abiturs: `(SELECT tAbitur.idAbitur as id, concat(IFNULL(tAbitur.Фамилия,''),' ',IFNULL(tAbitur.Имя,''),' ',IFNULL(tAbitur.Отчество,''))as ФИО,
		 tZajav.Шифр, vwSummaBalls.Балл_100 as Балл, tAbiturStatus.Статус,
            tSpec.Название as Специальность,
		 (concat(tEduForma.Форма_обучения, (case tPlanPriema.idEduLevel when 2 then ' (ссо)' else '' end))) as Форма,
            tEduOplata.Оплата_обучения as Оплата,
            DATE_FORMAT(tZajav.iDate, '%Y.%m.%d %T') as Дата
        FROM \`tAbitur\`
        left join tZajav on tAbitur.idAbitur = tZajav.idAbitur
        left join tAbiturStatus on tZajav.idAbiturStatus = tAbiturStatus.idAbiturStatus
        left join vwSummaBalls on vwSummaBalls.idAbitur = tAbitur.idAbitur and vwSummaBalls.idPlanPriema = tZajav.currentPlanPriemaId
        left join tPlanPriema on tPlanPriema.idPlanPriema = tZajav.currentPlanPriemaId
        left join tEduForma on tEduForma.idEduForma = tPlanPriema.idEduForma
        left join tEduOplata on tEduOplata.idEduOplata = tPlanPriema.idEduoplata
        left join tSpec on tSpec.idSpec = tPlanPriema.idSpec) as q1`,
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

    async getFields(params, req) {
        let table = "";
        if (!(table = this.checkTableName(params.entity))) throw new HttpException("Not Found", 404);
        return this.db.getFieldList(
            table
        );
    }

    async getOneRow(params, req){
        let table = "";
        if (!(table = this.checkTableName(params.entity))) throw new HttpException("Not Found", 404);
        return this.db.getOneRow(
            table,
            params.keyvalue
        );
    }

    async getPage(params, req) {
        //console.log('abiturs/page ', params, req.query);
        let table = "";
        if (!(table = this.checkTableName(params.entity))) throw new HttpException("Not Found", 404);
        return this.db.getPage(
            table,
            params.page,
            params.size,
            params.sort,
            params.filter
        );
    }

    async getLinesCount(params, req) {
        //console.log('abiturs/page ', params, req.query);
        let table = "";
        if (!(table = this.checkTableName(params.entity))) throw new HttpException("Not Found", 404);
        return this.db.getLinesCount(
            table,
            params.filter
        );
    }

    async getLinesCountWithoutFilter(params, req) {
        let table = "";
        if (!(table = this.checkTableName(params.entity))) throw new HttpException("Not Found", 404);
        return this.db.getLinesCount(
            table
        );
    }

    async updateValues(params, req){
        let table = "";
        if (!(table = this.checkTableName(params.entity))) throw new HttpException("Not Found", 404);

        //console.log(req);

        return this.db.updateValues(
            table,
            params.keyvalue,
            req.body.names,
            req.body.values
        )
    }

    async insertValues(params, req) {
        let table = "";
        if (!(table = this.checkTableName(params.entity))) throw new HttpException("Not Found", 404);

        //console.log(req);

        return this.db.insertValues(
            table,
            req.body.names,
            req.body.values
        )
    }

    async deleteValues(params, req){
        let table = "";
        if (!(table = this.checkTableName(params.entity))) throw new HttpException("Not Found", 404);

        return this.db.deleteValues(
            table,
            params.keyvalue
        )
    }
}