import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from './entity/users.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(Users) private usersRepository: Repository<Users>,
  ) {}

  /* userId를 이용해서 user 조회 */
  async findUserByPk(userId: number): Promise<Users> {
    const user = await this.usersRepository.findOne({ where: { userId } });
    return user;
  }
}
