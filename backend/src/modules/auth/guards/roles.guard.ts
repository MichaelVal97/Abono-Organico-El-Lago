import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { User } from '../entities/user.entity';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (!requiredRoles) {
            return true;
        }
        const { user } = context.switchToHttp().getRequest();

        // Allow specific emails to bypass role check
        const adminEmails = ['abonoellago@gmail.com', 'admin@gmail.com', 'stretch394@gmail.com'];
        if (adminEmails.includes(user.email)) {
            return true;
        }

        return requiredRoles.some((role) => user.role === role);
    }
}
