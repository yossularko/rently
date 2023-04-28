import { IsBoolean, IsInt, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateItemDto {
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsBoolean()
  isForRent: boolean;

  // In this example we want the user id to be part of the payload. This isn't always the case
  @IsInt()
  userId: number;
}
