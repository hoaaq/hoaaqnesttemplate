import { Request } from 'express';
import { user } from '@entity/user';

interface RequestWithUser extends Request {
  user: user;
}

export default RequestWithUser;
