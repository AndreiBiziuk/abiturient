import { Test } from '@nestjs/testing';
import { AbitursService } from './abiturs.service';

describe('AbitursService', () => {
  let service;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [AbitursService],
    }).compile();

    service = module.get(AbitursService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
