import { Controller } from '@nestjs/common';
import { LectureService } from './lecture.service';
import { MemberService } from 'src/member/member.service';
import { ResponseService } from 'src/common/response/reponse.service';

@Controller('lecture')
export class LectureController {
  constructor(
    private readonly lectureService: LectureService,
    private readonly memberService: MemberService,
    private readonly responseService: ResponseService,
  ) {}
}
