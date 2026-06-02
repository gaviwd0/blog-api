import {
  ForbiddenException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post, Status } from './entities/post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Role } from 'src/users/entities/user.entity';
import { findAllPostDto } from './dto/findall-post.dto';
import { ownerOrAdmin } from 'src/common/utils/authorization.utils';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private readonly postsRepository: Repository<Post>,
  ) {}

  async create(
    createPostDto: CreatePostDto,
    userReq: { id: string; username: string; role: string },
  ): Promise<Post> {
    const post = this.postsRepository.create({
      ...createPostDto,
      userOwner: { id: userReq.id },
    });

    return this.postsRepository.save(post);
  }

  async findAll(
    query: findAllPostDto,
    userId?: string,
    role?: string,
  ): Promise<Post[]> {
    const { page = 1, limit = 10, title } = query;

    const qb = this.postsRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.userOwner', 'user')
      .leftJoinAndSelect('post.tags', 'tag')
      .select(['post', 'user.id', 'user.username', 'user.imageProfile', 'tag']);

    if (role === Role.ADMIN) {
      // Admin: ve todo excepto soft-deleteados
      qb.where('post.deletedAt IS NULL');
    } else if (userId) {
      // Owner: ve públicos + sus propios privados
      qb.where(
        '(post.status = :publicStatus AND post.deletedAt IS NULL) OR (post.userOwnerId = :ownerId AND post.deletedAt IS NULL)',
        { publicStatus: Status.PUBLISH, ownerId: userId },
      );
    } else {
      // Sin auth: solo públicos
      qb.where('post.status = :status AND post.deletedAt IS NULL', {
        status: Status.PUBLISH,
      });
    }

    // Filtro opcional por título
    if (title) {
      qb.andWhere('post.title ILIKE :title', { title: `%${title}%` });
    }

    // Paginación
    qb.skip((page - 1) * limit).take(limit);

    return qb.getMany();
  }

  async findOne(
    id: number,
    userReq?: { id: string; username: string; role: string },
  ): Promise<Post | HttpException> {
    const post = await this.postsRepository.findOne({
      where: { id },
      relations: ['userOwner'],
    });
    // si hay post
    if (!post) throw new NotFoundException('Post not found or not available');
    if (post) {
      //si es owner o admin le da cualquier estado de post
      if (userReq?.id == post.userOwner.id || userReq?.role == Role.ADMIN) {
        return post;
      }
      //si no esta logeado y no esta publico da error
      if (post.status != Status.PUBLISH && !userReq) {
        throw new ForbiddenException('Post not available');
      }
    }

    return post;
  }

  async update(
    id: number,
    updatePostDto: UpdatePostDto,
    userReq: { id: string; username: string; role: string },
  ): Promise<Post | HttpException> {
    const post = await this.postsRepository.findOne({
      where: { id },
      relations: ['userOwner'],
    });

    if (!post) throw new NotFoundException('Post not found');

    //verificamos que sea owner o admin
    ownerOrAdmin(post.userOwner.id, userReq);

    const updated = this.postsRepository.merge(post, updatePostDto);
    return this.postsRepository.save(updated);
  }

  async remove(
    id: number,
    userReq: { id: string; username: string; role: string },
  ): Promise<object | HttpException> {
    const post = await this.postsRepository.findOne({
      where: { id },
      relations: ['userOwner'],
    });

    if (!post) throw new NotFoundException('Post not found');
    //verificamos que sea owner o admin
    ownerOrAdmin(post.userOwner.id, userReq);

    await this.postsRepository.softDelete(id);
    return { id };
  }
}
