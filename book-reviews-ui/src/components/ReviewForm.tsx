'use client';

import { useAddReview } from '@/lib/hooks/useAddReview';
import { SubmitHandler, useForm } from 'react-hook-form';

interface ReviewFormProps {
  bookId: string;
}

type FormInputs = {
  reviewerName: string;
  rating: number;
  comment: string;
};

export default function ReviewForm({ bookId }: ReviewFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormInputs>();

  const { mutate: addReview, isPending } = useAddReview();

  const onSubmit: SubmitHandler<FormInputs> = (data) => {
    const reviewData = { ...data, rating: Number(data.rating) };

    addReview(
      { bookId, reviewData },
      {
        onSuccess: () => {
          reset();
        },
      },
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-4 pt-6 border-t">
      <h3 className="text-2xl font-semibold">Add Your Review</h3>

      <div>
        <label htmlFor="reviewerName" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          Your Name
        </label>
        <input
          id="reviewerName"
          {...register('reviewerName', { required: 'Your name is required' })}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
        />
        {errors.reviewerName && <p className="mt-1 text-sm text-red-600">{errors.reviewerName.message}</p>}
      </div>

      <div>
        <label htmlFor="rating" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          Rating
        </label>
        <select
          id="rating"
          {...register('rating', { required: 'Rating is required' })}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        >
          <option value="">Select a rating</option>
          <option value="1">1 Star</option>
          <option value="2">2 Stars</option>
          <option value="3">3 Stars</option>
          <option value="4">4 Stars</option>
          <option value="5">5 Stars</option>
        </select>
        {errors.rating && <p className="mt-1 text-sm text-red-600">{errors.rating.message}</p>}
      </div>

      <div>
        <label htmlFor="comment" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          Comment
        </label>
        <textarea
          id="comment"
          rows={4}
          {...register('comment')}
          className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 disabled:bg-gray-400"
      >
        {isPending ? 'Submitting...' : 'Submit Review'}
      </button>
    </form>
  );
}
