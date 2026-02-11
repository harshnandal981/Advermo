# Image Upload System - Implementation Guide

This document provides a comprehensive guide to the Cloudinary-based image upload system implemented in Advermo.

## Overview

The image upload system provides:
- ✅ Cloud-based image storage using Cloudinary
- ✅ Drag & drop file upload
- ✅ Multiple file upload (up to 10 images)
- ✅ Image validation (type, size)
- ✅ Automatic image optimization (WebP, AVIF)
- ✅ CDN delivery for fast loading
- ✅ Image management (delete, reorder, set primary)
- ✅ Profile picture upload with face detection
- ✅ Proof of delivery image uploads
- ✅ Full-screen image viewer (lightbox)

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Client (Browser)                        │
│  ┌──────────────┐  ┌──────────────┐  ┌─────────────────┐   │
│  │ ImageUploader│  │ ImageGallery │  │  AvatarUploader │   │
│  └──────────────┘  └──────────────┘  └─────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            ↓ ↑
┌─────────────────────────────────────────────────────────────┐
│                     Next.js API Routes                       │
│  ┌──────────────┐  ┌──────────────┐  ┌─────────────────┐   │
│  │ /api/upload/ │  │/api/upload/  │  │ /api/upload/    │   │
│  │    image     │  │  multiple    │  │    avatar       │   │
│  └──────────────┘  └──────────────┘  └─────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            ↓ ↑
┌─────────────────────────────────────────────────────────────┐
│                        Cloudinary                            │
│  - Image storage                                             │
│  - Automatic optimization                                    │
│  - CDN delivery                                              │
│  - Image transformations                                     │
└─────────────────────────────────────────────────────────────┘
                            ↓ ↑
┌─────────────────────────────────────────────────────────────┐
│                      MongoDB Database                        │
│  - Upload tracking (Upload model)                            │
│  - Space images (AdSpace.imageDetails)                       │
│  - User avatars (User.profileImage)                          │
└─────────────────────────────────────────────────────────────┘
```

## Setup Instructions

### 1. Install Dependencies

Already installed:
```bash
npm install cloudinary next-cloudinary react-dropzone
```

### 2. Configure Cloudinary

1. Sign up at [cloudinary.com](https://cloudinary.com)
2. Get your credentials from the dashboard
3. Create an upload preset:
   - Go to Settings → Upload
   - Click "Add upload preset"
   - Name: `advermo_uploads`
   - Signing Mode: Unsigned (or Signed for more security)
   - Folder: `advermo/`

### 3. Environment Variables

Add to `.env.local`:

```env
# Cloudinary Configuration
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=advermo_uploads

# Image Upload Settings
MAX_IMAGE_SIZE=10485760  # 10MB in bytes
MAX_IMAGES_PER_SPACE=10
ALLOWED_IMAGE_TYPES=image/jpeg,image/png,image/webp,image/jpg
```

### 4. Verify Setup

Visit `/examples/image-upload` to test the upload system.

## Components

### ImageUploader

Main upload component with drag & drop.

```tsx
import { ImageUploader } from '@/components/upload/image-uploader';

<ImageUploader
  onUpload={async (files) => {
    // Handle upload logic
  }}
  maxFiles={10}
  folder="spaces"
  existingImages={[]}
/>
```

**Props:**
- `onUpload`: Function to handle file upload
- `maxFiles`: Maximum number of files (default: 10)
- `folder`: Cloudinary folder name
- `existingImages`: Array of already uploaded images
- `disabled`: Disable upload

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

**Props:**
- `images`: Array of ImageData objects
- `onDelete`: Function to delete image
- `onSetPrimary`: Function to set primary image
- `onImageClick`: Function called when image is clicked
- `editable`: Show edit controls

### AvatarUploader

Profile picture uploader with circular preview.

```tsx
import { AvatarUploader } from '@/components/upload/avatar-uploader';

<AvatarUploader
  currentAvatar="/path/to/avatar.jpg"
  onUpload={async (file) => {
    // Handle avatar upload
  }}
  size="md"
