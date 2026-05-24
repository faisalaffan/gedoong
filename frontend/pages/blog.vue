<script setup lang="ts">
import { ref } from "vue";

useHead({
  title: 'Blog, Tips, & Edukasi Properti'
})

const articles = [
  {
    id: 1,
    title: "5 Tips Melejitkan Penjualan Properti Menggunakan CRM Kanban",
    excerpt: "Bagaimana memvisualisasikan prospek pembeli, mengatur tahapan closing, dan meningkatkan produktivitas penjualan properti Anda hingga 200%.",
    image: "https://images.unsplash.com/photo-1543269865-cbf427effbad?w=500&h=300&fit=crop",
    date: "20 Mei 2026",
    category: "CRM & Tips",
    readTime: "4 Menit Baca"
  },
  {
    id: 2,
    title: "Cara Mudah Menghitung Pajak PPh 21 Komisi Agen Properti",
    excerpt: "Panduan lengkap regulasi perpajakan komisi agen independen di Indonesia. Ketahui potongan bersih yang harus Anda terima.",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=500&h=300&fit=crop",
    date: "15 Mei 2026",
    category: "Keuangan",
    readTime: "6 Menit Baca"
  },
  {
    id: 3,
    title: "Tren Properti Jakarta Selatan 2026: Pembeli vs Penyewa",
    excerpt: "Analisis pasar properti terupdate di area Jaksel. Mana lokasi hot spot yang paling banyak diincar oleh investor tahun ini?",
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=500&h=300&fit=crop",
    date: "10 Mei 2026",
    category: "Tren Pasar",
    readTime: "5 Menit Baca"
  }
];

const searchQuery = ref("");
const selectedCategory = ref("Semua");

const filteredArticles = computed(() => {
  return articles.filter(art => {
    const matchesSearch = art.title.toLowerCase().includes(searchQuery.value.toLowerCase()) || 
                          art.excerpt.toLowerCase().includes(searchQuery.value.toLowerCase());
    const matchesCategory = selectedCategory.value === "Semua" || art.category === selectedCategory.value;
    return matchesSearch && matchesCategory;
  });
});
</script>

<template>
  <div class="blog-page">
    <!-- Hero Header -->
    <header class="blog-hero">
      <h1 class="blog-title">Kabar, Edukasi, & Tips Properti Terbaik</h1>
      <p class="blog-subtitle">
        Pelajari strategi pemasaran, manajemen keuangan agen, regulasi pajak, dan tren pasar real estate terupdate di Indonesia.
      </p>
    </header>

    <!-- Content Section -->
    <section class="blog-section">
      <!-- Toolbar Filter Bar -->
      <div class="blog-toolbar">
        <div class="toolbar-left">
          <button 
            v-for="cat in ['Semua', 'CRM & Tips', 'Keuangan', 'Tren Pasar']" 
            :key="cat"
            class="btn-category"
            :class="{ active: selectedCategory === cat }"
            @click="selectedCategory = cat"
          >
            {{ cat }}
          </button>
        </div>
        <div class="toolbar-right">
          <input 
            type="text" 
            v-model="searchQuery" 
            class="blog-search-input"
            placeholder="Cari judul artikel..."
          />
        </div>
      </div>

      <!-- Articles Grid -->
      <div class="articles-grid" v-if="filteredArticles.length > 0">
        <article class="article-card" v-for="art in filteredArticles" :key="art.id">
          <div class="card-image-wrap">
            <img :src="art.image" :alt="art.title" loading="lazy" />
            <span class="card-category">{{ art.category }}</span>
          </div>
          
          <div class="card-body-content">
            <div class="card-meta">
              <span class="meta-date">📅 {{ art.date }}</span>
              <span class="meta-time">⏱️ {{ art.readTime }}</span>
            </div>
            
            <h3 class="card-title">{{ art.title }}</h3>
            <p class="card-excerpt">{{ art.excerpt }}</p>
            
            <NuxtLink to="/kontak" class="btn-read-more">Baca Selengkapnya ➔</NuxtLink>
          </div>
        </article>
      </div>

      <!-- Empty State -->
      <div class="empty-blog" v-else>
        <span class="empty-icon">📂</span>
        <h3>Artikel Tidak Ditemukan</h3>
        <p>Maaf, kami tidak dapat menemukan artikel blog yang cocok dengan pencarian Anda.</p>
        <button class="btn-reset" @click="searchQuery = ''; selectedCategory = 'Semua'">Reset Pencarian</button>
      </div>
    </section>
  </div>
