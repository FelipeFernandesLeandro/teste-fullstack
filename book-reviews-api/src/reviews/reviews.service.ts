import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { Model } from 'mongoose';
import type { CreateReviewDto } from './dto/create-review.dto';
import { Review, type ReviewDocument } from './schemas/review.schema';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectModel(Review.name) private reviewModel: Model<ReviewDocument>,
  ) {}

  async create(
    bookId: string,
    createReviewDto: CreateReviewDto,
  ): Promise<Review> {
    const newReview = new this.reviewModel({
      ...createReviewDto,
      bookId: bookId,
    });
    return newReview.save();
  }

  async findAll(bookId: string): Promise<Review[]> {
    return this.reviewModel.find({ bookId }).exec();
  }

  async update(
    id: string,
    updateReviewDto: CreateReviewDto,
  ): Promise<Review | null> {
    return this.reviewModel
      .findByIdAndUpdate(id, updateReviewDto, { new: true })
      .exec();
  }

  async remove(id: string): Promise<Review | null> {
    return this.reviewModel.findByIdAndDelete(id).exec();
  }
}
