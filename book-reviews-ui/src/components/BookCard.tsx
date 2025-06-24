import { Book } from '@/lib/types';
import { Star } from 'lucide-react';
import Link from 'next/link';
import BookCover from './BookCover';

interface BookCardProps {
  book: Book;
}

export default function BookCard({ book }: BookCardProps) {
  return (
    <Link
      href={`/books/${book._id}`}
      className="flex flex-col gap-4 w-full max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
    >
      <BookCover src={book.coverImageUrl} alt={book.title} />
      <div className="flex flex-col">
        <h5 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white line-clamp-2">
          {book.title}
        </h5>
        <p className="font-normal text-gray-700 dark:text-gray-400">
          by {book.author}
        </p>

        {book.averageRating && (
          <div className="flex items-center gap-1 mt-2 text-yellow-500 font-bold">
            <Star className="h-4 w-4 fill-current" />
            <span>{book.averageRating.toFixed(1)}</span>
          </div>
        )}
      </div>
    </Link>
  );
}
