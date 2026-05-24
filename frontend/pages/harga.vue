<script setup lang="ts">
const isAnnual = ref(false);

useHead({
  title: "Paket Harga — Gedoong CRM",
  meta: [
    {
      name: "description",
      content:
        "Pilih paket Gedoong CRM yang sesuai: Gratis selamanya, Pro untuk agen aktif, Business untuk tim & AI, hingga Enterprise white-label.",
    },
  ],
});
</script>

<template>
  <div class="pricing-page">
    <!-- Hero -->
    <header class="pricing-hero">
      <p class="hero-eyebrow">Transparansi Penuh, Tanpa Biaya Tersembunyi</p>
      <h1 class="pricing-title">
        Pilih Paket yang Tepat untuk Karier Properti Anda
      </h1>
      <p class="pricing-subtitle">
        Mulai gratis selamanya. Tingkatkan saat bisnis Anda berkembang.
      </p>
      <!-- Annual toggle -->
      <div class="billing-toggle">
        <span :class="{ 'toggle-active': !isAnnual }" @click="isAnnual = false"
          >Bulanan</span
        >
        <button
          class="toggle-switch"
          :class="{ 'is-annual': isAnnual }"
          @click="isAnnual = !isAnnual"
          aria-label="Toggle annual billing"
        >
          <span class="toggle-knob" />
        </button>
        <span :class="{ 'toggle-active': isAnnual }" @click="isAnnual = true"
          >Tahunan</span
        >
        <span class="annual-badge" v-if="isAnnual">Hemat 20%</span>
      </div>
    </header>

    <!-- Pricing Stack -->
    <section class="pricing-section">
      <div class="pricing-stack">
        <!-- 1. Gratis -->
        <div class="pricing-row">
          <div class="row-left">
            <span class="tier-badge badge-free">GRATIS</span>
            <h2 class="tier-name">Paket Gratis</h2>
            <p class="tier-target">
              Untuk agen independen pemula atau paruh waktu
            </p>
            <div class="price-block">
              <span class="price-currency">Rp</span>
              <span class="price-amount">0</span>
              <span class="price-period">/ selamanya</span>
            </div>
            <NuxtLink to="/daftar" class="btn-cta btn-free"
              >Mulai Gratis Sekarang →</NuxtLink
            >
          </div>
          <div class="row-right">
            <p class="feature-group-label">Fitur Inti (Open Source · MIT)</p>
            <ul class="feature-list">
              <li>
                <span class="check free-check">✓</span> Maksimal
                <strong>5 Listing</strong> Properti Aktif
              </li>
              <li>
                <span class="check free-check">✓</span> Kanban Pipeline Prospek
                Dasar
              </li>
              <li>
                <span class="check free-check">✓</span> Database Klien (s.d. 50
                Kontak)
              </li>
              <li>
                <span class="check free-check">✓</span> Catat Komisi Single
                Agent
              </li>
              <li>
                <span class="check free-check">✓</span> Notifikasi Real-time
                (Supabase Realtime)
              </li>
              <li>
                <span class="check free-check">✓</span> WhatsApp Click-to-Chat
                Integration
              </li>
              <li>
                <span class="check free-check">✓</span> Auth Google & Apple
                OAuth
              </li>
              <li class="disabled">
                <span class="cross">✗</span> Analisis Komisi & Laporan Finansial
              </li>
              <li class="disabled">
                <span class="cross">✗</span> Ekspor CSV/PDF
              </li>
            </ul>
          </div>
        </div>

        <div class="divider" />

        <!-- 2. Pro -->
        <div class="pricing-row featured-row">
          <div class="row-left">
            <span class="tier-badge badge-pro">❆ PRO</span>
            <h2 class="tier-name">Paket Pro</h2>
            <p class="tier-target">
              Agen profesional aktif — individual agent serius
            </p>
            <div class="price-block">
              <span class="price-currency">Rp</span>
              <span class="price-amount">{{ isAnnual ? "239k" : "299k" }}</span>
              <span class="price-period">/ bulan</span>
            </div>
            <p class="price-annual-note" v-if="isAnnual">
              Ditagih Rp 2.868k/tahun (hemat Rp 720k)
            </p>
            <NuxtLink to="/daftar" class="btn-cta btn-pro"
              >Coba Pro 7 Hari Gratis →</NuxtLink
            >
            <p class="trial-note">Tidak perlu kartu kredit</p>
          </div>
          <div class="row-right">
            <p class="feature-group-label">Semua fitur Gratis, ditambah:</p>
            <ul class="feature-list">
              <li>
                <span class="check pro-check">✓</span>
                <strong>Unlimited</strong> Listing & Database Klien
              </li>
              <li>
                <span class="check pro-check">✓</span> Kanban Pipeline Lanjutan
                (drag & drop)
              </li>
              <li>
                <span class="check pro-check">✓</span>
                <strong>Dokumen Hukum</strong> — AJB, PPJB, Surat Kuasa (PDF)
              </li>
              <li>
                <span class="check pro-check">✓</span> Digital Signature pada
                Dokumen
              </li>
              <li>
                <span class="check pro-check">✓</span>
                <strong>Manajemen Tim</strong> Multi-Agen dalam 1 Kantor
              </li>
              <li>
                <span class="check pro-check">✓</span> Split Komisi Transaksi &
                Audit Log Tim
              </li>
              <li>
                <span class="check pro-check">✓</span> Proyeksi PPh 21 &
                Analisis Komisi Mendalam
              </li>
              <li><span class="check pro-check">✓</span> Ekspor Laporan CSV</li>
              <li>
                <span class="check pro-check">✓</span> Cloud Backup Otomatis
              </li>
              <li>
                <span class="check pro-check">✓</span> Dukungan Prioritas
                WhatsApp 24/7
              </li>
            </ul>
          </div>
        </div>

        <div class="divider" />

        <!-- 3. Business -->
        <div class="pricing-row business-row">
          <div class="row-left">
            <span class="tier-badge badge-business">🚀 BUSINESS</span>
            <h2 class="tier-name">Paket Business</h2>
            <p class="tier-target">
              Kantor agen & tim properti — 5–20 agen per kantor
            </p>
            <div class="price-block">
              <span class="price-currency">Rp</span>
              <span class="price-amount">{{ isAnnual ? "799k" : "999k" }}</span>
              <span class="price-period">/ bulan/kantor</span>
            </div>
            <p class="price-annual-note" v-if="isAnnual">
              Ditagih Rp 9.588k/tahun (hemat Rp 2.4jt)
            </p>
            <NuxtLink to="/kontak" class="btn-cta btn-business"
              >Jadwalkan Demo Gratis →</NuxtLink
            >
            <p class="trial-note">Setup & onboarding gratis</p>
          </div>
          <div class="row-right">
            <p class="feature-group-label">Semua fitur Pro, ditambah:</p>
            <ul class="feature-list">
              <li>
                <span class="check biz-check">✓</span>
                <strong>AI Engine</strong> — Estimasi Harga Properti (NJOP + ML)
              </li>
              <li>
                <span class="check biz-check">✓</span> AI Copywriter Deskripsi
                Iklan Otomatis
              </li>
              <li>
                <span class="check biz-check">✓</span>
                <strong>WhatsApp Asisten</strong> — Auto-Reply & Kualifikasi
                Lead
              </li>
              <li>
                <span class="check biz-check">✓</span> Event-triggered
                Notification via WhatsApp Business API
              </li>
              <li>
                <span class="check biz-check">✓</span>
                <strong>Advanced Report</strong> — Dasbor Analitik Kantor
              </li>
              <li>
                <span class="check biz-check">✓</span> Ekspor Custom Report
                Bulanan (PDF)
              </li>
              <li>
                <span class="check biz-check">✓</span> Dedicated Account Manager
              </li>
            </ul>
          </div>
        </div>

        <div class="divider" />

        <!-- 4. Enterprise -->
        <div class="pricing-row enterprise-row">
          <div class="row-left">
            <span class="tier-badge badge-enterprise">◆ ENTERPRISE</span>
            <h2 class="tier-name">Paket Enterprise</h2>
            <p class="tier-target">
              Jaringan agen besar & franchise properti — 1000+ agen
            </p>
            <div class="price-block">
              <span class="price-amount enterprise-price">Custom</span>
            </div>
            <NuxtLink to="/kontak" class="btn-cta btn-enterprise"
              >Hubungi Tim Sales →</NuxtLink
            >
            <p class="trial-note">Harga disesuaikan kebutuhan</p>
          </div>
          <div class="row-right">
            <p class="feature-group-label">Semua fitur Business, ditambah:</p>
            <ul class="feature-list">
              <li>
                <span class="check ent-check">✓</span>
                <strong>White-Label</strong> — Ubah Logo, Nama & Warna Brand
              </li>
              <li>
                <span class="check ent-check">✓</span> Domain Kustom
                (app.kantoranda.id)
              </li>
              <li>
                <span class="check ent-check">✓</span> Email Kustom
                (notif@kantoranda.id)
              </li>
              <li>
                <span class="check ent-check">✓</span> SLA Uptime 99.9% &
                Infrastruktur Terisolasi
              </li>
              <li>
                <span class="check ent-check">✓</span> Integrasi API Kustom
                (ERP, CRM Internal)
              </li>
              <li>
                <span class="check ent-check">✓</span> Pelatihan Tim &
                Onboarding Penuh
              </li>
              <li>
                <span class="check ent-check">✓</span> Kontrak & Invoicing
                Korporat
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- FAQ -->
    <section class="faq-section">
      <h2 class="faq-title">Pertanyaan Umum</h2>
      <div class="faq-grid">
        <div class="faq-item">
          <h4>Apakah Paket Gratis benar-benar selamanya?</h4>
          <p>
            Ya! Core CRM Gedoong bersifat open source (MIT). Anda bisa
            menggunakannya gratis selamanya atau bahkan self-host sendiri
            menggunakan Supabase Cloud gratis.
          </p>
        </div>
        <div class="faq-item">
          <h4>Kapan saya perlu upgrade ke Pro?</h4>
          <p>
            Ketika Anda punya lebih dari 10 listing aktif, butuh generate
            dokumen AJB/PPJB, atau mulai membangun tim agen dalam satu kantor.
          </p>
        </div>
        <div class="faq-item">
          <h4>Apa bedanya Business dengan Pro?</h4>
          <p>
            Business menambahkan AI Estimator harga properti, AI Copywriter
            iklan, WhatsApp Asisten untuk otomatisasi lead, dan analitik kantor
            tingkat lanjut. Ideal untuk 5+ agen aktif.
          </p>
        </div>
        <div class="faq-item">
          <h4>Apakah ada biaya tersembunyi?</h4>
          <p>
            Sama sekali tidak. Skema harga kami transparan penuh. Batalkan kapan
            saja tanpa penalti.
          </p>
        </div>
        <div class="faq-item">
          <h4>Bagaimana keamanan data saya?</h4>
          <p>
            Data disimpan di Supabase (PostgreSQL) dengan enkripsi end-to-end
            dan Row Level Security (RLS) yang terbuka untuk diaudit siapa saja.
          </p>
        </div>
        <div class="faq-item">
          <h4>Apakah AI Engine akurat untuk pasar Indonesia?</h4>
          <p>
            AI Estimator menggunakan data NJOP, riwayat transaksi platform, dan
            model ML yang terus diperbarui. Akurasi rata-rata ±8% dari harga
            pasar aktual di area yang sudah ter-cover.
          </p>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.pricing-page {
  background: #f8fafc;
  color: #0f172a;
  font-family: "Inter", sans-serif;
  min-height: 100vh;
}

