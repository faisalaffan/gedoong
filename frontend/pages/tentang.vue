<script setup lang="ts">
const config = useRuntimeConfig()
const appName = config.public.appName
const appDescription = config.public.appDescription
const appBanner = config.public.appBanner

useHead({
  title: 'Tentang Kami'
})

const heroStyle = computed(() => ({
  background: `linear-gradient(135deg, rgba(11, 28, 48, 0.9) 0%, rgba(0, 82, 204, 0.85) 50%, rgba(11, 28, 48, 0.95) 100%), url('${appBanner}') no-repeat center center`,
  backgroundSize: 'cover'
}))
</script>

<template>
  <div>
    <!-- Hero -->
    <section class="about-hero" :style="heroStyle">
      <h1 class="about-title">{{ appName }}: {{ appDescription }}</h1>
      <p class="about-sub">
        Platform all-in-one yang membantu agen properti independen mengelola listing, pipeline, klien, dan komisi — dalam satu tempat.
      </p>
    </section>

    <!-- Misi -->
    <section class="about-mission">
      <div class="mission-grid">
        <div class="mission-card">
          <div class="mission-icon">🎯</div>
          <h3>Untuk Agen Independen</h3>
          <p>
            {{ appName }} dirancang khusus untuk agen properti mandiri yang ingin profesional tanpa ribet. Tidak perlu tim IT, tidak perlu biaya mahal.
          </p>
        </div>
        <div class="mission-card">
          <div class="mission-icon">🚀</div>
          <h3>Dari End-to-End</h3>
          <p>
            Dari listing properti, follow-up klien, transaksi komisi, sampai manajemen dokumen — semua terintegrasi dalam satu dashboard sederhana.
          </p>
        </div>
      </div>
    </section>

    <!-- Fitur -->
    <section class="about-features">
      <h2 class="section-title">Fitur Utama</h2>
      <div class="features-grid">
        <div class="feature-card">
          <div class="feature-icon">🏠</div>
          <h3>Manajemen Listing</h3>
          <p>Kelola semua properti jual dan sewa. Upload foto, atur harga, dan pantau status listing dengan mudah.</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">📋</div>
          <h3>Pipeline Kanban</h3>
          <p>Visualisasikan prospek klien dari leads ke closing. Drag-and-drop, atur follow-up, tidak ada yang terlewat.</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">👥</div>
          <h3>Direktori Klien</h3>
          <p>Simpan data kontak, preferensi, dan riwayat interaksi dengan setiap klien. Bangun hubungan jangka panjang.</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">💰</div>
          <h3>Komisi & Keuangan</h3>
          <p>Lacak komisi dari setiap transaksi. Pantau pendapatan, buat laporan sederhana, dan kelola cashflow agen.</p>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="about-cta">
      <h2>Siap Kelola Properti Lebih Profesional?</h2>
      <p>Gabung dengan 2000+ agen yang sudah menggunakan {{ appName }}</p>
      <div class="cta-buttons">
        <button class="btn-primary-lg">Mulai Gratis Sekarang</button>
        <button class="btn-outline-lg">Hubungi Kami</button>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* Hero */
.about-hero {
  text-align: center;
  padding: 100px 24px 80px;
  color: #fff;
  clip-path: polygon(0 0, 100% 0, 100% 90%, 0 97%);
}

.about-title {
  font-family: var(--font-display);
  font-size: 38px;
  font-weight: 800;
  line-height: 1.25;
  letter-spacing: -0.02em;
  max-width: 760px;
  margin: 0 auto 20px;
  text-shadow: 0 4px 12px rgba(11, 28, 48, 0.3);
}

.about-sub {
  font-family: var(--font-body);
  font-size: 18px;
  color: rgba(255, 255, 255, 0.9);
  max-width: 640px;
  margin: 0 auto;
  line-height: 1.6;
  text-shadow: 0 2px 6px rgba(11, 28, 48, 0.2);
}

/* Misi */
.about-mission {
  max-width: 1040px;
  margin: 0 auto;
  padding: 80px 24px 48px;
}

