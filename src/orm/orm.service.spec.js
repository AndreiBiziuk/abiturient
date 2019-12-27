import { Test } from '@nestjs/testing';
import { OrmService } from './orm.service';

describe('OrmService', () => {
  let service;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [OrmService],
    }).compile();

    service = module.get(OrmService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
