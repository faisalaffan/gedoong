<script setup lang="ts">
useHead({
  title: "Pusat Bantuan & Panduan Pengguna",
});
</script>

<template>
  <div class="help-page">
    <!-- Hero Header -->
    <header class="help-hero">
      <h1 class="help-title">Pusat Bantuan Gedoong</h1>
      <p class="help-subtitle">
        Temukan panduan lengkap, tutorial langkah demi langkah, dan tips
        memaksimalkan pengelolaan properti Anda di dashboard CRM.
      </p>
    </header>

    <!-- Content Sections -->
    <section class="help-section">
      <!-- Search Banner -->
      <div class="search-banner">
        <h3>Bagaimana kami bisa membantu Anda hari ini?</h3>
        <div class="search-box-wrap">
          <input
            type="text"
            class="help-search-input"
            placeholder="Cari artikel bantuan (misal: 'upload listing', 'hitung komisi')..."
          />
        </div>
      </div>

      <!-- Categories Grid -->
      <h2 class="help-section-title">Kategori Panduan</h2>
      <div class="categories-grid">
        <!-- 1. Listing -->
        <div class="category-card">
          <span class="category-icon">🏠</span>
          <h4>Manajemen Listing</h4>
          <p>
            Pelajari cara menambah properti baru, mengedit spesifikasi,
            mengunggah galeri foto, dan mengubah status iklan di portal publik.
          </p>
          <ul class="help-links">
            <li>
              <NuxtLink to="/faq">Cara mengunggah foto properti →</NuxtLink>
            </li>
            <li>
              <NuxtLink to="/faq"
                >Mengubah status properti ke Terjual →</NuxtLink
              >
            </li>
          </ul>
        </div>

        <!-- 2. Pipeline -->
        <div class="category-card">
          <span class="category-icon">📋</span>
          <h4>Pipeline & Kanban board</h4>
          <p>
            Panduan menggunakan drag-and-drop opportunity cards, memindahkan
            stage closing, serta melakukan log history deals klien.
          </p>
          <ul class="help-links">
            <li>
              <NuxtLink to="/faq">Cara memindahkan stage deal →</NuxtLink>
            </li>
            <li>
              <NuxtLink to="/faq">Melihat riwayat timeline deals →</NuxtLink>
            </li>
          </ul>
        </div>

        <!-- 3. Klien -->
        <div class="category-card">
          <span class="category-icon">👥</span>
          <h4>Direktori Kontak Klien</h4>
          <p>
            Mendokumentasikan data kontak klien, menambahkan timeline interaksi
            rapat, email, marketing source, dan korelasi multiple deals.
          </p>
          <ul class="help-links">
            <li>
              <NuxtLink to="/faq">Menulis catatan aktivitas klien →</NuxtLink>
            </li>
            <li>
              <NuxtLink to="/faq"
                >Mengkorelasikan deal baru ke klien →</NuxtLink
              >
            </li>
          </ul>
        </div>

        <!-- 4. Komisi -->
        <div class="category-card">
          <span class="category-icon">💰</span>
          <h4>Komisi & Keuangan</h4>
          <p>
            Cara mencatat komisi kotor, proyeksi split revenue 60/40 dengan
            kantor, dan estimasi potongan PPh 21 pajak individu.
          </p>
          <ul class="help-links">
            <li><NuxtLink to="/faq">Menghitung PPh 21 otomatis →</NuxtLink></li>
            <li>
              <NuxtLink to="/faq">Mengekspor laporan komisi ke CSV →</NuxtLink>
            </li>
          </ul>
        </div>
      </div>

      <!-- Quick Support Box -->
      <div class="support-contact-box">
        <div class="support-text">
          <h3>Tidak menemukan solusi yang Anda cari?</h3>
          <p>
            Customer support kami aktif 24/7 untuk menjawab kendala integrasi
            database, billing, atau akun Anda.
          </p>
        </div>
        <NuxtLink to="/kontak" class="btn-support-redirect"
          >Hubungi Customer Support</NuxtLink
        >
      </div>
    </section>
  </div>
