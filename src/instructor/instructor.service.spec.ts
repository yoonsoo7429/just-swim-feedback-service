import { Test, TestingModule } from '@nestjs/testing';
import { InstructorService } from './instructor.service';
import { Instructor } from './entity/instructor.entity';
import { Users } from 'src/users/entity/users.entity';
import { InstructorRepository } from './instructor.repository';

export class MockInstructorRepository {
  readonly mockInstructor: Instructor = {
    instructorId: 1,
    user: new Users(),
    workingLocation: null,
    career: null,
    history: null,
    introduction: null,
    curriculum: null,
    youtubeLink: null,
    instagramLink: null,
    facebookLink: null,
    instructorCreatedAt: new Date(),
    instructorUpdatedAt: new Date(),
  };
}

describe('InstructorService', () => {
  let instructorService: InstructorService;
  let instructorRepository: InstructorRepository;

  const mockInstructor = new MockInstructorRepository().mockInstructor;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InstructorService,
        {
          provide: InstructorRepository,
          useValue: {
            createInstructor: jest.fn(),
            findInstructorByUserId: jest.fn(),
          },
        },
      ],
    }).compile();

    instructorService = module.get<InstructorService>(InstructorService);
    instructorRepository =
      module.get<InstructorRepository>(InstructorRepository);
  });

  it('should be defined', () => {
    expect(instructorService).toBeDefined();
  });
});
