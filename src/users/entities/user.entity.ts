import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Post } from '../../posts/entities/post.entity';

export enum Role {
  ADMIN = 'admin',
  OCURRENT = 'ocurrent',
  NORMAL = 'normal',
  OVNI = 'ovni',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  username!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @Column()
  imageProfile!: string;

  @Column()
  bio!: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.NORMAL,
  })
  role!: Role;

  @OneToMany(() => Post, (post) => post.userOwner)
  posts!: Post[];
}
