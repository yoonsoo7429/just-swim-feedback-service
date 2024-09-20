import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Feedback } from './entity/feedback.entity';
import { Repository, UpdateResult } from 'typeorm';
import { FeedbackDto } from './dto/feedback.dto';
import { EditFeedbackDto } from './dto/edit-feedback.dto';

@Injectable()
export class FeedbackRepository {
  constructor(
    @InjectRepository(Feedback)
    private readonly feedbackRepository: Repository<Feedback>,
  ) {}

  /* 강사용 전체 feedback 조회(feedbackDeletedAt is null) */
  async getAllFeedbackByInstructor(userId: number): Promise<Feedback[]> {
    return await this.feedbackRepository.find({
      where: { user: { userId } },
      relations: [
        'feedbackTarget',
        'feedbackTarget.user',
        'feedbackTarget.lecture',
        'feedbackTarget.lecture.member',
      ],
    });
  }

  /* customer 개인 feedback 전체 조회 */
  async getAllFeedbackByCustomer(userId: number): Promise<Feedback[]> {
    return await this.feedbackRepository.find({
      where: { feedbackTarget: { user: { userId } } },
      relations: [
        'feedbackTarget',
        'feedbackTarget.lecture',
        'feedbackTarget.lecture.user',
      ],
    });
  }

  /* feedback 상세 조회 */
  async getFeedbackByPk(feedbackId: number): Promise<Feedback> {
    return await this.feedbackRepository.findOne({
      where: { feedbackId, feedbackDeletedAt: null },
      relations: ['user', 'image', 'feedbackTarget'],
    });
  }

  /* feedback 생성 */
  async createFeedback(
    userId: number,
    feedbackDto: FeedbackDto,
  ): Promise<Feedback> {
    const { feedbackType, feedbackContent, feedbackDate, feedbackLink } =
      feedbackDto;
    const feedback = this.feedbackRepository.create({
      user: { userId },
      feedbackType,
      feedbackContent,
      feedbackDate,
      feedbackLink,
    });
    await this.feedbackRepository.save(feedback);
    return feedback;
  }

  /* feedback 수정 */
  async updateFeedback(
    feedbackId: number,
    editFeedbackDto: EditFeedbackDto,
  ): Promise<UpdateResult> {
    const { feedbackType, feedbackContent, feedbackDate, feedbackLink } =
      editFeedbackDto;

    return await this.feedbackRepository.update(
      { feedbackId },
      { feedbackType, feedbackContent, feedbackDate, feedbackLink },
    );
  }

  /* feedback 삭제(softDelete) */
  async softDeleteFeedback(feedbackId: number): Promise<UpdateResult> {
    return await this.feedbackRepository.update(
      { feedbackId },
      { feedbackDeletedAt: new Date() },
    );
  }
}
