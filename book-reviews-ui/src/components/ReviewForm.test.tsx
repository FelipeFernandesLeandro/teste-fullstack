import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ReviewForm from './ReviewForm';

const mockMutate = jest.fn();
jest.mock('@/lib/hooks/useAddReview', () => ({
  useAddReview: () => ({
    mutate: mockMutate,
    isPending: false,
  }),
}));

describe('ReviewForm', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render all form fields and the submit button', () => {
    render(<ReviewForm bookId="123" />);

    expect(screen.getByLabelText(/Your Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Rating/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Comment/i)).toBeInTheDocument();

    expect(screen.getByRole('button', { name: /Submit Review/i })).toBeInTheDocument();
  });

  it('should call the mutation function with the correct data on submit', async () => {
    const user = userEvent.setup();
    render(<ReviewForm bookId="test-book-id" />);

    await user.type(screen.getByLabelText(/Your Name/i), 'John Doe');
    await user.selectOptions(screen.getByLabelText(/Rating/i), '5');
    await user.type(screen.getByLabelText(/Comment/i), 'This is a fantastic book!');
    await user.click(screen.getByRole('button', { name: /Submit Review/i }));

    expect(mockMutate).toHaveBeenCalledTimes(1);
    expect(mockMutate).toHaveBeenCalledWith(
      {
        bookId: 'test-book-id',
        reviewData: {
          reviewerName: 'John Doe',
          rating: 5,
          comment: 'This is a fantastic book!',
        },
      },
      expect.anything(),
    );
  });
});
