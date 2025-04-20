import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

/**
 * Middleware for debugging authentication requests.
 * Logs request headers and checks for the presence of an Authorization header.
 */
@Injectable()
export class AuthDebugMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log('🔹 [Auth Debug Middleware] Request received.');
    console.log('🔹 Request headers:', req.headers);

    if (req.headers.authorization) {
      console.log('✅ Authorization Header found:', req.headers.authorization);
    } else {
      console.log('❌ Authorization Header NOT found!');
    }

    next();
  }
}
