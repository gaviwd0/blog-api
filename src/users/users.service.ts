import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User, Role } from './entities/user.entity';
import { Repository } from 'typeorm';
import { findoneOutUser } from './dto/findone-user.dto';
import { findAllUserDto } from './dto/findall-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<object | HttpException> {
    const existUser: [User[], number] | undefined =
      await this.usersRepository.findAndCount({
        where: [
          { username: createUserDto.username },
          { email: createUserDto.email },
        ],
      });

    //verificamos si el usuario ya existe
    if (existUser[1] != 0)
      throw new HttpException(
        'User unique credentials already exists',
        HttpStatus.CONFLICT,
      );

    //creamos el usuario
    const newUser = this.usersRepository.create(createUserDto);

    //guardamos el usuario
    await this.usersRepository.save(newUser);

    return {
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
      role: newUser.role,
    };
  }

  async findAll(query: findAllUserDto): Promise<object | HttpException> {
    let { page, limit } = query;
    const { username, email, role } = query;
    if (!page) page = 1;
    if (!limit) limit = 10;

    const qb = this.usersRepository.createQueryBuilder('user');

    qb.select([
      'user.id',
      'user.username',
      'user.email',
      'user.bio',
      'user.imageProfile',
      'user.role',
      'user.createdAt',
      'user.updatedAt',
      'user.deletedAt',
    ]).where('user.deletedAt IS NULL');

    if (username) {
      qb.andWhere('user.username ILIKE :username', {
        username: `%${username}%`,
      });
    }

    if (email) {
      qb.andWhere('user.email ILIKE :email', {
        email: `%${email}%`,
      });
    }

    if (role) {
      qb.andWhere('user.role = :role', {
        role: role,
      });
    }
    qb.orderBy('user.username', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    const [data, total] = await qb.getManyAndCount();

    return {
      data,
      meta: {
        total,
        page,
        limit,
        lastPage: Math.ceil(total / limit),
      },
    };
  }

  //usar solamente para datos privados
  async findOne(id: string): Promise<findoneOutUser | HttpException> {
    const user = await this.usersRepository.findOneBy({
      id: id,
      deletedAt: undefined,
    });
    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);

    return {
      id: user.id,
      username: user.username,
      email: user.email,
      bio: user.bio,
      imageProfile: user.imageProfile,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      deletedAt: user.deletedAt,
    };
  }

  //usar query builder
  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.usersRepository.findOne({
      where: {
        id: id,
        deletedAt: undefined,
      },
    });
    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);

    const qb = this.usersRepository.createQueryBuilder('user');

    qb.select([
      'user.id',
      'user.username',
      'user.email',
      'user.bio',
      'user.imageProfile',
      'user.role',
      'user.createdAt',
      'user.updatedAt',
      'user.deletedAt',
    ]).where('user.id != :id', {
      id: id,
    });
    if (updateUserDto.username) {
      qb.andWhere('user.username ILIKE :username', {
        username: `%${updateUserDto.username}%`,
      });
    }

    if (updateUserDto.email) {
      qb.andWhere('user.email ILIKE :email', {
        email: `%${updateUserDto.email}%`,
      });
    }
    qb.orderBy('user.username', 'DESC');
    const getone = await qb.getOne();
    if (getone)
      throw new HttpException(
        'User unique credentials already exists',
        HttpStatus.CONFLICT,
      );

    const upUser = this.usersRepository.merge(user, updateUserDto);

    await this.usersRepository.save(upUser);

    return {
      id: upUser.id,
      username: upUser.username,
      email: upUser.email,
      bio: upUser.bio,
      imageProfile: upUser.imageProfile,
      role: upUser.role,
      createdAt: upUser.createdAt,
      updatedAt: upUser.updatedAt,
      deletedAt: upUser.deletedAt,
    };
  }

  async remove(id: string): Promise<object | HttpException> {
    const user = await this.usersRepository.findOneBy({
      id: id,
      deletedAt: undefined,
    });

    if (!user)
      throw new HttpException('User ID not found', HttpStatus.NOT_FOUND);

    await this.usersRepository.softDelete(id);

    return { id: id };
  }

  async asingRole(id: string, role: Role): Promise<Role | HttpException> {
    const existUserId = await this.usersRepository.findOneBy({
      id: id,
    });

    if (!existUserId) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    if (existUserId.role == role) {
      return existUserId.role;
    }

    await this.usersRepository.update(id, { role: role });

    await this.usersRepository.save(existUserId);

    return existUserId.role;
  }
}
