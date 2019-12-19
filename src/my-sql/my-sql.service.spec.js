import { Test } from '@nestjs/testing';
import { MySqlService } from './my-sql.service';

describe('MySqlService', () => {
  let service;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [MySqlService],
    }).compile();

    service = module.get(MySqlService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
