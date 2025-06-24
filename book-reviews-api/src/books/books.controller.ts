import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { BooksService } from 'src/books/books.service';
import { CreateBookDto } from 'src/books/dto/create-book.dto';
import { Book } from 'src/books/schemas/book.schema';

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Post()
  create(@Body() createBookDto: CreateBookDto): Promise<Book> {
    return this.booksService.create(createBookDto);
  }

  @Get()
  findAll(): Promise<Book[]> {
    return this.booksService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Book | null> {
    return this.booksService.findOne(id);
  }

  @Get('top-rated')
  findTopRated(@Query('limit') limit: number = 10): Promise<Book[]> {
    return this.booksService.findTopRated(limit);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<Book | null> {
    return this.booksService.remove(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateBookDto: CreateBookDto,
  ): Promise<Book | null> {
    return this.booksService.update(id, updateBookDto);
  }
}
