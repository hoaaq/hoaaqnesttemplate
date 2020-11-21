import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { jwt } from '@const';
import TokenPayload from '@interface/jwttokenpayload.interface';
import { UserService } from '../../user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.headers?.authorization
            .replace('Bearer ', '')
            .replace('bearer ', '');
        },
      ]),
      secretOrKey: jwt.secret,
    });
  }

  async validate(payload: TokenPayload) {
    return this.userService.getbyid(payload.uid);
  }
}
