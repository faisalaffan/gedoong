<script setup lang="ts">
import { ref } from "vue";

useHead({
  title: 'FAQ - Pertanyaan Sering Diajukan'
})

const activeCategory = ref("Semua");
const search = ref("");

const faqs = [
  {
    category: "Umum",
    question: "Apa itu Gedoong?",
    answer: "Gedoong adalah platform PropTech all-in-one yang dirancang khusus untuk agen properti independen di Indonesia. Kami membantu Anda mengelola listing properti, memantau leads klien melalui pipeline Kanban, mencatat transaksi komisi keuangan, dan mengotomasi pembagian split komisi dalam satu dashboard terintegrasi."
  },
  {
    category: "Umum",
    question: "Apakah Gedoong benar-benar gratis?",
    answer: "Ya, benar! Kami menyediakan Paket Gratis selamanya yang memungkinkan Anda mengelola hingga 10 listing aktif, 50 data kontak klien, dan papan pipeline dasar tanpa perlu memasukkan kartu kredit."
  },
  {
    category: "Fitur & Teknis",
    question: "Apakah database klien CRM saya aman?",
    answer: "Keamanan data Anda adalah prioritas utama kami. Semua data klien CRM bersifat privat penuh untuk masing-masing akun agen. Admin Gedoong maupun agen lain tidak memiliki akses ke database klien Anda. Semua data disimpan secara aman dengan enkripsi SSL di server cloud Supabase."
  },
  {
    category: "Fitur & Teknis",
    question: "Bagaimana cara mencatat komisi dan pajak PPh 21?",
    answer: "Anda dapat mencatat komisi melalui menu 'Komisi' di dashboard CRM Anda. Cukup pilih klien dan deal yang sesuai, maka sistem akan menghitung komisi kotor secara otomatis berdasarkan harga deal. Jika Anda beralih ke Paket Pro, sistem akan secara otomatis memproyeksikan estimasi potongan PPh 21 (2.5%) dan pembagian split komisi (60% Agen / 40% Kantor) untuk laporan keuangan Anda."
  },
  {
    category: "Akun & Pembayaran",
    question: "Bagaimana cara upgrade ke Paket Pro?",
    answer: "Anda dapat melakukan upgrade dengan masuk ke menu 'Pengaturan Akun' -> 'Billing' di dashboard CRM Anda. Pilih Paket Pro, pilih metode pembayaran (Transfer Bank, E-Wallet, atau Kartu Kredit), dan nikmati masa uji coba gratis selama 7 hari."
  },
  {
    category: "Akun & Pembayaran",
    question: "Apakah saya bisa membatalkan langganan Paket Pro kapan saja?",
    answer: "Tentu saja. Anda bebas membatalkan langganan Paket Pro kapan saja tanpa biaya penalti atau komitmen jangka panjang. Setelah pembatalan, akun Anda akan kembali ke Paket Gratis setelah periode penagihan berjalan berakhir."
  }
];

const filteredFaqs = computed(() => {
  return faqs.filter(f => {
    const matchesSearch = f.question.toLowerCase().includes(search.value.toLowerCase()) || 
                          f.answer.toLowerCase().includes(search.value.toLowerCase());
    const matchesCategory = activeCategory.value === "Semua" || f.category === activeCategory.value;
    return matchesSearch && matchesCategory;
  });
});

// Accordion toggle state
const openIndex = ref<number | null>(null);
function toggleAccordion(index: number) {
  if (openIndex.value === index) {
    openIndex.value = null;
  } else {
    openIndex.value = index;
  }
}
</script>

<template>
  <div class="faq-page">
    <!-- Hero Header -->
    <header class="faq-hero">
      <h1 class="faq-title">Ada Pertanyaan? Temukan Jawabannya di Sini</h1>
      <p class="faq-subtitle">
        Kami merangkum semua pertanyaan yang paling sering ditanyakan oleh agen properti seputar manajemen listing, keamanan database, dan penagihan billing.
      </p>
    </header>

    <!-- Main Section -->
    <section class="faq-section">
      <!-- Search & Filters -->
      <div class="faq-toolbar">
        <div class="toolbar-left">
          <button 
            v-for="cat in ['Semua', 'Umum', 'Fitur & Teknis', 'Akun & Pembayaran']" 
            :key="cat"
            class="btn-category"
            :class="{ active: activeCategory === cat }"
            @click="activeCategory = cat"
          >
            {{ cat }}
          </button>
        </div>
        <div class="toolbar-right">
          <input 
            type="text" 
            v-model="search" 
            class="faq-search-input"
            placeholder="Cari pertanyaan..."
          />
        </div>
      </div>

      <!-- FAQ Accordions List -->
      <div class="faq-accordions" v-if="filteredFaqs.length > 0">
        <div 
          v-for="(faq, idx) in filteredFaqs" 
          :key="idx" 
          class="accordion-item"
          :class="{ open: openIndex === idx }"
        >
          <div class="accordion-header" @click="toggleAccordion(idx)">
            <h4>{{ faq.question }}</h4>
            <span class="accordion-arrow">▼</span>
          </div>
          <div class="accordion-content" v-show="openIndex === idx">
            <p>{{ faq.answer }}</p>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div class="empty-faq" v-else>
        <span class="empty-icon">🔍</span>
        <h3>Pertanyaan Tidak Ditemukan</h3>
        <p>Maaf, kami tidak dapat menemukan jawaban yang cocok dengan kata kunci pencarian Anda.</p>
        <button class="btn-reset" @click="search = ''; activeCategory = 'Semua'">Reset Filter</button>
      </div>

      <!-- Support Footer -->
      <div class="faq-support-footer">
        <h3>Pertanyaan Anda Belum Terjawab?</h3>
        <p>Hubungi tim customer support kami yang siap membantu Anda kapan saja.</p>
        <div class="support-buttons">
          <NuxtLink to="/kontak" class="btn-contact-support">Hubungi Support Form</NuxtLink>
          <a href="https://wa.me/6281234567890" target="_blank" class="btn-wa-support">Chat WhatsApp Support</a>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.faq-page {
  background: var(--bg-default);
  color: var(--text-dark);
  font-family: 'Inter', sans-serif;
  min-height: 100vh;
}

