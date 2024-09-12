import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Customer } from './entity/customer.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CustomerRepository {
  constructor(
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
  ) {}

  /* userType을 customer로 지정할 경우 customer 정보 생성 */
  async createCustomer(userId: number): Promise<Customer> {
    const customer = new Customer();
    customer.user.userId = userId;
    await this.customerRepository.save(customer);

    return customer;
  }

  /* customer의 정보 조회 */
  async findCustomerByUserId(userId: number): Promise<Customer> {
    const customer = await this.customerRepository.findOne({
      where: { user: { userId } },
      relations: ['user'],
    });

    return customer;
  }
}
