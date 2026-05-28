import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // 1. Lee los roles definidos con @Roles() en el handler
    // getAllAndOverride busca en: handler → controller → global
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    // 2. Si NO se usó @Roles(), no restringe → deja pasar
    if (!requiredRoles) return true;

    // 3. Si se usó @Roles(), agarramos el user del token (JwtStrategy ya lo dejó en req.user)
    const { role } = context.switchToHttp().getRequest().user;

    // 4. Verificamos si el role del use<r está en los roles permitidos
    const hasRole = requiredRoles.includes(role);

    // 5. Si no tiene el role, lanzamos 403
    if (!hasRole) throw new ForbiddenException('Insufficient permissions');

    return true;
  }
}
