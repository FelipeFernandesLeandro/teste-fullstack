'use client';

import { Review } from '@/lib/types';
import { useEffect, useRef, useState } from 'react';

interface ReviewCardProps {
  review: Review;
}

export default function ReviewCard({ review }: ReviewCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const commentRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (commentRef.current) {
      setIsOverflowing(commentRef.current.scrollHeight > commentRef.current.clientHeight);
    }
  }, [review.comment]);

  const toggleIsExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-800 transition-all duration-300">
      <div className="flex items-baseline gap-4">
        <p className="font-bold text-lg">{review.reviewerName}</p>
        <p className="text-yellow-500">{'★'.repeat(review.rating)}</p>
      </div>

      <p
        ref={commentRef}
        className={`mt-2 text-gray-700 dark:text-gray-300 ${
          isExpanded ? '' : 'line-clamp-3'
        }`}
      >
        {review.comment}
      </p>

      {isOverflowing && (
        <button
          onClick={toggleIsExpanded}
          className="text-sm font-semibold text-blue-600 hover:underline mt-2"
        >
          {isExpanded ? 'Show Less' : 'Read More'}
        </button>
      )}
    </div>
  );
}
