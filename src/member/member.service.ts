import { Injectable, NotFoundException } from '@nestjs/common';
import { MemberRepository } from './member.repository';
import { Member } from './entity/member.entity';

@Injectable()
export class MemberService {
  constructor(private readonly memberRepository: MemberRepository) {}

  /* QR코드를 통한 회원 등록 */
  async insertMemberFromQR(userId: number, lectureId: number): Promise<Member> {
    return await this.memberRepository.insertMemberFromQR(userId, lectureId);
  }

  /* 강의에 해당하는 수강생 */
  async getAllMembersByLectureId(lectureId: number): Promise<Member[]> {
    return await this.memberRepository.getAllMembersByLectureId(lectureId);
  }

  /* instructor가 피드백 작성 시 강의를 듣고 있는 member 조회 */
  async getAllMembersByFeedback(userId: number): Promise<Member[]> {
    return await this.memberRepository.getAllMembersByFeedback(userId);
  }

  /* instructor가 강의 상세 조회 때 수강생의 강의에 대한 정보 조회 */
  async getMemberInfo(memberUserId: number, instructorUserId: number) {
    const memberData = await this.memberRepository.getMemberInfo(
      memberUserId,
      instructorUserId,
    );

    if (!memberData) {
      throw new NotFoundException('수강생 정보를 찾을 수 없습니다.');
    }

    return memberData;
  }
}
