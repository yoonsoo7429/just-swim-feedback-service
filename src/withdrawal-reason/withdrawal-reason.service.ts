import { Injectable } from '@nestjs/common';
import { WithdrawalReasonRepository } from './withdrawal-reason.repository';
import { WithdrawalReasonDto } from './dto/withdrawal-reason.dto';
import { WithdrawalReason } from './entity/withdrawal-reason.entity';

@Injectable()
export class WithdrawalReasonService {
  constructor(
    private readonly withdrawalReasonRepository: WithdrawalReasonRepository,
  ) {}

  /* 탈퇴 사유 저장 */
  async createWithdrawalReason(
    userId: number,
    withdrawalReasonDto: WithdrawalReasonDto,
  ): Promise<WithdrawalReason> {
    return await this.withdrawalReasonRepository.createWithdrawalReason(
      userId,
      withdrawalReasonDto,
    );
  }
}
