import { Test, TestingModule } from '@nestjs/testing';
import { CustomerService } from './customer.service';
import { Customer } from './entity/customer.entity';
import { Users } from 'src/users/entity/users.entity';
import { CustomerRepository } from './customer.repository';

export class MockCustomerRepository {
  readonly mockCustomer: Customer = {
    user: new Users(),
    customerId: 1,
    customerNickname: '홍길동',
    customerCreatedAt: new Date(),
    customerUpdatedAt: new Date(),
  };
}

describe('CustomerService', () => {
  let customerService: CustomerService;
  let custmoerRepository: CustomerRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomerService,
        {
          provide: CustomerRepository,
          useValue: {
            createCustomer: jest.fn(),
            findCustomerByUserId: jest.fn(),
          },
        },
      ],
    }).compile();

    customerService = module.get<CustomerService>(CustomerService);
    custmoerRepository = module.get<CustomerRepository>(CustomerRepository);
  });

  it('should be defined', () => {
    expect(customerService).toBeDefined();
  });
});
