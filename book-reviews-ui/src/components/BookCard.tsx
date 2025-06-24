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
      <BookCover src={book.coverImageUrl} alt={book.title + ' cover'} />
      <div className="flex flex-col">
        <h5 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white line-clamp-2">
          {book.title}
        </h5>
        <p className="font-normal text-gray-700 dark:text-gray-400">
          by {book.author}
        </p>

        {(book.averageRating || book.reviewCount) && (
          <div className="flex items-center gap-2 mt-2">
            {book.averageRating && (
              <span className="flex items-center gap-1 text-yellow-500 font-bold">
                <Star className="h-4 w-4 fill-current" />
                {book.averageRating.toFixed(1)}
              </span>
            )}

            {book.averageRating && book.reviewCount ? (
              <span className="text-gray-400">·</span>
            ) : null}

            {book.reviewCount !== undefined && (
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {book.reviewCount} review{book.reviewCount === 1 ? '' : 's'}
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}
