/**
 * DBD Care - Seed Data Script
 * 
 * Script ini digunakan untuk populate data dummy ke Firestore
 * untuk keperluan testing dan demo.
 * 
 * Cara menjalankan:
 * 1. Pastikan dev server sudah jalan (npm run dev)
 * 2. Buka browser: http://localhost:3001/seed
 * 3. Klik tombol "Seed Database"
 * 4. Tunggu sampai selesai
 * 
 * Note: Script ini akan menambahkan data, TIDAK menghapus data yang sudah ada.
 */

import { db } from '@/lib/firebase';
import { collection, addDoc, Timestamp, getDocs, query, where } from 'firebase/firestore';

// ========== MATERI EDUKASI ==========
export const materiData = [
  {
    title: 'Mengenal Demam Berdarah Dengue (DBD)',
    category: 'Edukasi',
    excerpt: 'Demam Berdarah Dengue adalah penyakit yang disebabkan oleh virus dengue yang ditularkan melalui gigitan nyamuk Aedes aegypti.',
    content: `
# Apa Itu DBD?

Demam Berdarah Dengue (DBD) adalah penyakit infeksi yang disebabkan oleh virus dengue. Penyakit ini ditularkan melalui gigitan nyamuk Aedes aegypti dan Aedes albopictus yang terinfeksi virus.

## Penyebab DBD

DBD disebabkan oleh virus dengue yang memiliki 4 serotipe berbeda (DEN-1, DEN-2, DEN-3, dan DEN-4). Seseorang yang pernah terinfeksi satu serotipe akan kebal terhadap serotipe tersebut seumur hidup, tetapi hanya kebal sementara terhadap serotipe lainnya.

## Cara Penularan

Nyamuk Aedes aegypti menggigit orang yang terinfeksi virus dengue, kemudian virus berkembang biak di dalam tubuh nyamuk selama 8-10 hari. Setelah itu, nyamuk dapat menularkan virus kepada orang lain yang digigitnya.

## Faktor Risiko

- Tinggal atau bepergian ke daerah tropis
- Riwayat infeksi dengue sebelumnya
- Lingkungan dengan banyak genangan air
- Musim hujan (meningkatkan populasi nyamuk)

## Pencegahan

Pencegahan terbaik adalah dengan menghilangkan tempat berkembang biak nyamuk melalui gerakan 3M Plus:
- Menguras bak mandi
- Menutup tempat penampungan air
- Mengubur atau membuang barang bekas
- Plus: menggunakan lotion anti nyamuk, memelihara ikan pemakan jentik, dll.
    `.trim(),
    thumbnailUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&h=400&fit=crop',
    views: 0,
  },
  {
    title: 'Gejala DBD yang Harus Diwaspadai',
    category: 'Gejala',
    excerpt: 'Kenali gejala DBD sejak dini agar dapat segera mendapatkan penanganan yang tepat dan mencegah komplikasi berbahaya.',
    content: `
# Gejala Demam Berdarah Dengue

## Gejala Awal (Hari 1-3)

1. **Demam Tinggi Mendadak** (38-40°C)
   - Demam terjadi secara tiba-tiba
   - Berlangsung selama 2-7 hari
   - Suhu bisa mencapai 40°C

2. **Sakit Kepala Hebat**
   - Terutama di daerah dahi
   - Terasa seperti ditekan
   - Bisa disertai pusing

3. **Nyeri di Belakang Mata**
   - Sakit saat menggerakkan bola mata
   - Sensitif terhadap cahaya

4. **Nyeri Otot dan Sendi**
   - Seluruh badan terasa pegal
   - Punggung dan tungkai terasa nyeri
   - Sering disebut "break-bone fever"

## Gejala Lanjutan (Hari 4-7)

5. **Mual dan Muntah**
   - Tidak nafsu makan
   - Perut terasa tidak nyaman

6. **Ruam Kemerahan**
   - Muncul bintik-bintik merah di kulit
   - Biasanya muncul hari ke-3 atau ke-4
   - Tidak hilang saat ditekan (uji tourniquet positif)

## Tanda Bahaya (Harus Segera ke RS!)

⚠️ **SEGERA KE RUMAH SAKIT jika muncul tanda bahaya:**

- Nyeri perut hebat dan terus menerus
- Muntah terus menerus
- Perdarahan gusi, mimisan, atau BAB berdarah
- Muntah darah
- Gelisah atau lemas
- Tangan dan kaki dingin, berkeringat
- Penurunan kesadaran

## Fase DBD

1. **Fase Demam** (Hari 1-3): Demam tinggi mendadak
2. **Fase Kritis** (Hari 4-5): Suhu turun, tapi bahaya meningkat
3. **Fase Pemulihan** (Hari 6-7): Kondisi mulai membaik

⚠️ **FASE KRITIS adalah yang paling berbahaya!** Meskipun demam turun, justru di fase ini risiko syok dan perdarahan paling tinggi.

## Kapan Harus ke Dokter?

- Demam tinggi lebih dari 2 hari
- Muncul bintik merah di kulit
- Muntah terus menerus
- Ada tanda perdarahan
- Pernah kontak dengan penderita DBD
    `.trim(),
    thumbnailUrl: 'https://images.unsplash.com/photo-1581595220892-b0739db3ba8c?w=800&h=400&fit=crop',
    views: 0,
  },
  {
    title: 'Gerakan 3M Plus: Cara Efektif Cegah DBD',
    category: 'Pencegahan',
    excerpt: '3M Plus adalah metode pencegahan DBD yang paling efektif dengan menguras, menutup, dan mengubur plus tindakan tambahan.',
    content: `
# Gerakan 3M Plus

Gerakan 3M Plus adalah cara paling efektif untuk memutus rantai perkembangbiakan nyamuk Aedes aegypti.

## 3M (Menguras, Menutup, Mengubur)

### 1. Menguras (M1)

**Menguras tempat penampungan air secara teratur:**

- **Bak mandi**: Kuras dan sikat dinding minimal 1x seminggu
- **Ember**: Kuras dan bersihkan setiap 3-4 hari
- **Tempayan**: Kuras minimal 1x seminggu
- **Kolam**: Kuras dan bersihkan secara berkala

**Mengapa harus dikuras?**
Jentik nyamuk Aedes dapat bertahan hidup di air bersih selama 7-10 hari. Dengan menguras, siklus hidup nyamuk terputus.

### 2. Menutup (M2)

**Menutup rapat tempat penampungan air:**

- Tutup rapat bak mandi dengan penutup yang tidak bocor
- Tutup ember dan drum air
- Tutup tandon air dengan rapat
- Pastikan tidak ada celah untuk nyamuk bertelur

**Mengapa harus ditutup?**
Nyamuk betina bertelur di permukaan air yang tenang. Dengan menutup, nyamuk tidak bisa bertelur.

### 3. Mengubur (M3)

**Mengubur atau membuang barang bekas:**

- Kaleng bekas
- Ban bekas
- Botol pecah
- Plastik yang dapat menampung air
- Barang bekas lainnya

**Mengapa harus dikubur/dibuang?**
Barang bekas dapat menampung air hujan dan menjadi tempat berkembang biak nyamuk.

## PLUS (Tindakan Tambahan)

### 4. Abatisasi

- Tabur bubuk abate di tempat penampungan air yang sulit dikuras
- 1 sendok makan abate untuk 10 liter air
- Ulangi setiap 2-3 bulan

### 5. Memelihara Ikan Pemakan Jentik

- Ikan cupang
- Ikan nila
- Ikan guppy
- Ikan mas

### 6. Menggunakan Anti Nyamuk

- Lotion anti nyamuk saat beraktivitas
- Obat nyamuk bakar/elektrik di malam hari
- Semprotan anti nyamuk

### 7. Memasang Kawat Kasa

- Pasang di ventilasi rumah
- Pasang di jendela
- Mencegah nyamuk masuk rumah

### 8. Tanaman Pengusir Nyamuk

- Lavender
- Serai wangi
- Zodia
- Rosemary

### 9. Gotong Royong

- Bersihkan lingkungan bersama
- PSN (Pemberantasan Sarang Nyamuk) serentak
- Jum'at bersih setiap minggu

## Jadwal 3M Plus

| Kegiatan | Frekuensi |
|----------|-----------|
| Menguras bak mandi | 1x seminggu |
| Menutup penampungan air | Setiap saat |
| Mengubur barang bekas | Setiap hari |
| Pakai lotion anti nyamuk | Setiap pagi & sore |
| Bersihkan got | 1x seminggu |
| Fogging (jika ada wabah) | Sesuai anjuran |

## Tips Tambahan

✅ Lakukan PSN setiap Jumat pagi
✅ Libatkan seluruh anggota keluarga
✅ Ajak tetangga untuk ikut 3M Plus
✅ Laporkan ke RT/RW jika ada penderita DBD di lingkungan
    `.trim(),
    thumbnailUrl: 'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=800&h=400&fit=crop',
    views: 0,
  },
  {
    title: 'Nyamuk Aedes Aegypti: Kenali Ciri-Cirinya',
    category: 'Edukasi',
    excerpt: 'Nyamuk Aedes aegypti memiliki ciri khas yang membedakannya dari nyamuk lain. Kenali agar bisa waspada.',
    content: `
# Mengenal Nyamuk Aedes Aegypti

## Ciri-Ciri Fisik

### 1. Warna Tubuh
- Tubuh berwarna hitam dengan belang-belang putih
- Garis putih berbentuk lira di bagian punggung (thorax)
- Kaki bergaris putih

### 2. Ukuran
- Panjang tubuh: 3-4 mm
- Lebih kecil dari nyamuk biasa
- Tubuh ramping dan gesit

### 3. Sayap
- Transparan tanpa bintik
- Panjang sekitar 2-3 mm

## Perilaku Nyamuk

### Waktu Aktif
- **Pagi hari**: 08.00 - 12.00
- **Sore hari**: 15.00 - 17.00
- Tidak aktif di malam hari (beda dengan nyamuk malaria)

### Tempat Hidup
- **Indoor**: Di dalam rumah, kamar mandi, gudang
- **Outdoor**: Taman, halaman dengan tanaman rindang
- Radius terbang: 40-100 meter dari tempat berkembang biak

### Kebiasaan Menggigit
- Hanya nyamuk betina yang menggigit
- Menggigit berulang kali sampai kenyang
- Target gigitan: kaki, tangan, bagian tubuh yang terbuka
- Dapat menggigit beberapa orang dalam waktu singkat (sebar virus cepat!)

## Siklus Hidup

### 1. Telur (2-3 hari)
- Diletakkan di dinding wadah, sedikit di atas permukaan air
- Tahan kering hingga 6 bulan
- Menetas jika terendam air

### 2. Jentik (6-8 hari)
- Hidup di air bersih
- Bergerak aktif di air
- Makan mikroorganisme di air

### 3. Pupa (2 hari)
- Tidak makan
- Aktif bergerak jika terganggu
- Berubah menjadi nyamuk dewasa

### 4. Nyamuk Dewasa (2-3 minggu)
- Kawin setelah 24-48 jam
- Betina menghisap darah untuk bertelur
- 1 nyamuk betina bertelur 100-200 butir setiap kali

**Total siklus: 9-10 hari** (dari telur ke dewasa)

## Tempat Berkembang Biak Favorit

### Di Dalam Rumah:
✅ Bak mandi
✅ Ember
✅ Tempayan
✅ Dispenser
✅ Kulkas (wadah penampung air)
✅ Vas bunga
✅ Tempat minum burung

### Di Luar Rumah:
✅ Ban bekas
✅ Kaleng bekas
✅ Pot bunga (tatakan)
✅ Talang air yang tersumbat
✅ Tempurung kelapa
✅ Barang bekas yang menampung air hujan

## Perbedaan dengan Nyamuk Lain

| Ciri | Aedes Aegypti | Nyamuk Lain |
|------|---------------|-------------|
| Warna | Hitam belang putih | Coklat/abu-abu |
| Waktu aktif | Pagi & sore | Malam hari |
| Air favorit | Bersih | Kotor juga bisa |
| Posisi hinggap | Sejajar permukaan | Miring 45° |
| Tempat bertelur | Dinding wadah | Permukaan air |

## Fakta Menarik

🦟 Hanya nyamuk betina yang menghisap darah
🦟 Nyamuk jantan makan nektar bunga
🦟 Jarak terbang maksimal: 100 meter
🦟 Dapat menularkan virus ke anak-anaknya (transovarial)
🦟 1 rumah bisa jadi sarang ratusan nyamuk
🦟 Telur dapat bertahan kering selama 6 bulan!

## Tips Anti Digigit

✅ Pakai baju lengan panjang saat pagi/sore
✅ Oleskan lotion anti nyamuk
✅ Pasang kawat kasa di jendela
✅ Gunakan kelambu saat tidur siang
✅ Hindari menggantung baju kotor (bau keringat menarik nyamuk)
    `.trim(),
    thumbnailUrl: 'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?w=800&h=400&fit=crop',
    views: 0,
  },
  {
    title: 'Pertolongan Pertama untuk Penderita DBD',
    category: 'Penanganan',
    excerpt: 'Langkah-langkah pertolongan pertama yang harus dilakukan ketika ada anggota keluarga yang terkena DBD.',
    content: `
# Pertolongan Pertama untuk Penderita DBD

## ⚠️ PENTING: Kapan Harus ke Rumah Sakit?

Segera bawa ke RS/Puskesmas jika:
- Demam tinggi lebih dari 3 hari
- Muntah terus menerus
- Perdarahan (mimisan, gusi berdarah, BAB hitam)
- Nyeri perut hebat
- Tangan dan kaki dingin
- Gelisah atau pingsan
- Sesak napas

## Perawatan di Rumah (Fase Awal)

### 1. Turunkan Demam

**Kompres Air Hangat:**
- Gunakan air hangat (bukan dingin!)
- Kompres di dahi, ketiak, dan lipatan paha
- Ganti setiap 15 menit

**Obat Penurun Panas:**
- ✅ Paracetamol (sesuai dosis)
- ❌ JANGAN BERI ASPIRIN atau IBUPROFEN (risiko perdarahan!)

### 2. Cegah Dehidrasi

**Banyak Minum:**
- Air putih: 2-3 liter per hari
- ORS (oralit)
- Air kelapa muda
- Jus buah (jeruk, jambu, kurma)
- Sup hangat

**Tanda Cukup Cairan:**
- Buang air kecil lancar (setiap 3-4 jam)
- Warna urine kuning muda
- Bibir tidak kering

### 3. Istirahat Total

- Tirah baring (bed rest)
- Jangan beraktivitas berat
- Tidur yang cukup (8-10 jam)

### 4. Nutrisi yang Tepat

**Makanan Dianjurkan:**
- Bubur atau nasi tim
- Sup ayam
- Telur rebus
- Pisang
- Jus jambu biji (meningkatkan trombosit)
- Kurma (energi & trombosit)

**Makanan Dihindari:**
- Gorengan
- Makanan pedas
- Minuman bersoda
- Kafein (kopi, teh kental)

### 5. Monitor Gejala

**Periksa Setiap 4 Jam:**
- Suhu tubuh (catat di buku)
- Tanda perdarahan (kulit, gusi, hidung)
- Jumlah minum dan BAK
- Kesadaran dan perilaku

## Fase Kritis (Hari 4-5)

⚠️ **FASE INI PALING BERBAHAYA!**

Meski demam turun, WASPADA:
- Awasi tanda perdarahan
- Pastikan minum terus
- Jangan anggap sudah sembuh
- Tetap pantau setiap 3-4 jam

**Tanda Bahaya Fase Kritis:**
- Nyeri perut mendadak
- Muntah makin sering
- Lemas berlebihan
- Gelisah atau rewel (anak-anak)
- BAK berkurang

➡️ **LANGSUNG KE RS!**

## Perawatan Lingkungan

### 1. Isolasi Penderita

- Gunakan kelambu (cegah nyamuk gigit penderita)
- Nyalakan obat nyamuk elektrik
- Tutup jendela dengan kasa nyamuk

**Mengapa penting?**
Nyamuk yang menggigit penderita akan membawa virus dan menularkan ke orang lain!

### 2. PSN di Rumah

- Kuras bak mandi
- Tutup tempat penampungan air
- Bersihkan halaman dari genangan
- Buang barang bekas

### 3. Fogging

Jika ada kasus DBD di lingkungan:
- Laporkan ke RT/RW
- Ikut fogging dari Puskesmas
- Lakukan PSN serentak

## Tanda Mulai Sembuh

✅ Demam turun dan stabil
✅ Nafsu makan kembali
✅ Tidak muntah lagi
✅ Trombosit naik (cek lab)
✅ Hematokrit normal
✅ Tidak ada perdarahan
✅ Buang air kecil lancar

## Pemeriksaan Lab

**Kapan Harus Cek Lab?**
- Hari ke-3 demam (pertama kali)
- Setiap hari di fase kritis (hari 4-7)
- Kontrol saat demam turun

**Yang Diperiksa:**
- Hematokrit (HCT)
- Trombosit (PLT)
- Leukosit (WBC)
- NS1 Antigen atau IgM/IgG Dengue

## Nilai Lab Normal vs DBD

| Pemeriksaan | Normal | DBD |
|-------------|--------|-----|
| Trombosit | 150.000-400.000 | < 100.000 |
| Hematokrit | 36-46% | > 20% dari normal |
| Leukosit | 4.000-10.000 | < 4.000 |

## Pemulihan Pasca DBD

### Fase Pemulihan (Hari 6-10)

- Nafsu makan membaik
- Ruam merah bisa muncul lagi (tanda pemulihan)
- Energi bertambah
- Trombosit naik bertahap

### Tips Pemulihan Cepat:

✅ Makan bergizi tinggi protein
✅ Banyak istirahat
✅ Hindari aktivitas berat dulu
✅ Kontrol ke dokter 1 minggu kemudian
✅ Minum vitamin C dan B kompleks

### Berapa Lama Sembuh Total?

- Demam turun: 5-7 hari
- Trombosit normal: 7-10 hari
- Energi pulih: 2-3 minggu
- Fit seperti semula: 1 bulan

## Yang TIDAK Boleh Dilakukan

❌ Beri aspirin/ibuprofen (risiko perdarahan)
❌ Kompres air es (kejang)
❌ Kerja berat saat masih demam
❌ Abaikan fase kritis
❌ Berhenti minum saat demam turun
❌ Minum obat herbal sembarangan

## Nomor Darurat

- **Ambulans**: 118 / 119
- **Puskesmas 24 jam**: (cek nomor di daerahmu)
- **RS Terdekat**: (siapkan nomor sebelumnya)

## Checklist Perawatan DBD

📋 **Harian:**
- [ ] Ukur suhu 3x sehari
- [ ] Minum minimal 2 liter
- [ ] Cek tanda perdarahan
- [ ] Catat jumlah BAK
- [ ] Beri paracetamol jika demam

📋 **Fase Kritis (Hari 4-5):**
- [ ] Awasi ekstra ketat setiap 3 jam
- [ ] Cek lab harian
- [ ] Siapkan tas untuk ke RS
- [ ] Hubungi dokter jika ada perubahan

📋 **Lingkungan:**
- [ ] Pasang kelambu
- [ ] Nyalakan obat nyamuk
- [ ] PSN di rumah
- [ ] Laporkan ke RT jika butuh fogging

**Ingat: Pencegahan tetap lebih baik daripada pengobatan! Lakukan 3M Plus rutin!**
    `.trim(),
    thumbnailUrl: 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=800&h=400&fit=crop',
    views: 0,
  },
];