/* ── Hero ── */
.pricing-hero {
  text-align: center;
  padding: 80px 24px 64px;
  background: linear-gradient(135deg, #0b1c30 0%, #0d3a72 60%, #0052cc 100%);
  color: white;
  clip-path: polygon(0 0, 100% 0, 100% 88%, 0 100%);
}

.hero-eyebrow {
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 16px;
}

.pricing-title {
  font-family: "Outfit", sans-serif;
  font-size: clamp(28px, 4vw, 40px);
  font-weight: 800;
  line-height: 1.2;
  margin-bottom: 16px;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
}

.pricing-subtitle {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.8);
  max-width: 500px;
  margin: 0 auto;
  line-height: 1.6;
}

/* Annual billing toggle */
.billing-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-top: 28px;
  font-size: 14px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.6);
  cursor: pointer;
  user-select: none;
}

.billing-toggle span {
  transition: color 0.2s;
}
.toggle-active {
  color: white !important;
}

.toggle-switch {
  position: relative;
  width: 44px;
  height: 24px;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: background 0.25s;
  flex-shrink: 0;
}

.toggle-switch.is-annual {
  background: #10b981;
}

.toggle-knob {
  position: absolute;
  top: 3px;
  left: 3px;
  width: 18px;
  height: 18px;
  background: white;
  border-radius: 50%;
  transition: transform 0.25s;
  display: block;
}

