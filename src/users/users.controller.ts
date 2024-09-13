import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { AuthService } from 'src/auth/auth.service';
import { ResponseService } from 'src/common/response/reponse.service';
import { GoogleAuthGuard } from 'src/auth/guard/google.guard';
import { Request, Response } from 'express';
import { NaverAuthGuard } from 'src/auth/guard/naver.guard';
import { UsersDto } from './dto/users.dto';
import { KakaoAuthGuard } from 'src/auth/guard/kakao.guard';
import { UserType } from './enum/user-type.enum';
import { EditProfileImageDto } from 'src/image/dto/edit-profile-image.dto';
import { EditUserDto } from './dto/edit-user.dto';
import { WithdrawalReasonDto } from 'src/withdrawal-reason/dto/withdrawal-reason.dto';

@ApiTags('Users')
@Controller()
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
    private readonly responseService: ResponseService,
  ) {}

  /* kakao 소셜 로그인 (Guard를 통해 접근) */
  @UseGuards(KakaoAuthGuard)
  @Get('Oauth/kakao')
  @ApiOperation({
    summary: 'Kakao login',
    description:
      'kakao 소셜 로그인 - 서버 주소에 엔드포인트를 붙이시면 사용 가능합니다.',
  })
  async kakaoLogin(): Promise<void> {
    return;
  }

  @UseGuards(KakaoAuthGuard)
  @Get('Oauth/kakao/callback')
  @ApiOperation({
    summary: 'Kakao callback',
    description: 'redirect를 통해 프론트 주소로 이동',
  })
  async kakaoCallback(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<void> {
    let profile: any = req.user;
    let provider: string = profile.provider;
    let name: string = profile._json.kakao_account.name;
    let email: string = profile._json.kakao_account.email;
    let profileImage: string = profile._json.properties.profile_image;
    // birth
    let birthYear: string = profile._json.kakao_account.birthyear;
    let birthDay: string = profile._json.kakao_account.birthday;
    let birth: string = `${birthYear}.${birthDay.substring(0, 2)}.${birthDay.substring(2)}`;
    // phoneNumber
    let phone_number: string = profile._json.kakao_account.phone_number;
    let cleanedNumber: string = phone_number.replace(/\D/g, '');
    let phoneNumber: string = `010-${cleanedNumber.substring(4, 8)}-${cleanedNumber.substring(8, 13)}`;

    const host = req.headers.host;

    const exUser = await this.authService.validateUser(email, provider);
    // user가 존재할 경우 로그인 시도
    if (exUser) {
      // // userType 지정되어 있지 않을 경우 userType을 선택하는 곳으로 redirect
      // if (exUser.userType === null) {
      //   const token = await this.authService.getToken(exUser.userId);
      //   const query = '?token=' + token;
      //   res.redirect(process.env.SELECT_USERTYPE_REDIRECT_URI + `/${query}`);
      // }
      // // userType 지정되어 있을 경우 Home으로 redirect
      // if (exUser.userType !== null) {
      //   const token = await this.authService.getToken(exUser.userId);
      //   const query = '?token=' + token;
      //   res.redirect(process.env.HOME_REDIRECT_URI + `/${query}`);
      // }
      const token = await this.authService.getToken(exUser.userId);
      const query = '?token=' + token;
      res.redirect(process.env.SELECT_USERTYPE_REDIRECT_URI + `/${query}`);
      // if (host.includes('localhost:3000')) {
      //   res.redirect(process.env.SELECT_USERTYPE_REDIRECT_URI + `/${query}`);
      // } else {
      //   res.redirect(
      //     process.env.SELECT_USERTYPE_PROD_REDIRECT_URI + `/${query}`,
      //   );
      // }
    }
    // user가 없을 경우 새로 생성 후에 userType 지정으로 redirect
    if (exUser === null) {
      const newUserData: UsersDto = {
        email,
        profileImage,
        name,
        provider,
        birth,
        phoneNumber,
      };
      const newUser = await this.authService.createUser(newUserData);
      const token = await this.authService.getToken(newUser.userId);
      const query = '?token=' + token;
      res.redirect(process.env.SELECT_USERTYPE_REDIRECT_URI + `/${query}`);
      // if (host.includes('localhost:3000')) {
      //   res.redirect(process.env.SELECT_USERTYPE_REDIRECT_URI + `/${query}`);
      // } else {
      //   res.redirect(
      //     process.env.SELECT_USERTYPE_PROD_REDIRECT_URI + `/${query}`,
      //   );
      // }
    }
  }

  /* naver 소셜 로그인 (Guard를 통해 접근) */
  @UseGuards(NaverAuthGuard)
  @Get('Oauth/naver')
  @ApiOperation({
    summary: 'Naver login',
    description:
      'naver 소셜 로그인 - 서버 주소에 엔드포인트를 붙이시면 사용 가능합니다.',
  })
  async naverLogin(): Promise<void> {
    return;
  }

  @UseGuards(NaverAuthGuard)
  @Get('Oauth/naver/callback')
  @ApiOperation({
    summary: 'Naver callback',
    description: 'redirect를 통해 프론트 주소로 이동',
  })
  async naverCallback(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<void> {
    let profile: any = req.user;
    let provider: string = profile.provider;
    let name: string = profile.name;
    let email: string = profile.email;
    let profileImage: string = profile.profileImage;
    // birth
    let birthYear: string = profile.birthYear;
    let birthDay: string = profile.birthday;
    let birth: string = `${birthYear}.${birthDay.substring(0, 2)}.${birthDay.substring(3)}`;
    // phoneNumber
    let phoneNumber: string = profile.mobile;

    const host = req.headers.host;

    const exUser = await this.authService.validateUser(email, provider);
    // user가 존재할 경우 로그인 시도
    if (exUser) {
      // // userType 지정되어 있지 않을 경우 userType을 선택하는 곳으로 redirect
      // if (exUser.userType === null) {
      //   const token = await this.authService.getToken(exUser.userId);
      //   const query = '?token=' + token;
      //   res.redirect(process.env.SELECT_USERTYPE_REDIRECT_URI + `/${query}`);
      // }
      // // userType 지정되어 있을 경우 Home으로 redirect
      // if (exUser.userType !== null) {
      //   const token = await this.authService.getToken(exUser.userId);
      //   const query = '?token=' + token;
      //   res.redirect(process.env.HOME_REDIRECT_URI + `/${query}`);
      // }
      const token = await this.authService.getToken(exUser.userId);
      const query = '?token=' + token;
      res.redirect(process.env.SELECT_USERTYPE_REDIRECT_URI + `/${query}`);
      // if (host.includes('localhost:3000')) {
      //   res.redirect(process.env.SELECT_USERTYPE_REDIRECT_URI + `/${query}`);
      // } else {
      //   res.redirect(
      //     process.env.SELECT_USERTYPE_PROD_REDIRECT_URI + `/${query}`,
      //   );
      // }
    }
    // user가 없을 경우 새로 생성 후에 userType 지정으로 redirect
    if (exUser === null) {
      const newUserData: UsersDto = {
        email,
        profileImage,
        name,
        provider,
        birth,
        phoneNumber,
      };
      const newUser = await this.authService.createUser(newUserData);
      const token = await this.authService.getToken(newUser.userId);
      const query = '?token=' + token;
      res.redirect(process.env.SELECT_USERTYPE_REDIRECT_URI + `/${query}`);
      // if (host.includes('localhost:3000')) {
      //   res.redirect(process.env.SELECT_USERTYPE_REDIRECT_URI + `/${query}`);
      // } else {
      //   res.redirect(
      //     process.env.SELECT_USERTYPE_PROD_REDIRECT_URI + `/${query}`,
      //   );
      // }
    }
  }

  /* google 소셜 로그인 (Guard를 통해 접근) */
  @UseGuards(GoogleAuthGuard)
  @Get('Oauth/google')
  @ApiOperation({
    summary: 'Google login',
    description:
      'google 소셜 로그인 - 서버 주소에 엔드포인트를 붙이시면 사용 가능합니다.',
  })
  async googleLogin(): Promise<void> {
    return;
  }

  @UseGuards(GoogleAuthGuard)
  @Get('Oauth/google/callback')
  @ApiOperation({
    summary: 'Google callback',
    description: 'redirect를 통해 프론트 주소로 이동',
  })
  async googleCallback(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<void> {
    let profile: any = req.user;
    let provider: string = profile.provider;
    let name: string = profile._json.name;
    let email: string = profile._json.email;
    let profileImage: string = profile._json.picture;

    const host = req.headers.host;

    const exUser = await this.authService.validateUser(email, provider);
    // user가 존재할 경우 로그인 시도
    if (exUser) {
      // // userType 지정되어 있지 않을 경우 userType을 선택하는 곳으로 redirect
      // if (exUser.userType === null) {
      //   const token = await this.authService.getToken(exUser.userId);
      //   const query = '?token=' + token;
      //   res.redirect(process.env.SELECT_USERTYPE_REDIRECT_URI + `/${query}`);
      // }
      // // userType 지정되어 있을 경우 Home으로 redirect
      // if (exUser.userType !== null) {
      //   const token = await this.authService.getToken(exUser.userId);
      //   const query = '?token=' + token;
      //   res.redirect(process.env.HOME_REDIRECT_URI + `/${query}`);
      // }
      const token = await this.authService.getToken(exUser.userId);
      const query = '?token=' + token;
      if (host.includes('localhost:3000')) {
        res.redirect(process.env.SELECT_USERTYPE_REDIRECT_URI + `/${query}`);
      } else {
        res.redirect(
          process.env.SELECT_USERTYPE_PROD_REDIRECT_URI + `/${query}`,
        );
      }
    }
    // user가 없을 경우 새로 생성 후에 userType 지정으로 redirect
    if (exUser === null) {
      const newUserData: UsersDto = {
        email,
        profileImage,
        name,
        provider,
      };
      const newUser = await this.authService.createUser(newUserData);
      const token = await this.authService.getToken(newUser.userId);
      const query = '?token=' + token;
      if (host.includes('localhost:3000')) {
        res.redirect(process.env.SELECT_USERTYPE_REDIRECT_URI + `/${query}`);
      } else {
        res.redirect(
          process.env.SELECT_USERTYPE_PROD_REDIRECT_URI + `/${query}`,
        );
      }
    }
  }

  /* 로그인 이후에 userType을 지정 */
  @Post('user/:userType')
  @ApiOperation({ summary: 'userType 선택' })
  @ApiParam({
    name: 'userType',
    description: 'userType을 지정해주세요.',
    enum: UserType,
    enumName: 'UserType',
  })
  @ApiResponse({ status: 200, description: 'userType 지정 완료' })
  @ApiResponse({ status: 400, description: 'userType을 지정해주세요' })
  @ApiResponse({ status: 500, description: '서버 오류' })
  @ApiBearerAuth('accessToken')
  async selectUserType(
    @Param('userType') userType: UserType,
    @Res() res: Response,
  ) {
    const { userId } = res.locals.user;

    // userType 기본 검사
    if (!Object.values(UserType).includes(userType)) {
      this.responseService.error(res, '올바른 userType을 지정해주세요.', 400);
    }

    await this.usersService.selectUserType(userId, userType);
    this.responseService.success(res, 'userType 지정 완료');
  }

  /* 나의 프로필 조회 */
  @Get('user/myProfile')
  @ApiOperation({ summary: '프로필 조회' })
  @ApiOkResponse({ type: UsersDto, description: '프로필 조회 성공' })
  @ApiResponse({ status: 500, description: '서버 오류' })
  @ApiBearerAuth('accessToken')
  async findUserProfile(@Res() res: Response) {
    const { userId } = res.locals.user;
    const userProfile = await this.usersService.findUserByPk(userId);

    this.responseService.success(res, '프로필 조회 성공', userProfile);
  }

  /* profileImage presigned url */
  @Post('user/profileImage/presignedUrl')
  @ApiOperation({
    summary: 'profileImage에 대해서 presigned url을 보내준다.',
    description: 'profileImage 저장 요청 시 presigned url을 보내준다.',
  })
  @ApiBearerAuth('accessToken')
  async getPresignedUrlForProfileImage(
    @Res() res: Response,
    @Body() editProfileImageDto: EditProfileImageDto,
  ) {
    const { userId } = res.locals.user;

    const presignedUrl =
      await this.usersService.generateProfileImagePresignedUrl(
        userId,
        editProfileImageDto,
      );

    this.responseService.success(
      res,
      'profileImage presigned url 생성 완료',
      presignedUrl,
    );
  }

  /* 프로필 수정 */
  @Patch('user/edit')
  @ApiOperation({
    summary: '유저 프로필 수정',
    description: 'user의 프로필 수정을 한다.',
  })
  @ApiBody({
    description: '프로필 수정에 필요한 정보를 받는다.',
    type: EditUserDto,
  })
  @ApiResponse({ status: 200, description: '프로필 수정 완료' })
  @ApiResponse({ status: 400, description: '프로필을 수정할 수 없습니다.' })
  @ApiResponse({ status: 500, description: '서버 오류' })
  @ApiBearerAuth('accessToken')
  async editUserProfile(
    @Body() editUserDto: EditUserDto,
    @Res() res: Response,
  ) {
    const { userId } = res.locals.user;

    await this.usersService.editUserProfile(userId, editUserDto);

    this.responseService.success(res, '프로필 수정 완료');
  }

  /* 로그아웃 */
  @Post('logout')
  @ApiOperation({ summary: '로그 아웃' })
  @ApiResponse({ status: 200, description: '로그아웃 완료' })
  @ApiResponse({ status: 500, description: '서버 오류' })
  @ApiBearerAuth('accessToken')
  async logout(@Res() res: Response) {
    res.clearCookie('authorization');
    this.responseService.success(res, 'logout 완료');
  }

  /* 회원 탈퇴 */
  @Delete('user/withdraw')
  @ApiOperation({
    summary: '회원 탈퇴',
    description: '회원 탈퇴 시 사유를 저장하게 된다.',
  })
  @ApiBody({ description: '탈퇴 사유', type: WithdrawalReasonDto })
  @ApiResponse({ status: 200, description: '회원 탈퇴 완료' })
  @ApiResponse({ status: 500, description: '서버 오류' })
  @ApiBearerAuth('accessToken')
  async withdrawUser(
    @Res() res: Response,
    @Body() withdrawalReasonDto: WithdrawalReasonDto,
  ) {
    const { userId } = res.locals.user;
    await this.usersService.withdrawUser(userId, withdrawalReasonDto);
    res.clearCookie('authorization');
    this.responseService.success(res, '회원 탈퇴 완료');
  }
}
