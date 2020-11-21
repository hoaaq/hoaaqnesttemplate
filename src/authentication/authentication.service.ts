import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

import { jwtrefresh } from '@const';
import { PostgresErrorCode } from '@db/postgreserrorcode.enum';
import TokenPayload from '@interface/jwttokenpayload.interface';
import registerdto from './dto/register.dto';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly userservice: UserService,
    private readonly jwtservice: JwtService,
  ) {}

  public async register(registrationData: registerdto) {
    const hashedPassword = await bcrypt.hash(registrationData.password, 10);
    try {
      const createdUser = await this.userservice.create({
        ...registrationData,
        password: hashedPassword,
      });
      createdUser.password = undefined;
      return createdUser;
    } catch (error) {
      if (error?.code === PostgresErrorCode.UniqueViolation) {
        throw new HttpException(
          'User with that email already exists',
          HttpStatus.BAD_REQUEST,
        );
      }
      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async getAuthenticatedUser(
    username: string,
    plainTextPassword: string,
  ) {
    try {
      const user = await this.userservice.getbyusername(username);
      await this.verifyPassword(plainTextPassword, user.password);
      const payload: TokenPayload = { uid: user.id };
      user.jwttoken = this.getaccesstoken(payload);
      user.jwttoken_refresh = this.getrefreshtoken(payload);
      user.password = undefined;
      return user;
    } catch (error) {
      throw new HttpException(
        'Wrong credentials provided',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  public getaccesstoken(payload: TokenPayload) {
    return this.jwtservice.sign(payload);
  }

  public getrefreshtoken(payload: TokenPayload) {
    return this.jwtservice.sign(payload, {
      secret: jwtrefresh.secret,
      expiresIn: jwtrefresh.expirein,
    });
  }

  private async verifyPassword(
    plainTextPassword: string,
    hashedPassword: string,
  ) {
    const isPasswordMatching = await bcrypt.compare(
      plainTextPassword,
      hashedPassword,
    );
    if (!isPasswordMatching) {
      throw new HttpException(
        'Wrong credentials provided',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
