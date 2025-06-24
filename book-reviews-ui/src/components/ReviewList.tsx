import ReviewCard from '@/components/ReviewCard';
import { Review } from '@/lib/types';
import { useState } from 'react';

interface ReviewListProps {
  reviews: Review[];
}

const INITIAL_VISIBLE_COUNT = 3;
const REVIEWS_TO_LOAD = 5;

export default function ReviewList({ reviews }: ReviewListProps) {
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COUNT);

  if (reviews.length === 0) {
    return <p className="text-gray-500">No reviews yet. Be the first!</p>;
  }

  const showLoadMoreButton = visibleCount < reviews.length;

  const handleLoadMore = () => {
    setVisibleCount((prevCount) => prevCount + REVIEWS_TO_LOAD);
  };

  return (
    <div className="space-y-4 w-full">
      <h3 className="text-2xl font-semibold border-b pb-2">Reviews</h3>

      {reviews.slice(0, visibleCount).map((review) => (
        <ReviewCard key={review._id} review={review} />
      ))}

      {showLoadMoreButton && (
        <div className="text-center pt-4">
          <button
            onClick={handleLoadMore}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            Load More Reviews
          </button>
        </div>
      )}
    </div>
  );
}
