import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { Model } from 'mongoose';
import { ReviewsService } from 'src/reviews/reviews.service';
import type { CreateBookDto } from './dto/create-book.dto';
import { Book, type BookDocument } from './schemas/book.schema';

@Injectable()
export class BooksService {
  constructor(
    @InjectModel(Book.name) private bookModel: Model<BookDocument>,
    @Inject(forwardRef(() => ReviewsService))
    private readonly reviewsService: ReviewsService,
  ) {}

  async create(createBookDto: CreateBookDto): Promise<BookDocument> {
    const createdBook = new this.bookModel(createBookDto);
    return createdBook.save();
  }

  async findAll(): Promise<BookDocument[]> {
    return this.bookModel.find().exec();
  }

  async findOne(id: string): Promise<BookDocument | null> {
    return this.bookModel.findById(id).populate('reviews').exec();
  }

  async findTopRated(limit: number): Promise<BookDocument[]> {
    return this.reviewsService.findTopRatedBooks(limit);
  }

  async remove(id: string): Promise<BookDocument | null> {
    return this.bookModel.findByIdAndDelete(id).exec();
  }

  async removeAll(): Promise<void> {
    await this.bookModel.deleteMany({}).exec();
  }

  async update(
    id: string,
    updateBookDto: CreateBookDto,
  ): Promise<BookDocument | null> {
    return this.bookModel
      .findByIdAndUpdate(id, updateBookDto, { new: true })
      .exec();
  }
}
