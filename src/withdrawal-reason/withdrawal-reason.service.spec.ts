import { Test, TestingModule } from '@nestjs/testing';
import { WithdrawalReasonService } from './withdrawal-reason.service';

describe('WithdrawalReasonService', () => {
  let service: WithdrawalReasonService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WithdrawalReasonService],
    }).compile();

    service = module.get<WithdrawalReasonService>(WithdrawalReasonService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
