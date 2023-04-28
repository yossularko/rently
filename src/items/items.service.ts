import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Item } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';

@Injectable()
export class ItemsService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createItemData: CreateItemDto): Promise<Item> {
    const { name, isForRent, userId } = createItemData;
    try {
      const item = await this.prismaService.item.create({
        data: {
          name,
          isForRent,
          User: {
            connect: {
              id: userId,
            },
          },
        },
      });

      return item;
    } catch (error) {
      if (error.code) {
        if (error.code === 'P2025') {
          throw new NotFoundException(`User Id ${userId} is Not found`);
        }
      }

      throw new InternalServerErrorException(error);
    }
  }

  findAll() {
    return `This action returns all items`;
  }

  findOne(id: number) {
    return `This action returns a #${id} item`;
  }

  update(id: number, updateItemDto: UpdateItemDto) {
    return `This action updates a #${id} item`;
  }

  remove(id: number) {
    return `This action removes a #${id} item`;
  }
}
