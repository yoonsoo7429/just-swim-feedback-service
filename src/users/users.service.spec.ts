import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { UserType } from './enum/user-type.enum';
import { Users } from './entity/users.entity';
import { AwsService } from 'src/common/aws/aws.service';
import { UsersRepository } from './users.repository';
import { CustomerRepository } from 'src/customer/customer.repository';
import { InstructorRepository } from 'src/instructor/instructor.repository';
import { MockCustomerRepository } from 'src/customer/customer.service.spec';
import { MockInstructorRepository } from 'src/instructor/instructor.service.spec';
import { WithdrawalReasonService } from 'src/withdrawal-reason/withdrawal-reason.service';

export class MockUsersRepository {
  readonly mockUser: Users = {
    userId: 1,
    email: 'test@example.com',
    provider: 'kakao',
    name: '홍길동',
    birth: null,
    profileImage: 'old_profile_image_url',
    phoneNumber: null,
    userType: UserType.Customer,
    userCreatedAt: new Date(),
    userUpdatedAt: new Date(),
    userDeletedAt: null,
    customer: [],
    instructor: [],
    member: [],
    lecture: [],
    feedback: [],
    feedbackTarget: [],
    withdrawalReason: [],
  };
}

const mockCustomer = new MockCustomerRepository().mockCustomer;
const mockInstructor = new MockInstructorRepository().mockInstructor;

describe('UsersService', () => {
  let usersService: UsersService;
  let awsService: AwsService;
  let usersRepository: UsersRepository;
  let customerRepository: CustomerRepository;
  let instructorRepository: InstructorRepository;
  let withdrawalReasonService: WithdrawalReasonService;

  const mockUser = new MockUsersRepository().mockUser;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: AwsService,
          useValue: {
            uploadImageToS3: jest.fn(),
            deleteImageFromS3: jest.fn(),
          },
        },
        {
          provide: UsersRepository,
          useValue: {
            findUserByEmail: jest.fn().mockResolvedValue(mockUser),
            findUserByPk: jest.fn().mockResolvedValue(mockUser),
            createUser: jest.fn().mockResolvedValue(mockUser),
            selectUserType: jest.fn().mockResolvedValue(mockUser),
            editUserProfile: jest.fn().mockResolvedValue(mockUser),
            withdrawUser: jest.fn().mockResolvedValue(mockUser),
          },
        },
        {
          provide: CustomerRepository,
          useValue: {
            createCustomer: jest.fn().mockResolvedValue(mockCustomer),
            findCustomerByUserId: jest.fn().mockResolvedValue(mockCustomer),
          },
        },
        {
          provide: InstructorRepository,
          useValue: {
            createInstructor: jest.fn().mockResolvedValue(mockInstructor),
            findInstructorByUserId: jest.fn().mockResolvedValue(mockInstructor),
          },
        },
        {
          provide: WithdrawalReasonService,
          useValue: {
            createWithdrawalReason: jest.fn(),
          },
        },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    awsService = module.get<AwsService>(AwsService);
    usersRepository = module.get<UsersRepository>(UsersRepository);
    customerRepository = module.get<CustomerRepository>(CustomerRepository);
    instructorRepository =
      module.get<InstructorRepository>(InstructorRepository);
    withdrawalReasonService = module.get<WithdrawalReasonService>(
      WithdrawalReasonService,
    );
  });

  it('should be defined', () => {
    expect(usersService).toBeDefined();
  });
});
