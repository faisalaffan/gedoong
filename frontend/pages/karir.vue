<script setup lang="ts">
import { ref } from "vue";
import { useToast } from "~/composables/useToast";
import ToastContainer from "~/components/listing/ToastContainer.vue";

useHead({
  title: 'Karir & Bergabung Bersama Kami'
})

const { toasts, showToast } = useToast();

const form = ref({
  nama: "",
  email: "",
  posisi: "",
  cv_link: "",
  pesan: ""
});

const isSubmitting = ref(false);

async function handleSubmit() {
  if (!form.value.nama || !form.value.email || !form.value.posisi) {
    showToast("Harap isi semua kolom wajib (*)", "error");
    return;
  }

  isSubmitting.value = true;
  
  // Simulate network request
  await new Promise((resolve) => setTimeout(resolve, 800));
  
  showToast("Lamaran Anda berhasil dikirim! Tim HR kami akan menghubungi Anda melalui email.", "success");
  
  form.value = {
    nama: "",
    email: "",
    posisi: "",
    cv_link: "",
    pesan: ""
  };
  
  isSubmitting.value = false;
}
</script>

<template>
  <div class="career-page">
    <ToastContainer :toasts="toasts" />

    <!-- Hero Header -->
    <header class="career-hero">
      <h1 class="career-title">Bergabunglah dengan Masa Depan PropTech Indonesia</h1>
      <p class="career-subtitle">
        Di Gedoong, kami membangun ekosistem CRM dan portal properti terpadu untuk memberdayakan ribuan agen independen di seluruh negeri.
      </p>
    </header>

    <!-- Content Sections -->
    <section class="career-section">
      <!-- Why Gedoong Section -->
      <div class="values-block">
        <h2 class="section-sub-title">Mengapa Berkarir di Gedoong?</h2>
        <div class="values-grid">
          <div class="value-card">
            <span class="value-icon">💻</span>
            <h4>Remote / Hybrid Kerja</h4>
            <p>Fleksibilitas penuh untuk bekerja dari rumah atau dari kantor kolaboratif kami di Kuningan, Jakarta.</p>
          </div>
          <div class="value-card">
            <span class="value-icon">🚀</span>
            <h4>Inovasi Berkelanjutan</h4>
            <p>Terus berinovasi mengembangkan modul AI, automasi WhatsApp, dan sistem financial-sharing terbaik.</p>
          </div>
          <div class="value-card">
            <span class="value-icon">📈</span>
            <h4>Pertumbuhan Profesional</h4>
            <p>Tunjangan belajar tahunan, mentoring dari leader berpengalaman, dan jenjang karir yang terarah.</p>
          </div>
        </div>
      </div>

      <!-- Main Split Grid -->
      <div class="career-split-grid">
        <!-- Active Job List -->
        <div class="jobs-column">
          <h2 class="column-title">Lowongan Aktif</h2>
          
          <div class="job-card">
            <div class="job-header">
              <span class="job-dept">ENGINEERING</span>
              <span class="job-type">Hybrid</span>
            </div>
            <h4>Senior Frontend Engineer (Vue/Nuxt)</h4>
            <p class="job-desc">Memimpin pengembangan modul CRM, performa rendering kanban, dan visualisasi chart finansial premium.</p>
            <span class="job-loc">📍 Kuningan, Jakarta & Remote</span>
          </div>

          <div class="job-card">
            <div class="job-header">
              <span class="job-dept">PRODUCT</span>
              <span class="job-type">Hybrid</span>
            </div>
            <h4>Product Manager (CRM / PropTech)</h4>
            <p class="job-desc">Membentuk roadmap produk, riset kebutuhan agen properti lapangan, dan memimpin kolaborasi tim lintas fungsi.</p>
            <span class="job-loc">📍 Kuningan, Jakarta & Remote</span>
          </div>

          <div class="job-card">
            <div class="job-header">
              <span class="job-dept">SALES & PARTNERSHIP</span>
              <span class="job-type">Full-Time</span>
            </div>
            <h4>Business Development Representative</h4>
            <p class="job-desc">Menjalin kerjasama dengan kantor agen properti (ARA, ERA, Ray White) dan onboarding agen ke platform premium.</p>
            <span class="job-loc">📍 Jakarta Selatan</span>
          </div>
        </div>

        <!-- Application Form -->
        <div class="apply-column">
          <h2 class="column-title">Kirim Lamaran Anda</h2>
          
          <form @submit.prevent="handleSubmit" class="apply-form">
            <div class="form-group">
              <label for="nama" class="form-label required">Nama Lengkap</label>
              <input
                type="text"
                id="nama"
                v-model="form.nama"
                class="form-input"
                placeholder="Masukkan nama lengkap Anda"
                required
              />
            </div>

            <div class="form-group">
              <label for="email" class="form-label required">Alamat Email</label>
              <input
                type="email"
                id="email"
                v-model="form.email"
                class="form-input"
                placeholder="Masukkan email aktif"
                required
              />
            </div>

            <div class="form-group">
              <label for="posisi" class="form-label required">Posisi yang Dilamar</label>
              <select id="posisi" v-model="form.posisi" class="form-select" required>
                <option value="" disabled>-- Pilih Posisi --</option>
                <option value="Frontend Engineer">Senior Frontend Engineer (Vue/Nuxt)</option>
                <option value="Product Manager">Product Manager (CRM / PropTech)</option>
                <option value="Business Development">Business Development Representative</option>
                <option value="Lainnya">Lainnya / Magang</option>
              </select>
            </div>

            <div class="form-group">
              <label for="cv_link" class="form-label">Link CV / Portofolio (Gdrive/Linkedin)</label>
              <input
                type="url"
                id="cv_link"
                v-model="form.cv_link"
                class="form-input"
                placeholder="https://..."
              />
            </div>

            <div class="form-group">
              <label for="pesan" class="form-label">Pesan / Pengantar Singkat</label>
              <textarea
                id="pesan"
                v-model="form.pesan"
                class="form-textarea"
                rows="4"
                placeholder="Ceritakan singkat mengapa Anda tertarik bergabung..."
              ></textarea>
            </div>

            <button type="submit" class="btn-submit" :disabled="isSubmitting">
              {{ isSubmitting ? 'Mengirim...' : 'Kirim Lamaran ➔' }}
            </button>
          </form>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.career-page {
  background: var(--bg-default);
  color: var(--text-dark);
  font-family: 'Inter', sans-serif;
  min-height: 100vh;
}

