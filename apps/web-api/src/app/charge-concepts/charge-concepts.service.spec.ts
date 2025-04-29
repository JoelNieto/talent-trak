import { Test, TestingModule } from '@nestjs/testing';
import { ChargeConceptsService } from './charge-concepts.service';

describe('ChargeConceptsService', () => {
  let service: ChargeConceptsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChargeConceptsService],
    }).compile();

    service = module.get<ChargeConceptsService>(ChargeConceptsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
