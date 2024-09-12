import { Injectable } from '@nestjs/common';
import { AwsService } from 'src/common/aws/aws.service';
import { FeedbackRepository } from './feedback.repository';
import { FeedbackTargetRepository } from './feedback-target.repository';
import { ImageService } from 'src/image/image.service';

@Injectable()
export class FeedbackService {
  constructor(
    private readonly awsService: AwsService,
    private readonly feedbackRepository: FeedbackRepository,
    private readonly feedbackTargetRepository: FeedbackTargetRepository,
    private readonly imageService: ImageService,
  ) {}
}
