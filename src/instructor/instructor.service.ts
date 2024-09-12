import { Injectable } from '@nestjs/common';
import { InstructorRepository } from './instructor.repository';
import { Instructor } from './entity/instructor.entity';

@Injectable()
export class InstructorService {
  constructor(private readonly instructorRepository: InstructorRepository) {}

  /* userType을 instructor로 지정할 경우 instructor 정보 생성 */
  async createInstructor(userId: number): Promise<Instructor> {
    return await this.instructorRepository.createInstructor(userId);
  }

  /* instructor의 정보 조회 */
  async findInstructorByUserId(userId: number): Promise<Instructor> {
    return await this.instructorRepository.findInstructorByUserId(userId);
  }
}
