import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll(): Promise<User[]> {
    return await this.prismaService.user.findMany();
  }

  async findUserById(id: number): Promise<User | null> {
    const user = await this.prismaService.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) {
      // optional, you can return null/undefined depending on your use case
      throw new NotFoundException(`User id ${id} is not found`);
    }

    return user;
  }

  async create(createUserData: Prisma.UserCreateInput): Promise<User> {
    const { name, email } = createUserData;
    return await this.prismaService.user.create({
      data: {
        name,
        email,
      },
    });
  }
}