/>
```

**Props:**
- `currentAvatar`: Current avatar URL
- `onUpload`: Function to handle upload
- `size`: 'sm' | 'md' | 'lg'
- `disabled`: Disable upload

### SpaceImageManager

Complete image management (combines uploader + gallery + lightbox).

```tsx
import { SpaceImageManager } from '@/components/upload/space-image-manager';

<SpaceImageManager
  spaceId="space_id_here"
  initialImages={[]}
  onImagesChange={(images) => {
    setImages(images);
  }}
  maxImages={10}
/>
```

**Props:**
- `spaceId`: ID of the space (optional for new spaces)
- `initialImages`: Existing images
- `onImagesChange`: Callback when images change
- `maxImages`: Maximum images allowed

## API Routes

### POST /api/upload/image

Upload a single image.

**Request:**
```typescript
const formData = new FormData();
formData.append('file', file);
formData.append('folder', 'spaces'); // or 'profiles', 'proofs'
formData.append('resourceType', 'space'); // or 'profile', 'proof'
formData.append('resourceId', 'optional_resource_id');

const response = await fetch('/api/upload/image', {
  method: 'POST',
  body: formData,
});
```

**Response:**
```json
{
  "success": true,
  "data": {
    "publicId": "advermo/spaces/abc123",
    "url": "https://res.cloudinary.com/...",
    "width": 1200,
    "height": 800,
    "format": "jpg",
    "bytes": 245678
  }
}
```

### POST /api/upload/multiple

Upload multiple images at once.

**Request:**
```typescript
const formData = new FormData();
files.forEach(file => formData.append('files', file));
formData.append('folder', 'spaces');
formData.append('resourceType', 'space');

const response = await fetch('/api/upload/multiple', {
  method: 'POST',
  body: formData,
});
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "success": true,
      "fileName": "image1.jpg",
      "data": { "publicId": "...", "url": "...", ... }
    },
    ...
  ],
  "summary": {
    "total": 5,
    "successful": 5,
    "failed": 0
  }
}
```

### DELETE /api/upload/delete

Delete an image from Cloudinary.

**Request:**
```typescript
const response = await fetch(
  `/api/upload/delete?publicId=${encodeURIComponent(publicId)}`,
  { method: 'DELETE' }
);
```

**Response:**
```json
{
  "success": true,
  "message": "Image deleted successfully"
}
```

### POST /api/upload/avatar

Upload user profile picture with face detection.

**Request:**
```typescript
const formData = new FormData();
formData.append('file', file);

const response = await fetch('/api/upload/avatar', {
  method: 'POST',
  body: formData,
});
```

**Response:**
```json
{
  "success": true,
  "data": {
    "url": "https://res.cloudinary.com/...",
    "publicId": "advermo/profiles/user123"
  }
}
```

### PATCH /api/spaces/[id]/images

Update space images (reorder, set primary).

**Request:**
```typescript
const response = await fetch(`/api/spaces/${spaceId}/images`, {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    imageDetails: [
      {
        url: "...",
        publicId: "...",
        width: 1200,
        height: 800,
        format: "jpg",
        isPrimary: true,
        order: 0
      },
      ...
    ],
    primaryImageId: "publicId_of_primary_image"
  }),
});
```

## Data Models

### Upload Model

Tracks all uploaded images.

```typescript
{
  userId: ObjectId,
  resourceType: 'space' | 'profile' | 'proof' | 'review',
  resourceId: ObjectId, // Optional reference to space, booking, etc.
  publicId: string,
  url: string,
  secureUrl: string,
  format: string,
  width: number,
  height: number,
  bytes: number,
  uploadedAt: Date
}
```

### AdSpace.imageDetails

Structured image data for spaces.

```typescript
imageDetails: [{
  url: string,
  publicId: string,
  width: number,
  height: number,
  format: string,
  uploadedAt: Date,
  isPrimary: boolean,
  order: number
}]
```

### User.profileImage

Profile picture data.

```typescript
profileImage: {
  url: string,
  publicId: string
}
```

## Usage Examples

### Example 1: Ad Space Form with Images

```tsx
'use client';

