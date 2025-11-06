# 🚀 DBD Care - Deployment Guide

## Deployment ke Vercel

Website DBD Care siap untuk di-deploy ke Vercel dengan auto-deploy dari GitHub.

---

## 📋 Prerequisites

1. ✅ Akun GitHub (gratis)
2. ✅ Akun Vercel (gratis) - https://vercel.com
3. ✅ Firebase project sudah setup
4. ✅ Repository GitHub (public atau private)

---

## 🔧 Step 1: Push ke GitHub

### 1.1 Inisialisasi Git (jika belum)

```bash
git init
git add .
git commit -m "Initial commit: DBD Care website"
```

### 1.2 Buat Repository di GitHub

1. Buka https://github.com
2. Klik tombol **"New"** atau **"+"** > **"New repository"**
3. Isi:
   - **Repository name**: `dbd-care`
   - **Description**: Website edukasi Demam Berdarah Dengue
   - **Visibility**: Public atau Private (terserah)
   - ❌ JANGAN centang "Initialize with README"
4. Klik **"Create repository"**

### 1.3 Push ke GitHub

Copy command yang muncul, atau jalankan:

```bash
git remote add origin https://github.com/USERNAME/dbd-care.git
git branch -M main
git push -u origin main
```

Ganti `USERNAME` dengan username GitHub kamu.

---

## 🌐 Step 2: Deploy ke Vercel

### 2.1 Login ke Vercel

1. Buka https://vercel.com
2. Klik **"Sign Up"** atau **"Login"**
3. Login dengan **GitHub** (recommended)
4. Authorize Vercel untuk akses GitHub repos

### 2.2 Import Project

1. Di dashboard Vercel, klik **"Add New"** > **"Project"**
2. Pilih repository **"dbd-care"** dari list
3. Klik **"Import"**

### 2.3 Configure Project

**Framework Preset**: Next.js (auto-detected) ✅

**Root Directory**: `./` (default) ✅

**Build Command**: `npm run build` (default) ✅

**Output Directory**: `.next` (default) ✅

**Install Command**: `npm install` (default) ✅

### 2.4 Environment Variables

⚠️ **PENTING!** Tambahkan environment variables dari `.env.local`:

Klik **"Environment Variables"**, lalu tambahkan satu per satu:

```
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyCRWS5T33_7NSsRQqpWoeHfT8aTpLTBRdA
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=dbd-care.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=dbd-care
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=dbd-care.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=553405605311
NEXT_PUBLIC_FIREBASE_APP_ID=1:553405605311:web:b0d62a5fecb30abedaad0a
```

**Atau** bisa paste langsung semua sekaligus.

### 2.5 Deploy!

1. Klik **"Deploy"**
2. Tunggu 2-5 menit (Vercel akan build project)
3. Jika sukses, akan muncul **"Congratulations!"**
4. Klik **"Visit"** untuk buka website

---

## 🎉 Step 3: Setup Domain (Optional)

### 3.1 Domain Gratis dari Vercel

Secara default, Vercel memberikan domain:
```
https://dbd-care.vercel.app
```

### 3.2 Custom Domain (Opsional)

Jika punya domain sendiri (contoh: dbdcare.com):

1. Di dashboard Vercel project, klik **"Settings"** > **"Domains"**
2. Klik **"Add"**
3. Masukkan domain kamu
4. Ikuti instruksi untuk setup DNS records
5. Tunggu propagasi DNS (5 menit - 24 jam)

---

## 🔄 Step 4: Auto-Deploy Setup

✅ **Auto-deploy sudah aktif otomatis!**

Setiap kali kamu push ke GitHub:
```bash
git add .
git commit -m "Update fitur baru"
git push
```

Vercel akan otomatis:
1. Detect perubahan
2. Build ulang website
3. Deploy versi terbaru

**Tanpa perlu manual deploy lagi!** 🚀

---

## 🔐 Step 5: Firebase Security (PENTING!)

### 5.1 Authorized Domains

Tambahkan domain Vercel ke Firebase:

1. Buka Firebase Console: https://console.firebase.google.com
2. Pilih project **dbd-care**
3. Klik **Authentication** > **Settings** > **Authorized domains**
4. Klik **"Add domain"**
5. Tambahkan: `dbd-care.vercel.app` (atau domain vercel kamu)
6. Klik **"Add"**

### 5.2 Firestore Rules (Sudah OK)

Rules sudah di-set dengan benar di Firebase Console.

---

## ✅ Checklist Deployment

Sebelum deploy, pastikan:

- [x] Firebase project sudah setup
- [x] Firestore Database enabled
- [x] Security rules sudah dipublish
- [x] `.env.local` sudah ada (local dev)
- [x] Data sudah di-seed (materi, poster, video)
- [ ] Push ke GitHub
- [ ] Deploy di Vercel
- [ ] Environment variables di Vercel
- [ ] Test website di domain Vercel
- [ ] Authorized domain di Firebase

---

## 🐛 Troubleshooting

### Build Failed di Vercel

**Problem**: Build error
**Solution**: 
- Cek error log di Vercel dashboard
- Pastikan `npm run build` jalan di local
- Cek apakah ada TypeScript error

### Firebase Error di Production

**Problem**: "Firebase: Error (auth/unauthorized-domain)"
**Solution**:
- Tambahkan domain Vercel ke Firebase Authorized Domains

### Environment Variables Tidak Terbaca

**Problem**: Firebase config undefined
**Solution**:
- Pastikan semua env vars sudah ditambahkan di Vercel
- Nama harus sama persis dengan `.env.local`
- Redeploy setelah tambah env vars

### Halaman 404 di Production

**Problem**: Halaman tertentu 404
**Solution**:
- Next.js App Router sudah handle routing
- Pastikan struktur folder `src/app` benar
- Check di Vercel Functions log

---

## 📊 Monitoring & Analytics

### Vercel Analytics

Aktifkan di: **Dashboard** > **Analytics** > **Enable**

Gratis untuk:
- Page views
- Top pages
- Traffic sources
- Performance metrics

### Firebase Analytics (Optional)

Bisa ditambahkan nanti untuk tracking user behavior.

---

## 🔄 Update Website

### Update Konten

**Via Admin Dashboard:**
1. Login sebagai admin
2. Upload materi/poster/video baru
3. Langsung tersimpan di Firestore
4. Tidak perlu redeploy!

**Update Code:**
```bash
# Edit code
git add .
git commit -m "Update: [deskripsi]"
git push
```
Vercel otomatis deploy 🚀

---

## 💰 Biaya

**Semuanya GRATIS!**

- ✅ Vercel Free Plan: Unlimited projects, 100GB bandwidth/month
- ✅ Firebase Spark Plan: 1GB storage, 50K reads/day
- ✅ GitHub: Free untuk public repos

---

## 🎓 Resources

- Vercel Docs: https://vercel.com/docs
- Next.js Docs: https://nextjs.org/docs
- Firebase Docs: https://firebase.google.com/docs

---

## 📞 Support

Jika ada masalah saat deployment, cek:
1. Vercel Build Logs
2. Browser Console (F12)
3. Firebase Console > Usage & billing

---

**Selamat! Website DBD Care kamu sudah siap untuk diakses public! 🎉**

Domain: `https://dbd-care.vercel.app` (atau domain custom kamu)
