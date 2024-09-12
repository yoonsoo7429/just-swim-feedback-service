import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from './entity/users.entity';
import { Repository, UpdateResult } from 'typeorm';
import { UsersDto } from './dto/users.dto';
import { UserType } from './enum/user-type.enum';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(Users) private usersRepository: Repository<Users>,
  ) {}

  /* email, provider를 이용해 user 조회 */
  async findUserByEmail(
    email: string,
    provider: string,
  ): Promise<Users | undefined> {
    const user = await this.usersRepository.findOne({
      where: { email, provider },
    });

    return user;
  }

  /* user 생성 */
  async createUser(userData: UsersDto): Promise<Users> {
    const { email, profileImage, name, provider, birth, phoneNumber } =
      userData;

    const user = new Users();
    user.email = email;
    user.profileImage = profileImage;
    user.name = name;
    user.provider = provider;
    user.birth = birth;
    user.phoneNumber = phoneNumber;
    await this.usersRepository.save(user);

    return user;
  }

  /* userId를 이용해서 user 조회 */
  async findUserByPk(userId: number): Promise<Users> {
    const user = await this.usersRepository.findOne({ where: { userId } });
    return user;
  }

  /* userType을 지정 */
  async selectUserType(
    userId: number,
    userType: UserType,
  ): Promise<UpdateResult> {
    return await this.usersRepository.update({ userId }, { userType });
  }
}
