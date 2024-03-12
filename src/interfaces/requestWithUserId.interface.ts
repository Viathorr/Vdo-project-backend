import { Request } from 'express';

/**
 * Represents a client request with the ID of the user.
 */
interface RequestWithUserId extends Request {
  /**
   * The ID of the user associated with the request, parsed from a JWT token.
   */
  id: number;
}

export default RequestWithUserId;