</template>

<style scoped>
.help-page {
  background: var(--bg-default);
  color: var(--text-dark);
  font-family: "Inter", sans-serif;
  min-height: 100vh;
}

.help-hero {
  text-align: center;
  padding: 80px 24px 60px;
  background: linear-gradient(135deg, #0b1c30 0%, #0052cc 100%);
  color: white;
  clip-path: polygon(0 0, 100% 0, 100% 90%, 0 97%);
}

.help-title {
  font-family: "Outfit", sans-serif;
  font-size: 36px;
  font-weight: 800;
  margin-bottom: 16px;
}

.help-subtitle {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.9);
  max-width: 680px;
  margin: 0 auto;
  line-height: 1.6;
}

/* Sections */
.help-section {
  max-width: 1040px;
  margin: 0 auto 100px;
  padding: 40px 24px;
}

/* Search Banner */
.search-banner {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 32px;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.02);
  margin-bottom: 56px;
}

.search-banner h3 {
  font-family: "Outfit", sans-serif;
  font-size: 18px;
  font-weight: 750;
  color: #0f172a;
  margin: 0 0 16px 0;
}

.search-box-wrap {
  max-width: 600px;
  margin: 0 auto;
}

.help-search-input {
  width: 100%;
  height: 48px;
  padding: 0 20px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 14px;
  outline: none;
  background: #fafafb;
  transition: all 0.15s ease;
}

.help-search-input:focus {
  border-color: #0052cc;
  background: white;
  box-shadow: 0 0 0 3px rgba(0, 82, 204, 0.08);
}

.help-section-title {
  font-family: "Outfit", sans-serif;
  font-size: 24px;
  font-weight: 800;
  color: #0f172a;
  margin: 0 0 36px 0;
  text-align: center;
}

/* Categories Grid */
.categories-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 28px;
  margin-bottom: 64px;
}

.category-card {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.01);
  display: flex;
  flex-direction: column;
  transition: all 0.2s ease;
}

.category-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.03);
}

.category-icon {
  font-size: 32px;
  margin-bottom: 16px;
  display: block;
}

.category-card h4 {
  font-family: "Outfit", sans-serif;
  font-size: 17px;
  font-weight: 750;
  color: #0f172a;
  margin: 0 0 10px 0;
}

.category-card p {
  font-size: 13.5px;
  color: #64748b;
  line-height: 1.55;
  margin: 0 0 20px 0;
}

.help-links {
  list-style: none;
  padding: 0;
  margin: auto 0 0 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
  border-top: 1px solid #f1f5f9;
  padding-top: 16px;
}

.help-links a {
  font-size: 13px;
  font-weight: 600;
  color: #0052cc;
  text-decoration: none;
  transition: color 0.15s ease;
}

.help-links a:hover {
  color: #003080;
  text-decoration: underline;
}

/* Support Box */
.support-contact-box {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 36px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.01);
}

.support-text {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.support-text h3 {
  font-family: "Outfit", sans-serif;
  font-size: 18px;
  font-weight: 750;
  color: #0f172a;
  margin: 0;
}

.support-text p {
  font-size: 14px;
  color: #64748b;
  margin: 0;
}

.btn-support-redirect {
  padding: 12px 28px;
  background: linear-gradient(135deg, #0052cc 0%, #0040a1 100%);
  color: white;
  font-size: 14px;
  font-weight: 700;
  text-decoration: none;
  border-radius: 8px;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(0, 82, 204, 0.15);
}

@media (max-width: 768px) {
  .categories-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .support-contact-box {
    flex-direction: column;
    text-align: center;
    padding: 24px;
  }

  .help-hero {
    padding: 60px 16px 40px;
  }

  .help-title {
    font-size: 28px;
  }
}
</style>
