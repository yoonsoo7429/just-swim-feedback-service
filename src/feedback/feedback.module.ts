import { forwardRef, Module } from '@nestjs/common';
import { FeedbackController } from './feedback.controller';
import { FeedbackService } from './feedback.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Feedback } from './entity/feedback.entity';
import { FeedbackTarget } from './entity/feedback-target.entity';
import { AwsModule } from 'src/common/aws/aws.module';
import { ImageModule } from 'src/image/image.module';
import { FeedbackRepository } from './feedback.repository';
import { FeedbackTargetRepository } from './feedback-target.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([Feedback, FeedbackTarget]),
    AwsModule,
    forwardRef(() => ImageModule),
  ],
  controllers: [FeedbackController],
  providers: [FeedbackService, FeedbackRepository, FeedbackTargetRepository],
  exports: [FeedbackService, FeedbackRepository, FeedbackTargetRepository],
})
export class FeedbackModule {}
