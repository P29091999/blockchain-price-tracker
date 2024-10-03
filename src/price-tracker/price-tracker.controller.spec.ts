import { Test, TestingModule } from '@nestjs/testing';
import { PriceTrackerController } from './price-tracker.controller';

describe('PriceTrackerController', () => {
  let controller: PriceTrackerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PriceTrackerController],
    }).compile();

    controller = module.get<PriceTrackerController>(PriceTrackerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
