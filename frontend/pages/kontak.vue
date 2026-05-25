<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useToast } from "~/composables/useToast";
import ToastContainer from "~/components/listing/ToastContainer.vue";

useHead({
  title: 'Hubungi Kami - Gedoong Support'
})

const config = useRuntimeConfig();
const turnstileSiteKey = config.public.turnstileSiteKey;
const { toasts, showToast } = useToast();
const { renderTurnstile, resetTurnstile, token: captchaToken, isVerified: captchaVerified } = useTurnstile();

onMounted(() => {
  renderTurnstile("turnstile-kontak", turnstileSiteKey);
});

const form = ref({
  nama: "",
  email: "",
  subjek: "",
  pesan: ""
});

const isSubmitting = ref(false);

async function handleSubmit() {
  if (!form.value.nama || !form.value.email || !form.value.pesan) {
    showToast("Harap lengkapi semua kolom wajib (*)", "error");
    return;
  }
  if (!captchaToken.value) {
    showToast("Mohon selesaikan verifikasi keamanan di bawah.", "error");
    return;
  }

  isSubmitting.value = true;

  // Simulate network request
  await new Promise((resolve) => setTimeout(resolve, 800));

  showToast("Pesan Anda berhasil dikirim! Tim support kami akan segera membalas email Anda.", "success");

  form.value = {
    nama: "",
    email: "",
    subjek: "",
    pesan: ""
  };
  resetTurnstile();

  isSubmitting.value = false;
}
</script>

<template>
  <div class="contact-page">
    <ToastContainer :toasts="toasts" />

    <!-- Hero Header -->
    <header class="contact-hero">
      <h1 class="contact-title">Ada Pertanyaan? Kami Siap Membantu Anda</h1>
      <p class="contact-subtitle">
        Hubungi tim support atau sales kami untuk bantuan seputar platform, pendaftaran agen, atau custom sharing plans.
      </p>
    </header>

    <!-- Main Section -->
    <section class="contact-section">
      <div class="contact-grid">
        <!-- Left Column: Contact Cards -->
        <div class="info-column">
          <h2 class="column-title">Info Kontak & Dukungan</h2>
          
          <div class="contact-card">
            <span class="card-icon">💬</span>
            <div class="card-content">
              <h5>WhatsApp Support</h5>
              <p>Respon cepat untuk panduan penggunaan platform & error handling.</p>
              <a href="https://wa.me/6281234567890" target="_blank" class="btn-wa-support">Chat WhatsApp Support →</a>
            </div>
          </div>

          <div class="contact-card">
            <span class="card-icon">✉️</span>
            <div class="card-content">
              <h5>Email Resmi</h5>
              <p>Untuk pertanyaan seputar partnership, billing, dan akun premium.</p>
              <a href="mailto:support@gedoong.id" class="email-link">support@gedoong.id</a>
            </div>
          </div>

          <div class="contact-card">
            <span class="card-icon">📍</span>
            <div class="card-content">
              <h5>Kantor Pusat</h5>
              <p>Gedoong HQ - Satrio Tower Lt. 18, Jl. Prof. Dr. Satrio, Kuningan, Jakarta Selatan, 12950.</p>
            </div>
          </div>
        </div>

        <!-- Right Column: Interactive Form -->
        <div class="form-column">
          <h2 class="column-title">Kirim Pesan Langsung</h2>
          
          <form @submit.prevent="handleSubmit" class="message-form">
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
                placeholder="Masukkan alamat email aktif"
                required
              />
            </div>

            <div class="form-group">
              <label for="subjek" class="form-label">Subjek</label>
              <input
                type="text"
                id="subjek"
                v-model="form.subjek"
                class="form-input"
                placeholder="Contoh: Pertanyaan paket premium"
              />
            </div>

            <div class="form-group">
              <label for="pesan" class="form-label required">Pesan</label>
              <textarea
                id="pesan"
                v-model="form.pesan"
                class="form-textarea"
                rows="5"
                placeholder="Tuliskan detail pertanyaan atau keluhan Anda..."
                required
              ></textarea>
            </div>

            <div class="turnstile-wrap">
              <div id="turnstile-kontak"></div>
            </div>

            <button type="submit" class="btn-submit" :disabled="isSubmitting || !captchaVerified">
              {{ isSubmitting ? 'Mengirim...' : 'Kirim Pesan ➔' }}
            </button>
          </form>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.contact-page {
  background: var(--bg-default);
  color: var(--text-dark);
  font-family: 'Inter', sans-serif;
  min-height: 100vh;
}

.contact-hero {
  text-align: center;
  padding: 80px 24px 60px;
  background: linear-gradient(135deg, #0b1c30 0%, #0052cc 100%);
  color: white;
  clip-path: polygon(0 0, 100% 0, 100% 90%, 0 97%);
}

.contact-title {
  font-family: 'Outfit', sans-serif;
  font-size: 36px;
  font-weight: 800;
  margin-bottom: 16px;
}

.contact-subtitle {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.9);
  max-width: 680px;
  margin: 0 auto;
  line-height: 1.6;
}

/* Grid layout */
.contact-section {
  max-width: 1040px;
  margin: 0 auto 100px;
  padding: 60px 24px;
}

.contact-grid {
  display: grid;
  grid-template-columns: 1fr 1.2fr;
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

/* Info Column Cards */
.info-column {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.contact-card {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 24px;
  display: flex;
  gap: 16px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.01);
  transition: all 0.2s ease;
}

.contact-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(0,0,0,0.04);
}

.card-icon {
  font-size: 24px;
  background: #f1f5f9;
  width: 44px;
  height: 44px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.card-content {
  display: flex;
  flex-direction: column;
}

.card-content h5 {
  font-family: 'Outfit', sans-serif;
  font-size: 15px;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 6px 0;
}

.card-content p {
  font-size: 13.5px;
  color: #64748b;
  line-height: 1.5;
  margin: 0 0 12px 0;
}

.btn-wa-support {
  display: inline-block;
  padding: 8px 16px;
  background: #25d366;
  color: white;
  font-size: 12px;
  font-weight: 700;
  text-decoration: none;
  border-radius: 6px;
  align-self: flex-start;
  transition: background 0.15s ease;
}

.btn-wa-support:hover {
  background: #128c7e;
}

.email-link {
  font-size: 14px;
  font-weight: 600;
  color: #0052cc;
  text-decoration: none;
  align-self: flex-start;
}

.email-link:hover {
  text-decoration: underline;
}

/* Form Column */
.form-column {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 40px;
  box-shadow: 0 10px 35px rgba(0,0,0,0.02);
}

.message-form {
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
.form-textarea:focus {
  border-color: #0052cc;
  box-shadow: 0 0 0 3px rgba(0, 82, 204, 0.08);
}

.form-textarea {
  resize: vertical;
}

.turnstile-wrap {
  display: flex;
  justify-content: flex-start;
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
  .contact-grid {
    grid-template-columns: 1fr;
    gap: 32px;
  }
  
  .form-column {
    padding: 24px;
  }
  
  .contact-hero {
    padding: 60px 16px 40px;
  }
  
  .contact-title {
    font-size: 28px;
  }
}
</style>
