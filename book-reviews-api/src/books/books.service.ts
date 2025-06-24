import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { Model } from 'mongoose';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { ReviewsService } from '../reviews/reviews.service';
import type { CreateBookDto } from './dto/create-book.dto';
import type { UpdateBookDto } from './dto/update-book.dto';
import { Book, type BookDocument } from './schemas/book.schema';

export type PaginatedBooksResult = {
  data: BookDocument[];
  total: number;
  page?: number;
  limit?: number;
  totalPages: number;
};

@Injectable()
export class BooksService {
  constructor(
    @InjectModel(Book.name) private bookModel: Model<BookDocument>,
    @Inject(forwardRef(() => ReviewsService))
    private readonly reviewsService: ReviewsService,
  ) {}

  async create(createBookDto: CreateBookDto): Promise<BookDocument> {
    return this.bookModel.create(createBookDto);
  }

  async findAll(paginationDto: PaginationDto): Promise<PaginatedBooksResult> {
    const { page, limit } = paginationDto;
    const limitValue = limit ?? 10;
    const skip = ((page ?? 1) - 1) * limitValue;

    const [data, total] = await Promise.all([
      this.bookModel.find().skip(skip).limit(limitValue).exec(),
      this.bookModel.countDocuments().exec(),
    ]);

    const totalPages = Math.ceil(total / limitValue);

    return {
      data,
      total,
      page,
      limit,
      totalPages,
    };
  }

  async findOne(id: string): Promise<BookDocument> {
    const book = await this.bookModel.findById(id).populate('reviews').exec();

    if (!book) {
      throw new NotFoundException(`Book with ID "${id}" not found`);
    }

    return book;
  }

  async findTopRated(limit: number): Promise<BookDocument[]> {
    return this.reviewsService.findTopRatedBooks(limit);
  }

  async remove(id: string): Promise<BookDocument> {
    const deletedBook = await this.bookModel.findByIdAndDelete(id).exec();

    if (!deletedBook) {
      throw new NotFoundException(`Book with ID "${id}" not found`);
    }

    await this.reviewsService.removeByBookId(id);

    return deletedBook;
  }

  async removeAll(): Promise<void> {
    await this.bookModel.deleteMany({}).exec();
  }

  async update(
    id: string,
    updateBookDto: UpdateBookDto,
  ): Promise<BookDocument | null> {
    return this.bookModel
      .findByIdAndUpdate(id, updateBookDto, { new: true })
      .exec();
  }
}
