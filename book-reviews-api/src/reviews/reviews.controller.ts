import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateReviewDto } from 'src/reviews/dto/create-review.dto';
import { ReviewsService } from 'src/reviews/reviews.service';
import { Review } from 'src/reviews/schemas/review.schema';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  create(
    @Param('bookId') bookId: string,
    @Body() createReviewDto: CreateReviewDto,
  ): Promise<Review> {
    return this.reviewsService.create(bookId, createReviewDto);
  }

  @Get()
  findAll(@Param('bookId') bookId: string): Promise<Review[]> {
    return this.reviewsService.findAll(bookId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateReviewDto: CreateReviewDto,
  ): Promise<Review | null> {
    return this.reviewsService.update(id, updateReviewDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<Review | null> {
    return this.reviewsService.remove(id);
  }
}
