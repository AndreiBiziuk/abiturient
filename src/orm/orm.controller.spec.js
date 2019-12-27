import { Test } from '@nestjs/testing';
import { OrmController } from './orm.controller';

describe('Orm Controller', () => {
  let controller;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [OrmController],
    }).compile();

    controller = module.get(OrmController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
