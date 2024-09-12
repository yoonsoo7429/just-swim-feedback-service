import { Injectable } from '@nestjs/common';
import { Instructor } from './entity/instructor.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class InstructorRepository {
  constructor(
    @InjectRepository(Instructor)
    private instructorRepository: Repository<Instructor>,
  ) {}

  /* userType을 instructor로 지정할 경우 instructor 정보 생성 */
  async createInstructor(userId: number): Promise<Instructor> {
    const instructor = new Instructor();
    instructor.user.userId = userId;
    await this.instructorRepository.save(instructor);

    return instructor;
  }

  /* instructor의 정보 조회 */
  async findInstructorByUserId(userId: number): Promise<Instructor> {
    const instructor = await this.instructorRepository.findOne({
      where: { user: { userId } },
      relations: ['user'],
    });

    return instructor;
  }
}
