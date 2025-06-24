/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { getModelToken } from '@nestjs/mongoose';
import { Test, type TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { Review } from '../reviews/schemas/review.schema';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { Book } from './schemas/book.schema';

describe('BooksService', () => {
  let service: BooksService;
  let bookModel: Model<Book>;
  let reviewModel: Model<Review>;

  const mockBook: Book = {
    _id: '1',
    title: 'Test Book',
    author: 'Test Author',
    isbn: '1234567890',
  } as Book;

  const mockReviewModel = {
    aggregate: jest.fn().mockReturnThis(),
    exec: jest.fn(),
  };

  class MockBookModel {
    _id: string;
    title: string;
    author: string;
    isbn: string;
    save: jest.Mock;

    constructor(dto: CreateBookDto) {
      this._id = '1';
      this.title = dto.title;
      this.author = dto.author;
      this.isbn = dto.isbn || '';
      this.save = jest.fn().mockResolvedValue({
        _id: '1',
        title: this.title,
        author: this.author,
        isbn: this.isbn,
      });
    }

    static find = jest.fn().mockReturnThis();
    static findById = jest.fn().mockReturnThis();
    static findByIdAndUpdate = jest.fn().mockReturnThis();
    static findByIdAndDelete = jest.fn().mockReturnThis();
    static exec = jest.fn();

    static create = jest.fn().mockImplementation((dto: CreateBookDto) => {
      return Promise.resolve(new MockBookModel(dto));
    });
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BooksService,
        {
          provide: getModelToken(Book.name),
          useValue: MockBookModel,
        },
        {
          provide: getModelToken(Review.name),
          useValue: mockReviewModel,
        },
      ],
    }).compile();

    service = module.get<BooksService>(BooksService);
    bookModel = module.get<Model<Book>>(getModelToken(Book.name));
    reviewModel = module.get<Model<Review>>(getModelToken(Review.name));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a book', async () => {
      const createBookDto: CreateBookDto = {
        title: 'Test Book',
        author: 'Test Author',
        isbn: '1234567890',
      };

      const result = await service.create(createBookDto);

      expect(result).toEqual({
        ...createBookDto,
        _id: '1',
      });
    });
  });

  describe('findAll', () => {
    it('should return an array of books', async () => {
      const books = [mockBook];
      const execMock = jest.fn().mockResolvedValueOnce(books);
      const findSpy = jest.spyOn(bookModel, 'find').mockReturnThis();

      (bookModel.find() as any).exec = execMock;

      const result = await service.findAll();

      expect(findSpy).toHaveBeenCalled();
      expect(execMock).toHaveBeenCalled();
      expect(result).toEqual(books);
    });
  });

  describe('findOne', () => {
    it('should return a book if found', async () => {
      const execMock = jest.fn().mockResolvedValueOnce(mockBook);
      const findByIdSpy = jest.spyOn(bookModel, 'findById').mockReturnThis();

      (bookModel.findById('1') as any).exec = execMock;

      const result = await service.findOne('1');

      expect(findByIdSpy).toHaveBeenCalledWith('1');
      expect(execMock).toHaveBeenCalled();
      expect(result).toEqual(mockBook);
    });

    it('should return null if book not found', async () => {
      const execMock = jest.fn().mockResolvedValueOnce(null);
      const findByIdSpy = jest.spyOn(bookModel, 'findById').mockReturnThis();

      (bookModel.findById('nonexistent') as any).exec = execMock;

      const result = await service.findOne('nonexistent');

      expect(findByIdSpy).toHaveBeenCalledWith('nonexistent');
      expect(execMock).toHaveBeenCalled();
      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update a book', async () => {
      const updateBookDto: CreateBookDto = {
        title: 'Updated Book',
        author: 'Updated Author',
        isbn: '0987654321',
      };
      const updatedBook = { ...mockBook, ...updateBookDto };
      const execMock = jest.fn().mockResolvedValueOnce(updatedBook);
      const findByIdAndUpdateSpy = jest
        .spyOn(bookModel, 'findByIdAndUpdate')
        .mockReturnThis();

      (
        bookModel.findByIdAndUpdate('1', updateBookDto, { new: true }) as any
      ).exec = execMock;

      const result = await service.update('1', updateBookDto);

      expect(findByIdAndUpdateSpy).toHaveBeenCalledWith('1', updateBookDto, {
        new: true,
      });
      expect(execMock).toHaveBeenCalled();
      expect(result).toEqual(updatedBook);
    });
  });

  describe('remove', () => {
    it('should remove a book', async () => {
      const execMock = jest.fn().mockResolvedValueOnce(mockBook);
      const findByIdAndDeleteSpy = jest
        .spyOn(bookModel, 'findByIdAndDelete')
        .mockReturnThis();

      (bookModel.findByIdAndDelete('1') as any).exec = execMock;

      const result = await service.remove('1');

      expect(findByIdAndDeleteSpy).toHaveBeenCalledWith('1');
      expect(execMock).toHaveBeenCalled();
      expect(result).toEqual(mockBook);
    });
  });

  describe('findTopRated', () => {
    it('should return top rated books', async () => {
      const topBooks = [
        { ...mockBook, averageRating: 5 },
        { ...mockBook, _id: '2', title: 'Another Book', averageRating: 4 },
      ];
      const execMock = jest.fn().mockResolvedValueOnce(topBooks);
      const aggregateSpy = jest
        .spyOn(reviewModel, 'aggregate')
        .mockReturnValue({
          exec: execMock,
        } as unknown as import('mongoose').Aggregate<any[]>);

      const result = await service.findTopRated(2);

      expect(aggregateSpy).toHaveBeenCalled();
      expect(execMock).toHaveBeenCalled();
      expect(result).toEqual(topBooks);
    });
  });
});
