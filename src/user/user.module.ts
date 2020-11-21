import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserService } from './user.service';
import { UserController } from './user.controller';
import { user } from '@entity/user';
import { AuthenticationModule } from '@auth/authentication.module';

@Module({
  imports: [TypeOrmModule.forFeature([user]), AuthenticationModule],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
