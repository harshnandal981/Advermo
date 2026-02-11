'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Camera, Loader2, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { validateImageFile } from '@/lib/utils/upload';

interface AvatarUploaderProps {
  currentAvatar?: string;
  onUpload: (file: File) => Promise<void>;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
}

export function AvatarUploader({
  currentAvatar,
  onUpload,
  size = 'md',
  disabled = false,
}: AvatarUploaderProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const sizeClasses = {
    sm: 'w-20 h-20',
    md: 'w-32 h-32',
    lg: 'w-40 h-40',
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    const validation = validateImageFile(file);
    
    if (!validation.valid) {
      alert(validation.error);
      return;
    }

    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/webp': ['.webp'],
    },
    maxFiles: 1,
    disabled: disabled || isUploading,
  });

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    try {
      await onUpload(selectedFile);
      
      // Clear preview on success
      if (preview) {
        URL.revokeObjectURL(preview);
      }
      setPreview(null);
      setSelectedFile(null);
    } catch (error: any) {
      console.error('Upload error:', error);
      alert(error.message || 'Failed to upload avatar');
    } finally {
      setIsUploading(false);
    }
  };

  const handleCancel = () => {
    if (preview) {
      URL.revokeObjectURL(preview);
    }
    setPreview(null);
    setSelectedFile(null);
  };

  const displayImage = preview || currentAvatar;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        {/* Avatar display */}
        <div
          {...getRootProps()}
          className={`
            ${sizeClasses[size]} rounded-full overflow-hidden
            border-2 border-gray-300 dark:border-gray-700
            relative group cursor-pointer
            ${disabled || isUploading ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          <input {...getInputProps()} />
          
          {displayImage ? (
            <img
              src={displayImage}
              alt="Avatar"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
              <User className="h-12 w-12 text-gray-400" />
            </div>
          )}

          {/* Hover overlay */}
          {!disabled && !isUploading && (
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Camera className="h-8 w-8 text-white" />
            </div>
          )}

          {/* Loading overlay */}
          {isUploading && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <Loader2 className="h-8 w-8 text-white animate-spin" />
            </div>
          )}
        </div>

        {/* Upload controls */}
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
            Profile Picture
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
            Click or drag to change • JPG, PNG, or WEBP • Max 10MB
          </p>
          
          {selectedFile && (
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={handleUpload}
                disabled={isUploading}
              >
                {isUploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  'Upload'
                )}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleCancel}
                disabled={isUploading}
              >
                Cancel
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
