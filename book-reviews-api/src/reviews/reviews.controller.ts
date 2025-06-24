import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateReviewDto } from 'src/reviews/dto/create-review.dto';
import { ReviewsService } from 'src/reviews/reviews.service';
import { Review } from 'src/reviews/schemas/review.schema';

@ApiTags('reviews')
@Controller()
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post('books/:bookId/reviews')
  @ApiOperation({ summary: 'Create a new review' })
  @ApiResponse({ status: 201, description: 'Review created successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid parameters.' })
  create(
    @Param('bookId') bookId: string,
    @Body() createReviewDto: CreateReviewDto,
  ): Promise<Review> {
    return this.reviewsService.create(bookId, createReviewDto);
  }

  @Get('books/:bookId/reviews')
  @ApiParam({ name: 'bookId', description: 'book id to find reviews for' })
  @ApiOperation({ summary: 'Find all reviews for a book' })
  @ApiResponse({ status: 200, description: 'List of reviews.' })
  @ApiResponse({ status: 404, description: 'Book not found.' })
  findAll(@Param('bookId') bookId: string): Promise<Review[]> {
    return this.reviewsService.findAll(bookId);
  }

  @Patch('reviews/:id')
  @ApiParam({ name: 'id', description: 'review id to update' })
  @ApiOperation({ summary: 'Update a review by ID' })
  @ApiResponse({ status: 200, description: 'Review updated successfully.' })
  @ApiResponse({ status: 404, description: 'Review not found.' })
  async update(
    @Param('id') id: string,
    @Body() updateReviewDto: CreateReviewDto,
  ): Promise<Review | null> {
    const review = await this.reviewsService.update(id, updateReviewDto);
    if (!review) {
      throw new NotFoundException(`Review with id ${id} not found`);
    }
    return review;
  }

  @Delete('reviews/:id')
  @ApiParam({ name: 'id', description: 'review id to delete' })
  @ApiOperation({ summary: 'Remove a review by ID' })
  @ApiResponse({ status: 200, description: 'Review removed successfully.' })
  @ApiResponse({ status: 404, description: 'Review not found.' })
  async remove(@Param('id') id: string): Promise<Review | null> {
    const review = await this.reviewsService.remove(id);
    if (!review) {
      throw new NotFoundException(`Review with id ${id} not found`);
    }
    return review;
  }
}
