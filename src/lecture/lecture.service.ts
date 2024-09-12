import { Injectable } from '@nestjs/common';
import { AwsService } from 'src/common/aws/aws.service';
import { LectureRepository } from './lecture.repository';

@Injectable()
export class LectureService {
  constructor(
    private readonly awsService: AwsService,
    private readonly lectureRepository: LectureRepository,
  ) {}
}
