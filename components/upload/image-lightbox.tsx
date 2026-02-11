'use client';

import { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ImageData } from '@/types';

interface ImageLightboxProps {
  images: ImageData[];
  currentIndex: number;
  onClose: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
}

export function ImageLightbox({
  images,
  currentIndex,
  onClose,
  onNext,
  onPrevious,
}: ImageLightboxProps) {
  const currentImage = images[currentIndex];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft' && onPrevious) {
        onPrevious();
      } else if (e.key === 'ArrowRight' && onNext) {
        onNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, onNext, onPrevious]);

  if (!currentImage) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
      onClick={onClose}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
      >
        <X className="h-8 w-8" />
      </button>

      {/* Image counter */}
      <div className="absolute top-4 left-4 text-white text-sm z-10">
        {currentIndex + 1} of {images.length}
      </div>

      {/* Download button */}
      <a
        href={currentImage.url}
        download
        className="absolute top-4 right-16 text-white hover:text-gray-300 z-10"
        onClick={(e) => e.stopPropagation()}
      >
        <Download className="h-6 w-6" />
      </a>

      {/* Previous button */}
      {currentIndex > 0 && onPrevious && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onPrevious();
          }}
          className="absolute left-4 text-white hover:text-gray-300"
        >
          <ChevronLeft className="h-12 w-12" />
        </button>
      )}

      {/* Next button */}
      {currentIndex < images.length - 1 && onNext && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onNext();
          }}
          className="absolute right-4 text-white hover:text-gray-300"
        >
          <ChevronRight className="h-12 w-12" />
        </button>
      )}

      {/* Image */}
      <div
        className="max-w-7xl max-h-[90vh] p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={currentImage.url}
          alt={`Image ${currentIndex + 1}`}
          className="max-w-full max-h-full object-contain"
        />
      </div>
    </div>
  );
}