import { useState } from 'react';
import { SpaceImageManager } from '@/components/upload/space-image-manager';
import { ImageData } from '@/types';

export default function CreateSpacePage() {
  const [images, setImages] = useState<ImageData[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Submit space with images
    const response = await fetch('/api/spaces', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...formData,
        images: images.map(img => img.url),
        imageDetails: images,
      }),
    });
    
    if (response.ok) {
      // Success!
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        placeholder="Space name"
      />
      
      <SpaceImageManager
        onImagesChange={setImages}
        maxImages={10}
      />
      
      <button type="submit">Create Space</button>
    </form>
  );
}
```

### Example 2: Profile Settings with Avatar

```tsx
'use client';

import { useState } from 'react';
import { AvatarUploader } from '@/components/upload/avatar-uploader';

export default function ProfileSettings() {
  const [avatar, setAvatar] = useState<string>();

  const handleAvatarUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/upload/avatar', {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      const result = await response.json();
      setAvatar(result.data.url);
    }
  };

  return (
    <div>
      <h2>Profile Picture</h2>
      <AvatarUploader
        currentAvatar={avatar}
        onUpload={handleAvatarUpload}
        size="lg"
      />
    </div>
  );
}
```

## Image Optimization

Cloudinary automatically optimizes images:

- **Format**: Auto-converts to WebP/AVIF for supported browsers
- **Quality**: Auto-adjusts quality for optimal size/quality ratio
- **Transformations**: Applied during upload
- **CDN**: Global CDN for fast delivery

### Transformation Examples

```typescript
// Avatar: 300x300 square with face detection
{
  width: 300,
  height: 300,
  crop: 'fill',
  gravity: 'face',
  quality: 'auto',
  fetch_format: 'auto'
}

// Space image: Limit to 1200x800
{
  width: 1200,
  height: 800,
  crop: 'limit',
  quality: 'auto',
  fetch_format: 'auto'
}
```

## Security

- ✅ Authentication required for all uploads
- ✅ File type validation (JPEG, PNG, WEBP only)
- ✅ File size validation (max 10MB)
- ✅ User ownership verification before delete
- ✅ Rate limiting (can be added)
- ✅ Signed uploads (optional, more secure)

## Error Handling

Common errors and solutions:

### "Unauthorized. Please sign in."
- User is not authenticated
- Solution: Sign in before uploading

### "Invalid file type"
- File is not an image or unsupported format
- Solution: Use JPEG, PNG, or WEBP

### "File size too large"
- File exceeds 10MB limit
- Solution: Compress image before upload

### "Maximum 10 images allowed"
- Space already has 10 images
- Solution: Delete an image before adding new ones

### "Upload failed"
- Network error or Cloudinary error
- Solution: Check internet connection, verify Cloudinary credentials

## Testing

### Manual Testing

1. Visit `/examples/image-upload`
2. Sign in to your account
3. Test avatar upload
4. Test space images upload
5. Test delete functionality
6. Test image viewer

### Automated Testing (TODO)

```bash
npm test
```

## Production Checklist

- [ ] Set up Cloudinary account
- [ ] Configure environment variables in Vercel
- [ ] Test upload in production
- [ ] Monitor Cloudinary usage/quota
- [ ] Set up image moderation (optional)
- [ ] Configure upload rate limiting
- [ ] Set up backup strategy
- [ ] Monitor storage costs

## Support

For issues or questions:
1. Check [Cloudinary Documentation](https://cloudinary.com/documentation)
2. Review code in `/components/upload/`
3. Check API routes in `/app/api/upload/`
4. Open an issue on GitHub

## Future Enhancements

- [ ] Image cropping tool
- [ ] Bulk image upload (50+)
- [ ] Video upload support
- [ ] AI-powered image tagging
- [ ] Background removal
- [ ] Image filters/effects
- [ ] 360° image viewer
- [ ] AR preview
