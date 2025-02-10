
import { CanActivate, ExecutionContext, UnauthorizedException, mixin } from '@nestjs/common';

import { UserEntity } from 'src/users/entities/user.entity';
interface CustomRequest extends Request {
    currentUser: UserEntity;
  }

export const AuthorizeGuard = (allowedRoles:string[]) => {
    class RolesGuardMixin implements CanActivate{
    canActivate(context: ExecutionContext): boolean  {
        const request: CustomRequest = context.switchToHttp().getRequest();
        console.log("request ",request.currentUser.roles);
        const result = request.currentUser.roles.some((role:string) => allowedRoles.includes(role));
        if(result) return true;
        throw new UnauthorizedException('You are not authorized to access this route');
    }
    
}
const guard = mixin(RolesGuardMixin)
return guard;
} 

