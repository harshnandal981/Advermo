'use client';

import { useState } from 'react';
import { SpaceImageManager } from '@/components/upload/space-image-manager';
import { AvatarUploader } from '@/components/upload/avatar-uploader';
import { ImageData } from '@/types';

export default function ImageUploadExample() {
  const [spaceImages, setSpaceImages] = useState<ImageData[]>([]);
  const [avatar, setAvatar] = useState<string>();

  const handleAvatarUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', 'profiles');
    formData.append('resourceType', 'profile');

    const response = await fetch('/api/upload/image', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Upload failed');
    }

    const result = await response.json();
    setAvatar(result.data.url);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold mb-2">Image Upload Examples</h1>
        <p className="text-muted-foreground mb-8">
          Demonstration of Cloudinary image upload components
        </p>

        {/* Avatar Upload */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Avatar Upload</h2>
          <div className="p-6 rounded-lg border bg-card">
            <AvatarUploader
              currentAvatar={avatar}
              onUpload={handleAvatarUpload}
              size="lg"
            />
          </div>
        </section>

        {/* Space Images Upload */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Ad Space Images</h2>
          <div className="p-6 rounded-lg border bg-card">
            <SpaceImageManager
              onImagesChange={setSpaceImages}
              maxImages={10}
            />
          </div>
        </section>

        {/* Debug Info */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Debug Information</h2>
          <div className="p-6 rounded-lg border bg-card">
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Avatar:</h3>
                <pre className="text-xs bg-muted p-3 rounded overflow-auto">
                  {JSON.stringify({ avatar }, null, 2)}
                </pre>
              </div>
              <div>
                <h3 className="font-medium mb-2">Space Images ({spaceImages.length}):</h3>
                <pre className="text-xs bg-muted p-3 rounded overflow-auto max-h-96">
                  {JSON.stringify(spaceImages, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        </section>

        {/* Setup Instructions */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Setup Instructions</h2>
          <div className="p-6 rounded-lg border bg-card">
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <h3>1. Configure Cloudinary</h3>
              <p>Add these variables to your <code>.env.local</code>:</p>
              <pre className="bg-muted p-3 rounded text-xs overflow-auto">
{`NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=advermo_uploads

MAX_IMAGE_SIZE=10485760
MAX_IMAGES_PER_SPACE=10
ALLOWED_IMAGE_TYPES=image/jpeg,image/png,image/webp,image/jpg`}
              </pre>

              <h3 className="mt-6">2. Sign up for Cloudinary</h3>
              <ol>
                <li>Visit <a href="https://cloudinary.com" target="_blank" rel="noopener">cloudinary.com</a></li>
                <li>Create a free account (25GB storage, 25GB bandwidth/month)</li>
                <li>Go to Dashboard and copy your credentials</li>
                <li>Create an upload preset named advermo_uploads</li>
              </ol>

              <h3 className="mt-6">3. Test the Upload</h3>
              <ol>
                <li>Make sure you are signed in</li>
                <li>Use the upload components above</li>
                <li>Images will be stored in Cloudinary</li>
                <li>Metadata is saved to MongoDB</li>
              </ol>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
