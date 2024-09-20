import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { AwsService } from 'src/common/aws/aws.service';
import { FeedbackRepository } from './feedback.repository';
import { FeedbackTargetRepository } from './feedback-target.repository';
import { ImageService } from 'src/image/image.service';
import { Feedback } from './entity/feedback.entity';
import { FeedbackImageDto } from 'src/image/dto/feedback-image.dto';
import slugify from 'slugify';
import { FeedbackDto } from './dto/feedback.dto';
import { EditFeedbackDto } from './dto/edit-feedback.dto';
import { UpdateResult } from 'typeorm';

@Injectable()
export class FeedbackService {
  constructor(
    private readonly awsService: AwsService,
    private readonly feedbackRepository: FeedbackRepository,
    private readonly feedbackTargetRepository: FeedbackTargetRepository,
    private readonly imageService: ImageService,
  ) {}

  /* 강사용 전체 feedback 조회(feedbackDeletedAt is null) */
  async getAllFeedbackByInstructor(userId: number): Promise<Feedback[]> {
    return await this.feedbackRepository.getAllFeedbackByInstructor(userId);
  }

  /* customer 개인 feedback 전체 조회 */
  async getAllFeedbackByCustomer(userId: number): Promise<Feedback[]> {
    return await this.feedbackRepository.getAllFeedbackByCustomer(userId);
  }

  /* feedback 상세 조회 */
  async getFeedbackByPk(userId: number, feedbackId: number): Promise<Feedback> {
    const feedback = await this.feedbackRepository.getFeedbackByPk(feedbackId);
    if (!feedback) {
      throw new NotFoundException('존재하지 않는 피드백입니다.');
    }

    const feedbackTargetList =
      await this.feedbackTargetRepository.getFeedbackTargetByFeedbackId(
        feedbackId,
      );

    if (feedback.user.userId === userId) {
      return feedback;
    }

    // member
    for (let i = 0; i < feedbackTargetList.length; i++) {
      if (feedbackTargetList[i].user.userId === userId) {
        return feedback;
      }
    }
    throw new UnauthorizedException('feedback 상세 조회 권한이 없습니다.');
  }

  /* feedback 이미지 업로드를 위한 presignedUrl 생성 */
  async generateFeedbackPresignedUrls(
    userId: number,
    feedbackImageDto: FeedbackImageDto,
  ): Promise<any[]> {
    const presignedUrls = await Promise.all(
      feedbackImageDto.files.map(async (file) => {
        const ext = file.split('.').pop(); // 확장자 추출
        const originalNameWithoutExt = file.split('.').slice(0, -1).join('.'); // 확장자를 제외한 이름
        const slugifiedName = slugify(originalNameWithoutExt, {
          lower: true,
          strict: true,
        });
        const fileName = `feedback/${userId}/${Date.now().toString()}-${slugifiedName}.${ext}`;

        // presignedUrl 생성
        const presignedUrl = await this.awsService.getPresignedUrl(
          fileName,
          ext,
        );

        return { presignedUrl, fileName };
      }),
    );

    return presignedUrls;
  }

  /* feedback 생성 */
  async createFeedback(
    userId: number,
    feedbackDto: FeedbackDto,
  ): Promise<Feedback> {
    const { feedbackTarget, feedbackImage } = feedbackDto;
    // feedback 생성
    const feedback = await this.feedbackRepository.createFeedback(
      userId,
      feedbackDto,
    );
    const feedbackId = feedback.feedbackId;

    for (const target of feedbackTarget) {
      let lectureId = target.lectureId;
      for (const userId of target.userIds) {
        await this.feedbackTargetRepository.createFeedbackTarget(
          feedbackId,
          lectureId,
          userId,
        );
      }
    }
    if (feedbackImage && feedbackImage.length > 0) {
      await this.imageService.createImage(feedbackImage, feedback.feedbackId);
    }

    return feedback;
  }

  /* feedback 수정 */
  async updateFeedback(
    userId: number,
    feedbackId: number,
    editFeedbackDto: EditFeedbackDto,
  ): Promise<UpdateResult> {
    const feedback = await this.feedbackRepository.getFeedbackByPk(feedbackId);
    if (!feedback) {
      throw new NotFoundException('존재하지 않는 피드백입니다.');
    }

    // 피드백 중 사용자 권한 확인
    if (feedback.user.userId !== userId) {
      throw new UnauthorizedException('feedback 수정 권한이 없습니다.');
    }

    let filesJsonArray = [];

    // s3에 저장된 새로운 이미지들의 URL 생성
    if (
      editFeedbackDto.feedbackImage &&
      editFeedbackDto.feedbackImage.length > 0
    ) {
      const existingImages =
        await this.imageService.getImagesByFeedbackId(feedbackId);
      if (existingImages && existingImages.length > 0) {
        await Promise.all(
          existingImages.map(async (image) => {
            const url = new URL(image.imagePath);
            const fileName = url.pathname.split('/').slice(-3).join('/');
            await this.awsService.deleteImageFromS3(fileName);
          }),
        );
      }
    }

    // feedbackTarget 업데이트
    if (
      editFeedbackDto.feedbackTarget &&
      editFeedbackDto.feedbackTarget.length > 0
    ) {
      await this.feedbackTargetRepository.deleteFeedbackTarget(feedbackId);
      for (const target of editFeedbackDto.feedbackTarget) {
        let lectureId = target.lectureId;
        for (const userId of target.userIds) {
          await this.feedbackTargetRepository.createFeedbackTarget(
            feedbackId,
            lectureId,
            userId,
          );
        }
      }
    }

    // 피드백 업데이트
    return await this.feedbackRepository.updateFeedback(
      feedbackId,
      editFeedbackDto,
    );
  }

  /* feedback 삭제(softDelete) */
  async softDeleteFeedback(userId: number, feedbackId: number): Promise<void> {
    const feedback = await this.feedbackRepository.getFeedbackByPk(feedbackId);
    if (!feedback) {
      throw new NotFoundException('존재하지 않는 피드백입니다.');
    }
    if (feedback.user.userId !== userId) {
      throw new UnauthorizedException('feedback 수정 권한이 없습니다.');
    }

    // S3에서 이미지 삭제
    const existingImages =
      await this.imageService.getImagesByFeedbackId(feedbackId);
    if (existingImages && existingImages.length > 0) {
      await Promise.all(
        existingImages.map((image) => {
          const url = new URL(image.imagePath);
          const fileName = url.pathname.split('/').slice(-3).join('/');
          this.awsService.deleteImageFromS3(fileName);
        }),
      );
    }

    // 피드백 삭제
    await this.feedbackRepository.softDeleteFeedback(feedbackId);
  }
}
