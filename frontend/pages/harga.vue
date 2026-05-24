<script setup lang="ts">
useHead({
  title: 'Paket Harga Terbuka & Transparan'
})
</script>

<template>
  <div class="pricing-page">
    <!-- Hero Header -->
    <header class="pricing-hero">
      <h1 class="pricing-title">Pilih Paket untuk Melejitkan Bisnis Properti Anda</h1>
      <p class="pricing-subtitle">
        Kelola listing, kelola deal, kelola klien, dan catat komisi secara profesional. Coba gratis selamanya.
      </p>
    </header>

    <!-- Pricing Grid -->
    <section class="pricing-section">
      <div class="pricing-grid">
        <!-- 1. Free Tier -->
        <div class="pricing-card">
          <span class="card-badge-free">PART-TIME AGENT</span>
          <h3 class="tier-title">Paket Gratis</h3>
          <p class="tier-desc">Sangat cocok untuk agen properti independen pemula atau paruh waktu.</p>
          <div class="price-container">
            <span class="currency">Rp</span>
            <span class="price-amount">0</span>
            <span class="period">/ selamanya</span>
          </div>
          
          <NuxtLink to="/daftar" class="btn-tier btn-free">Mulai Gratis Sekarang</NuxtLink>

          <ul class="features-list">
            <li><span class="check-icon">✓</span> Maksimal 10 Listing Aktif</li>
            <li><span class="check-icon">✓</span> Kanban Pipeline Prospek Dasar</li>
            <li><span class="check-icon">✓</span> Database Klien (s.d 50 Kontak)</li>
            <li><span class="check-icon">✓</span> 1 Akun Pengguna</li>
            <li><span class="check-icon">✓</span> WhatsApp Click-to-chat Integration</li>
            <li class="disabled"><span class="cross-icon">✗</span> Analisis Komisi & Finansial</li>
            <li class="disabled"><span class="cross-icon">✗</span> Proyeksi Pajak PPh 21 Otomatis</li>
            <li class="disabled"><span class="cross-icon">✗</span> Ekspor CSV/PDF Laporan</li>
          </ul>
        </div>

        <!-- 2. Pro Tier -->
        <div class="pricing-card featured-card">
          <div class="card-badge-pro">PRO AGENT CHOICE</div>
          <h3 class="tier-title">Paket Pro</h3>
          <p class="tier-desc">Sempurna untuk agen profesional berprestasi tinggi yang ingin tumbuh tanpa batas.</p>
          <div class="price-container">
            <span class="currency">Rp</span>
            <span class="price-amount">149k</span>
            <span class="period">/ bulan</span>
          </div>
          
          <NuxtLink to="/daftar" class="btn-tier btn-pro">Tingkatkan ke Pro (Uji Coba 7 Hari)</NuxtLink>

          <ul class="features-list">
            <li><span class="check-icon green-check">✓</span> <strong>Unlimited</strong> Listing Properti</li>
            <li><span class="check-icon green-check">✓</span> Kanban Pipeline Lanjutan</li>
            <li><span class="check-icon green-check">✓</span> <strong>Unlimited</strong> Database Klien & Kontak</li>
            <li><span class="check-icon green-check">✓</span> Analisis Komisi & Finansial Mendalam</li>
            <li><span class="check-icon green-check">✓</span> Proyeksi Pembagian & PPh 21 Pajak</li>
            <li><span class="check-icon green-check">✓</span> Ekspor Laporan CSV Laporan</li>
            <li><span class="check-icon green-check">✓</span> Cloud Backup Database Otomatis</li>
            <li><span class="check-icon green-check">✓</span> Dukungan Prioritas WA (24/7 Support)</li>
          </ul>
        </div>
      </div>
    </section>

    <!-- FAQ Accordions -->
    <section class="faq-section">
      <h2 class="faq-title">Pertanyaan Sering Diajukan</h2>
      <div class="faq-grid">
        <div class="faq-item">
          <h4>Apakah benar paket gratis aktif selamanya?</h4>
          <p>Ya, benar! Kami berkomitmen membantu agen independen pemula. Anda dapat terus menggunakan paket gratis kami selamanya tanpa perlu memasukkan kartu kredit.</p>
        </div>
        <div class="faq-item">
          <h4>Kapan saya perlu beralih ke paket Pro?</h4>
          <p>Jika Anda memiliki lebih dari 10 listing aktif secara bersamaan, atau membutuhkan fitur kalkulasi PPh 21 otomatis, split komisi, dan ekspor laporan CSV untuk pembukuan kantor.</p>
        </div>
        <div class="faq-item">
          <h4>Apakah ada biaya tersembunyi lainnya?</h4>
          <p>Sama sekali tidak ada. Skema kami transparan penuh. Pembatalan langganan Pro dapat dilakukan kapan saja tanpa penalti.</p>
        </div>
        <div class="faq-item">
          <h4>Bagaimana keamanan data properti dan klien saya?</h4>
          <p>Keamanan data adalah prioritas tertinggi kami. Semua informasi disimpan dengan enkripsi tingkat militer di infrastruktur server Supabase Cloud yang aman.</p>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.pricing-page {
  background: var(--bg-default);
  color: var(--text-dark);
  font-family: 'Inter', sans-serif;
  min-height: 100vh;
}

