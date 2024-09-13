import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WithdrawalReason } from './entity/withdrawal-reason.entity';
import { WithdrawalReasonService } from './withdrawal-reason.service';
import { WithdrawalReasonRepository } from './withdrawal-reason.repository';

@Module({
  imports: [TypeOrmModule.forFeature([WithdrawalReason])],
  providers: [WithdrawalReasonService, WithdrawalReasonRepository],
  exports: [WithdrawalReasonService, WithdrawalReasonRepository],
})
export class WithdrawalReasonModule {}
