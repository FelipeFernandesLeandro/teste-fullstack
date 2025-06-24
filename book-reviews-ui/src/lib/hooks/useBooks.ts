"use client"

import { Book, PaginatedResponse } from "@/lib/types"
import { useQuery } from "@tanstack/react-query"

const fetchBooks = async (
  page: number = 1,
  limit: number = 12,
): Promise<PaginatedResponse<Book>> => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  const res = await fetch(`${apiUrl}/books?page=${page}&limit=${limit}`)

  if (!res.ok) {
    throw new Error("An error occurred while fetching the books")
  }

  return res.json()
}

export function useBooks(page: number, limit: number) {
  const query = useQuery<PaginatedResponse<Book>, Error>({
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchInterval: false,
    queryKey: ["books", page, limit] as const,
    queryFn: () => fetchBooks(page, limit),
    placeholderData: (previousData) => previousData,
  })

  return {
    ...query,
    data: query.data,
    error: query.error,
    isLoading: query.isLoading,
    isPlaceholderData: query.isPlaceholderData,
    refetch: query.refetch,
  }
}
