'use client';

import BookCard from '@/components/BookCard';
import { useBooks } from '@/lib/hooks/useBooks';

export default function HomePage() {
  const { data: books, isLoading, error } = useBooks();

  if (isLoading) {
    return (
      <main className="flex min-h-screen flex-col items-center p-24">
        <p>Loading books...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex min-h-screen flex-col items-center p-24">
        <p>Error loading books: {error.message}</p>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-12 md:p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex mb-12">
        <h1 className="text-4xl font-bold">Book Reviews Platform</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {books?.map((book) => (
          <BookCard key={book._id} book={book} />
        ))}
      </div>

      {books && books.length === 0 && (
        <p className="mt-8 text-gray-500">No books found. Try adding one!</p>
      )}
    </main>
  );
}
