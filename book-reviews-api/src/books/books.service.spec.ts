import { getModelToken } from '@nestjs/mongoose';
import { Test, type TestingModule } from '@nestjs/testing';

import { ReviewsService } from '../reviews/reviews.service';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { Book } from './schemas/book.schema';

describe('BooksService', () => {
  let service: BooksService;

  const mockBook = {
    _id: '1',
    title: 'Test Book',
    author: 'Test Author',
    isbn: '1234567890',
  };

  const mockBookModel = {
    find: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
    create: jest.fn(),
  };

  const mockReviewsService = {
    findTopRatedBooks: jest.fn(),
    removeByBookId: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BooksService,
        {
          provide: getModelToken(Book.name),
          useValue: mockBookModel,
        },
        {
          provide: ReviewsService,
          useValue: mockReviewsService,
        },
      ],
    }).compile();

    service = module.get<BooksService>(BooksService);
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
      const createdBook = { ...createBookDto, _id: '1' };
      mockBookModel.create.mockResolvedValue(createdBook as any);

      const result = await service.create(createBookDto);

      expect(mockBookModel.create).toHaveBeenCalledWith(createBookDto);
      expect(result).toEqual(createdBook);
    });
  });

  describe('findAll', () => {
    it('should return an array of books', async () => {
      const books = [mockBook];
      mockBookModel.find.mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(books),
      } as any);

      const result = await service.findAll();

      expect(mockBookModel.find).toHaveBeenCalled();
      expect(result).toEqual(books);
    });
  });

  describe('findOne', () => {
    it('should return a book if found', async () => {
      mockBookModel.findById.mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValueOnce(mockBook),
      } as any);

      const result = await service.findOne('1');

      expect(mockBookModel.findById).toHaveBeenCalledWith('1');
      expect(result).toEqual(mockBook);
    });

    it('should return null if book not found', async () => {
      mockBookModel.findById.mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValueOnce(null),
      } as any);

      const result = await service.findOne('nonexistent');

      expect(mockBookModel.findById).toHaveBeenCalledWith('nonexistent');
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
      mockBookModel.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(updatedBook),
      } as any);

      const result = await service.update('1', updateBookDto);

      expect(mockBookModel.findByIdAndUpdate).toHaveBeenCalledWith(
        '1',
        updateBookDto,
        {
          new: true,
        },
      );
      expect(result).toEqual(updatedBook);
    });
  });

  describe('remove', () => {
    it('should remove a book and its reviews', async () => {
      const execMock = jest.fn().mockResolvedValue(mockBook);
      mockBookModel.findByIdAndDelete.mockImplementation(() => ({
        exec: execMock,
      }));

      mockReviewsService.removeByBookId.mockResolvedValue(undefined as any);

      const result = await service.remove('1');

      expect(mockBookModel.findByIdAndDelete).toHaveBeenCalledWith('1');
      expect(mockReviewsService.removeByBookId).toHaveBeenCalledWith('1');
      expect(result).toEqual(mockBook);
    });

    it('should return null if book to remove is not found', async () => {
      mockBookModel.findByIdAndDelete.mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(null),
      } as any);

      const result = await service.remove('nonexistent');

      expect(mockBookModel.findByIdAndDelete).toHaveBeenCalledWith(
        'nonexistent',
      );
      expect(mockReviewsService.removeByBookId).not.toHaveBeenCalled();
      expect(result).toBeNull();
    });
  });

  describe('findTopRated', () => {
    it('should return top rated books', async () => {
      const topBooks = [
        { ...mockBook, averageRating: 5 },
        { ...mockBook, _id: '2', title: 'Another Book', averageRating: 4 },
      ];
      mockReviewsService.findTopRatedBooks.mockResolvedValue(topBooks as any);

      const result = await service.findTopRated(2);

      expect(mockReviewsService.findTopRatedBooks).toHaveBeenCalledWith(2);
      expect(result).toEqual(topBooks);
    });
  });
});
