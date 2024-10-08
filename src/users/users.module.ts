import { forwardRef, Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from './entity/users.entity';
import { UsersRepository } from './users.repository';
import { AuthModule } from 'src/auth/auth.module';
import { CustomerModule } from 'src/customer/customer.module';
import { InstructorModule } from 'src/instructor/instructor.module';
import { AwsModule } from 'src/common/aws/aws.module';
import { WithdrawalReasonModule } from 'src/withdrawal-reason/withdrawal-reason.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Users]),
    forwardRef(() => AuthModule),
    forwardRef(() => CustomerModule),
    forwardRef(() => InstructorModule),
    forwardRef(() => WithdrawalReasonModule),
    AwsModule,
  ],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository],
  exports: [UsersService, UsersRepository],
})
export class UsersModule {}
