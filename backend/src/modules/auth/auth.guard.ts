import { Injectable } from '@nestjs/common';
import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import * as jwt from 'jsonwebtoken';
import { HttpException, HttpStatus } from '@nestjs/common';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.get('Authorization');

    if (!authHeader) {
      throw new HttpException('No Authenticated', HttpStatus.UNAUTHORIZED);
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      throw new HttpException('No Authenticated', HttpStatus.UNAUTHORIZED);
    }

    try {
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
      request.user = {
        userId: decodedToken.userId,
        role: decodedToken.role,
      };
      return true;
    } catch (error) {
      throw new HttpException(
        'Your session has expired. Please log in again.',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }
}
