import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll(): Promise<User[]> {
    return await this.prismaService.user.findMany();
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
