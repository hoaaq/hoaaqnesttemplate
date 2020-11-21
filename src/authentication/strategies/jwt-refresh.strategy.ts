import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { jwtrefresh } from '@const';
import TokenPayload from '@interface/jwttokenpayload.interface';
import { UserService } from '../../user/user.service';

@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh-token',
) {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.body?.refresh_token;
        },
      ]),
      secretOrKey: jwtrefresh.secret,
      passReqToCallback: true,
    });
  }

  async validate(request: Request, payload: TokenPayload) {
    const refreshToken = request?.body?.refresh_token;
    return this.userService.getUserIfRefreshTokenMatches(
      refreshToken,
      payload.uid,
    );
  }
}
