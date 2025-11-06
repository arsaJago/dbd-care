# 🔥 Firebase Setup Guide - Step by Step dengan Konfirmasi

## 📋 Overview
Anda akan setup:
1. ✅ Firebase Project
2. ✅ Firestore Database
3. ✅ Firebase Storage
4. ✅ Web App Configuration
5. ✅ Environment Variables

**Estimasi Waktu Total: 15-20 menit**

---

## 🚀 PHASE 1: CREATE FIREBASE PROJECT

### Step 1.1: Buka Firebase Console
1. Buka browser dan kunjungi: **https://console.firebase.google.com/**
2. Login dengan akun Google Anda
3. Anda akan melihat halaman Firebase Console

**✋ PAUSE - KONFIRMASI #1:**
```
📸 Kirim screenshot: 
- Halaman Firebase Console (dashboard utama)
- Pastikan terlihat tombol "Add project" atau "Create a project"
```

---

### Step 1.2: Create New Project
1. Click tombol **"Add project"** atau **"Create a project"**
2. Anda akan dibawa ke form wizard

**✋ PAUSE - KONFIRMASI #2:**
```
📸 Kirim screenshot:
- Form "Create a project" step 1
- Pastikan ada field untuk nama project
```

---

### Step 1.3: Enter Project Name
1. Di field **"Project name"**, ketik: **`dbd-care`**
2. Firebase akan auto-generate Project ID (biasanya: dbd-care-xxxxx)
3. Click tombol **"Continue"**

**✋ PAUSE - KONFIRMASI #3:**
```
📸 Kirim screenshot:
- Form dengan project name "dbd-care" sudah terisi
- Project ID yang di-generate
- Sebelum click Continue
```

---

### Step 1.4: Google Analytics (Optional)
1. Anda akan ditanya: "Enable Google Analytics for this project?"
2. **PILIHAN:**
   - **Recommended**: Toggle OFF (disable) - lebih cepat
   - **Alternative**: Biarkan ON jika ingin analytics
3. Click **"Create project"**

**✋ PAUSE - KONFIRMASI #4:**
```
📸 Kirim screenshot:
- Halaman Google Analytics configuration
- Pilihan Anda (ON atau OFF)
- Sebelum click Create project
```

---

### Step 1.5: Wait for Project Creation
1. Firebase akan membuat project (loading 30-60 detik)
2. Tunggu sampai muncul "Your new project is ready"
3. Click **"Continue"**

**✋ PAUSE - KONFIRMASI #5:**
```
📸 Kirim screenshot:
- Halaman "Your new project is ready"
- Atau dashboard project yang sudah jadi
```

---

## 🗄️ PHASE 2: SETUP FIRESTORE DATABASE

### Step 2.1: Navigate to Firestore
1. Di sidebar kiri, cari dan click **"Firestore Database"**
2. Atau di menu "Build" → click **"Firestore Database"**
3. Anda akan melihat halaman intro Firestore

**✋ PAUSE - KONFIRMASI #6:**
```
📸 Kirim screenshot:
- Halaman Firestore Database (belum dibuat)
- Pastikan ada tombol "Create database"
```

---

### Step 2.2: Create Firestore Database
1. Click tombol **"Create database"**
2. Dialog popup akan muncul

**✋ PAUSE - KONFIRMASI #7:**
```
📸 Kirim screenshot:
- Dialog "Create database"
- Pilihan production mode dan test mode
```

---

### Step 2.3: Choose Security Rules
1. **PENTING:** Pilih **"Start in production mode"**
   - Radio button: ● Start in production mode
2. Click **"Next"**

> ⚠️ Jangan pilih "test mode" - kita akan setup rules manual nanti

**✋ PAUSE - KONFIRMASI #8:**
```
📸 Kirim screenshot:
- "Start in production mode" sudah dipilih
- Sebelum click Next
```

---

### Step 2.4: Choose Firestore Location
1. Di dropdown **"Cloud Firestore location"**, pilih:
   - **`asia-southeast2 (Jakarta)`** ← RECOMMENDED untuk Indonesia
   - Alternative: `asia-southeast1 (Singapore)`
2. ⚠️ **WARNING:** Location TIDAK BISA DIUBAH setelah dibuat!
3. Click **"Enable"**

**✋ PAUSE - KONFIRMASI #9:**
```
📸 Kirim screenshot:
- Location dropdown dengan "asia-southeast2" dipilih
- Sebelum click Enable
```

---

### Step 2.5: Wait for Firestore Creation
1. Loading 30-60 detik
2. Setelah selesai, Anda akan melihat Firestore dashboard
3. Tab "Data" akan muncul (masih kosong)

**✋ PAUSE - KONFIRMASI #10:**
```
📸 Kirim screenshot:
- Firestore Database dashboard
- Tab "Data" (kosong)
- Tab "Rules", "Indexes", "Usage" terlihat
```

---

