export interface Review {
  _id: string
  reviewerName: string
  rating: number
  comment?: string
}

export interface Book {
  _id: string
  title: string
  author: string
  isbn?: string
  coverImageUrl?: string
  reviews?: Review[]
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}
