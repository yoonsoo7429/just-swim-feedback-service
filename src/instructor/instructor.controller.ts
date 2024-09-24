import { Controller } from '@nestjs/common';
import { InstructorService } from './instructor.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Instructor')
@Controller('instructor')
export class InstructorController {
  constructor(private readonly instructorService: InstructorService) {}
}