.mission-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 32px;
}

.mission-card {
  background: var(--bg-card);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-lg);
  padding: 40px;
  box-shadow: var(--shadow-sm);
  transition: all var(--transition-normal);
}

.mission-card:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-md);
  border-color: rgba(0, 82, 204, 0.15);
}

.mission-icon {
  font-size: 36px;
  margin-bottom: 20px;
}

.mission-card h3 {
  font-family: var(--font-display);
  font-size: 20px;
  font-weight: 700;
  color: var(--text-dark);
  margin-bottom: 12px;
}

.mission-card p {
  font-family: var(--font-body);
  font-size: 15px;
  color: var(--text-medium);
  line-height: 1.65;
}

/* Fitur */
.about-features {
  max-width: 1040px;
  margin: 0 auto;
  padding: 48px 24px 80px;
}

.section-title {
  text-align: center;
  font-family: var(--font-display);
  font-size: 30px;
  font-weight: 800;
  color: var(--text-dark);
  margin-bottom: 48px;
  position: relative;
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: -12px;
  left: 50%;
  transform: translateX(-50%);
  width: 48px;
  height: 4px;
  background: var(--primary);
  border-radius: var(--radius-full);
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 28px;
}

.feature-card {
  background: var(--bg-card);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-lg);
  padding: 32px;
  box-shadow: var(--shadow-sm);
  transition: all var(--transition-normal);
}

.feature-card:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-hover);
  border-color: rgba(0, 82, 204, 0.2);
}

.feature-icon {
  font-size: 32px;
  margin-bottom: 16px;
}

.feature-card h3 {
  font-family: var(--font-display);
  font-size: 18px;
  font-weight: 700;
  color: var(--text-dark);
  margin-bottom: 10px;
}

.feature-card p {
  font-family: var(--font-body);
  font-size: 14px;
  color: var(--text-medium);
  line-height: 1.6;
}

/* CTA */
.about-cta {
  text-align: center;
  padding: 80px 24px;
  background: var(--bg-card);
  border-top: 1px solid var(--border-light);
}

.about-cta h2 {
  font-family: var(--font-display);
  font-size: 28px;
  font-weight: 800;
  color: var(--text-dark);
  margin-bottom: 12px;
}

.about-cta p {
  font-family: var(--font-body);
  font-size: 16px;
  color: var(--text-muted);
  margin-bottom: 36px;
}

.cta-buttons {
  display: flex;
  justify-content: center;
  gap: 16px;
  flex-wrap: wrap;
}

.btn-primary-lg {
  padding: 14px 36px;
  border: none;
  border-radius: var(--radius-md);
  background: var(--primary);
  color: #fff;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  font-family: var(--font-display);
  box-shadow: 0 4px 14px var(--primary-glow);
  transition: all var(--transition-fast);
}

.btn-primary-lg:hover {
  background: var(--primary-hover);
  box-shadow: 0 6px 20px rgba(0, 82, 204, 0.35);
  transform: translateY(-1px);
}

.btn-outline-lg {
  padding: 14px 36px;
  border: 2px solid var(--primary);
  border-radius: var(--radius-md);
  background: transparent;
  color: var(--primary);
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  font-family: var(--font-display);
  transition: all var(--transition-fast);
}

.btn-outline-lg:hover {
  background: var(--primary);
  color: #fff;
  box-shadow: 0 6px 20px rgba(0, 82, 204, 0.25);
  transform: translateY(-1px);
}

@media (max-width: 768px) {
  .about-hero {
    padding: 80px 16px 60px;
    clip-path: polygon(0 0, 100% 0, 100% 93%, 0 98%);
  }
  
  .about-title {
    font-size: 28px;
  }
  
  .about-sub {
    font-size: 15px;
  }

  .mission-grid,
  .features-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .about-cta h2 {
    font-size: 22px;
  }

  .about-mission {
    padding: 60px 16px 32px;
  }
  
  .about-features {
    padding: 32px 16px 60px;
  }
  
  .about-cta {
    padding: 60px 16px;
  }
}
</style>
