import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
}
