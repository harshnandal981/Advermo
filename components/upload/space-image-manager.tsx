'use client';

import { useState } from 'react';
import { ImageUploader } from './image-uploader';
import { ImageGallery } from './image-gallery';
import { ImageLightbox } from './image-lightbox';
import { ImageData } from '@/types';

interface SpaceImageManagerProps {
  spaceId?: string;
  initialImages?: ImageData[];
  onImagesChange?: (images: ImageData[]) => void;
  maxImages?: number;
}

export function SpaceImageManager({
  spaceId,
  initialImages = [],
  onImagesChange,
  maxImages = 10,
}: SpaceImageManagerProps) {
  const [images, setImages] = useState<ImageData[]>(initialImages);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async (files: File[]) => {
    setIsUploading(true);
    try {
      const formData = new FormData();
      
      // For multiple files
      if (files.length > 1) {
        files.forEach((file) => {
          formData.append('files', file);
        });
        formData.append('folder', 'spaces');
        formData.append('resourceType', 'space');
        if (spaceId) {
          formData.append('resourceId', spaceId);
        }

        const response = await fetch('/api/upload/multiple', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Upload failed');
        }

        const result = await response.json();
        
        // Add successful uploads to images
        const newImages: ImageData[] = result.data
          .filter((r: any) => r.success)
          .map((r: any, index: number) => ({
            url: r.data.url,
            publicId: r.data.publicId,
            width: r.data.width,
            height: r.data.height,
            format: r.data.format,
            uploadedAt: new Date(),
            isPrimary: images.length === 0 && index === 0,
            order: images.length + index,
          }));

        const updatedImages = [...images, ...newImages];
        setImages(updatedImages);
        onImagesChange?.(updatedImages);

        if (result.summary.failed > 0) {
          alert(`${result.summary.failed} image(s) failed to upload`);
        }
      } else if (files.length === 1) {
        // For single file
        formData.append('file', files[0]);
        formData.append('folder', 'spaces');
        formData.append('resourceType', 'space');
        if (spaceId) {
          formData.append('resourceId', spaceId);
        }

        const response = await fetch('/api/upload/image', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Upload failed');
        }

        const result = await response.json();
        
        const newImage: ImageData = {
          url: result.data.url,
          publicId: result.data.publicId,
          width: result.data.width,
          height: result.data.height,
          format: result.data.format,
          uploadedAt: new Date(),
          isPrimary: images.length === 0,
          order: images.length,
        };

        const updatedImages = [...images, newImage];
        setImages(updatedImages);
        onImagesChange?.(updatedImages);
      }
    } catch (error: any) {
      console.error('Upload error:', error);
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (publicId: string) => {
    try {
      const response = await fetch(`/api/upload/delete?publicId=${encodeURIComponent(publicId)}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Delete failed');
      }

      const updatedImages = images.filter((img) => img.publicId !== publicId);
      
      // If we deleted the primary image, make the first image primary
      if (updatedImages.length > 0) {
        updatedImages[0].isPrimary = true;
      }
      
      setImages(updatedImages);
      onImagesChange?.(updatedImages);
    } catch (error: any) {
      console.error('Delete error:', error);
      throw error;
    }
  };

  const handleSetPrimary = async (publicId: string) => {
    const updatedImages = images.map((img) => ({
      ...img,
      isPrimary: img.publicId === publicId,
    }));
    
    setImages(updatedImages);
    onImagesChange?.(updatedImages);
  };

  const handleImageClick = (index: number) => {
    setLightboxIndex(index);
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
  };

  const nextImage = () => {
    if (lightboxIndex !== null && lightboxIndex < images.length - 1) {
      setLightboxIndex(lightboxIndex + 1);
    }
  };

  const previousImage = () => {
    if (lightboxIndex !== null && lightboxIndex > 0) {
      setLightboxIndex(lightboxIndex - 1);
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload section */}
      {images.length < maxImages && (
        <ImageUploader
          onUpload={handleUpload}
          maxFiles={maxImages}
          folder="spaces"
          existingImages={images}
          disabled={isUploading}
        />
      )}

      {/* Gallery section */}
      {images.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-4">
            Uploaded Images
          </h3>
          <ImageGallery
            images={images}
            onDelete={handleDelete}
            onSetPrimary={handleSetPrimary}
            onImageClick={handleImageClick}
            editable={true}
          />
        </div>
      )}

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <ImageLightbox
          images={images}
          currentIndex={lightboxIndex}
          onClose={closeLightbox}
          onNext={nextImage}
          onPrevious={previousImage}
        />
      )}

      {/* Tips */}
      {images.length === 0 && (
        <div className="text-sm text-gray-500 dark:text-gray-400 space-y-1">
          <p>📸 Tips for great photos:</p>
          <ul className="list-disc list-inside ml-2 space-y-1">
            <li>Use good lighting - natural light works best</li>
            <li>Show the ad spot from multiple angles</li>
            <li>Include context - show the venue and surroundings</li>
            <li>First photo will be the main image in listings</li>
          </ul>
        </div>
      )}
    </div>
  );
}
