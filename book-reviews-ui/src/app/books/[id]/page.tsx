'use client';

import ReviewForm from '@/components/ReviewForm';
import ReviewList from '@/components/ReviewList';
import { useBookById } from '@/lib/hooks/useBookById';
import { useParams } from 'next/navigation';

export default function BookDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const { data: book, isLoading, error } = useBookById(id);

  if (isLoading) {
    return <main className="flex min-h-screen flex-col items-center p-24"><p>Loading book details...</p></main>;
  }

  if (error) {
    return <main className="flex min-h-screen flex-col items-center p-24"><p>Error: {error.message}</p></main>;
  }

  if (!book) {
    return <main className="flex min-h-screen flex-col items-center p-24"><p>Book not found.</p></main>;
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-8 md:p-16">
      <div className="w-full max-w-4xl space-y-8">
        <div className="pb-8 border-b">
          <h1 className="text-5xl font-extrabold">{book.title}</h1>
          <p className="mt-2 text-2xl text-gray-600 dark:text-gray-400">by {book.author}</p>
          {book.isbn && <p className="mt-4 text-sm text-gray-500">ISBN: {book.isbn}</p>}
        </div>

        <ReviewList reviews={book.reviews || []} />

        <ReviewForm bookId={book._id} />

      </div>
    </main>
  );
}
