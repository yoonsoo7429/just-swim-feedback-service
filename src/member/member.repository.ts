import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Member } from './entity/member.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MemberRepository {
  constructor(
    @InjectRepository(Member)
    private readonly memberRepository: Repository<Member>,
  ) {}

  /* QR코드를 통한 회원 등록 */
  async insertMemberFromQR(userId: number, lectureId: number): Promise<Member> {
    const member = this.memberRepository.create({
      user: { userId },
      lecture: { lectureId },
    });
    await this.memberRepository.save(member);
    return member;
  }

  /* 강의에 해당하는 member 조회 */
  async getAllMembersByLectureId(lectureId: number): Promise<Member[]> {
    return await this.memberRepository.find({
      where: { lecture: { lectureId } },
      relations: ['user', 'lecture'],
    });
  }

  /* instructor가 피드백 작성 시 강의를 듣고 있는 member 조회 */
  async getAllMembersByFeedback(userId: number): Promise<Member[]> {
    return await this.memberRepository.find({
      where: { lecture: { user: { userId } } },
      relations: ['lecture', 'user'],
    });
  }

  /* instructor가 강의 상세 조회 때 수강생의 강의에 대한 정보 조회 */
  async getMemberInfo(
    memberUserId: number,
    instructorUserId: number,
  ): Promise<Member> {
    return await this.memberRepository
      .createQueryBuilder('member')
      .leftJoinAndSelect('member.user', 'user') // 회원의 유저 정보 조인
      .leftJoinAndSelect('member.lecture', 'lecture') // 회원의 강의 정보 조인
      .leftJoin(
        'feedbackTarget',
        'feedbackTarget',
        'feedbackTarget.userId = member.userId',
      ) // feedbackTarget 조인
      .leftJoin(
        (qb) =>
          qb
            .select([
              'feedback.feedbackId AS feedbackId',
              'feedback.feedbackDate AS feedbackDate',
              'feedback.feedbackType AS feedbackType',
              'feedback.feedbackContent AS feedbackContent',
              'feedbackTarget.userId AS userId',
            ])
            .from('feedback', 'feedback')
            .innerJoin('feedback.feedbackTarget', 'feedbackTarget')
            .where('feedbackTarget.userId = :memberUserId', { memberUserId })
            .andWhere('feedback.userId = :instructorUserId', {
              instructorUserId,
            })
            .orderBy('feedback.feedbackDate', 'DESC')
            .limit(1),
        'feedback',
        'feedback.userId = member.userId',
      ) // feedback 서브쿼리 조인
      .leftJoin(
        (qb) =>
          qb
            .select([
              'image.imageId AS imageId',
              'image.feedbackId AS feedbackId',
              'image.imagePath AS imagePath',
            ])
            .from('image', 'image')
            .innerJoin(
              'feedback',
              'feedback',
              'image.feedbackId = feedback.feedbackId',
            )
            .where(
              'feedback.feedbackId IN (SELECT feedbackId FROM feedbackTarget WHERE userId = :memberUserId)',
              { memberUserId },
            )
            .orderBy('image.imageId', 'DESC'),
        'image',
        'image.feedbackId = feedback.feedbackId',
      ) // image 서브쿼리 조인
      .where('member.userId = :memberUserId', { memberUserId })
      .getOne();
  }
}
