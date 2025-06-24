import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as http from 'http';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { BookDocument } from '../src/books/schemas/book.schema';
import { CreateReviewDto } from '../src/reviews/dto/create-review.dto';
import { ReviewDocument } from '../src/reviews/schemas/review.schema';

describe('ReviewsController (e2e)', () => {
  let app: INestApplication;
  let server: http.Server;
  let bookId: string;
  let reviewId: string;

  const book = {
    title: 'Test Book for Reviews',
    author: 'Test Author',
    publicationYear: 2024,
    isbn: `978-3-16-148410-0-${Date.now()}`,
  };

  const createReviewDto: CreateReviewDto = {
    reviewerName: 'John Doe',
    rating: 5,
    comment: 'Excellent book!',
  };

  const updateReviewDto: CreateReviewDto = {
    reviewerName: 'Jane Doe',
    rating: 4,
    comment: 'Very good book!',
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
    server = app.getHttpServer() as http.Server;

    // Create a book to associate reviews with
    const response = await request(server)
      .post('/books')
      .send(book)
      .expect(201);
    bookId = (response.body as BookDocument)._id.toString();
  });

  afterAll(async () => {
    // Clean up the created book
    await request(server).delete(`/books/${bookId}`);
    await app.close();
  });

  describe('POST /books/:bookId/reviews', () => {
    it('should create a new review', async () => {
      const response = await request(server)
        .post(`/books/${bookId}/reviews`)
        .send(createReviewDto)
        .expect(201);

      const newReview = response.body as ReviewDocument;
      expect(newReview).toHaveProperty('_id');
      expect(newReview.reviewerName).toBe(createReviewDto.reviewerName);
      reviewId = newReview._id.toString();
    });

    it('should return 400 for invalid review data', () => {
      return request(server)
        .post(`/books/${bookId}/reviews`)
        .send({ ...createReviewDto, rating: 6 })
        .expect(400);
    });
  });

  describe('GET /books/:bookId/reviews', () => {
    it('should get all reviews for a book', async () => {
      const response = await request(server)
        .get(`/books/${bookId}/reviews`)
        .expect(200);

      const reviews = response.body as ReviewDocument[];
      expect(Array.isArray(reviews)).toBe(true);
      expect(reviews.length).toBeGreaterThan(0);
      expect(reviews[0].reviewerName).toBe(createReviewDto.reviewerName);
    });
  });

  describe('PATCH /reviews/:id', () => {
    it('should update a review', async () => {
      const response = await request(server)
        .patch(`/reviews/${reviewId}`)
        .send(updateReviewDto)
        .expect(200);

      const updatedReview = response.body as ReviewDocument;
      expect(updatedReview.reviewerName).toBe(updateReviewDto.reviewerName);
      expect(updatedReview.rating).toBe(updateReviewDto.rating);
    });

    it('should return 404 for a non-existent review', () => {
      return request(server)
        .patch('/reviews/60d5ec49f7e4e3a5e8a0b1a2')
        .send(updateReviewDto)
        .expect(404);
    });
  });

  describe('DELETE /reviews/:id', () => {
    it('should delete a review', () => {
      return request(server).delete(`/reviews/${reviewId}`).expect(200);
    });

    it('should return 404 for a non-existent review', () => {
      return request(server).delete(`/reviews/${reviewId}`).expect(404);
    });
  });
});
