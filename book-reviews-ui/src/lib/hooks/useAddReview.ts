"use client"

import { Review } from "@/lib/types"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "react-hot-toast"

interface AddReviewPayload {
  bookId: string
  reviewData: {
    reviewerName: string
    rating: number
    comment?: string
  }
}

const addReview = async ({
  bookId,
  reviewData,
}: AddReviewPayload): Promise<Review> => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  const res = await fetch(`${apiUrl}/books/${bookId}/reviews`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(reviewData),
  })

  if (!res.ok) {
    const errorData = await res.json()
    throw new Error(
      errorData.message || "An error occurred while adding the review",
    )
  }

  return res.json()
}

export function useAddReview() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: addReview,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["book", variables.bookId] })
    },
    onError: (error) => {
      toast.error(`Failed to add review: ${error.message}`)
      console.error("Failed to add review:", error)
    },
  })
}