.faq-hero {
  text-align: center;
  padding: 80px 24px 60px;
  background: linear-gradient(135deg, #0b1c30 0%, #0052cc 100%);
  color: white;
  clip-path: polygon(0 0, 100% 0, 100% 90%, 0 97%);
}

.faq-title {
  font-family: 'Outfit', sans-serif;
  font-size: 36px;
  font-weight: 800;
  margin-bottom: 16px;
}

.faq-subtitle {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.9);
  max-width: 680px;
  margin: 0 auto;
  line-height: 1.6;
}

/* Toolbar filters */
.faq-section {
  max-width: 800px;
  margin: 0 auto 100px;
  padding: 40px 24px;
}

.faq-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  margin-bottom: 36px;
  border-bottom: 2px solid #e2e8f0;
  padding-bottom: 16px;
}

.toolbar-left {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.btn-category {
  padding: 8px 16px;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  background: white;
  color: #475569;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
}

.btn-category:hover,
.btn-category.active {
  border-color: #0052cc;
  background: #eff6ff;
  color: #0052cc;
}

.faq-search-input {
  height: 38px;
  padding: 0 16px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 13px;
  outline: none;
  width: 220px;
  background: white;
  transition: border-color 0.15s ease;
}

.faq-search-input:focus {
  border-color: #0052cc;
}

/* Accordion list styling */
.faq-accordions {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.accordion-item {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0,0,0,0.01);
  transition: all 0.2s ease;
}

.accordion-item:hover {
  border-color: #cbd5e1;
}

.accordion-item.open {
  border-color: #0052cc;
  box-shadow: 0 8px 24px rgba(0,82,204,0.03);
}

.accordion-header {
  padding: 20px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  user-select: none;
}

.accordion-header h4 {
  font-family: 'Outfit', sans-serif;
  font-size: 15.5px;
  font-weight: 750;
  color: #0f172a;
  margin: 0;
  line-height: 1.4;
  flex: 1;
  padding-right: 20px;
}

.accordion-arrow {
  font-size: 11px;
  color: #64748b;
  transition: transform 0.25s ease;
}

.accordion-item.open .accordion-arrow {
  transform: rotate(180deg);
  color: #0052cc;
}

.accordion-content {
  padding: 0 24px 24px 24px;
  border-top: 1px solid #f1f5f9;
  background: #fafafb;
}

.accordion-content p {
  font-size: 14px;
  color: #475569;
  line-height: 1.65;
  margin: 20px 0 0 0;
}

/* Empty State */
.empty-faq {
  text-align: center;
  padding: 64px 24px;
  background: white;
  border-radius: 12px;
  border: 2px dashed #cbd5e1;
}

.empty-icon {
  font-size: 32px;
  display: block;
  margin-bottom: 12px;
}

.empty-faq h3 {
  font-family: 'Outfit', sans-serif;
  font-size: 18px;
  color: #0f172a;
  margin: 0 0 8px 0;
}

.empty-faq p {
  font-size: 13.5px;
  color: #64748b;
  margin: 0 0 20px 0;
}

.btn-reset {
  padding: 10px 20px;
  background: #0052cc;
  border: none;
  color: white;
  border-radius: 6px;
  font-weight: 700;
  cursor: pointer;
}

/* Support footer */
.faq-support-footer {
  margin-top: 64px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 40px;
  text-align: center;
  box-shadow: 0 4px 20px rgba(0,0,0,0.01);
}

.faq-support-footer h3 {
  font-family: 'Outfit', sans-serif;
  font-size: 20px;
  font-weight: 750;
  color: #0f172a;
  margin: 0 0 10px 0;
}

.faq-support-footer p {
  font-size: 14.5px;
  color: #64748b;
  margin: 0 0 28px 0;
}

.support-buttons {
  display: flex;
  justify-content: center;
  gap: 16px;
  flex-wrap: wrap;
}

.btn-contact-support {
  padding: 12px 28px;
  background: #0052cc;
  color: white;
  font-size: 14px;
  font-weight: 700;
  text-decoration: none;
  border-radius: 8px;
}

.btn-wa-support {
  padding: 12px 28px;
  background: #25d366;
  color: white;
  font-size: 14px;
  font-weight: 700;
  text-decoration: none;
  border-radius: 8px;
}

@media (max-width: 768px) {
  .faq-toolbar {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }
  
  .faq-search-input {
    width: 100%;
  }
  
  .faq-hero {
    padding: 60px 16px 40px;
  }
  
  .faq-title {
    font-size: 28px;
  }
}
</style>
