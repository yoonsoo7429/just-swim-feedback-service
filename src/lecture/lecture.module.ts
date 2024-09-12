import { forwardRef, Module } from '@nestjs/common';
import { LectureController } from './lecture.controller';
import { LectureService } from './lecture.service';
import { Lecture } from './entity/lecture.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MemberModule } from 'src/member/member.module';
import { AwsModule } from 'src/common/aws/aws.module';
import { LectureRepository } from './lecture.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([Lecture]),
    forwardRef(() => MemberModule),
    forwardRef(() => AwsModule),
  ],
  controllers: [LectureController],
  providers: [LectureService, LectureRepository],
  exports: [LectureService, LectureRepository],
})
export class LectureModule {}
