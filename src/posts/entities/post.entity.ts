import { Tag } from 'src/tags/entities/tag.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum Status {
  PUBLISH = 'publish',
  PRIVATE = 'private',
  DELETED = 'deleted',
}
@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @Column()
  content!: string;

  @Column({
    type: 'enum',
    enum: Status,
    default: Status.PUBLISH,
  })
  status!: Status;

  //Usuarios
  @ManyToOne(() => User, (user) => user.posts)
  userOwner!: User;
  //Tags
  @ManyToMany(() => Tag, (tag) => tag.posts, { onDelete: 'SET NULL' })
  @JoinTable()
  tags!: Tag[];

  @CreateDateColumn()
  createdAt!: Date;

  @DeleteDateColumn()
  deletedAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
