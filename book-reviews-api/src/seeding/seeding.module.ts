import { Module } from '@nestjs/common';
import { BooksModule } from '../books/books.module';
import { ReviewsModule } from '../reviews/reviews.module';
import { SeedingService } from './seeding.service';

@Module({
  imports: [BooksModule, ReviewsModule],
  providers: [SeedingService],
})
export class SeedingModule {}
