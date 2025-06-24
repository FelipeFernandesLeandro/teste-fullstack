"use client"

import { Book, Review } from "@/lib/types"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "react-hot-toast"

type AddReviewPayload = {
  bookId: string
  reviewData: {
    reviewerName: string
    rating: number
    comment?: string
  }
}

type OptimisticUpdateContext = {
  previousBook?: Book
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

  return useMutation<Review, Error, AddReviewPayload, OptimisticUpdateContext>({
    mutationFn: addReview,
    onMutate: async (newReviewPayload) => {
      const { bookId, reviewData } = newReviewPayload
      const queryKey = ["book", bookId]

      await queryClient.cancelQueries({ queryKey })

      const previousBook = queryClient.getQueryData<Book>(queryKey)

      queryClient.setQueryData<Book>(queryKey, (oldBook) => {
        if (!oldBook) return undefined

        const optimisticReview: Review = {
          _id: `optimistic-${Date.now()}`,
          ...reviewData,
        }

        return {
          ...oldBook,
          reviews: [...(oldBook.reviews || []), optimisticReview],
        }
      })

      return { previousBook }
    },

    onError: (error, variables, context) => {
      toast.error(`Failed to add review: ${error.message}`)
      if (context?.previousBook) {
        queryClient.setQueryData(
          ["book", variables.bookId],
          context.previousBook,
        )
      }
    },

    onSettled: (data, error, variables) => {
      queryClient.invalidateQueries({ queryKey: ["book", variables.bookId] })
    },
  })
}
