import { Test, TestingModule } from '@nestjs/testing';
import { ChargeConceptsController } from './charge-concepts.controller';
import { ChargeConceptsService } from './charge-concepts.service';

describe('ChargeConceptsController', () => {
  let controller: ChargeConceptsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChargeConceptsController],
      providers: [ChargeConceptsService],
    }).compile();

    controller = module.get<ChargeConceptsController>(ChargeConceptsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
