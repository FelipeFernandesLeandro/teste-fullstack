'use client';

import BookCard from '@/components/BookCard';
import BookCardSkeleton from '@/components/BookCardSkeleton';
import ErrorMessage from '@/components/ErrorMessage';
import TopRatedBooksSection from '@/components/TopRatedBooksSection';
import { useBooks } from '@/lib/hooks/useBooks';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useState } from 'react';

export default function HomePage() {
  const [page, setPage] = useState(1);
  const booksPerPage = 12;

  const {
    data: books,
    isLoading,
    error,
    isPlaceholderData,
    refetch
  } = useBooks(page, booksPerPage);

  const errorMessage = error instanceof Error ? error.message : 'An error occurred while fetching books';

  if (isLoading) {
    return (
      <main className="flex min-h-screen flex-col items-center p-12 md:p-24">
        <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex mb-12">
          <h1 className="text-4xl font-bold">Book Reviews Platform</h1>
        </div>

        <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {Array.from({ length: booksPerPage }).map((_, index) => (
            <BookCardSkeleton key={index} />
          ))}
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-24">
        <ErrorMessage message={errorMessage} onRetry={() => refetch()} />
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-8 md:p-12 lg:p-24 space-y-16">

      <div className="w-full max-w-7xl text-center">
        <h1 className="text-4xl lg:text-5xl font-bold">Book Reviews Platform</h1>
      </div>

      <TopRatedBooksSection />

      <div className="w-full max-w-7xl">
        <h2 className="text-3xl font-bold mb-6">All Books</h2>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {Array.from({ length: booksPerPage }).map((_, index) => (
              <BookCardSkeleton key={index} />
            ))}
          </div>
        ) : error ? (
          <ErrorMessage message={errorMessage} onRetry={() => refetch()} />
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {books?.data?.map((book) => (
                <BookCard key={book._id} book={book} />
              ))}
            </div>

            {books?.data?.length === 0 && (
              <p className="mt-8 text-gray-500">No books found.</p>
            )}

            <div className="flex items-center justify-center gap-4 mt-12">
              <button
                onClick={() => setPage((old) => Math.max(old - 1, 1))}
                disabled={page === 1}
                aria-label="Previous Page"
                className="p-2 bg-blue-600 text-white rounded-full disabled:bg-gray-400 hover:bg-blue-700 transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>

              <span className="font-medium text-lg">
                Page {books?.page} of {books?.totalPages}
              </span>

              <button
                onClick={() => setPage((old) => old + 1)}
                disabled={isPlaceholderData || page === books?.totalPages}
                aria-label="Next Page"
                className="p-2 bg-blue-600 text-white rounded-full disabled:bg-gray-400 hover:bg-blue-700 transition-colors"
              >
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
