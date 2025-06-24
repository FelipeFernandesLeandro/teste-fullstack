"use client"

import { Book } from "@/lib/types"
import { useQuery } from "@tanstack/react-query"

const fetchTopRatedBooks = async (limit: number): Promise<Book[]> => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  const res = await fetch(`${apiUrl}/books/top?limit=${limit}`)

  if (!res.ok) {
    throw new Error("An error occurred while fetching the top rated books")
  }

  return res.json()
}

export function useTopRatedBooks(limit: number = 5) {
  return useQuery({
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchInterval: false,
    queryKey: ["books", "top", limit],
    queryFn: () => fetchTopRatedBooks(limit),
  })
}