.pricing-hero {
  text-align: center;
  padding: 80px 24px 60px;
  background: linear-gradient(135deg, #0b1c30 0%, #0052cc 100%);
  color: white;
  clip-path: polygon(0 0, 100% 0, 100% 90%, 0 97%);
}

.pricing-title {
  font-family: 'Outfit', sans-serif;
  font-size: 36px;
  font-weight: 800;
  margin-bottom: 16px;
}

.pricing-subtitle {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.9);
  max-width: 680px;
  margin: 0 auto;
  line-height: 1.6;
}

/* Grid & Cards */
.pricing-section {
  max-width: 1000px;
  margin: 0 auto;
  padding: 60px 24px;
}

.pricing-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 32px;
  align-items: stretch;
}

.pricing-card {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 40px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.02);
  display: flex;
  flex-direction: column;
  position: relative;
  transition: all 0.25s ease;
}

.pricing-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 40px rgba(0,0,0,0.06);
}

.featured-card {
  border: 2px solid #0052cc;
  box-shadow: 0 20px 40px rgba(0, 82, 204, 0.08);
}

.featured-card:hover {
  box-shadow: 0 25px 50px rgba(0, 82, 204, 0.12);
}

.card-badge-free,
.card-badge-pro {
  font-family: 'Outfit', sans-serif;
  font-size: 10px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 4px 10px;
  border-radius: 6px;
  align-self: flex-start;
  margin-bottom: 20px;
}

.card-badge-free {
  background: #f1f5f9;
  color: #475569;
}

.card-badge-pro {
  background: #eff6ff;
  color: #0052cc;
}

.tier-title {
  font-family: 'Outfit', sans-serif;
  font-size: 24px;
  font-weight: 750;
  color: #0f172a;
  margin: 0 0 8px 0;
}

.tier-desc {
  font-size: 14px;
  color: #64748b;
  line-height: 1.5;
  margin: 0 0 24px 0;
  height: 42px;
}

.price-container {
  display: flex;
  align-items: baseline;
  margin-bottom: 32px;
}

.currency {
  font-size: 18px;
  font-weight: 600;
  color: #0f172a;
  margin-right: 2px;
}

.price-amount {
  font-family: 'Outfit', sans-serif;
  font-size: 48px;
  font-weight: 800;
  color: #0f172a;
  line-height: 1;
}

.period {
  font-size: 14px;
  color: #64748b;
  margin-left: 4px;
}

.btn-tier {
  display: block;
  text-align: center;
  padding: 14px 24px;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 700;
  text-decoration: none;
  margin-bottom: 32px;
  transition: all 0.2s ease;
}

.btn-free {
  background: #f1f5f9;
  color: #475569;
  border: 1px solid #cbd5e1;
}

.btn-free:hover {
  background: #e2e8f0;
  color: #0f172a;
}

.btn-pro {
  background: linear-gradient(135deg, #0052cc 0%, #0040a1 100%);
  color: white;
  box-shadow: 0 4px 14px rgba(0, 82, 204, 0.2);
}

.btn-pro:hover {
  background: linear-gradient(135deg, #0040a1 0%, #003080 100%);
  box-shadow: 0 6px 20px rgba(0, 82, 204, 0.35);
  transform: scale(1.01);
}

.features-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 14px;
  border-top: 1px solid #f1f5f9;
  padding-top: 24px;
}

.features-list li {
  font-size: 14px;
  color: #334155;
  display: flex;
  align-items: center;
  gap: 10px;
}

.features-list li.disabled {
  color: #94a3b8;
}

.check-icon {
  font-weight: bold;
  color: #0052cc;
}

.green-check {
  color: #10b981;
}

.cross-icon {
  font-weight: bold;
  color: #ef4444;
}

/* FAQ */
.faq-section {
  max-width: 800px;
  margin: 0 auto 100px;
  padding: 40px 24px 0;
  border-top: 1px solid #e2e8f0;
}

.faq-title {
  text-align: center;
  font-family: 'Outfit', sans-serif;
  font-size: 28px;
  font-weight: 750;
  color: #0f172a;
  margin-bottom: 48px;
}

.faq-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 32px;
}

.faq-item h4 {
  font-family: 'Outfit', sans-serif;
  font-size: 16px;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 10px 0;
}

.faq-item p {
  font-size: 14px;
  color: #64748b;
  line-height: 1.6;
  margin: 0;
}

@media (max-width: 768px) {
  .pricing-grid,
  .faq-grid {
    grid-template-columns: 1fr;
    gap: 24px;
  }
  
  .pricing-hero {
    padding: 60px 16px 40px;
  }
  
  .pricing-title {
    font-size: 28px;
  }
}
</style>
