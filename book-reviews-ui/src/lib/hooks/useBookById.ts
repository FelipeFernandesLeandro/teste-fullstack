"use client"

import { Book } from "@/lib/types"
import { useQuery } from "@tanstack/react-query"

const fetchBookById = async (bookId: string): Promise<Book> => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  const res = await fetch(`${apiUrl}/books/${bookId}`)

  if (!res.ok) {
    throw new Error("An error occurred while fetching the book")
  }

  return res.json()
}

export function useBookById(bookId: string) {
  return useQuery({
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchInterval: false,
    queryKey: ["book", bookId],
    queryFn: () => fetchBookById(bookId),
    enabled: !!bookId,
  })
}
