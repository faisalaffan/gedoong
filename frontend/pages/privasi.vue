<script setup lang="ts">
useHead({
  title: 'Kebijakan Privasi & Perlindungan Data'
})
</script>

<template>
  <div class="legal-page">
    <!-- Hero Header -->
    <header class="legal-hero">
      <h1 class="legal-title">Kebijakan Privasi & Perlindungan Data</h1>
      <p class="legal-subtitle">
        Pembaruan Terakhir: 24 Mei 2026. Kami berkomitmen untuk menjaga keamanan dan kerahasiaan informasi personal dan transaksi Anda.
      </p>
    </header>

    <!-- Content Container -->
    <section class="legal-section">
      <div class="legal-grid">
        <!-- Sticky Left Navigation -->
        <aside class="legal-sidebar">
          <ul class="sidebar-links">
            <li><a href="#pengumpulan" class="active">1. Informasi Dikumpulkan</a></li>
            <li><a href="#penggunaan">2. Penggunaan Data</a></li>
            <li><a href="#keamanan">3. Keamanan Informasi</a></li>
            <li><a href="#berbagi">4. Pengungkapan Pihak Ketiga</a></li>
            <li><a href="#hak">5. Hak Pengguna</a></li>
          </ul>
        </aside>

        <!-- Right Content Body -->
        <article class="legal-body">
          <section id="pengumpulan" class="legal-content-block">
            <h3>1. Informasi yang Kami Kumpulkan</h3>
            <p>
              Gedoong mengumpulkan data yang diperlukan untuk mendukung operasi CRM Properti agen independen:
            </p>
            <ul>
              <li><strong>Informasi Agen:</strong> Nama lengkap, email, nomor HP, foto profil (avatar), nama instansi/kantor agen.</li>
              <li><strong>Informasi Klien CRM:</strong> Nama klien, kontak telepon klien, alamat email, tipe klien, riwayat deal transaksi, dan catatan aktivitas interaksi yang diinput oleh agen ke database pribadi.</li>
              <li><strong>Informasi Listing:</strong> Judul properti, spesifikasi (KT/KM/Luas), harga, kelengkapan surat, dan foto galeri properti.</li>
            </ul>
          </section>

          <section id="penggunaan" class="legal-content-block">
            <h3>2. Bagaimana Kami Menggunakan Informasi Anda</h3>
            <p>
              Data yang dikumpulkan di Gedoong digunakan sepenuhnya untuk kepentingan fungsional CRM:
            </p>
            <ul>
              <li>Menampilkan listing properti ke portal publik bagi pembeli/penyewa potensial.</li>
              <li>Mendukung sistem pencatatan database klien internal milik agen agar terorganisir dengan rapi.</li>
              <li>Menghasilkan analisis komisi, proyeksi PPh 21, dan visualisasi papan pipeline Kanban.</li>
              <li>Mengirimkan notifikasi pembaruan sistem dan bantuan kendala teknis (support).</li>
            </ul>
          </section>

          <section id="keamanan" class="legal-content-block">
            <h3>3. Keamanan & Perlindungan Informasi</h3>
            <p>
              Kami mengimplementasikan langkah-langkah keamanan komprehensif untuk memastikan kerahasiaan data pribadi Anda:
            </p>
            <ul>
              <li>Semua komunikasi data terenkripsi penuh melalui protokol HTTPS / SSL.</li>
              <li>Infrastruktur database di-host di server Supabase Cloud yang berstandar internasional dengan cadangan data (cloud backups) berkala.</li>
              <li>Database klien CRM bersifat privat penuh untuk masing-masing agen pemilik akun; admin Gedoong dan agen lain tidak memiliki akses ke database klien Anda.</li>
            </ul>
          </section>

          <section id="berbagi" class="legal-content-block">
            <h3>4. Pengungkapan Kepada Pihak Ketiga</h3>
            <p>
              Gedoong tidak pernah menjual, menyewakan, membagikan, atau memperdagangkan informasi pribadi agen maupun data klien CRM milik agen kepada perusahaan periklanan atau pihak ketiga mana pun untuk tujuan pemasaran eksternal.
            </p>
          </section>

          <section id="hak" class="legal-content-block">
            <h3>5. Hak-Hak Pengguna (Agen & Klien)</h3>
            <p>
              Anda memiliki hak penuh atas pengelolaan data Anda di platform Gedoong:
            </p>
            <ul>
              <li><strong>Hak Akses & Edit:</strong> Anda dapat mengedit profil properti, data klien, dan komisi kapan saja melalui dashboard CRM Anda.</li>
              <li><strong>Hak Penghapusan (Right to be Forgotten):</strong> Anda dapat menghapus data listing, catatan transaksi komisi, atau data klien kapan saja. Jika Anda memutuskan menghapus akun agen Anda, seluruh database privat terkait akan dihapus permanen dari server kami.</li>
            </ul>
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
