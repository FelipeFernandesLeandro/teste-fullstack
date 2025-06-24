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
    countDocuments: jest.fn(),
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
    it('should return paginated books', async () => {
      const paginationDto = { page: 2, limit: 5 };
      const books = [mockBook];
      const total = 10;

      const findQuery = {
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(books),
      };
      mockBookModel.find.mockReturnValue(findQuery);

      mockBookModel.countDocuments.mockReturnValue({
        exec: jest.fn().mockResolvedValue(total),
      });

      const result = await service.findAll(paginationDto);

      expect(mockBookModel.find).toHaveBeenCalled();
      expect(findQuery.skip).toHaveBeenCalledWith(5);
      expect(findQuery.limit).toHaveBeenCalledWith(5);
      expect(mockBookModel.countDocuments).toHaveBeenCalled();

      expect(result).toEqual({
        data: books,
        total,
        page: 2,
        limit: 5,
        totalPages: 2,
      });
    });

    it('should use default values if page and limit are not provided', async () => {
      const books = [mockBook];
      const total = 1;

      const findQuery = {
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(books),
      };
      mockBookModel.find.mockReturnValue(findQuery);

      mockBookModel.countDocuments.mockReturnValue({
        exec: jest.fn().mockResolvedValue(total),
      });

      const result = await service.findAll({});

      expect(findQuery.skip).toHaveBeenCalledWith(0);
      expect(findQuery.limit).toHaveBeenCalledWith(10);

      expect(result.totalPages).toBe(1);
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
