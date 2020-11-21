import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthenticationService } from '../authentication.service';
import { user } from '@entity/user';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authenticationService: AuthenticationService) {
    super({
      usernameField: 'username',
    });
  }
  async validate(username: string, password: string): Promise<user> {
    return this.authenticationService.getAuthenticatedUser(username, password);
  }
}
