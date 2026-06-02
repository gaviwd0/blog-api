import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Tag } from './entities/tag.entity';
import { Repository } from 'typeorm';
import { findAllTagsDto } from './dto/findall-tag.dto';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(Tag)
    private readonly tagsRepository: Repository<Tag>,
  ) {}

  async create(createTagDto: CreateTagDto): Promise<Tag | HttpException> {
    const existTag = await this.tagsRepository.findOne({
      where: { name: createTagDto.name, deletedAt: undefined },
    });

    if (existTag)
      throw new HttpException('name tag already exist', HttpStatus.CONFLICT);
    const tag = this.tagsRepository.create(createTagDto);
    await this.tagsRepository.save(tag);

    return tag;
  }

  async findAll(dto: findAllTagsDto) {
    let { page, limit } = dto;
    if (!page) page = 1;
    if (!limit) limit = 10;

    const qb = this.tagsRepository.createQueryBuilder('tag');
    qb.select(['tag.id', 'tag.name']);
    qb.where('tag.deletedAt IS NULL');

    if (dto.name) {
      qb.andWhere('tag.name ILIKE :name', {
        name: `%${dto.name}%`,
      });

      qb.orderBy('tag.name', 'DESC')
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
  }

  async findOne(
    id: number,
    userReq: { id: string; username: string; role: string },
  ): Promise<Tag | HttpException> {
    const tag = await this.tagsRepository.findOne({
      where: { id },
    });
    if (!tag) throw new HttpException('Tag not found', HttpStatus.NOT_FOUND);

    if (!userReq && tag.deletedAt != undefined) {
      throw new HttpException('Tag not available', HttpStatus.FORBIDDEN);
    }

    return tag;
  }

  // tener en cuenta que al updatear se cambiaria la tag en los POSTS,
  // solamente usar para correcciones no cambios grandes
  async update(
    id: number,
    updateTagDto: UpdateTagDto,
  ): Promise<Tag | HttpException> {
    const tag = await this.tagsRepository.findOne({
      where: { id, deletedAt: undefined },
    });
    // si no existe el id o esta softdeleteado => Error 404
    if (!tag)
      throw new HttpException(
        'Tag not found or not available',
        HttpStatus.NOT_FOUND,
      );
    // si existe el name en alguna tag NO SOFTDELET => Error 409
    const existTagName = await this.tagsRepository.findOne({
      where: { name: updateTagDto.name, deletedAt: undefined },
    });

    if (existTagName)
      throw new HttpException('name tag already exist', HttpStatus.CONFLICT);

    //mergeamos tag con update
    const updatedTag = this.tagsRepository.merge(tag, updateTagDto);

    await this.tagsRepository.save(updatedTag);
    return tag;
  }

  async remove(id: number): Promise<object | HttpException> {
    const tag = await this.tagsRepository.findOne({
      where: { id, deletedAt: undefined },
    });

    if (!tag) {
      throw new HttpException(
        'Tag not found or not available',
        HttpStatus.NOT_FOUND,
      );
    }
    await this.tagsRepository.softDelete(id);
    return { tag, message: 'Tag deleted successfully' };
  }
}
