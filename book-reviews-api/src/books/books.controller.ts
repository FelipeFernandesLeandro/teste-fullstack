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
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BooksService } from 'src/books/books.service';
import { CreateBookDto } from 'src/books/dto/create-book.dto';
import { Book } from 'src/books/schemas/book.schema';

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
  findAll(): Promise<Book[]> {
    return this.booksService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find a book by ID' })
  @ApiParam({ name: 'id', description: 'book id to find' })
  @ApiResponse({ status: 200, description: 'Book found successfully.' })
  @ApiResponse({ status: 404, description: 'Book not found.' })
  findOne(@Param('id') id: string): Promise<Book | null> {
    return this.booksService.findOne(id);
  }

  @Get('top-rated')
  @ApiOperation({ summary: 'Find top rated books' })
  @ApiResponse({ status: 200, description: 'List of top rated books.' })
  @ApiParam({ name: 'limit', description: 'Number of books to return' })
  findTopRated(@Query('limit') limit: number = 10): Promise<Book[]> {
    return this.booksService.findTopRated(limit);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a book by ID' })
  @ApiParam({ name: 'id', description: 'ID do livro a ser removido' })
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
    @Body() updateBookDto: CreateBookDto,
  ): Promise<Book | null> {
    return this.booksService.update(id, updateBookDto);
  }
}
