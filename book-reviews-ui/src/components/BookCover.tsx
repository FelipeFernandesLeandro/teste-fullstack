'use client';

import Image from 'next/image';
import { useState } from 'react';

interface BookCoverProps {
  src?: string;
  alt: string;
  className?: string;
}

const PLACEHOLDER_IMAGE = '/images/placeholder-book-cover.jpg';

export default function BookCover({ src, alt, className }: BookCoverProps) {
  const [imageSrc, setImageSrc] = useState(src || PLACEHOLDER_IMAGE);

  const handleError = () => {
    setImageSrc(PLACEHOLDER_IMAGE);
  };

  return (
    <div className={`relative aspect-[2/3] w-full ${className}`}>
      <Image
        src={imageSrc}
        alt={alt}
        fill
        className="object-cover rounded-md"
        onError={handleError}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
    </div>
  );
}
