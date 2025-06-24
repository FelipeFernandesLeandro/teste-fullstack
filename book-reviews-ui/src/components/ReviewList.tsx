import { Review } from '@/lib/types';

interface ReviewListProps {
  reviews: Review[];
}

export default function ReviewList({ reviews }: ReviewListProps) {
  if (reviews.length === 0) {
    return <p className="text-gray-500">No reviews yet. Be the first!</p>;
  }

  return (
    <div className="space-y-4 w-full">
      <h3 className="text-2xl font-semibold border-b pb-2">Reviews</h3>
      {reviews.map((review) => (
        <div key={review._id} className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-800">
          <div className="flex items-baseline gap-4">
            <p className="font-bold text-lg">{review.reviewerName}</p>
            <p className="text-yellow-500">{'★'.repeat(review.rating)}</p>
          </div>
          <p className="mt-2 text-gray-700 dark:text-gray-300">{review.comment}</p>
        </div>
      ))}
    </div>
  );
}
