"use client"

import { Book } from "@/lib/types"
import { useQuery } from "@tanstack/react-query"

const fetchBooks = async (): Promise<Book[]> => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  const res = await fetch(`${apiUrl}/books`)

  if (!res.ok) {
    throw new Error("An error occurred while fetching the books")
  }

  return res.json()
}

export function useBooks() {
  return useQuery({
    queryKey: ["books"],
    queryFn: fetchBooks,
  })
}
