'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { validateImageFile, formatFileSize } from '@/lib/utils/upload';
import { toast } from '@/lib/utils/toast';
import { UploadProgress as UploadProgressType } from '@/types';

interface ImageUploaderProps {
  onUpload: (files: File[]) => Promise<void>;
  maxFiles?: number;
  folder?: string;
  existingImages?: any[];
  disabled?: boolean;
}

export function ImageUploader({
  onUpload,
  maxFiles = 10,
  folder = 'spaces',
  existingImages = [],
  disabled = false,
}: ImageUploaderProps) {
  const [uploadProgress, setUploadProgress] = useState<UploadProgressType[]>([]);
  const [previews, setPreviews] = useState<{ file: File; preview: string }[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    // Validate each file
    const validFiles: File[] = [];
    const errors: string[] = [];

    for (const file of acceptedFiles) {
      const validation = validateImageFile(file);
      if (validation.valid) {
        validFiles.push(file);
      } else {
        errors.push(`${file.name}: ${validation.error}`);
      }
    }

    // Show errors if any
    if (errors.length > 0) {
      toast.error(errors.join(', '));
      return;
    }

    // Check total file count
    const totalFiles = existingImages.length + validFiles.length + previews.length;
    if (totalFiles > maxFiles) {
      toast.error(`Maximum ${maxFiles} images allowed. You have ${existingImages.length} existing images.`);
      return;
    }

    // Create previews
    const newPreviews = validFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    setPreviews((prev) => [...prev, ...newPreviews]);
  }, [existingImages.length, maxFiles, previews.length]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/webp': ['.webp'],
    },
    maxFiles,
    disabled: disabled || isUploading,
  });

  const removePreview = (index: number) => {
    setPreviews((prev) => {
      const newPreviews = [...prev];
      URL.revokeObjectURL(newPreviews[index].preview);
      newPreviews.splice(index, 1);
      return newPreviews;
    });
  };

  const handleUpload = async () => {
    if (previews.length === 0) return;

    setIsUploading(true);
    setUploadProgress(
      previews.map((p) => ({
        fileName: p.file.name,
        progress: 0,
        status: 'uploading' as const,
      }))
    );

    try {
      await onUpload(previews.map((p) => p.file));
      
      // Clear previews on success
      previews.forEach((p) => URL.revokeObjectURL(p.preview));
      setPreviews([]);
      setUploadProgress([]);
      
      toast.success(`Successfully uploaded ${previews.length} image${previews.length > 1 ? 's' : ''}`);
    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error(error.message || 'Failed to upload images');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Drop zone */}
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
          transition-colors duration-200
          ${isDragActive ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950' : 'border-gray-300 dark:border-gray-700'}
          ${disabled || isUploading ? 'opacity-50 cursor-not-allowed' : 'hover:border-indigo-400'}
        `}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <p className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
          {isDragActive ? 'Drop images here' : 'Drag & drop images here'}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          or click to browse files
        </p>
        <p className="text-xs text-gray-400">
          Supports: JPG, PNG, WEBP • Max size: 10MB per image • Max {maxFiles} images
        </p>
      </div>

      {/* Preview images */}
      {previews.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
            Ready to Upload ({previews.length})
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {previews.map((preview, index) => (
              <div key={index} className="relative group">
                <img
                  src={preview.preview}
                  alt={preview.file.name}
                  className="w-full h-32 object-cover rounded-lg"
                />
                <button
                  onClick={() => removePreview(index)}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  disabled={isUploading}
                >
                  <X className="h-4 w-4" />
                </button>
                <div className="mt-1 text-xs text-gray-500 truncate">
                  {preview.file.name}
                </div>
                <div className="text-xs text-gray-400">
                  {formatFileSize(preview.file.size)}
                </div>
              </div>
            ))}
          </div>

          {/* Upload progress */}
          {isUploading && uploadProgress.length > 0 && (
            <div className="space-y-2">
              {uploadProgress.map((progress, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-700 dark:text-gray-300 truncate flex-1">
                      {progress.fileName}
                    </span>
                    <span className="text-gray-500 ml-2">
                      {progress.status === 'uploading' && 'Uploading...'}
                      {progress.status === 'success' && '✓ Done'}
                      {progress.status === 'error' && '✗ Failed'}
                    </span>
                  </div>
                  {progress.status === 'uploading' && (
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-indigo-600 h-2 rounded-full animate-pulse w-full" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Upload button */}
          <Button
            onClick={handleUpload}
            disabled={isUploading || previews.length === 0}
            className="w-full"
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Upload {previews.length} {previews.length === 1 ? 'Image' : 'Images'}
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
