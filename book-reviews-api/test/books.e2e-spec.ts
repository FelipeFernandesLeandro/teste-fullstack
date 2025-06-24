/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { getConnectionToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import * as http from 'http';
import { Connection } from 'mongoose';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { CreateBookDto } from '../src/books/dto/create-book.dto';

interface Book extends CreateBookDto {
  _id: string;
}

interface PaginatedBooks {
  data: Book[];
  total: number;
}

describe('BooksController (e2e)', () => {
  let app: INestApplication;
  let connection: Connection;
  let httpServer: http.Server;

  const createBookDto: CreateBookDto = {
    title: 'E2E Test Book',
    author: 'Supertest Author',
    isbn: '123456789-e2e',
  };

  const createBook = async (): Promise<Book> => {
    const response = await request(httpServer)
      .post('/books')
      .send(createBookDto)
      .expect(201);
    return response.body as Book;
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
    httpServer = app.getHttpServer();

    connection = app.get<Connection>(getConnectionToken());
  });

  beforeEach(async () => {
    await connection.collection('books').deleteMany({});
    await connection.collection('reviews').deleteMany({});
  });

  afterAll(async () => {
    await connection.close();
    await app.close();
  });

  describe('POST /books', () => {
    it('should create a book', async () => {
      const response = await request(httpServer)
        .post('/books')
        .send(createBookDto)
        .expect(201);

      expect(response.body as Book).toEqual(
        expect.objectContaining({
          _id: expect.any(String),
          ...createBookDto,
        }),
      );
    });
  });

  describe('GET /books', () => {
    it('should find all books with pagination', async () => {
      await createBook();

      const response = await request(httpServer)
        .get('/books?page=1&limit=5')
        .expect(200);

      const paginatedResponse = response.body as PaginatedBooks;

      expect(paginatedResponse).toHaveProperty('data');
      expect(paginatedResponse).toHaveProperty('total');
      expect(paginatedResponse.data).toBeInstanceOf(Array);
      expect(paginatedResponse.data.length).toBe(1);
      expect(paginatedResponse.total).toBe(1);
    });
  });

  describe('GET /books/:id', () => {
    it('should find a book by id', async () => {
      const book = await createBook();

      const response = await request(httpServer)
        .get(`/books/${book._id}`)
        .expect(200);

      const foundBook = response.body as Book;

      expect(foundBook._id).toBe(book._id);
      expect(foundBook.title).toBe(book.title);
    });
  });

  describe('PATCH /books/:id', () => {
    it('should update a book', async () => {
      const book = await createBook();
      const updateDto = { title: 'Updated E2E Test Book' };

      const response = await request(httpServer)
        .patch(`/books/${book._id}`)
        .send(updateDto)
        .expect(200);

      const updatedBook = response.body as Book;

      expect(updatedBook.title).toBe(updateDto.title);
      expect(updatedBook.author).toBe(book.author);
    });
  });

  describe('DELETE /books/:id', () => {
    it('should delete a book', async () => {
      const book = await createBook();

      await request(httpServer).delete(`/books/${book._id}`).expect(204);

      await request(httpServer).get(`/books/${book._id}`).expect(404);
    });
  });
});
