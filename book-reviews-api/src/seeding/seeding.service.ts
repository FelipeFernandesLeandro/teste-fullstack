import { Injectable, Logger } from '@nestjs/common';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { BooksService } from '../books/books.service';
import { CreateBookDto } from '../books/dto/create-book.dto';
import { CreateReviewDto } from '../reviews/dto/create-review.dto';
import { ReviewsService } from '../reviews/reviews.service';

type RawSeedData = {
  'Book.title': string;
  'Book.author': string;
  'Book.isbn': string;
  'Book.coverUrl': string;
  'Review.reviewerName': string;
  'Review.rating': number;
  'Review.comment': string;
};

@Injectable()
export class SeedingService {
  private readonly logger = new Logger(SeedingService.name);

  constructor(
    private readonly booksService: BooksService,
    private readonly reviewsService: ReviewsService,
  ) {}

  async seed() {
    this.logger.log('Starting seeding process...');

    await this.booksService.removeAll();
    await this.reviewsService.removeAll();
    this.logger.log('Previous data removed.');

    const rawData: RawSeedData[] = JSON.parse(
      readFileSync(
        join(process.cwd(), 'data/books_reviews_dataset.json'),
        'utf-8',
      ),
    ) as RawSeedData[];

    const uniqueBooks = new Map<string, CreateBookDto>();
    for (const item of rawData) {
      if (!uniqueBooks.has(item['Book.isbn'])) {
        uniqueBooks.set(item['Book.isbn'], {
          title: item['Book.title'],
          author: item['Book.author'],
          isbn: item['Book.isbn'],
          coverImageUrl: item['Book.coverUrl'],
        });
      }
    }

    const createdBooks = await Promise.all(
      Array.from(uniqueBooks.values()).map((bookDto) =>
        this.booksService.create(bookDto),
      ),
    );
    this.logger.log(`${createdBooks.length} unique books have been created.`);

    const isbnToIdMap = new Map<string, string>();
    createdBooks.forEach((book) => {
      if (book.isbn) {
        isbnToIdMap.set(book.isbn, book._id.toString());
      }
    });

    const reviewsToCreate: { bookId: string; reviewDto: CreateReviewDto }[] =
      [];
    for (const item of rawData) {
      const bookId = isbnToIdMap.get(item['Book.isbn']);
      if (bookId) {
        reviewsToCreate.push({
          bookId,
          reviewDto: {
            reviewerName: item['Review.reviewerName'],
            rating: item['Review.rating'],
            comment: item['Review.comment'],
          },
        });
      }
    }

    await Promise.all(
      reviewsToCreate.map((review) =>
        this.reviewsService.create(review.bookId, review.reviewDto),
      ),
    );
    this.logger.log(`${reviewsToCreate.length} reviews have been created.`);
    this.logger.log('Seeding process finished successfully.');
  }
}
