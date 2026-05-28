import { ForbiddenException, HttpException } from '@nestjs/common';
import { Role } from 'src/users/entities/user.entity';

/**
 * Verifica por el payload del JWT si el usuario es ADMIN o DUEÑO
 * @param {string} idOwner - el id a verificar del dueño
 * @param {} userReq - payload decifrado del jwt, contiene ID, USERNAME y ROLE del user que manda la request
 * @returns {void | HttpException} si no es dueño y no es admin: ERROR 403, sino VOID
 */

export function ownerOrAdmin(
  idOwner: string,
  userReq: { id: string; username: string; role: string },
): void | HttpException {
  if (userReq.id !== idOwner && userReq.role !== (Role.ADMIN as string)) {
    throw new ForbiddenException('You can only access your own data');
  }
}