</template>

<style scoped>
.blog-page {
  background: var(--bg-default);
  color: var(--text-dark);
  font-family: 'Inter', sans-serif;
  min-height: 100vh;
}

.blog-hero {
  text-align: center;
  padding: 80px 24px 60px;
  background: linear-gradient(135deg, #0b1c30 0%, #0052cc 100%);
  color: white;
  clip-path: polygon(0 0, 100% 0, 100% 90%, 0 97%);
}

.blog-title {
  font-family: 'Outfit', sans-serif;
  font-size: 36px;
  font-weight: 800;
  margin-bottom: 16px;
  max-width: 780px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.2;
}

.blog-subtitle {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.9);
  max-width: 680px;
  margin: 0 auto;
  line-height: 1.6;
}

/* Section content */
.blog-section {
  max-width: 1040px;
  margin: 0 auto 100px;
  padding: 40px 24px;
}

.blog-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  margin-bottom: 40px;
  border-bottom: 2px solid #e2e8f0;
  padding-bottom: 16px;
}

.toolbar-left {
  display: flex;
  gap: 10px;
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

.blog-search-input {
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

.blog-search-input:focus {
  border-color: #0052cc;
}

/* Articles grid */
.articles-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
}

.article-card {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0,0,0,0.01);
  display: flex;
  flex-direction: column;
  transition: all 0.2s ease;
}

.article-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 24px rgba(0,0,0,0.04);
  border-color: #cbd5e1;
}

.card-image-wrap {
  position: relative;
  aspect-ratio: 16 / 10;
  overflow: hidden;
}

.card-image-wrap img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.card-category {
  position: absolute;
  top: 12px;
  left: 12px;
  background: rgba(11, 28, 48, 0.85);
  color: white;
  font-size: 10px;
  font-weight: 700;
  padding: 4px 8px;
  border-radius: 4px;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.card-body-content {
  padding: 20px;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.card-meta {
  display: flex;
  gap: 12px;
  font-size: 11px;
  color: #64748b;
  margin-bottom: 12px;
  font-weight: 500;
}

.card-title {
  font-family: 'Outfit', sans-serif;
  font-size: 15px;
  font-weight: 750;
  color: #0f172a;
  margin: 0 0 10px 0;
  line-height: 1.4;
  height: 42px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-excerpt {
  font-size: 13px;
  color: #475569;
  line-height: 1.5;
  margin: 0 0 20px 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  height: 58px;
}

.btn-read-more {
  font-size: 13px;
  font-weight: 700;
  color: #0052cc;
  text-decoration: none;
  margin-top: auto;
  align-self: flex-start;
}

.btn-read-more:hover {
  text-decoration: underline;
}

/* Empty State */
.empty-blog {
  text-align: center;
  padding: 64px 24px;
  background: white;
  border-radius: 12px;
  border: 2px dashed #cbd5e1;
  max-width: 500px;
  margin: 0 auto;
}

.empty-icon {
  font-size: 32px;
  display: block;
  margin-bottom: 12px;
}

.empty-blog h3 {
  font-family: 'Outfit', sans-serif;
  font-size: 18px;
  color: #0f172a;
  margin: 0 0 8px 0;
}

.empty-blog p {
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

@media (max-width: 768px) {
  .blog-toolbar {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }
  
  .blog-search-input {
    width: 100%;
  }
  
  .articles-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .blog-hero {
    padding: 60px 16px 40px;
  }
  
  .blog-title {
    font-size: 28px;
  }
}
</style>