// ========== POSTER DATA ==========
export const posterData = [
  {
    title: 'Kenali Gejala DBD Sejak Dini',
    category: 'Gejala',
    imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&h=800&fit=crop',
    downloadUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200&h=1600&fit=crop',
    downloads: 0,
  },
  {
    title: '3M Plus: Cara Mudah Cegah DBD',
    category: 'Pencegahan',
    imageUrl: 'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=600&h=800&fit=crop',
    downloadUrl: 'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=1200&h=1600&fit=crop',
    downloads: 0,
  },
  {
    title: 'Siklus Hidup Nyamuk Aedes Aegypti',
    category: 'Edukasi',
    imageUrl: 'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?w=600&h=800&fit=crop',
    downloadUrl: 'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?w=1200&h=1600&fit=crop',
    downloads: 0,
  },
  {
    title: 'Waspada Fase Kritis DBD',
    category: 'Bahaya',
    imageUrl: 'https://images.unsplash.com/photo-1581595220892-b0739db3ba8c?w=600&h=800&fit=crop',
    downloadUrl: 'https://images.unsplash.com/photo-1581595220892-b0739db3ba8c?w=1200&h=1600&fit=crop',
    downloads: 0,
  },
  {
    title: 'Tips Mencegah DBD di Rumah',
    category: 'Pencegahan',
    imageUrl: 'https://images.unsplash.com/photo-1600428081814-59ec59fb84a6?w=600&h=800&fit=crop',
    downloadUrl: 'https://images.unsplash.com/photo-1600428081814-59ec59fb84a6?w=1200&h=1600&fit=crop',
    downloads: 0,
  },
  {
    title: 'Fogging: Kapan Diperlukan?',
    category: 'Penanganan',
    imageUrl: 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=600&h=800&fit=crop',
    downloadUrl: 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=1200&h=1600&fit=crop',
    downloads: 0,
  },
];

