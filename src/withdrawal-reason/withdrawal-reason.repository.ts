import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WithdrawalReason } from './entity/withdrawal-reason.entity';
import { Repository } from 'typeorm';
import { WithdrawalReasonDto } from './dto/withdrawal-reason.dto';

@Injectable()
export class WithdrawalReasonRepository {
  constructor(
    @InjectRepository(WithdrawalReason)
    private withdrawalReasonRepository: Repository<WithdrawalReason>,
  ) {}

  /* 탈퇴 사유 저장 */
  async createWithdrawalReason(
    userId: number,
    withdrawalReasonDto: WithdrawalReasonDto,
  ): Promise<WithdrawalReason> {
    const withdrawalReason = new WithdrawalReason();

    withdrawalReason.user.userId = userId;
    withdrawalReason.withdrawalReasonContent =
      withdrawalReasonDto.withdrawalReasonContent;

    await this.withdrawalReasonRepository.save(withdrawalReason);

    return withdrawalReason;
  }
}
