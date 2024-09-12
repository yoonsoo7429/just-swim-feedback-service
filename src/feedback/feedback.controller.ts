import { Controller } from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { ResponseService } from 'src/common/response/reponse.service';

@Controller('feedback')
export class FeedbackController {
  constructor(
    private readonly feedbackService: FeedbackService,
    private readonly responseService: ResponseService,
  ) {}
}
