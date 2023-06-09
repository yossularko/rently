import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  BadRequestException,
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

  async findAll(userId?: string): Promise<Item[]> {
    if (userId && Number.isNaN(+userId)) {
      throw new BadRequestException('UserId is not a number');
    }

    return await this.prismaService.item.findMany({
      where: userId ? { userId: +userId } : undefined,
    });
  }

  async findOne(id: number): Promise<Item | null> {
    const item = await this.prismaService.item.findUnique({
      where: {
        id,
      },
      include: {
        User: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!item) {
      // optional, you can return null/undefined depending on your use case
      throw new NotFoundException(`Item id ${id} is not found`);
    }

    delete item.userId;

    return item;
  }

  async update(id: number, updateItemDto: UpdateItemDto): Promise<Item> {
    const { name, isForRent } = updateItemDto;
    try {
      return await this.prismaService.item.update({
        where: { id },
        data: { name, isForRent },
      });
    } catch (error) {
      if (error.code) {
        if (error.code === 'P2025') {
          throw new NotFoundException(error.meta?.cause);
        }
      }
      throw new InternalServerErrorException(error);
    }
  }

  async remove(id: number) {
    try {
      return await this.prismaService.item.delete({ where: { id } });
    } catch (error) {
      if (error.code) {
        if (error.code === 'P2025') {
          throw new NotFoundException(error.meta?.cause);
        }
      }
      throw new InternalServerErrorException(error);
    }
  }
}
