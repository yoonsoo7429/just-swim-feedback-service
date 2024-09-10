import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserType } from '../enum/user-type.enum';
//   import { Customer } from 'src/customer/entity/customer.entity';
//   import { Instructor } from 'src/instructor/entity/instrutor.entity';
//   import { Lecture } from 'src/lecture/entity/lecture.entity';
//   import { Course } from 'src/course/entity/course.entity';

@Entity('users')
export class Users {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  userId: number;

  @Column({ type: 'enum', enum: UserType, nullable: true })
  userType: UserType;

  @Column({ type: 'varchar', nullable: true })
  provider: string;

  @Column({ type: 'varchar', nullable: true })
  email: string;

  @CreateDateColumn({ type: 'timestamp' })
  userCreatedAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  userUpdatedAt: Date;

  // @OneToMany(() => Customer, (customer) => customer.user)
  // customer: Customer[];

  // @OneToMany(() => Instructor, (instructor) => instructor.user)
  // instructor: Instructor[];

  // @OneToMany(() => Lecture, (lecture) => lecture.user)
  // lecture: Lecture[];

  // @OneToMany(() => Course, (course) => course.user)
  // course: Course[];
}
