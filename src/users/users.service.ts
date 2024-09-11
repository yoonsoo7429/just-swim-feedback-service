import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { Users } from './entity/users.entity';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  /* userId를 이용해 user 조회 */
  async findUserByPk(userId: number): Promise<Users> {
    const result = await this.usersRepository.findUserByPk(userId);
    if (!result) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }
    return result;
  }
}
