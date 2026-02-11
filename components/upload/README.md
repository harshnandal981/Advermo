# Image Upload Components

This directory contains all image upload and management components for the Advermo platform.

## Components

### ImageUploader
Main upload component with drag & drop functionality.

```tsx
import { ImageUploader } from '@/components/upload/image-uploader';

<ImageUploader
  onUpload={async (files) => {
    // Handle upload
  }}
  maxFiles={10}
  folder="spaces"
  existingImages={[]}
/>
```

### ImageGallery
Display and manage uploaded images.

```tsx
import { ImageGallery } from '@/components/upload/image-gallery';

<ImageGallery
  images={images}
  onDelete={handleDelete}
  onSetPrimary={handleSetPrimary}
  onImageClick={handleImageClick}
  editable={true}
/>
```

### ImageLightbox
Full-screen image viewer.

```tsx
import { ImageLightbox } from '@/components/upload/image-lightbox';

<ImageLightbox
  images={images}
  currentIndex={0}
  onClose={() => setLightboxOpen(false)}
  onNext={() => setIndex(i => i + 1)}
  onPrevious={() => setIndex(i => i - 1)}
/>
```

### AvatarUploader
Profile picture uploader with circular crop.

```tsx
import { AvatarUploader } from '@/components/upload/avatar-uploader';

<AvatarUploader
  currentAvatar="/path/to/avatar.jpg"
  onUpload={async (file) => {
    // Handle upload
  }}
  size="md"
/>
```

### SpaceImageManager
Complete image management for ad spaces (combines uploader + gallery + lightbox).

```tsx
import { SpaceImageManager } from '@/components/upload/space-image-manager';

<SpaceImageManager
  spaceId="123"
  initialImages={[]}
  onImagesChange={(images) => {
    // Handle image changes
  }}
  maxImages={10}
/>
```

## Usage Example

### In a form:

```tsx
'use client';

import { useState } from 'react';
import { SpaceImageManager } from '@/components/upload/space-image-manager';
import { ImageData } from '@/types';

export default function CreateSpacePage() {
  const [images, setImages] = useState<ImageData[]>([]);

  const handleSubmit = async () => {
    const formData = {
      name: 'My Space',
      images: images.map(img => img.url),
      imageDetails: images,
      // ... other fields
    };
    
    // Submit to API
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Other fields */}
      
      <SpaceImageManager
        onImagesChange={setImages}
        maxImages={10}
      />
      
      <button type="submit">Submit</button>
    </form>
  );
}
```

## API Routes

### POST /api/upload/image
Upload a single image.

```typescript
const formData = new FormData();
formData.append('file', file);
formData.append('folder', 'spaces');
formData.append('resourceType', 'space');

const response = await fetch('/api/upload/image', {
  method: 'POST',
  body: formData,
});
```

### POST /api/upload/multiple
Upload multiple images.

```typescript
const formData = new FormData();
files.forEach(file => formData.append('files', file));
formData.append('folder', 'spaces');

const response = await fetch('/api/upload/multiple', {
  method: 'POST',
  body: formData,
});
```

### DELETE /api/upload/delete
Delete an image.

```typescript
const response = await fetch(
  `/api/upload/delete?publicId=${publicId}`,
  { method: 'DELETE' }
);
```

## Environment Variables

Required Cloudinary configuration:

```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=advermo_uploads

MAX_IMAGE_SIZE=10485760  # 10MB
MAX_IMAGES_PER_SPACE=10
ALLOWED_IMAGE_TYPES=image/jpeg,image/png,image/webp,image/jpg
```

## Features

- ✅ Drag & drop upload
- ✅ Multiple file selection
- ✅ File type validation
- ✅ File size validation
- ✅ Upload progress
- ✅ Image preview
- ✅ Delete images
- ✅ Set primary image
- ✅ Lightbox viewer
- ✅ Responsive design
- ✅ Dark mode support

## Notes

- Images are stored in Cloudinary
- Automatic optimization (WebP, quality)
- CDN delivery for fast loading
- Metadata stored in MongoDB
- User authentication required
