import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Lecture } from './entity/lecture.entity';
import { Repository, UpdateResult } from 'typeorm';
import { EditLectureDto } from './dto/edit-lecture.dto';
import { LectureDto } from './dto/lecture.dto';

Injectable();
export class LectureRepository {
  constructor(
    @InjectRepository(Lecture)
    private readonly lectureRepository: Repository<Lecture>,
  ) {}

  /* 스케줄 - 강사용 강의 조회 (lectureDeletedAt is null) */
  async getScheduleLecturesByInstructor(userId: number): Promise<Lecture[]> {
    return await this.lectureRepository.find({
      where: { user: { userId }, lectureDeletedAt: null },
      relations: ['member', 'member.user'],
    });
  }

  /* 강사 모든 강의 조회 */
  async getAllLecturesByInstructor(userId: number): Promise<Lecture[]> {
    return await this.lectureRepository.find({
      where: { user: { userId } },
      relations: ['member', 'member.user'],
    });
  }

  /* 수강생 강의 조회 */
  async getScheduleLecturesByCustomer(userId: number): Promise<any[]> {
    return await this.lectureRepository.find({
      where: { member: { user: { userId } }, lectureDeletedAt: null },
      relations: ['user'],
    });
  }

  /* 수강생 모든 강의 조회 */
  async getAllLecturesByCustomer(userId: number): Promise<Lecture[]> {
    return await this.lectureRepository.find({
      where: { member: { user: { userId } } },
      relations: ['user'],
    });
  }

  /* 강의 상세 조회 */
  async getLectureByPk(lectureId: number): Promise<Lecture> {
    return await this.lectureRepository.findOne({
      where: { lectureId },
      relations: ['user', 'member', 'member.user'],
    });
  }

  /* 강의 수정 */
  async updateLecture(
    lectureId: number,
    editLectureDto: EditLectureDto,
  ): Promise<UpdateResult> {
    const {
      lectureTitle,
      lectureContent,
      lectureTime,
      lectureDays,
      lectureColor,
      lectureQRCode,
      lectureLocation,
      lectureEndDate,
    } = editLectureDto;

    return await this.lectureRepository.update(
      { lectureId },
      {
        lectureTitle,
        lectureContent,
        lectureTime,
        lectureDays,
        lectureColor,
        lectureQRCode,
        lectureLocation,
        lectureEndDate,
      },
    );
  }

  /* 강의 삭제(softDelete) */
  async softDeleteLecture(lectureId: number): Promise<UpdateResult> {
    return await this.lectureRepository.update(
      { lectureId },
      { lectureDeletedAt: new Date() },
    );
  }

  /* 강의 생성 */
  async createLecture(
    userId: number,
    lectureDto: LectureDto,
  ): Promise<Lecture> {
    const {
      lectureTitle,
      lectureContent,
      lectureTime,
      lectureDays,
      lectureColor,
      lectureLocation,
      lectureQRCode,
      lectureEndDate,
    } = lectureDto;

    const lecture = this.lectureRepository.create({
      user: { userId },
      lectureTitle,
      lectureContent,
      lectureTime,
      lectureDays,
      lectureColor,
      lectureLocation,
      lectureQRCode,
      lectureEndDate,
    });
    await this.lectureRepository.save(lecture);
    return lecture;
  }

  /* 강의 QR 코드 생성 */
  async saveQRCode(
    lectureId: number,
    lectureQRCode: string,
  ): Promise<UpdateResult> {
    return await this.lectureRepository.update(
      { lectureId },
      { lectureQRCode },
    );
  }

  /* 강의 권한 확인을 위한 조회 */
  async getLectureForAuth(lectureId: number): Promise<Lecture> {
    return await this.lectureRepository.findOne({ where: { lectureId } });
  }
}
