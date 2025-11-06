# 📘 DBD Care - Complete Setup Guide

## Table of Contents
1. [Project Overview](#project-overview)
2. [Prerequisites](#prerequisites)
3. [Firebase Setup](#firebase-setup)
4. [Local Development](#local-development)
5. [Creating Remaining Pages](#creating-remaining-pages)
6. [Seeding Data](#seeding-data)
7. [Deployment to Vercel](#deployment-to-vercel)
8. [Troubleshooting](#troubleshooting)

---

## Project Overview

**DBD Care** adalah platform edukasi Demam Berdarah Dengue yang dirancang untuk membantu orangtua menjadi agent perubahan dalam mencegah DBD.

### Tech Stack
- **Framework**: Next.js 14 (App Router, TypeScript)
- **Styling**: Tailwind CSS
- **Database**: Firebase Firestore
- **Storage**: Firebase Storage
- **Auth**: Custom (username + password, NO EMAIL)
- **Hosting**: Vercel

### Current Progress ✅
- [x] Next.js project setup
- [x] Firebase configuration
- [x] AuthContext (custom authentication)
- [x] Shared components (Header, Footer, Cards)
- [x] Landing page
- [x] Login & Register pages
- [x] Beranda (Dashboard)
- [x] Materi list page

### Todo 📝
- [ ] Materi detail page (`/materi/[id]`)
- [ ] Poster page (`/poster`)
- [ ] Video page (`/video`)
- [ ] Quiz page (`/quiz`)
- [ ] Checklist page (`/checklist`)
- [ ] Admin dashboard (`/admin`)
- [ ] Admin upload pages
- [ ] Seed data script

---

## Prerequisites

Pastikan sudah terinstall:
- **Node.js** 18.x atau lebih baru
- **npm** atau **yarn**
- **Git**
- **Firebase Account** (gratis)
- **Vercel Account** (gratis)

---

## Firebase Setup

### Step 1: Create Firebase Project

1. Buka https://console.firebase.google.com/
2. Click "Add project" atau "Create a project"
3. Project name: **`dbd-care`**
4. Disable Google Analytics (optional, bisa di-enable nanti)
5. Click "Create project"
6. Tunggu sampai selesai, lalu click "Continue"

### Step 2: Enable Firestore Database

1. Di sidebar kiri, click **"Firestore Database"**
2. Click **"Create database"**
3. Pilih **"Start in production mode"**
4. Location: **asia-southeast2 (Jakarta)**
5. Click **"Enable"**

### Step 3: Setup Firestore Security Rules

Di tab "Rules", replace dengan:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read: if true;
      allow create: if true;
      allow update, delete: if false;
    }
    
    // Materials collection
    match /materials/{materialId} {
      allow read: if true;
      allow write: if true;
    }
    
    // Posters collection
    match /posters/{posterId} {
      allow read: if true;
      allow write: if true;
    }
    
    // Videos collection
    match /videos/{videoId} {
      allow read: if true;
      allow write: if true;
    }
    
    // Quiz responses
    match /quizResponses/{quizId} {
      allow read, write: if true;
    }
    
    // Comments
    match /comments/{commentId} {
      allow read, write: if true;
    }
  }
}
```

Click **"Publish"**.

### Step 4: Enable Firebase Storage

1. Di sidebar kiri, click **"Storage"**
2. Click **"Get started"**
3. Keep default rules → Click **"Next"**
4. Location: **asia-southeast2**
5. Click **"Done"**

### Step 5: Setup Storage Rules

Di tab "Rules", replace dengan:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /posters/{allPaths=**} {
      allow read: if true;
      allow write: if request.resource.size < 5 * 1024 * 1024; // 5MB max
    }
  }
}
```

Click **"Publish"**.

### Step 6: Get Firebase Config

1. Di sidebar, click icon **⚙️ (Settings)** → **"Project settings"**
2. Scroll ke bawah ke section **"Your apps"**
3. Click icon **"</>"** (Web)
4. App nickname: **`dbd-care-web`**
5. **JANGAN** check "Firebase Hosting"
6. Click **"Register app"**
7. Copy **firebaseConfig** object

Example:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyC...",
  authDomain: "dbd-care.firebaseapp.com",
  projectId: "dbd-care",
  storageBucket: "dbd-care.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123",
  measurementId: "G-XXXXXXXXXX"
};
```

### Step 7: Configure Environment Variables

1. Buka file `.env.local` di root project
2. Isi dengan Firebase credentials:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyC...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=dbd-care.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=dbd-care
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=dbd-care.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

⚠️ **PENTING**: File `.env.local` tidak akan di-commit ke Git (sudah di `.gitignore`).

---

## Local Development

### Run Development Server

```bash
npm run dev
```

Buka browser di http://localhost:3000

### Test Authentication

1. Buka http://localhost:3000
2. Click **"Mulai Belajar"** atau **"Daftar"**
3. Register dengan:
   - Username: `budi` (hanya huruf, no spasi)
   - Password: `123456` (minimal 6 karakter)
   - Confirm Password: `123456`
4. Setelah register, otomatis login dan redirect ke `/beranda`

### Test Admin Login

1. Buka http://localhost:3000/login
2. Login dengan:
   - Username: `admin`
   - Password: `admin123`
3. Setelah login, bisa akses `/admin` (belum dibuat)

---

## Creating Remaining Pages

Karena project ini sangat besar, berikut template untuk halaman yang belum dibuat:

### 1. Material Detail Page: `src/app/materi/[id]/page.tsx`

File ini untuk menampilkan detail materi dengan:
- Full content
- Views counter (increment saat dibuka)
- Comment section
- Related materials

### 2. Poster Page: `src/app/poster/page.tsx`

Gallery poster dengan fitur:
- Grid layout responsive
- Modal preview saat di-click
- Download button
- Filter by category

### 3. Video Page: `src/app/video/page.tsx`

List video dengan:
- YouTube embed
- Views counter
- Play button

### 4. Quiz Page: `src/app/quiz/page.tsx`

Interactive quiz dengan:
- 10 multiple choice questions
- Progress bar
- Score calculation
- Feedback & badge

### 5. Checklist Page: `src/app/checklist/page.tsx`

Checklist tracker dengan:
- 10 prevention items
- LocalStorage untuk save progress
- Progress bar
- Confetti animation jika complete

### 6. Admin Dashboard: `src/app/admin/page.tsx`

Dashboard untuk admin dengan:
- Statistics cards
- User list
- Comments moderation

### 7. Admin Upload Pages

- `src/app/admin/upload-materi/page.tsx`
- `src/app/admin/upload-poster/page.tsx`
- `src/app/admin/upload-video/page.tsx`

---

## Seeding Data

### Option 1: Manual via Admin Panel

1. Login sebagai admin
2. Akses `/admin/upload-materi`
3. Upload materi satu per satu

### Option 2: Create Seed Script

Buat file `scripts/seed.ts`:

```typescript
import { db } from '../src/lib/firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';

const seedMaterials = async () => {
  const materials = [
    {
      title: "Apa itu DBD dan Bahayanya",
      content: "<p>DBD adalah penyakit yang disebabkan oleh virus dengue...</p>",
      category: "Gejala",
      thumbnailUrl: "https://images.unsplash.com/photo-1584362917165-526a968579e8",
      views: 0,
      createdAt: Timestamp.now()
    },
    // ... more materials
  ];

  for (const material of materials) {
    await addDoc(collection(db, 'materials'), material);
  }
};

seedMaterials();
```

---

## Deployment to Vercel

### Step 1: Push to GitHub

```bash
git add .
git commit -m "Initial commit: DBD Care"
git push origin main
```

### Step 2: Connect to Vercel

1. Buka https://vercel.com/
2. Login dengan GitHub
3. Click **"Add New..."** → **"Project"**
4. Import repository **`dbd-care`**
5. Configure:
   - Framework Preset: **Next.js** (auto-detected)
   - Root Directory: **`./`**
   - Build Command: `npm run build` (default)
   - Output Directory: `.next` (default)

### Step 3: Add Environment Variables

Di Vercel dashboard, add semua environment variables dari `.env.local`:

```
NEXT_PUBLIC_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
```

### Step 4: Deploy

1. Click **"Deploy"**
2. Wait 2-3 minutes
3. Your app is live! 🎉

URL: `https://dbd-care.vercel.app` (atau custom domain)

### Step 5: Auto-Deploy

Setiap push ke branch `main` akan otomatis trigger deployment baru.

---

## Troubleshooting

### Error: "Cannot find module 'firebase'"

```bash
npm install firebase
```

### Error: "Module not found: Can't resolve 'clsx'"

```bash
npm install clsx
```

### Error: Firestore permission denied

Check Firestore rules di Firebase Console → Firestore → Rules.

### Error: Storage upload failed

Check Storage rules di Firebase Console → Storage → Rules.

### Build Error di Vercel

1. Check Environment Variables sudah lengkap
2. Check Firebase credentials valid
3. Lihat build logs untuk error detail

---

## Next Steps

1. ✅ Selesaikan halaman yang masih todo
2. ✅ Seed data awal (8 materi, 5 poster, 4 video)
3. ✅ Test semua fitur end-to-end
4. ✅ Deploy ke Vercel
5. ✅ Share dengan target user untuk feedback

---

## Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Vercel Documentation](https://vercel.com/docs)

---

Need help? Create an issue di GitHub atau contact developer! 🚀
