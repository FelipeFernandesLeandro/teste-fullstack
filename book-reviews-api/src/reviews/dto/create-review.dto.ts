import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CreateReviewDto {
  @ApiProperty({
    description: 'The name of the reviewer',
    example: 'John Doe',
  })
  @IsString()
  @IsNotEmpty({ message: 'Reviewer name cannot be empty.' })
  reviewerName: string;

  @ApiProperty({
    description: 'The rating of the review',
    example: 5,
  })
  @IsNumber()
  @Min(1, { message: 'Rating must be at least 1.' })
  @Max(5, { message: 'Rating must be at most 5.' })
  rating: number;

  @ApiProperty({
    description: 'The comment of the review',
    example: 'This is a great book!',
    required: false,
  })
  @IsString()
  @IsOptional()
  comment: string;
}
