/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { getModelToken } from '@nestjs/mongoose';
import { Test, type TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { CreateReviewDto } from './dto/create-review.dto';
import { ReviewsService } from './reviews.service';
import { Review } from './schemas/review.schema';

describe('ReviewsService', () => {
  let service: ReviewsService;
  let reviewModel: Model<Review>;

  const mockReview: Review = {
    _id: '1',
    reviewerName: 'Test User',
    rating: '5',
    comment: 'Great book!',
    bookId: '1',
  } as Review;

  class MockReviewModel {
    static constructorSpy = jest.fn();
    static saveSpy = jest.fn();
    static find = jest.fn().mockReturnThis();
    static findById = jest.fn().mockReturnThis();
    static findByIdAndUpdate = jest.fn().mockReturnThis();
    static findByIdAndDelete = jest.fn().mockReturnThis();
    static exec = jest.fn();

    constructor(dto: CreateReviewDto & { bookId: string }) {
      MockReviewModel.constructorSpy(dto);
    }

    save = MockReviewModel.saveSpy;
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReviewsService,
        {
          provide: getModelToken(Review.name),
          useValue: MockReviewModel,
        },
      ],
    }).compile();

    service = module.get<ReviewsService>(ReviewsService);
    reviewModel = module.get<Model<Review>>(getModelToken(Review.name));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a review', async () => {
      const createReviewDto: CreateReviewDto = {
        reviewerName: 'Test User',
        rating: 5,
        comment: 'Great book!',
      };
      const bookId = '1';
      const expectedResult = {
        ...createReviewDto,
        _id: '1',
        rating: createReviewDto.rating.toString(),
        bookId,
      };

      MockReviewModel.saveSpy.mockResolvedValue(expectedResult);

      const result = await service.create(bookId, createReviewDto);

      expect(result).toEqual(expectedResult);
      expect(MockReviewModel.constructorSpy).toHaveBeenCalledWith({
        ...createReviewDto,
        bookId,
      });
      expect(MockReviewModel.saveSpy).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return an array of reviews for a book', async () => {
      const bookId = '1';
      const reviews = [mockReview];
      const execMock = jest.fn().mockResolvedValueOnce(reviews);
      const findSpy = jest.spyOn(reviewModel, 'find').mockReturnThis();

      (reviewModel.find() as any).exec = execMock;

      const result = await service.findAll(bookId);

      expect(findSpy).toHaveBeenCalledWith({ bookId });
      expect(execMock).toHaveBeenCalled();
      expect(result).toEqual(reviews);
    });

    it('should return an empty array if no reviews found', async () => {
      const bookId = '2';
      const execMock = jest.fn().mockResolvedValueOnce([]);
      const findSpy = jest.spyOn(reviewModel, 'find').mockReturnThis();

      (reviewModel.find() as any).exec = execMock;

      const result = await service.findAll(bookId);

      expect(findSpy).toHaveBeenCalledWith({ bookId });
      expect(execMock).toHaveBeenCalled();
      expect(result).toEqual([]);
    });
  });

  describe('update', () => {
    it('should update a review', async () => {
      const updateReviewDto: CreateReviewDto = {
        reviewerName: 'Updated User',
        rating: 4,
        comment: 'Still a good book',
      };
      const updatedReview = { ...mockReview, ...updateReviewDto, rating: '4' };
      const execMock = jest.fn().mockResolvedValueOnce(updatedReview);
      const findByIdAndUpdateSpy = jest
        .spyOn(reviewModel, 'findByIdAndUpdate')
        .mockReturnThis();

      (
        reviewModel.findByIdAndUpdate('1', updateReviewDto, {
          new: true,
        }) as any
      ).exec = execMock;

      const result = await service.update('1', updateReviewDto);

      expect(findByIdAndUpdateSpy).toHaveBeenCalledWith('1', updateReviewDto, {
        new: true,
      });
      expect(execMock).toHaveBeenCalled();
      expect(result).toEqual(updatedReview);
    });

    it('should return null if review to update is not found', async () => {
      const updateReviewDto: CreateReviewDto = {
        reviewerName: 'Non-existent User',
        rating: 3,
        comment: 'This should not exist',
      };
      const execMock = jest.fn().mockResolvedValueOnce(null);
      const findByIdAndUpdateSpy = jest
        .spyOn(reviewModel, 'findByIdAndUpdate')
        .mockReturnThis();

      (
        reviewModel.findByIdAndUpdate('nonexistent', updateReviewDto, {
          new: true,
        }) as any
      ).exec = execMock;

      const result = await service.update('nonexistent', updateReviewDto);

      expect(findByIdAndUpdateSpy).toHaveBeenCalledWith(
        'nonexistent',
        updateReviewDto,
        { new: true },
      );
      expect(execMock).toHaveBeenCalled();
      expect(result).toBeNull();
    });
  });

  describe('remove', () => {
    it('should remove a review', async () => {
      const execMock = jest.fn().mockResolvedValueOnce(mockReview);
      const findByIdAndDeleteSpy = jest
        .spyOn(reviewModel, 'findByIdAndDelete')
        .mockReturnThis();

      (reviewModel.findByIdAndDelete('1') as any).exec = execMock;

      const result = await service.remove('1');

      expect(findByIdAndDeleteSpy).toHaveBeenCalledWith('1');
      expect(execMock).toHaveBeenCalled();
      expect(result).toEqual(mockReview);
    });

    it('should return null if review to delete is not found', async () => {
      const execMock = jest.fn().mockResolvedValueOnce(null);
      const findByIdAndDeleteSpy = jest
        .spyOn(reviewModel, 'findByIdAndDelete')
        .mockReturnThis();

      (reviewModel.findByIdAndDelete('nonexistent') as any).exec = execMock;

      const result = await service.remove('nonexistent');

      expect(findByIdAndDeleteSpy).toHaveBeenCalledWith('nonexistent');
      expect(execMock).toHaveBeenCalled();
      expect(result).toBeNull();
    });
  });
});
