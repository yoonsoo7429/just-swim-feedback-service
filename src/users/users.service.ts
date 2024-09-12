import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { Users } from './entity/users.entity';
import { UsersDto } from './dto/users.dto';
import { UserType } from './enum/user-type.enum';
import { CustomerRepository } from 'src/customer/customer.repository';
import { InstructorRepository } from 'src/instructor/instructor.repository';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly customerRepository: CustomerRepository,
    private readonly instructorRepository: InstructorRepository,
  ) {}

  /* user 생성 */
  async createUser(userData: UsersDto): Promise<Users> {
    return await this.usersRepository.createUser(userData);
  }

  /* email, provider를 이용해서 user 조회 */
  async findUserByEmail(
    email: string,
    provider: string,
  ): Promise<Users | undefined> {
    return await this.usersRepository.findUserByEmail(email, provider);
  }

  /* userId를 이용해 user 조회 */
  async findUserByPk(userId: number): Promise<Users> {
    const result = await this.usersRepository.findUserByPk(userId);
    if (!result) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }
    return result;
  }

  /* user의 userType 지정 */
  async selectUserType(userId: number, userType: UserType): Promise<void> {
    const user = await this.usersRepository.findUserByPk(userId);
    if (user.userType !== null) {
      throw new NotAcceptableException('계정에 타입이 이미 지정되어 있습니다.');
    }
    // userType 지정
    await this.usersRepository.selectUserType(userId, userType);
    // 각 테이블에 맞게 생성
    if (userType === UserType.Customer) {
      await this.customerRepository.createCustomer(userId);
    }
    if (userType === UserType.Instructor) {
      await this.instructorRepository.createInstructor(userId);
    }
  }
}