// ========== VIDEO DATA (YouTube) ==========
// Note: Ini adalah video edukasi DBD dari channel resmi Kemenkes & RS
export const videoData = [
  {
    title: 'Demam Berdarah Dengue (DBD) - Kemenkes RI',
    category: 'Pengenalan',
    youtubeUrl: 'https://www.youtube.com/watch?v=4tpY7eGSF4s',
    duration: '3:45',
    description: 'Penjelasan lengkap tentang penyakit DBD dari Kementerian Kesehatan RI.',
    views: 0,
  },
  {
    title: 'Cara Mencegah Demam Berdarah dengan 3M Plus',
    category: 'Pencegahan',
    youtubeUrl: 'https://www.youtube.com/watch?v=Jh8Q0QmQm2o',
    duration: '4:30',
    description: 'Tutorial praktis melakukan 3M Plus untuk mencegah DBD di rumah.',
    views: 0,
  },
  {
    title: 'Gejala dan Tanda Bahaya Demam Berdarah',
    category: 'Gejala',
    youtubeUrl: 'https://www.youtube.com/watch?v=vZu5j3h3lxA',
    duration: '5:12',
    description: 'Mengenal gejala DBD dan tanda bahaya yang harus segera ke rumah sakit.',
    views: 0,
  },
  {
    title: 'Animasi Edukasi DBD untuk Anak',
    category: 'Edukasi',
    youtubeUrl: 'https://www.youtube.com/watch?v=WFBF3qD_qCI',
    duration: '3:20',
    description: 'Video animasi edukatif tentang DBD yang mudah dipahami anak-anak.',
    views: 0,
  },
  {
    title: 'PSN (Pemberantasan Sarang Nyamuk) DBD',
    category: 'Pencegahan',
    youtubeUrl: 'https://www.youtube.com/watch?v=dSJ9xsRqXdI',
    duration: '6:15',
    description: 'Panduan lengkap PSN untuk memberantas sarang nyamuk Aedes aegypti.',
    views: 0,
  },
  {
    title: 'Fogging DBD - Kapan dan Bagaimana?',
    category: 'Penanganan',
    youtubeUrl: 'https://www.youtube.com/watch?v=8RhtyJ8VQm4',
    duration: '4:45',
    description: 'Informasi tentang proses fogging untuk pengendalian nyamuk DBD.',
    views: 0,
  },
];

