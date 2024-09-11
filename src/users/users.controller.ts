import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { AuthService } from 'src/auth/auth.service';
import { ResponseService } from 'src/common/response/reponse.service';
import { GoogleAuthGuard } from 'src/auth/guard/google.guard';
import { Request, Response } from 'express';
import { NaverAuthGuard } from 'src/auth/guard/naver.guard';
import { UsersDto } from './dto/users.dto';
import { KakaoAuthGuard } from 'src/auth/guard/kakao.guard';

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
}
