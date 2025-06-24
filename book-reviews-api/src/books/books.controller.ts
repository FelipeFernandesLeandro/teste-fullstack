import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { BooksService, PaginatedBooksResult } from 'src/books/books.service';
import { Book } from 'src/books/schemas/book.schema';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@ApiTags('books')
@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new book' })
  @ApiResponse({ status: 201, description: 'Book created successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid parameters.' })
  create(@Body() createBookDto: CreateBookDto): Promise<Book> {
    return this.booksService.create(createBookDto);
  }

  @Get()
  @ApiOperation({ summary: 'Find all books' })
  @ApiResponse({ status: 200, description: 'List of all books.' })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number to return',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Number of items per page',
  })
  findAll(
    @Query() paginationDto: PaginationDto,
  ): Promise<PaginatedBooksResult> {
    return this.booksService.findAll(paginationDto);
  }

  @Get('top')
  @ApiOperation({ summary: 'Find top rated books' })
  @ApiResponse({ status: 200, description: 'List of top rated books.' })
  @ApiParam({ name: 'limit', description: 'Number of books to return' })
  findTopRated(
    @Query('limit', new DefaultValuePipe(5), ParseIntPipe) limit: number = 10,
  ): Promise<Book[]> {
    return this.booksService.findTopRated(limit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find a book by ID' })
  @ApiParam({ name: 'id', description: 'book id to find' })
  @ApiResponse({ status: 200, description: 'Book found successfully.' })
  @ApiResponse({ status: 404, description: 'Book not found.' })
  findOne(@Param('id') id: string): Promise<Book | null> {
    return this.booksService.findOne(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a book by ID' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiParam({ name: 'id', description: 'book id to delete' })
  @ApiResponse({ status: 204, description: 'Book deleted successfully.' })
  @ApiResponse({ status: 404, description: 'Book not found.' })
  remove(@Param('id') id: string): Promise<Book | null> {
    return this.booksService.remove(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a book by ID' })
  @ApiParam({ name: 'id', description: 'book id to update' })
  @ApiResponse({ status: 200, description: 'Book updated successfully.' })
  @ApiResponse({ status: 404, description: 'Book not found.' })
  update(
    @Param('id') id: string,
    @Body() updateBookDto: UpdateBookDto,
  ): Promise<Book | null> {
    return this.booksService.update(id, updateBookDto);
  }
}
