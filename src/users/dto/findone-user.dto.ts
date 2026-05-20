import { Role } from '../entities/user.entity';

export class findoneOutUser {
  id!: string;

  username!: string;

  email!: string;

  bio?: string;

  imageProfile?: string;

  role?: Role;

  createdAt?: Date;

  updatedAt?: Date;

  deletedAt?: Date;
}
