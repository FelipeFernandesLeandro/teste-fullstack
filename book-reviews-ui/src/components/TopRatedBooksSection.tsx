// src/components/TopRatedBooksSection.tsx
'use client';

import { useTopRatedBooks } from "@/lib/hooks/useTopRatedBooks";
import BookCard from "./BookCard";
import BookCardSkeleton from "./BookCardSkeleton";

export default function TopRatedBooksSection() {
	const { data: topBooks, isLoading, error } = useTopRatedBooks(4);

    if (error || (!isLoading && (!topBooks || topBooks.length === 0))) {
        return null;
    }

    return (
        <div className="w-full max-w-7xl mb-16">
            <h2 className="text-3xl font-bold mb-6">Top Rated Books</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {isLoading ? (
                    Array.from({ length: 4 }).map((_, i) => <BookCardSkeleton key={i} />)
                ) : (
                    topBooks?.map(book => (
                        <BookCard key={book._id} book={book} />
                    ))
                )}
            </div>
        </div>
    );
}
