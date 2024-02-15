import { Request } from 'express';

interface RequestWithUserId extends Request {
  id: number;
}

export default RequestWithUserId;