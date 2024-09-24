import { Controller, Get, Res } from '@nestjs/common';
import { LectureService } from './lecture.service';
import { MemberService } from 'src/member/member.service';
import { ResponseService } from 'src/common/response/reponse.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  getScheduleLecturesByCustomer,
  getScheuldeLecturesByInstructor,
} from './example/lecture-example';
import { Response } from 'express';

@ApiTags('Lecture')
@Controller('lecture')
export class LectureController {
  constructor(
    private readonly lectureService: LectureService,
    private readonly memberService: MemberService,
    private readonly responseService: ResponseService,
  ) {}

  /* 스케줄 - 강의 전체 조회(삭제된 강의는 제외) */
  @Get('schedule')
  @ApiOperation({
    summary: '스케줄러 - 진행 중인 나의 강의 조회',
    description: '스케줄러에 보여줄 진행 중인 나의 강의 조회',
  })
  @ApiResponse({
    status: 200,
    content: {
      'application/json': {
        examples: {
          getScheuldeLecturesByInstructor,
          getScheduleLecturesByCustomer,
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: '인증 실패' })
  @ApiResponse({ status: 500, description: '서버 오류' })
  @ApiBearerAuth('accessToken')
  async getLecturesForSchedule(@Res() res: Response) {
    const { userType, userId } = res.locals.user;

    // instructor 페이지
    if (userType === 'instructor') {
      const lectures =
        await this.lectureService.getScheduleLecturesByInstructor(userId);
      return this.responseService.success(
        res,
        '스케줄에 해당하는 강의 조회 성공',
        lectures,
      );
    }

    // customer 페이지
    if (userType === 'customer') {
      const lectures =
        await this.lectureService.getScheduleLecturesByCustomer(userId);
      return this.responseService.success(
        res,
        '스케줄에 해당하는 강의 조회 성공',
        lectures,
      );
    }
  }
}