.toggle-switch.is-annual .toggle-knob {
  transform: translateX(20px);
}

.annual-badge {
  background: #10b981;
  color: white !important;
  font-size: 11px;
  font-weight: 800;
  padding: 3px 8px;
  border-radius: 20px;
  letter-spacing: 0.04em;
}

.price-annual-note {
  font-size: 11px;
  color: #10b981;
  font-weight: 600;
  margin: -6px 0 4px;
}

/* ── Stack Layout ── */
.pricing-section {
  max-width: 900px;
  margin: 0 auto;
  padding: 56px 24px 80px;
}

.pricing-stack {
  display: flex;
  flex-direction: column;
  gap: 0;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.06);
}

.divider {
  height: 1px;
  background: #f1f5f9;
}

/* ── Row ── */
.pricing-row {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 0;
  transition: background 0.2s;
}

.pricing-row:hover {
  background: #fafbff;
}

.featured-row {
  background: linear-gradient(100deg, #eff6ff 0%, #fff 50%);
}

.featured-row:hover {
  background: linear-gradient(100deg, #dbeafe 0%, #f0f7ff 50%);
}

.business-row {
  background: linear-gradient(100deg, #faf5ff 0%, #fff 50%);
}

.business-row:hover {
  background: linear-gradient(100deg, #ede9fe 0%, #f8f5ff 50%);
}

.enterprise-row {
  background: linear-gradient(100deg, #fffbeb 0%, #fff 50%);
}

.enterprise-row:hover {
  background: linear-gradient(100deg, #fef3c7 0%, #fffcf0 50%);
}

/* ── Left Panel ── */
.row-left {
  padding: 40px 32px;
  border-right: 1px solid #f1f5f9;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.tier-badge {
  font-family: "Outfit", sans-serif;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: 4px 10px;
  border-radius: 6px;
  align-self: flex-start;
}

.badge-free {
  background: #f1f5f9;
  color: #475569;
}
.badge-pro {
  background: #dbeafe;
  color: #1d4ed8;
}
.badge-business {
  background: linear-gradient(135deg, #7c3aed, #a855f7);
  color: white;
}
.badge-enterprise {
  background: linear-gradient(135deg, #b45309, #d97706);
  color: white;
}

.tier-name {
  font-family: "Outfit", sans-serif;
  font-size: 22px;
  font-weight: 750;
  color: #0f172a;
  margin: 0;
}

.tier-target {
  font-size: 13px;
  color: #64748b;
  line-height: 1.4;
  margin: 0;
}

.price-block {
  display: flex;
  align-items: baseline;
  gap: 2px;
  margin: 4px 0;
}

.price-currency {
  font-size: 16px;
  font-weight: 600;
  color: #334155;
}

.price-amount {
  font-family: "Outfit", sans-serif;
  font-size: 40px;
  font-weight: 800;
  color: #0f172a;
  line-height: 1;
}

.enterprise-price {
  font-size: 32px;
}

.price-period {
  font-size: 13px;
  color: #94a3b8;
  margin-left: 4px;
}

.btn-cta {
  display: block;
  text-align: center;
  padding: 12px 20px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 700;
  text-decoration: none;
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
  background: linear-gradient(135deg, #0052cc, #0040a1);
  color: white;
  box-shadow: 0 4px 12px rgba(0, 82, 204, 0.25);
}
.btn-pro:hover {
  background: linear-gradient(135deg, #0040a1, #003080);
  box-shadow: 0 6px 18px rgba(0, 82, 204, 0.38);
  transform: translateY(-1px);
}

.btn-business {
  background: linear-gradient(135deg, #7c3aed, #6d28d9);
  color: white;
  box-shadow: 0 4px 12px rgba(124, 58, 237, 0.3);
}
.btn-business:hover {
  background: linear-gradient(135deg, #6d28d9, #5b21b6);
  box-shadow: 0 6px 18px rgba(124, 58, 237, 0.42);
  transform: translateY(-1px);
}

.btn-enterprise {
  background: linear-gradient(135deg, #b45309, #d97706);
  color: white;
  box-shadow: 0 4px 12px rgba(180, 83, 9, 0.28);
}
.btn-enterprise:hover {
  background: linear-gradient(135deg, #92400e, #b45309);
  box-shadow: 0 6px 18px rgba(180, 83, 9, 0.4);
  transform: translateY(-1px);
}

.trial-note {
  font-size: 11px;
  color: #94a3b8;
  text-align: center;
  margin: 0;
}

/* ── Right Panel ── */
.row-right {
  padding: 40px 36px;
}

.feature-group-label {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #94a3b8;
  margin: 0 0 16px 0;
}

.feature-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.feature-list li {
  font-size: 14px;
  color: #334155;
  display: flex;
  align-items: flex-start;
  gap: 10px;
  line-height: 1.5;
}

.feature-list li.disabled {
  color: #cbd5e1;
}

.check {
  font-weight: 700;
  flex-shrink: 0;
  margin-top: 1px;
}

.free-check {
  color: #64748b;
}
.pro-check {
  color: #0052cc;
}
.biz-check {
  color: #7c3aed;
}
.ent-check {
  color: #b45309;
}
.cross {
  color: #e2e8f0;
  font-weight: 700;
  flex-shrink: 0;
}

/* ── FAQ ── */
.faq-section {
  max-width: 900px;
  margin: 0 auto 100px;
  padding: 0 24px;
}

.faq-title {
  font-family: "Outfit", sans-serif;
  font-size: 26px;
  font-weight: 750;
  color: #0f172a;
  text-align: center;
  margin-bottom: 40px;
}

.faq-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 28px;
}

.faq-item {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 24px;
}

.faq-item h4 {
  font-family: "Outfit", sans-serif;
  font-size: 15px;
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

/* ── Responsive ── */
@media (max-width: 768px) {
  .pricing-row {
    grid-template-columns: 1fr;
  }

  .row-left {
    border-right: none;
    border-bottom: 1px solid #f1f5f9;
    padding: 32px 24px 28px;
  }

  .row-right {
    padding: 28px 24px 32px;
  }

  .faq-grid {
    grid-template-columns: 1fr;
  }

  .pricing-hero {
    padding: 60px 20px 52px;
  }
}
</style>