// ========== SEED FUNCTIONS ==========

export async function seedMaterials() {
  const results = { success: 0, failed: 0, skipped: 0 };
  
  for (const materi of materiData) {
    try {
      // Check if material with same title already exists
      const q = query(
        collection(db, 'materials'),
        where('title', '==', materi.title)
      );
      const existing = await getDocs(q);
      
      if (existing.empty) {
        await addDoc(collection(db, 'materials'), {
          ...materi,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
        });
        results.success++;
      } else {
        results.skipped++;
      }
    } catch (error) {
      console.error(`Failed to seed material: ${materi.title}`, error);
      results.failed++;
    }
  }
  
  return results;
}

export async function seedPosters() {
  const results = { success: 0, failed: 0, skipped: 0 };
  
  for (const poster of posterData) {
    try {
      const q = query(
        collection(db, 'posters'),
        where('title', '==', poster.title)
      );
      const existing = await getDocs(q);
      
      if (existing.empty) {
        await addDoc(collection(db, 'posters'), {
          ...poster,
          createdAt: Timestamp.now(),
        });
        results.success++;
      } else {
        results.skipped++;
      }
    } catch (error) {
      console.error(`Failed to seed poster: ${poster.title}`, error);
      results.failed++;
    }
  }
  
  return results;
}

export async function seedVideos() {
  const results = { success: 0, failed: 0, skipped: 0 };
  
  for (const video of videoData) {
    try {
      const q = query(
        collection(db, 'videos'),
        where('title', '==', video.title)
      );
      const existing = await getDocs(q);
      
      if (existing.empty) {
        await addDoc(collection(db, 'videos'), {
          ...video,
          createdAt: Timestamp.now(),
        });
        results.success++;
      } else {
        results.skipped++;
      }
    } catch (error) {
      console.error(`Failed to seed video: ${video.title}`, error);
      results.failed++;
    }
  }
  
  return results;
}

export async function seedAll() {
  console.log('🌱 Starting database seeding...');
  
  const materials = await seedMaterials();
  console.log('📚 Materials:', materials);
  
  const posters = await seedPosters();
  console.log('🖼️  Posters:', posters);
  
  const videos = await seedVideos();
  console.log('🎥 Videos:', videos);
  
  return {
    materials,
    posters,
    videos,
    total: {
      success: materials.success + posters.success + videos.success,
      failed: materials.failed + posters.failed + videos.failed,
      skipped: materials.skipped + posters.skipped + videos.skipped,
    }
  };
}
