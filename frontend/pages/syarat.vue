<script setup lang="ts">
useHead({
  title: 'Syarat & Ketentuan Penggunaan'
})
</script>

<template>
  <div class="legal-page">
    <!-- Hero Header -->
    <header class="legal-hero">
      <h1 class="legal-title">Syarat & Ketentuan Penggunaan</h1>
      <p class="legal-subtitle">
        Pembaruan Terakhir: 24 Mei 2026. Harap baca dokumen ketentuan layanan ini dengan saksama sebelum menggunakan Gedoong.
      </p>
    </header>

    <!-- Content Container -->
    <section class="legal-section">
      <div class="legal-grid">
        <!-- Sticky Left Navigation -->
        <aside class="legal-sidebar">
          <ul class="sidebar-links">
            <li><a href="#pendahuluan" class="active">1. Ketentuan Umum</a></li>
            <li><a href="#akun">2. Registrasi & Akun</a></li>
            <li><a href="#listing">3. Ketentuan Listing</a></li>
            <li><a href="#biaya">4. Paket & Pembayaran</a></li>
            <li><a href="#tanggungjawab">5. Batasan Tanggung Jawab</a></li>
          </ul>
        </aside>

        <!-- Right Content Body -->
        <article class="legal-body">
          <section id="pendahuluan" class="legal-content-block">
            <h3>1. Ketentuan Umum</h3>
            <p>
              Dengan mengakses dan menggunakan platform Gedoong (situs web, portal, dan CRM), Anda menyatakan bahwa Anda telah membaca, memahami, dan menyetujui untuk terikat oleh Syarat & Ketentuan ini. Gedoong berhak untuk mengubah atau memperbarui ketentuan ini sewaktu-waktu tanpa pemberitahuan sebelumnya.
            </p>
            <p>
              Platform kami dirancang khusus sebagai alat bantu manajemen Real Estate bagi agen properti independen mandiri di Indonesia.
            </p>
          </section>

          <section id="akun" class="legal-content-block">
            <h3>2. Pendaftaran Akun & Keanggotaan</h3>
            <p>
              Untuk menggunakan layanan CRM dan mempublikasikan properti, Anda diwajibkan mendaftar dan menjaga keamanan akun Anda sendiri:
            </p>
            <ul>
              <li>Anda wajib memberikan informasi kontak (Nama, Telepon, dan Email) yang akurat dan aktif saat registrasi.</li>
              <li>Satu akun hanya boleh digunakan oleh satu individu agen terdaftar.</li>
              <li>Penyalahgunaan akun atau pemalsuan data keanggotaan dapat mengakibatkan penangguhan layanan secara permanen tanpa pengembalian dana.</li>
            </ul>
          </section>

          <section id="listing" class="legal-content-block">
            <h3>3. Akurasi Listing & Konten Properti</h3>
            <p>
              Setiap agen bertanggung jawab penuh atas segala konten listing properti yang dipublikasikan ke portal publik Gedoong:
            </p>
            <ul>
              <li>Agen wajib menjamin properti yang diiklankan memiliki status legalitas yang jelas dan harga yang sesuai dengan kesepakatan pemilik properti (owner).</li>
              <li>Segala bentuk penipuan listing (listing palsu, harga umpan, foto tiruan) sangat dilarang.</li>
              <li>Gedoong berhak menghapus secara sepihak listing yang dianggap melanggar hukum atau memiliki kualitas informasi rendah demi menjaga reputasi portal.</li>
            </ul>
          </section>

          <section id="biaya" class="legal-content-block">
            <h3>4. Ketentuan Paket & Pembayaran</h3>
            <p>
              Kami menyediakan dua paket langganan yaitu Paket Gratis dan Paket Pro:
            </p>
            <p>
              Layanan Paket Pro ditagih secara berulang setiap bulan. Pembatalan langganan dapat dilakukan kapan saja melalui dashboard pengaturan billing Anda. Biaya yang sudah didebit untuk periode berjalan tidak dapat di-refund.
            </p>
          </section>

          <section id="tanggungjawab" class="legal-content-block">
            <h3>5. Batasan Tanggung Jawab</h3>
            <p>
              Gedoong bertindak sebagai penyedia platform SaaS (Software-as-a-Service) CRM dan portal iklan properti. Kami tidak terlibat dalam transaksi jual-beli/sewa aktual antara agen, pemilik, dan konsumen akhir.
            </p>
            <p>
              Kami tidak bertanggung jawab atas segala kerugian finansial, sengketa komisi, kerusakan properti, atau masalah hukum yang timbul dari interaksi bisnis antar pengguna platform.
            </p>
          </section>
        </article>
      </div>
    </section>
  </div>
</template>

<style scoped>
.legal-page {
  background: var(--bg-default);
  color: var(--text-dark);
  font-family: 'Inter', sans-serif;
  min-height: 100vh;
}

.legal-hero {
  text-align: center;
  padding: 80px 24px 60px;
  background: linear-gradient(135deg, #0b1c30 0%, #0052cc 100%);
  color: white;
  clip-path: polygon(0 0, 100% 0, 100% 90%, 0 97%);
}

.legal-title {
  font-family: 'Outfit', sans-serif;
  font-size: 32px;
  font-weight: 800;
  margin-bottom: 16px;
}

.legal-subtitle {
  font-size: 15px;
  color: rgba(255, 255, 255, 0.9);
  max-width: 680px;
  margin: 0 auto;
  line-height: 1.6;
}

/* Legal grid layout */
.legal-section {
  max-width: 1040px;
  margin: 0 auto 100px;
  padding: 60px 24px;
}

.legal-grid {
  display: grid;
  grid-template-columns: 1fr 2.5fr;
  gap: 48px;
  align-items: start;
}

/* Sidebar navigation */
.legal-sidebar {
  position: sticky;
  top: 100px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.01);
}

.sidebar-links {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.sidebar-links a {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #64748b;
  text-decoration: none;
  padding: 8px 12px;
  border-radius: 6px;
  transition: all 0.15s ease;
}

.sidebar-links a:hover,
.sidebar-links a.active {
  background: #eff6ff;
  color: #0052cc;
}

/* Content Body */
.legal-body {
  display: flex;
  flex-direction: column;
  gap: 48px;
}

.legal-content-block h3 {
  font-family: 'Outfit', sans-serif;
  font-size: 20px;
  font-weight: 750;
  color: #0f172a;
  margin: 0 0 16px 0;
  border-bottom: 2px solid #f1f5f9;
  padding-bottom: 8px;
}

.legal-content-block p {
  font-size: 14.5px;
  color: #334155;
  line-height: 1.65;
  margin: 0 0 14px 0;
}

.legal-content-block ul {
  padding-left: 20px;
  margin-bottom: 14px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.legal-content-block li {
  font-size: 14px;
  color: #334155;
  line-height: 1.5;
}

@media (max-width: 768px) {
  .legal-grid {
    grid-template-columns: 1fr;
    gap: 32px;
  }
  
  .legal-sidebar {
    position: static;
  }
  
  .legal-hero {
    padding: 60px 16px 40px;
  }
  
  .legal-title {
    font-size: 26px;
  }
}
</style>
