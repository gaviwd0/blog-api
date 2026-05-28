import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtOptionalGuard extends AuthGuard('jwt') {
  handleRequest(err: any, user: any) {
    // Si no hay token, token inválido, o expiró → no falla, devuelve null
    if (err || !user) return null;
    return user;
  }
}