### Step 2.6: Setup Firestore Security Rules
1. Click tab **"Rules"** (di atas, sebelah tab Data)
2. Anda akan melihat editor dengan rules default
3. **DELETE SEMUA** code yang ada
4. **COPY-PASTE** code ini:

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

5. Click tombol **"Publish"** (kanan atas)

**✋ PAUSE - KONFIRMASI #11:**
```
📸 Kirim screenshot:
- Tab Rules dengan code baru yang sudah di-paste
- Sebelum click Publish
```

---

## 📦 PHASE 3: SETUP FIREBASE STORAGE

### Step 3.1: Navigate to Storage
1. Di sidebar kiri, cari dan click **"Storage"**
2. Atau di menu "Build" → click **"Storage"**
3. Anda akan melihat halaman intro Storage

**✋ PAUSE - KONFIRMASI #12:**
```
📸 Kirim screenshot:
- Halaman Storage (belum dibuat)
- Tombol "Get started"
```

---

### Step 3.2: Get Started with Storage
1. Click tombol **"Get started"**
2. Dialog popup akan muncul

**✋ PAUSE - KONFIRMASI #13:**
```
📸 Kirim screenshot:
- Dialog "Get started with Cloud Storage"
- Security rules preview
```

---

### Step 3.3: Choose Storage Security Rules
1. Anda akan melihat default security rules
2. **Biarkan default** (production mode)
3. Click **"Next"**

**✋ PAUSE - KONFIRMASI #14:**
```
📸 Kirim screenshot:
- Default security rules
- Sebelum click Next
```

---

### Step 3.4: Choose Storage Location
1. **IMPORTANT:** Pilih location yang **SAMA** dengan Firestore
   - **`asia-southeast2 (Jakarta)`**
2. Click **"Done"**

**✋ PAUSE - KONFIRMASI #15:**
```
📸 Kirim screenshot:
- Location dropdown dengan "asia-southeast2" dipilih
- Sebelum click Done
```

---

### Step 3.5: Wait for Storage Creation
1. Loading 20-30 detik
2. Setelah selesai, Anda akan melihat Storage dashboard
3. Files view akan muncul (masih kosong)

**✋ PAUSE - KONFIRMASI #16:**
```
📸 Kirim screenshot:
- Storage dashboard
- Files view (kosong)
- Tab "Files", "Rules", "Usage" terlihat
```

---

### Step 3.6: Setup Storage Security Rules
1. Click tab **"Rules"** (di atas)
2. Anda akan melihat editor dengan rules default
3. **DELETE SEMUA** code yang ada
4. **COPY-PASTE** code ini:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /posters/{allPaths=**} {
      allow read: if true;
      allow write: if request.resource.size < 5 * 1024 * 1024;
    }
  }
}
```

5. Click tombol **"Publish"**

**✋ PAUSE - KONFIRMASI #17:**
```
📸 Kirim screenshot:
- Tab Rules dengan code baru
- Sebelum click Publish
```

---

## 🌐 PHASE 4: CREATE WEB APP & GET CREDENTIALS

### Step 4.1: Navigate to Project Settings
1. Click icon **⚙️ (Gear/Settings)** di sidebar kiri (paling bawah)
2. Click **"Project settings"**
3. Anda akan dibawa ke halaman Project Settings

**✋ PAUSE - KONFIRMASI #18:**
```
📸 Kirim screenshot:
- Halaman Project Settings
- Tab "General" active
```

---

### Step 4.2: Scroll to "Your Apps"
1. Scroll ke bawah sampai section **"Your apps"**
2. Anda akan melihat pilihan platform (iOS, Android, Web)
3. Kalo belum ada app, akan ada tulisan "There are no apps in your project"

**✋ PAUSE - KONFIRMASI #19:**
```
📸 Kirim screenshot:
- Section "Your apps"
- Icon platform: iOS, Android, Web, Unity, C++
```

---

### Step 4.3: Create Web App
1. Click icon **"</>"** (Web platform)
2. Dialog "Add Firebase to your web app" akan muncul

**✋ PAUSE - KONFIRMASI #20:**
```
📸 Kirim screenshot:
- Dialog "Add Firebase to your web app"
- Field "App nickname"
```

---

### Step 4.4: Register Web App
1. Di field **"App nickname"**, ketik: **`dbd-care-web`**
2. **JANGAN** centang "Also set up Firebase Hosting"
3. Click **"Register app"**

**✋ PAUSE - KONFIRMASI #21:**
```
📸 Kirim screenshot:
- App nickname "dbd-care-web" sudah terisi
- Checkbox Firebase Hosting TIDAK dicentang
- Sebelum click Register app
```

---

### Step 4.5: Copy Firebase Config
1. Setelah register, Anda akan melihat code snippet dengan **firebaseConfig**
2. Code-nya akan seperti ini:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyC...",
  authDomain: "dbd-care-xxxxx.firebaseapp.com",
  projectId: "dbd-care-xxxxx",
  storageBucket: "dbd-care-xxxxx.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456",
  measurementId: "G-XXXXXXXXXX"
};
```

