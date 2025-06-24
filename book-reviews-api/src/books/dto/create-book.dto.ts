import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateBookDto {
  @ApiProperty({
    description: 'The title of the book',
    example: 'Duna',
  })
  @IsString()
  @IsNotEmpty({ message: 'Title cannot be empty.' })
  title: string;

  @ApiProperty({
    description: 'The author of the book',
    example: 'Frank Herbert',
  })
  @IsString()
  @IsNotEmpty({ message: 'Author cannot be empty.' })
  author: string;

  @ApiProperty({
    description: 'The ISBN of the book (optional)',
    example: '978-0441013593',
    required: false,
  })
  @IsString()
  @IsOptional()
  isbn?: string;

  @ApiProperty({
    description: 'The cover image URL of the book (optional)',
    example: 'https://example.com/cover.jpg',
    required: false,
  })
  @IsString()
  @IsOptional()
  coverImageUrl?: string;
}
