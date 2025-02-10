/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */

import { Injectable, NestMiddleware } from '@nestjs/common';
import { isArray } from 'class-validator';
import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import { UserEntity } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';

declare global {
    namespace Express {
        interface Request {
            currentUser: UserEntity | null ;
        }
    }
    
}

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
    constructor(private readonly usersService: UsersService) {}
    async use(req: Request, res: Response, next: NextFunction) {
        const authHeader = req.headers.authorization || req.headers.Authorization;
        
        if (!authHeader || isArray(authHeader) || !authHeader.startsWith('Bearer ')) {
            return next();
        }
    
        try {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            const token = authHeader.split(' ')[1];
        if (!token) {
             throw new Error('Invalid authorization header');
        }
            const decoded = <JwtPayload> verify(token, process.env.JWT_SECRET + "");
            console.log("Decoded JWT:", decoded);

            if (!decoded || !decoded.id || isNaN(Number(decoded.id))) {
                return next(); 
            }
    
            const currentUser = await this.usersService.findOne(Number(decoded.id));
            req.currentUser = currentUser;
        } catch (error) {
            req.currentUser = null;
            console.error("JWT Verification Failed:", error);
        }
    
        next();
    }
    
}
interface JwtPayload {
    id: number;
  }