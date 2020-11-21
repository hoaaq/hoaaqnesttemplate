import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import createuserdto from './dto/createuser.dto';
import RequestWithUser from '@interface/requestwithuser.interface';
import TokenPayload from '@interface/jwttokenpayload.interface';

import LocalAuthenticationGuard from '@auth/authentication.guard';
import JwtAuthenticationGuard from '@auth/jwt-authentication.guard';
import JwtRefreshGuard from '@auth/jwt-refresh.guard';
import { AuthenticationService } from '@auth/authentication.service';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(
    private readonly authservice: AuthenticationService,
    private readonly userservice: UserService,
  ) {}

  @Post('register')
  register(@Body() user: createuserdto) {
    return this.authservice.register(user);
  }

  @HttpCode(200)
  @UseGuards(LocalAuthenticationGuard)
  @Post('login')
  async logIn(@Req() request: RequestWithUser) {
    const user = request.user;
    const access_token = user.jwttoken;
    const refresh_token = user.jwttoken_refresh;
    this.userservice.setCurrentRefreshToken(refresh_token, user.id);
    user.password = undefined;
    user.jwttoken = undefined;
    user.jwttoken_refresh = undefined;
    return { user, access_token, refresh_token };
  }

  @UseGuards(JwtAuthenticationGuard)
  @Get('me')
  async me(@Req() request: RequestWithUser) {
    const user = request.user;
    user.password = undefined;
    return { user };
  }

  @HttpCode(200)
  @UseGuards(JwtRefreshGuard)
  @Post('refresh')
  async refresh(@Req() request: RequestWithUser) {
    const user = request.user;
    const payload: TokenPayload = { uid: user.id };
    const access_token = this.authservice.getaccesstoken(payload);
    return { user, access_token, refresh_token: user.jwttoken_refresh };
  }

  @HttpCode(200)
  @UseGuards(JwtAuthenticationGuard)
  @Post('logout')
  async logout(@Req() request: RequestWithUser) {
    const user = request.user;
    this.userservice.removeRefreshToken(user.id);
    return;
  }
}
