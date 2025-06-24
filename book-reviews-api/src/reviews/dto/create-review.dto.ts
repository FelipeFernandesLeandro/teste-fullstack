import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
  MinLength,
} from 'class-validator';

export class CreateReviewDto {
  @IsString()
  @IsNotEmpty({ message: 'Reviewer name cannot be empty.' })
  reviewerName: string;

  @IsNumber()
  @Min(1, { message: 'Rating must be at least 1.' })
  @Max(5, { message: 'Rating must be at most 5.' })
  rating: number;

  @IsString()
  @IsOptional()
  @MinLength(10, { message: 'Comment must be at least 10 characters long.' })
  comment: string;
}
