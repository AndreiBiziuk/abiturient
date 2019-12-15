import { Test } from '@nestjs/testing';
import { AbitursController } from './abiturs.controller';

describe('Abiturs Controller', () => {
  let controller;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [AbitursController],
    }).compile();

    controller = module.get(AbitursController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
