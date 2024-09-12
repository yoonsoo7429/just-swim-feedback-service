import { Controller } from '@nestjs/common';
import { MemberService } from './member.service';
import { UsersService } from 'src/users/users.service';
import { ResponseService } from 'src/common/response/reponse.service';

@Controller('member')
export class MemberController {
  constructor(
    private readonly memberService: MemberService,
    private readonly usersService: UsersService,
    private readonly reponseService: ResponseService,
  ) {}
}
