# Panduan Konfigurasi Supabase OAuth (Google & Apple Sign-In)

Dokumen ini menjelaskan langkah-langkah lengkap untuk mengonfigurasi **Google Auth** dan **Apple Auth** pada proyek Gedoong menggunakan Supabase, baik secara manual melalui Dashboard maupun secara otomatis menggunakan script otomasi interaktif Gedoong CLI.

---

## Daftar Isi
1. [Konfigurasi Google OAuth](#1-konfigurasi-google-oauth)
2. [Konfigurasi Apple OAuth](#2-konfigurasi-apple-oauth)
3. [Menerapkan Konfigurasi ke Supabase](#3-menerapkan-konfigurasi-ke-supabase)
   - [Metode A: Script Otomatisasi Gedoong CLI (Direkomendasikan)](#metode-a-script-otomatisasi-gedoong-cli-direkomendasikan)
   - [Metode B: Manual lewat Dashboard Supabase](#metode-b-manual-lewat-dashboard-supabase)
4. [Cara Kerja Integrasi di Nuxt 3 (Frontend)](#4-cara-kerja-integrasi-di-nuxt-3-frontend)
5. [Penyelesaian Masalah (Troubleshooting)](#5-penyelesaian-masalah-troubleshooting)

---

## 1. Konfigurasi Google OAuth

Untuk mengaktifkan login dengan Google, Anda harus membuat proyek di Google Cloud Console dan mendapatkan **Client ID** serta **Client Secret**.

### Langkah-langkah:
1. **Buka Google Cloud Console**:
   Kunjungi [Google Cloud Console](https://console.cloud.google.com/) dan buat proyek baru atau pilih proyek yang sudah ada.
   
2. **Konfigurasi OAuth Consent Screen**:
   - Masuk ke menu **APIs & Services** > **OAuth consent screen**.
   - Pilih **External** dan klik **Create**.
   - Isi informasi aplikasi yang wajib (App name, User support email, Developer contact information).
   - Pada bagian **Scopes**, tambahkan scope standar: `.../auth/userinfo.email` dan `.../auth/userinfo.profile`.
   - Tambahkan email testing Anda pada bagian **Test users** (jika status aplikasi masih *Testing*).

3. **Buat Kredensial OAuth Client ID**:
   - Masuk ke menu **APIs & Services** > **Credentials**.
   - Klik **+ CREATE CREDENTIALS** > **OAuth client ID**.
   - Pilih **Application type**: `Web application`.
   - Beri nama (misal: `Gedoong Local & Web`).
   - Pada bagian **Authorized JavaScript origins**, tambahkan:
     - `http://localhost:5001` (untuk development lokal)
     - `https://pkcjhfuelyexpsypqcct.supabase.co` (domain Supabase Anda)
   - Pada bagian **Authorized redirect URIs**, masukkan callback URI Supabase Anda:
     - `https://pkcjhfuelyexpsypqcct.supabase.co/auth/v1/callback`
   - Klik **Create**.

4. **Salin Kredensial**:
   - Catat dan simpan **Client ID** dan **Client Secret** yang muncul untuk dimasukkan ke konfigurasi Supabase.

---

## 2. Konfigurasi Apple OAuth

Konfigurasi Apple Sign-In memerlukan akun **Apple Developer Program** berbayar. Konfigurasi ini memiliki beberapa tahapan khusus di Apple Developer Portal.

### Langkah 1: Kumpulkan Informasi Dasar dari Apple Developer
Sebelum memulai, Anda membutuhkan data berikut dari Apple Developer portal Anda:
*   **Team ID**: Kode 10 karakter unik yang terlihat di pojok kanan atas Apple Developer Console.
*   **Key ID**: ID dari private key `.p8` yang diunduh.
*   **Client ID (Services ID)**: Identifier khusus untuk integrasi web/OAuth.
*   **Private Key (.p8 file)**: Kunci privat rahasia yang diunduh saat membuat Key.

### Langkah 2: Buat Services ID & Whitelist Domain
1. Buka [Apple Developer Portal](https://developer.apple.com/) > **Certificates, Identifiers & Profiles** > **Identifiers**.
2. Klik tombol **+** (Plus), pilih **Services IDs**, lalu klik **Continue**.
3. Isi **Description** (misal: `Gedoong Web Auth`) dan tentukan **Identifier** (biasanya menggunakan reverse-domain, misal: `com.faisalaffan.gedoong.sid`). Klik **Continue** lalu **Register**.
4. Cari Services ID yang baru saja dibuat, klik untuk mengedit, lalu centang kotak **Sign in with Apple**.
5. Klik **Configure** di sebelah Sign in with Apple.
6. Pada kolom **Domains and Subdomains**:
   > [!WARNING]
   > **Jangan memasukkan `localhost`** ke dalam daftar domain Apple. Apple Developer Portal mendeteksi `localhost` sebagai domain tidak valid dan akan memicu error *"One or more domains are invalid"*.
   
   Masukkan hanya domain publik resmi proyek Anda dan domain project Supabase:
   `pkcjhfuelyexpsypqcct.supabase.co, gedoong.faisalaffan.com`
   
7. Pada kolom **Return URLs**, masukkan callback Supabase:
   `https://pkcjhfuelyexpsypqcct.supabase.co/auth/v1/callback`
8. Klik **Next**, lalu **Done**, lalu klik **Continue** dan **Save** untuk menyimpan konfigurasi.

### Langkah 3: Dapatkan Apple Client Secret
Apple membutuhkan **Client Secret** dalam bentuk JSON Web Token (JWT) yang ditandatangani menggunakan private key `.p8` milik Anda. Token ini memiliki masa kedaluwarsa maksimal **6 bulan**.

Terdapat dua cara untuk menangani ini:

#### Metode A: Unggah Private Key .p8 Langsung ke Dashboard Supabase (Sangat Direkomendasikan)
Supabase mempermudah proses ini dengan mengotomatiskan pembuatan dan rotasi JWT secara internal.
1. Masuk ke **Supabase Dashboard** > **Authentication** > **Providers** > **Apple**.
2. Masukkan **Services ID** sebagai *Client ID*.
3. Masukkan **Team ID** dan **Key ID**.
4. Unggah file `.p8` yang Anda unduh dari Apple Developer Portal.
5. Supabase akan secara otomatis membuat JWT Client Secret dan memperbaruinya terus-menerus tanpa harus Anda rotasi manual setiap 6 bulan!

#### Metode B: Generate JWT Secret Menggunakan Web Tool
Jika Anda ingin melakukan konfigurasi melalui CLI / Script Otomatisasi, Anda harus memasukkan `Client Secret` yang sudah berupa string JWT terenkripsi:
1. Buka tool generator gratis dari Expo: [Apple Keygen (Expo)](https://applekeygen.expo.app/) atau [Apple Developer Client Secret Generator](https://supabase-apple-client-secret.vercel.app/).
2. Masukkan informasi Anda: **Team ID**, **Services ID (Client ID)**, **Key ID**, dan isi file privat `.p8` Anda.
3. Klik **Generate**.
4. Salin string JWT panjang yang dihasilkan. String inilah yang akan dimasukkan sebagai **Client Secret (Secret Key)** pada script otomasi atau form manual.
   > [!NOTE]
   > Jika menggunakan metode ini, Anda harus membuat ulang JWT baru dan mengunggahnya ke Supabase setiap **6 bulan sekali**.

---

## 3. Menerapkan Konfigurasi ke Supabase

Gedoong menyediakan dua metode untuk menyinkronkan kredensial ini ke project Supabase Anda.

### Metode A: Script Otomatisasi Gedoong CLI (Direkomendasikan)
Kami telah menyediakan script otomasi di dalam repositori ini untuk mengunggah konfigurasi OAuth langsung ke Supabase Management API tanpa harus mengeklik menu satu per satu di browser.

1. Pastikan file `.env` di direktori `frontend/.env` Anda sudah berisi URL Supabase Anda (misal `SUPABASE_URL=https://pkcjhfuelyexpsypqcct.supabase.co`). Proyek otomatis akan membaca Project Ref Anda dari sana.
2. Dapatkan **Supabase Personal Access Token**:
   - Buka **Supabase Dashboard** > **Account** (klik foto profil Anda di pojok kiri bawah) > **Access Tokens**.
   - Klik **Generate new token**, beri nama (misal: `Gedoong CLI`), lalu salin token tersebut.
3. Jalankan command make di root direktori proyek Anda:
   ```bash
   make setup-oauth
   ```
4. Masukkan **Supabase Personal Access Token** saat diminta (input ini tersembunyi demi keamanan).
5. Pilih provider yang ingin Anda konfigurasi:
   - Pilih `1` untuk Google OAuth saja.
   - Pilih `2` untuk Apple OAuth saja (gunakan JWT Client Secret yang didapat dari Langkah 3 Metode B).
   - Pilih `3` untuk mengonfigurasi keduanya sekaligus.
6. Masukkan Client ID dan Secret yang sesuai.
7. Script akan otomatis memproses dan mengirimkan PATCH request ke Supabase API. Jika berhasil, pesan sukses `✓ Sukses! Konfigurasi Auth Supabase Anda berhasil diperbarui secara otomatis` akan muncul.

### Metode B: Manual lewat Dashboard Supabase
Jika Anda lebih memilih menggunakan antarmuka grafis:
1. Buka [Supabase Dashboard](https://supabase.com/dashboard).
2. Masuk ke proyek Anda, lalu navigasikan ke **Authentication** > **Providers**.
3. Cari **Google** dari daftar provider:
   - Aktifkan toggle **Enable Google Provider**.
   - Masukkan **Client ID** dan **Client Secret** Anda.
   - Klik **Save**.
4. Cari **Apple** dari daftar provider:
   - Aktifkan toggle **Enable Apple Provider**.
   - Masukkan **Services ID** sebagai Client ID.
   - Pilih mode input: isi **Secret Key** dengan JWT buatan Anda (dari Metode B), atau isi data `.p8` private key (Metode A).
   - Klik **Save**.

---

## 4. Cara Kerja Integrasi di Nuxt 3 (Frontend)

Integrasi OAuth di sisi Nuxt 3 diimplementasikan pada file [masuk.vue](file:///Users/faisalaffan/go/src/github.com/faisalaffan/gedoong/frontend/pages/masuk.vue) dan [daftar.vue](file:///Users/faisalaffan/go/src/github.com/faisalaffan/gedoong/frontend/pages/daftar.vue).

Kode frontend menggunakan composable `useSupabaseClient()` untuk memanggil provider sosial dengan konfigurasi pengalihan pengembalian (*callback redirection*) dinamis:

```typescript
const loginWithProvider = async (provider: 'google' | 'apple') => {
  try {
    isLoading.value = true;
    errorMsg.value = '';
    
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        // Menggunakan origin browser saat ini secara dinamis agar 
        // bekerja lancar di localhost maupun domain production (whitelabel)
        redirectTo: `${window.location.origin}/dashboard`
      }
    });

    if (error) throw error;
  } catch (err: any) {
    errorMsg.value = err.message || 'Gagal masuk menggunakan akun sosial.';
  } finally {
    isLoading.value = false;
  }
};
```

### Mengapa Pendekatan Ini "White-Label Friendly"?
*   **Redirect URL Dinamis**: Penggunaan `window.location.origin` secara otomatis mendeteksi di mana aplikasi Nuxt sedang berjalan (misal: `http://localhost:5001`, `https://gedoong.faisalaffan.com`, atau domain baru milik klien Anda).
*   **Tidak Perlu Ganti Env**: Anda tidak perlu memodifikasi variabel lingkungan `REDIRECT_URL` di sisi frontend setiap kali beralih environment atau melakukan deploy ke domain kustom baru.

---

## 5. Penyelesaian Masalah (Troubleshooting)

### Masalah 1: Error "One or more domains are invalid" di Portal Apple Developer
*   **Penyebab**: Anda memasukkan `localhost` atau URL dengan port (`http://localhost:5001`) di kolom domains.
*   **Solusi**: Hapus entri tersebut. Apple hanya membolehkan domain publik tingkat atas tanpa skema (`http://` atau `https://`). Cukup masukkan `pkcjhfuelyexpsypqcct.supabase.co` dan domain kustom produksi Anda (misal `gedoong.faisalaffan.com`).

### Masalah 2: Error "Redirect URI mismatch" pada Google Login
*   **Penyebab**: URL Callback yang Anda gunakan belum didaftarkan di Google Cloud Console, atau terdapat ketidakcocokan antara URL callback Supabase dan setelan Google.
*   **Solusi**: Pastikan Anda telah menambahkan `https://<PROJECT_REF>.supabase.co/auth/v1/callback` di kolom **Authorized redirect URIs** pada Google Cloud Console.

### Masalah 3: User dialihkan kembali ke Halaman Login dengan Status Error
*   **Penyebab**: Supabase gagal menukarkan kode otorisasi dari provider sosial karena Client Secret salah atau kedaluwarsa.
*   **Solusi**: 
    - Untuk Google, cek kembali apakah Client Secret masih aktif dan salin tanpa spasi tambahan.
    - Untuk Apple, periksa apakah JWT Client Secret Anda sudah kedaluwarsa (berlaku max 6 bulan). Disarankan beralih menggunakan Metode A (mengunggah `.p8` langsung di Dashboard Supabase).
