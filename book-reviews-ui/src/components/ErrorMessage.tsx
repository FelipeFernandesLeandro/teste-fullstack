'use client';

import { TriangleAlert } from 'lucide-react';

interface ErrorMessageProps {
  message?: string;
  onRetry: () => void; // Função para ser chamada ao clicar em "Tentar Novamente"
}

export default function ErrorMessage({
  message = 'An unexpected error occurred.',
  onRetry,
}: ErrorMessageProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 p-8 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-300">
      <TriangleAlert className="w-12 h-12" />
      <div className="text-center">
        <h3 className="text-xl font-semibold">Oops! Something went wrong.</h3>
        <p className="mt-1 text-sm">{message}</p>
      </div>
      <button
        onClick={onRetry}
        className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
      >
        Try Again
      </button>
    </div>
  );
}
