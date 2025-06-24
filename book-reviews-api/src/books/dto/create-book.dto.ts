import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateBookDto {
  @IsString()
  @IsNotEmpty({ message: 'Title cannot be empty.' })
  title: string;

  @IsString()
  @IsNotEmpty({ message: 'Author cannot be empty.' })
  author: string;

  @IsString()
  @IsOptional()
  isbn?: string;

  @IsString()
  @IsOptional()
  coverImageUrl?: string;
}