.career-hero {
  text-align: center;
  padding: 80px 24px 60px;
  background: linear-gradient(135deg, #0b1c30 0%, #0052cc 100%);
  color: white;
  clip-path: polygon(0 0, 100% 0, 100% 90%, 0 97%);
}

.career-title {
  font-family: 'Outfit', sans-serif;
  font-size: 36px;
  font-weight: 800;
  margin-bottom: 16px;
  max-width: 780px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.2;
}

.career-subtitle {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.9);
  max-width: 680px;
  margin: 0 auto;
  line-height: 1.6;
}

.career-section {
  max-width: 1040px;
  margin: 0 auto 100px;
  padding: 40px 24px;
}

/* Values Section */
.values-block {
  margin-bottom: 64px;
}

.section-sub-title {
  font-family: 'Outfit', sans-serif;
  font-size: 24px;
  font-weight: 800;
  text-align: center;
  margin-bottom: 36px;
  color: #0f172a;
}

.values-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.value-card {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 28px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.01);
  text-align: center;
  transition: all 0.2s ease;
}

.value-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 24px rgba(0,0,0,0.03);
}

.value-icon {
  font-size: 28px;
  margin-bottom: 16px;
  display: block;
}

.value-card h4 {
  font-family: 'Outfit', sans-serif;
  font-size: 16px;
  font-weight: 750;
  color: #0f172a;
  margin: 0 0 10px 0;
}

.value-card p {
  font-size: 13.5px;
  color: #64748b;
  line-height: 1.6;
  margin: 0;
}

/* Split Grid */
.career-split-grid {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 48px;
  align-items: start;
}

.column-title {
  font-family: 'Outfit', sans-serif;
  font-size: 22px;
  font-weight: 750;
  color: #0f172a;
  margin: 0 0 28px 0;
  border-bottom: 2px solid #e2e8f0;
  padding-bottom: 12px;
}

/* Jobs Column Cards */
.jobs-column {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.job-card {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.01);
  display: flex;
  flex-direction: column;
  transition: all 0.2s ease;
}

.job-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(0,0,0,0.04);
  border-color: #0052cc;
}

.job-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.job-dept {
  font-size: 9.5px;
  font-weight: 800;
  color: #0052cc;
  background: #eff6ff;
  padding: 2px 8px;
  border-radius: 4px;
  letter-spacing: 0.05em;
}

.job-type {
  font-size: 10px;
  font-weight: 600;
  color: #475569;
  background: #f1f5f9;
  padding: 2px 8px;
  border-radius: 4px;
}

.job-card h4 {
  font-family: 'Outfit', sans-serif;
  font-size: 16px;
  font-weight: 750;
  color: #0f172a;
  margin: 0 0 10px 0;
}

.job-desc {
  font-size: 13.5px;
  color: #64748b;
  line-height: 1.5;
  margin: 0 0 16px 0;
}

.job-loc {
  font-size: 12px;
  font-weight: 500;
  color: #475569;
}

/* Apply Column Form */
.apply-column {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 40px;
  box-shadow: 0 10px 35px rgba(0,0,0,0.02);
}

.apply-form {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-label {
  font-size: 12.5px;
  font-weight: 600;
  color: #334155;
}

.required::after {
  content: " *";
  color: #ef4444;
}

.form-input,
.form-select,
.form-textarea {
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  padding: 10px 14px;
  font-size: 13.5px;
  font-family: 'Inter', sans-serif;
  color: #0f172a;
  outline: none;
  background: #fff;
  transition: all 0.15s ease;
}

.form-input:focus,
.form-select:focus,
.form-textarea:focus {
  border-color: #0052cc;
  box-shadow: 0 0 0 3px rgba(0, 82, 204, 0.08);
}

.form-textarea {
  resize: vertical;
}

.btn-submit {
  padding: 12px 28px;
  background: linear-gradient(135deg, #0052cc 0%, #0040a1 100%);
  border: none;
  color: #fff;
  border-radius: 8px;
  font-family: 'Outfit', sans-serif;
  font-weight: 700;
  font-size: 15px;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0,82,204,0.15);
  transition: all 0.2s ease;
  align-self: flex-start;
  margin-top: 8px;
}

.btn-submit:hover:not(:disabled) {
  background: linear-gradient(135deg, #0040a1 0%, #003080 100%);
  box-shadow: 0 6px 18px rgba(0,82,204,0.25);
  transform: translateY(-1px);
}

.btn-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .career-split-grid {
    grid-template-columns: 1fr;
    gap: 32px;
  }
  
  .values-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .apply-column {
    padding: 24px;
  }
  
  .career-hero {
    padding: 60px 16px 40px;
  }
  
  .career-title {
    font-size: 28px;
  }
}
</style>
