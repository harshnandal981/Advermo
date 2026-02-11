'use client';

import { useState } from 'react';
import { Star, Trash2, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ImageData } from '@/types';

interface ImageGalleryProps {
  images: ImageData[];
  onDelete?: (publicId: string) => void;
  onSetPrimary?: (publicId: string) => void;
  onReorder?: (images: ImageData[]) => void;
  editable?: boolean;
  onImageClick?: (index: number) => void;
}

export function ImageGallery({
  images,
  onDelete,
  onSetPrimary,
  onReorder,
  editable = false,
  onImageClick,
}: ImageGalleryProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (publicId: string) => {
    if (!confirm('Are you sure you want to delete this image?')) {
      return;
    }

    setDeletingId(publicId);
    try {
      await onDelete?.(publicId);
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete image');
    } finally {
      setDeletingId(null);
    }
  };

  const handleSetPrimary = async (publicId: string) => {
    try {
      await onSetPrimary?.(publicId);
    } catch (error) {
      console.error('Set primary error:', error);
      alert('Failed to set primary image');
    }
  };

  if (images.length === 0) {
    return (
      <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-12 text-center">
        <ImageIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <p className="text-gray-500 dark:text-gray-400">No images yet</p>
        <p className="text-sm text-gray-400 mt-1">Upload images to get started</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {images.length} {images.length === 1 ? 'image' : 'images'}
        </p>
        {editable && images.length > 1 && (
          <p className="text-xs text-gray-500">
            First image is the main photo
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((image, index) => (
          <div
            key={image.publicId}
            className="relative group rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700"
          >
            {/* Image */}
            <div
              className="aspect-[4/3] relative cursor-pointer"
              onClick={() => onImageClick?.(index)}
            >
              <img
                src={image.url}
                alt={`Image ${index + 1}`}
                className="w-full h-full object-cover"
              />
              
              {/* Primary badge */}
              {(image.isPrimary || index === 0) && (
                <div className="absolute top-2 left-2 bg-indigo-600 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                  <Star className="h-3 w-3 fill-current" />
                  <span>Main</span>
                </div>
              )}
            </div>

            {/* Actions overlay */}
            {editable && (
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                {!image.isPrimary && index !== 0 && onSetPrimary && (
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => handleSetPrimary(image.publicId)}
                    className="text-xs"
                  >
                    <Star className="h-3 w-3 mr-1" />
                    Set Main
                  </Button>
                )}
                
                {onDelete && images.length > 1 && (
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(image.publicId)}
                    disabled={deletingId === image.publicId}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
