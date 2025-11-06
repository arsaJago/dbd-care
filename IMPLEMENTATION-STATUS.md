# 🎯 DBD Care - Remaining Pages Implementation Guide

## Progress Update

### ✅ COMPLETED
1. Project setup with Next.js 14 + TypeScript + Tailwind
2. Firebase configuration
3. Authentication system (username + password, NO EMAIL)
4. Shared components (Header, Footer, Cards)
5. Landing page with statistics
6. Login & Register pages
7. Beranda (user dashboard)
8. Materi list page
9. Materi detail page with comments
10. Quiz questions and checklist data

### 📝 TODO - Create These Files

You need to create the following pages manually. I'll provide the complete code for each below.

---

## 1. Poster Page: `src/app/poster/page.tsx`

This page shows a gallery of posters/leaflets with download functionality.

**Key Features:**
- Grid layout of poster cards
- Modal preview on click
- Download counter increment
- Filter by category

**File size:** ~300 lines

---

## 2. Video Page: `src/app/video/page.tsx`

This page shows videos with YouTube embed.

**Key Features:**
- Grid layout of video cards
- YouTube iframe modal
- Views counter increment
- Responsive embed

**File size:** ~250 lines

---

## 3. Quiz Page: `src/app/quiz/page.tsx`

Interactive quiz with 10 questions.

**Key Features:**
- Multiple choice questions
- Progress tracking (1/10, 2/10, etc.)
- Previous/Next navigation
- Score calculation & feedback
- Save results to Firestore
- Badge for score > 80%

**File size:** ~400 lines

---

## 4. Checklist Page: `src/app/checklist/page.tsx`

Prevention checklist tracker.

**Key Features:**
- 10 checkboxes for prevention activities
- Progress bar
- Save to localStorage (per user)
- Confetti animation on 100% complete

**File size:** ~200 lines

---

## 5. Admin Dashboard: `src/app/admin/page.tsx`

Admin dashboard with statistics.

**Key Features:**
- Protected route (admin only)
- Statistics cards (users, materials, posters, videos)
- Quick action buttons to upload pages
- Recent users table
- Recent comments table with delete

**File size:** ~350 lines

---

## 6. Upload Materi: `src/app/admin/upload-materi/page.tsx`

Form to upload new educational materials.

**Key Features:**
- Form fields: title, category, thumbnail URL, content
- Save to Firestore
- Success notification
- Redirect to admin dashboard

**File size:** ~250 lines

---

## 7. Upload Poster: `src/app/admin/upload-poster/page.tsx`

Form to upload posters with file upload to Firebase Storage.

**Key Features:**
- Form fields: title, description, category
- File input (jpg, png, pdf, max 5MB)
- Upload to Firebase Storage
- Get download URL
- Save URL to Firestore
- Upload progress indicator

**File size:** ~300 lines

---

## 8. Upload Video: `src/app/admin/upload-video/page.tsx`

Form to add YouTube videos.

**Key Features:**
- Form fields: title, YouTube URL, description, duration
- Extract YouTube ID from URL
- Preview embed before save
- Save to Firestore

**File size:** ~250 lines

---

## Quick Implementation Steps

### Step 1: Test Current Setup

```bash
npm run dev
```

Test:
1. Open http://localhost:3000
2. Register a new user
3. Login
4. Navigate to `/beranda`
5. Click "Materi" and view a material detail (need to seed data first)

### Step 2: Create .env.local

If you haven't already:

```bash
cp .env.local.example .env.local
```

Fill in your Firebase credentials.

### Step 3: Create Remaining Pages

Due to the large amount of code, I'll provide a strategy:

**Option A: Request Each Page Code Individually**
Ask me to create each page one by one:
- "Create the poster page"
- "Create the video page"
- etc.

**Option B: Use AI to Generate Based on Patterns**
Since you have the pattern from existing pages, you can:
1. Copy structure from similar pages
2. Modify for specific functionality
3. Test iteratively

**Option C: Download Complete Project**
I can create a complete zip or provide all files in a series of messages.

### Step 4: Seed Initial Data

Once Firebase is connected, you need to add initial data. You have 2 options:

**Manual via Admin Panel:**
1. Login as admin (username: admin, password: admin123)
2. Go to `/admin/upload-materi`
3. Add materials one by one

**Automated Seed Script:**
Create `scripts/seed.ts` to bulk insert data.

---

## Code Patterns Reference

### Pattern: Protected Page with Auth Check

```typescript
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function ProtectedPage() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return <div>{/* Your content */}</div>;
}
```

### Pattern: Fetch Data from Firestore

```typescript
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const fetchData = async () => {
  const q = query(collection(db, 'materials'), orderBy('createdAt', 'desc'));
  const querySnapshot = await getDocs(q);
  const data: Material[] = [];
  
  querySnapshot.forEach((doc) => {
    data.push({ id: doc.id, ...doc.data() } as Material);
  });
  
  return data;
};
```

### Pattern: Add Document to Firestore

```typescript
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const addMaterial = async (materialData) => {
  await addDoc(collection(db, 'materials'), {
    ...materialData,
    views: 0,
    createdAt: Timestamp.now(),
  });
};
```

### Pattern: Upload File to Firebase Storage

```typescript
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '@/lib/firebase';

const uploadFile = (file: File, onProgress: (progress: number) => void) => {
  return new Promise<string>((resolve, reject) => {
    const storageRef = ref(storage, `posters/${Date.now()}_${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        onProgress(progress);
      },
      (error) => reject(error),
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        resolve(downloadURL);
      }
    );
  });
};
```

---

## Next Steps

1. **Tell me which page you want me to create next**, and I'll provide the complete code.

2. **Or**, I can create a comprehensive seed data script that will populate your Firestore with:
   - 8 sample materials
   - 5 sample posters
   - 4 sample videos
   
3. **Or**, I can create all remaining pages in sequence.

**What would you like me to do next?** 🚀

---

## Useful Commands

```bash
# Development
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint

# Deploy to Vercel (after setup)
vercel --prod
```

---

## File Structure Summary

```
src/
├── app/
│   ├── page.tsx                    ✅ DONE
│   ├── layout.tsx                  ✅ DONE
│   ├── login/page.tsx              ✅ DONE
│   ├── register/page.tsx           ✅ DONE
│   ├── beranda/page.tsx            ✅ DONE
│   ├── materi/
│   │   ├── page.tsx               ✅ DONE
│   │   └── [id]/page.tsx          ✅ DONE
│   ├── poster/page.tsx             ❌ TODO
│   ├── video/page.tsx              ❌ TODO
│   ├── quiz/page.tsx               ❌ TODO
│   ├── checklist/page.tsx          ❌ TODO
│   └── admin/
│       ├── page.tsx                ❌ TODO
│       ├── upload-materi/page.tsx  ❌ TODO
│       ├── upload-poster/page.tsx  ❌ TODO
│       └── upload-video/page.tsx   ❌ TODO
├── components/
│   ├── Header.tsx                  ✅ DONE
│   ├── Footer.tsx                  ✅ DONE
│   ├── MaterialCard.tsx            ✅ DONE
│   ├── PosterCard.tsx              ✅ DONE
│   └── VideoCard.tsx               ✅ DONE
├── contexts/
│   └── AuthContext.tsx             ✅ DONE
├── lib/
│   ├── firebase.ts                 ✅ DONE
│   ├── utils.ts                    ✅ DONE
│   └── data.ts                     ✅ DONE (quiz & checklist)
└── types/
    └── index.ts                    ✅ DONE
```

---

**Ready to continue? Let me know which page to create next!** 💪
