import { Test, TestingModule } from '@nestjs/testing';
import { WithdrawalReasonService } from './withdrawal-reason.service';
import { WithdrawalReasonRepository } from './withdrawal-reason.repository';
import { WithdrawalReason } from './entity/withdrawal-reason.entity';
import { MockUsersRepository } from 'src/users/users.service.spec';
import { WithdrawalReasonDto } from './dto/withdrawal-reason.dto';

const mockUser = new MockUsersRepository().mockUser;

export class MockWithdrawalReasonRepository {
  readonly mockWithdrawal: WithdrawalReason = {
    user: mockUser,
    withdrawalReasonId: 1,
    withdrawalReasonContent: '서비스가 불편해요.',
    withdrawalReasonCreatedAt: new Date(),
    withdrawalReasonUpdatedAt: new Date(),
  };
}

describe('WithdrawalReasonService', () => {
  let withdrawalReasonService: WithdrawalReasonService;
  let withdrawalReasonRepository: WithdrawalReasonRepository;

  const mockWithdrawal = new MockWithdrawalReasonRepository().mockWithdrawal;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WithdrawalReasonService,
        {
          provide: WithdrawalReasonRepository,
          useValue: { createWithdrawalReason: jest.fn() },
        },
      ],
    }).compile();

    withdrawalReasonService = module.get<WithdrawalReasonService>(
      WithdrawalReasonService,
    );
    withdrawalReasonRepository = module.get<WithdrawalReasonRepository>(
      WithdrawalReasonRepository,
    );
  });

  it('should be defined', () => {
    expect(withdrawalReasonService).toBeDefined();
  });

  describe('createWithdrawalReason', () => {
    it('계정을 탈퇴 사유를 저장하고 탈퇴 사유에 대한 정보를 return', async () => {
      const userId = mockUser.userId;
      const withdrawalReasonDto: WithdrawalReasonDto = {
        withdrawalReasonContent: '서비스가 불편해요.',
      };

      (
        withdrawalReasonRepository.createWithdrawalReason as jest.Mock
      ).mockResolvedValue(mockWithdrawal);

      const result = await withdrawalReasonService.createWithdrawalReason(
        userId,
        withdrawalReasonDto,
      );

      expect(result).toEqual(mockWithdrawal);
    });
  });
});
