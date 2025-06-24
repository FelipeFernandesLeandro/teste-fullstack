import { Test, type TestingModule } from '@nestjs/testing';
import { BooksService } from '../books/books.service';
import { ReviewsService } from '../reviews/reviews.service';
import { SeedingService } from './seeding.service';

describe('SeedingService', () => {
  let service: SeedingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SeedingService,
        {
          provide: BooksService,
          useValue: {
            create: jest.fn(),
            removeAll: jest.fn(),
          },
        },
        {
          provide: ReviewsService,
          useValue: {
            create: jest.fn(),
            removeAll: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<SeedingService>(SeedingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
