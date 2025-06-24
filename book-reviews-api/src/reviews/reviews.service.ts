import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { Model } from 'mongoose';
import { BookDocument } from '../books/schemas/book.schema';
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

  async findAll(bookId: string): Promise<ReviewDocument[]> {
    return this.reviewModel.find({ bookId }).exec();
  }

  async findTopRatedBooks(limit: number): Promise<BookDocument[]> {
    return this.reviewModel
      .aggregate([
        {
          $group: {
            _id: '$bookId',
            averageRating: { $avg: '$rating' },
          },
        },
        { $sort: { averageRating: -1 } },
        { $limit: limit },
        {
          $lookup: {
            from: 'books',
            localField: '_id',
            foreignField: '_id',
            as: 'bookDetails',
          },
        },
        { $unwind: '$bookDetails' },
        {
          $project: {
            _id: '$bookDetails._id',
            title: '$bookDetails.title',
            author: '$bookDetails.author',
            averageRating: '$averageRating',
          },
        },
      ])
      .exec() as Promise<BookDocument[]>;
  }

  async update(
    id: string,
    updateReviewDto: CreateReviewDto,
  ): Promise<ReviewDocument | null> {
    return this.reviewModel
      .findByIdAndUpdate(id, updateReviewDto, { new: true })
      .exec();
  }

  async remove(id: string): Promise<ReviewDocument | null> {
    return this.reviewModel.findByIdAndDelete(id).exec();
  }

  async removeAll(): Promise<void> {
    await this.reviewModel.deleteMany({}).exec();
  }
}
