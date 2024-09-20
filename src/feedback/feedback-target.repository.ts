import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FeedbackTarget } from './entity/feedback-target.entity';
import { DeleteResult, Repository } from 'typeorm';

@Injectable()
export class FeedbackTargetRepository {
  constructor(
    @InjectRepository(FeedbackTarget)
    private readonly feedbackTargetRepository: Repository<FeedbackTarget>,
  ) {}

  /* feedbackId를 통해 target 확인 */
  async getFeedbackTargetByFeedbackId(
    feedbackId: number,
  ): Promise<FeedbackTarget[]> {
    return await this.feedbackTargetRepository.find({
      where: { feedback: { feedbackId } },
      relations: ['user', 'lecture', 'lecture.member'],
    });
  }

  /* feedbackTarget 생성 */
  async createFeedbackTarget(
    feedbackId: number,
    lectureId: number,
    userId: number,
  ): Promise<FeedbackTarget> {
    const feedbackTarget = this.feedbackTargetRepository.create({
      feedback: { feedbackId },
      lecture: { lectureId },
      user: { userId },
    });

    await this.feedbackTargetRepository.save(feedbackTarget);
    return feedbackTarget;
  }

  /* feedbackTarget 삭제 */
  async deleteFeedbackTarget(feedbackId: number): Promise<DeleteResult> {
    return await this.feedbackTargetRepository.delete({
      feedback: { feedbackId },
    });
  }
}
