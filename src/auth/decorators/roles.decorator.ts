import { SetMetadata } from '@nestjs/common';

// Esta clave la usan TANTO el decorador como el guard
// Por eso la exportamos como constante
export const ROLES_KEY = 'roles';

// Rest params (...) permite pasar varios roles: @Roles('admin', 'ocurrent')
// SetMetadata guarda el array como metadata del handler
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
