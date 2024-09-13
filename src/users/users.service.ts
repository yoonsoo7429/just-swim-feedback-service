import {
  Injectable,
  InternalServerErrorException,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { Users } from './entity/users.entity';
import { UsersDto } from './dto/users.dto';
import { UserType } from './enum/user-type.enum';
import { CustomerRepository } from 'src/customer/customer.repository';
import { InstructorRepository } from 'src/instructor/instructor.repository';
import slugify from 'slugify';
import { EditProfileImageDto } from 'src/image/dto/edit-profile-image.dto';
import { AwsService } from 'src/common/aws/aws.service';
import { EditUserDto } from './dto/edit-user.dto';
import { WithdrawalReasonDto } from 'src/withdrawal-reason/dto/withdrawal-reason.dto';
import { WithdrawalReasonService } from 'src/withdrawal-reason/withdrawal-reason.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly awsService: AwsService,
    private readonly usersRepository: UsersRepository,
    private readonly customerRepository: CustomerRepository,
    private readonly instructorRepository: InstructorRepository,
    private readonly withdrawalReasonService: WithdrawalReasonService,
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

  /* profileImage 업로드를 위한 presigned url 생성 */
  async generateProfileImagePresignedUrl(
    userId: number,
    editProfileImageDto: EditProfileImageDto,
  ): Promise<string> {
    const ext = editProfileImageDto.profileImage.split('.').pop();
    const originalNameWithoutExt = editProfileImageDto.profileImage
      .split('.')
      .slice(0, -1)
      .join('.'); // 확장자를 제외한 이름
    const slugifiedName = slugify(originalNameWithoutExt, {
      lower: true,
      strict: true,
    });
    const fileName = `profileImage/${Date.now().toString()}-${slugifiedName}.${ext}`;

    // presignedUrl 생성
    const presignedUrl = await this.awsService.getPresignedUrl(fileName, ext);

    return presignedUrl;
  }

  /* user 프로필 수정 */
  async editUserProfile(userId: number, editUserDto: EditUserDto) {
    const user = await this.usersRepository.findUserByPk(userId);

    if (!user) {
      throw new NotFoundException('해당 사용자를 찾을 수 없습니다.');
    }

    // profileImage를 수정할 경우
    if (editUserDto.profileImage) {
      // 기존 프로필 이미지가 있다면 삭제 준비
      const exProfileImage = user.profileImage ? user.profileImage : null;

      if (exProfileImage) {
        const fileName = user.profileImage.split('/').slice(-2).join('/');
        await this.awsService.deleteImageFromS3(fileName);
      }
    }
    const updateResult = await this.usersRepository.editUserProfile(
      userId,
      editUserDto,
    );
    if (updateResult.affected === 0) {
      throw new InternalServerErrorException('프로필 수정에 실패했습니다.');
    }
  }

  /* user 탈퇴 */
  async withdrawUser(
    userId: number,
    withdrawalReasonDto: WithdrawalReasonDto,
  ): Promise<void> {
    const updateResult = await this.usersRepository.withdrawUser(userId);

    if (updateResult.affected === 0) {
      throw new InternalServerErrorException('계정 탈퇴에 실패했습니다.');
    }

    await this.withdrawalReasonService.createWithdrawalReason(
      userId,
      withdrawalReasonDto,
    );
  }
}
