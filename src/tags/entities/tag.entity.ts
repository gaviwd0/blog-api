import { Post } from 'src/posts/entities/post.entity';
import {
  Column,
  DeleteDateColumn,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Tag {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  name!: string;

  @ManyToMany(() => Post, (post) => post.tags, { onDelete: 'SET NULL' })
  posts!: Post[];

  @DeleteDateColumn()
  deletedAt!: Date;
}
