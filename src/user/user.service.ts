import { user } from '@entity/user';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import createuserdto from './dto/createuser.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(user)
    private userRespository: Repository<user>,
  ) {}

  async getbyid(uid: number) {
    const user = await this.userRespository.findOne({ id: uid });
    if (user) {
      return user;
    }
    throw new HttpException(
      'User with this id does not exist',
      HttpStatus.NOT_FOUND,
    );
  }

  async getbyusername(username: string) {
    const user = await this.userRespository.findOne({ username });
    if (user) {
      return user;
    }
    throw new HttpException(
      'User with this username does not exist',
      HttpStatus.NOT_FOUND,
    );
  }

  async setCurrentRefreshToken(refreshToken: string, userId: number) {
    const currentHashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.userRespository.update(userId, {
      jwttoken_refresh: currentHashedRefreshToken,
    });
  }

  async getUserIfRefreshTokenMatches(refreshToken: string, userId: number) {
    const user = await this.getbyid(userId);
    const isRefreshTokenMatching = await bcrypt.compare(
      refreshToken,
      user.jwttoken_refresh,
    );
    if (isRefreshTokenMatching) {
      return user;
    }
  }

  async removeRefreshToken(userId: number) {
    return this.userRespository.update(userId, {
      jwttoken_refresh: null,
    });
  }

  async create(userData: createuserdto) {
    const newUser = await this.userRespository.create(userData);
    await this.userRespository.save(newUser);
    return newUser;
  }
}