3. **COPY** semua nilai dari firebaseConfig ini
4. Click **"Continue to console"**

**✋ PAUSE - KONFIRMASI #22:**
```
📸 Kirim screenshot:
- Code snippet dengan firebaseConfig
- Pastikan semua values terlihat (blur sensitive parts OK)
- COPY VALUES-nya ke notepad dulu!
```

---

## 🔐 PHASE 5: SETUP ENVIRONMENT VARIABLES

### Step 5.1: Create .env.local File
1. Buka project folder **`E:\dbd-care`** di VS Code
2. Buka terminal dan jalankan:

```powershell
cp .env.local.example .env.local
```

3. File `.env.local` akan dibuat

**✋ PAUSE - KONFIRMASI #23:**
```
📸 Kirim screenshot:
- VS Code dengan file .env.local terbuka
- Isi masih template
```

---

### Step 5.2: Fill Environment Variables
1. Buka file `.env.local`
2. Replace semua value dengan data dari Firebase Config Anda
3. Format:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyC-YOUR-ACTUAL-KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=dbd-care-xxxxx.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=dbd-care-xxxxx
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=dbd-care-xxxxx.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef123456
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

4. **Save** file (Ctrl + S)

**✋ PAUSE - KONFIRMASI #24:**
```
📸 Kirim screenshot:
- File .env.local dengan values sudah diisi
- Blur/hide sensitive parts (apiKey, appId)
- Tapi pastikan format benar
```

---

## ✅ PHASE 6: TEST CONNECTION

### Step 6.1: Run Development Server
1. Di terminal VS Code, jalankan:

```powershell
npm run dev
```

2. Tunggu sampai muncul:
```
✓ Ready in 2.5s
○ Local:   http://localhost:3000
```

**✋ PAUSE - KONFIRMASI #25:**
```
📸 Kirim screenshot:
- Terminal dengan "npm run dev" berhasil
- URL localhost:3000 terlihat
```

---

### Step 6.2: Test Landing Page
1. Buka browser
2. Kunjungi: **http://localhost:3000**
3. Anda akan melihat landing page DBD Care

**✋ PAUSE - KONFIRMASI #26:**
```
📸 Kirim screenshot:
- Landing page DBD Care di browser
- Hero section "Lindungi Keluarga dari DBD"
- Buttons "Mulai Belajar" dan "Login"
```

---

### Step 6.3: Test Registration
1. Click tombol **"Mulai Belajar"** atau **"Daftar"**
2. Anda akan dibawa ke halaman Register
3. Coba register dengan:
   - Username: **`testuser`**
   - Password: **`123456`**
   - Confirm Password: **`123456`**
4. Click **"Daftar Sekarang"**

**✋ PAUSE - KONFIRMASI #27:**
```
📸 Kirim screenshot:
- Halaman Register
- Form sudah terisi
- Sebelum click Daftar
```

---

### Step 6.4: Verify Registration Success
1. Jika berhasil, Anda akan auto-login dan redirect ke **`/beranda`**
2. Anda akan melihat dashboard user dengan greeting "Halo, testuser! 👋"

**✋ PAUSE - KONFIRMASI #28:**
```
📸 Kirim screenshot:
- Halaman Beranda setelah register
- Greeting dengan username terlihat
- Menu cards (Materi, Poster, Video, dll)
```

---

### Step 6.5: Verify in Firebase Console
1. Kembali ke Firebase Console
2. Go to **Firestore Database** → Tab **"Data"**
3. Anda akan melihat collection **"users"** dengan 1 document
4. Click document untuk melihat data user yang baru register

**✋ PAUSE - KONFIRMASI #29 (FINAL):**
```
📸 Kirim screenshot:
- Firestore Data tab
- Collection "users" dengan 1 document
- User data (username: testuser, password, role, createdAt)
```

---

## 🎉 SETUP COMPLETE!

Jika semua konfirmasi berhasil, Firebase Anda sudah:
✅ Project created
✅ Firestore enabled & configured
✅ Storage enabled & configured
✅ Web app registered
✅ Environment variables set
✅ Connection tested
✅ Registration working

---

## 📝 Checklist Final

```
✅ Phase 1: Firebase Project created
✅ Phase 2: Firestore Database setup with rules
✅ Phase 3: Firebase Storage setup with rules
✅ Phase 4: Web App configured & credentials copied
✅ Phase 5: .env.local file created & filled
✅ Phase 6: Connection tested & working
```

---

## 🚀 NEXT STEPS

Setelah semua fase konfirmasi selesai, Anda siap untuk:
1. Seed data (add materials, posters, videos)
2. Create remaining pages (poster, video, checklist, admin)
3. Deploy to Vercel

**Siap mulai Phase 1? Silakan buka Firebase Console dan kirim screenshot pertama!** 🔥
