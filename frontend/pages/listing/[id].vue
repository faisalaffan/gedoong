<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { formatRupiah } from "~/utils/format";
import { cacheSWR } from "~/utils/cache";

definePageMeta({ layout: false });

const route = useRoute();
const router = useRouter();
const config = useRuntimeConfig();

const id = route.params.id;
const listing = ref<any>(null);
const isLoading = ref(true);
const isFromCache = ref(false);

const DETAIL_TTL = 30 * 60 * 1000; // 30 minutes

async function fetchListingDetail() {
  isLoading.value = true;

  const cacheKey = `listing:detail:${id}`;
  const result = await cacheSWR<any>(cacheKey, async () => {
    const supabase = useSupabaseClient();
    const { data, error } = await supabase
      .from("listings")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data;
  }, DETAIL_TTL);

  if (result.data) {
    listing.value = result.data;
    isFromCache.value = result.fromCache;
    useHead({
      title: result.data.properti || "Detail Properti",
    });
  }

  isLoading.value = false;
}

// WhatsApp chat deep link prefill message
const waLink = computed(() => {
  if (!listing.value) return "#";
  const phone = config.public.supportPhone.replace(/[^0-9]/g, "");
  const message = encodeURIComponent(
    `Halo, saya tertarik dengan properti "${listing.value.properti}" (ID: ${listing.value.id}) yang saya temukan di Gedoong.\n\nBisa berikan info detail lebih lanjut? Terima kasih.`
  );
  return `https://wa.me/62${phone.substring(1)}?text=${message}`;
});

onMounted(() => {
  fetchListingDetail();
});
</script>

<template>
  <div class="listing-detail-page">
    <div class="detail-container">
      
      <!-- Loading Skeleton -->
      <div v-if="isLoading" class="detail-layout">
        <div class="nav-breadcrumb">
          <div class="skeleton-line skeleton-btn"></div>
        </div>
        <div class="main-split-grid">
          <div class="content-side">
            <div class="skeleton-box skeleton-hero"></div>
            <div class="skeleton-card-block">
              <div class="skeleton-line skeleton-title-lg"></div>
              <div class="skeleton-line skeleton-subtitle"></div>
            </div>
            <div class="property-specs-grid">
              <div v-for="n in 4" :key="n" class="skeleton-box skeleton-spec"></div>
            </div>
            <div class="skeleton-card-block">
              <div class="skeleton-line skeleton-heading-sm"></div>
              <div class="skeleton-line skeleton-text"></div>
              <div class="skeleton-line skeleton-text"></div>
              <div class="skeleton-line skeleton-text skeleton-text-short"></div>
            </div>
          </div>
          <div class="sidebar-side">
            <div class="skeleton-box skeleton-sidebar-card">
              <div class="skeleton-line skeleton-label"></div>
              <div class="skeleton-line skeleton-price-lg"></div>
              <div class="skeleton-line skeleton-pill"></div>
            </div>
            <div class="skeleton-box skeleton-sidebar-card">
              <div class="skeleton-line skeleton-heading-sm"></div>
              <div class="skeleton-agent-row">
                <div class="skeleton-box skeleton-avatar"></div>
                <div>
                  <div class="skeleton-line skeleton-text"></div>
                  <div class="skeleton-line skeleton-subtitle"></div>
                </div>
              </div>
              <div class="skeleton-box skeleton-btn-block"></div>
              <div class="skeleton-box skeleton-btn-block"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Error / Not Found State -->
      <div v-else-if="!listing" class="error-wrap">
        <span class="error-icon">⚠️</span>
        <h3>Properti Tidak Ditemukan</h3>
        <p>Maaf, properti yang Anda cari tidak aktif, sudah terjual, atau tidak terdaftar di portal Gedoong.</p>
        <button class="btn-back-home" @click="router.push('/')">Kembali ke Beranda</button>
      </div>

      <!-- Real Detail Layout -->
      <div v-else class="detail-layout">
        <!-- Back navigation & Breadcrumb row -->
        <div class="nav-breadcrumb">
          <button class="btn-nav-back" @click="router.push('/')">
            ← Kembali ke Cari Properti
          </button>
        </div>

        <div class="main-split-grid">
          <!-- Left side content: Gallery, specs, desc -->
          <div class="content-side">
            <!-- Property Hero Image -->
            <div class="gallery-hero-wrapper">
              <img
                :src="listing.image_url || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=900&fit=crop'"
                :alt="listing.properti"
                class="gallery-hero-img"
              />
              <span class="badge-type-float" :class="listing.tipe === 'Jual' ? 'jual' : 'sewa'">
                Di{{ listing.tipe }}
              </span>
            </div>

            <!-- Header Information -->
            <div class="property-header-card">
              <h1 class="property-detail-title">{{ listing.properti }}</h1>
              <p class="property-detail-location">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0052cc" stroke-width="2"><path d="M20 10c0 6-8 13-8 13s-8-7-8-13a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                {{ listing.lokasi || "Jakarta, Indonesia" }}
              </p>
            </div>

            <!-- Specs Bar -->
            <div class="property-specs-grid">
              <div class="spec-badge-box">
                <span class="spec-icon">🛌</span>
                <div class="spec-meta">
                  <span class="spec-label">Kamar Tidur</span>
                  <span class="spec-val">{{ listing.kamar_tidur || 0 }} KT</span>
                </div>
              </div>
              <div class="spec-badge-box">
                <span class="spec-icon">🚿</span>
                <div class="spec-meta">
                  <span class="spec-label">Kamar Mandi</span>
                  <span class="spec-val">{{ listing.kamar_mandi || 0 }} KM</span>
                </div>
              </div>
              <div class="spec-badge-box">
                <span class="spec-icon">📐</span>
                <div class="spec-meta">
                  <span class="spec-label">Luas Bangunan</span>
                  <span class="spec-val">{{ listing.luas || 0 }} m²</span>
                </div>
              </div>
              <div class="spec-badge-box">
                <span class="spec-icon">🛡️</span>
                <div class="spec-meta">
                  <span class="spec-label">Sertifikasi</span>
                  <span class="spec-val">SHM Terverifikasi</span>
                </div>
              </div>
            </div>

            <!-- Description Box -->
            <div class="property-desc-section">
              <h3 class="section-sub-title">Deskripsi Properti</h3>
              <p class="desc-text-content">
                {{ listing.deskripsi || "Rumah hunian asri dengan ventilasi prima, berlokasi di area sangat strategis dan aman. Dekat dengan sarana transportasi umum, sekolah berkualitas, pusat belanja, dan pusat rekreasi. Sangat cocok untuk tempat tinggal keluarga bahagia atau aset investasi jangka panjang." }}
              </p>
            </div>
          </div>

          <!-- Right side content: Sticky Pricing & Agent contacts -->
          <div class="sidebar-side">
            <div class="sticky-card">
              <!-- Pricing card -->
              <div class="pricing-card-sidebar">
                <span class="price-header">HARGA DITAWARKAN</span>
                <h2 class="price-amount-sidebar">
                  {{ formatRupiah(listing.harga) }}
                  <span class="price-period-label" v-if="listing.tipe === 'Sewa'">/ tahun</span>
                </h2>
                <div class="negotiable-pill">Harga Negotiable</div>
              </div>

              <!-- Agent Contact Card -->
              <div class="agent-contact-sidebar">
                <h4 class="agent-card-title">Hubungi Agen Pemasar</h4>
                <div class="agent-profile-row">
                  <div class="agent-avatar-sidebar">GP</div>
                  <div class="agent-info-sidebar">
                    <span class="agent-name-sidebar">Gedoong Partner Agent</span>
                    <span class="agent-license-sidebar">Licensed Properti Agent</span>
                  </div>
                </div>

                <div class="agent-contacts-list">
                  <a :href="waLink" target="_blank" class="btn-sidebar-contact btn-wa-sidebar">
                    💬 Hubungi via WhatsApp
                  </a>
                  <a :href="`tel:${config.public.supportPhone}`" class="btn-sidebar-contact btn-tel-sidebar">
                    📞 Telepon Agen: {{ config.public.supportPhone }}
                  </a>
                </div>
                
                <div class="agent-safety-tip">
                  🛡️ Transaksi aman bersama agen resmi berlisensi Gedoong.
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<style scoped>
.listing-detail-page {
  background: var(--bg-default);
  color: var(--text-dark);
  font-family: 'Inter', sans-serif;
  min-height: 100vh;
}

.detail-container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 40px 24px 80px;
}

/* Skeleton Shimmer */
.skeleton-box {
  background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
  background-size: 200% 100%;
  animation: shimmer 1.6s infinite;
  border-radius: 12px;
}

.skeleton-card-block {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 28px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.skeleton-line {
  height: 16px;
  background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
  background-size: 200% 100%;
  animation: shimmer 1.6s infinite;
  border-radius: 6px;
}

.skeleton-btn { width: 140px; height: 14px; }
.skeleton-hero { aspect-ratio: 16 / 9; width: 100%; }
.skeleton-title-lg { width: 60%; height: 28px; }
.skeleton-subtitle { width: 35%; height: 14px; }
.skeleton-heading-sm { width: 40%; height: 18px; }
.skeleton-text { width: 100%; height: 14px; }
.skeleton-text-short { width: 60%; }
.skeleton-label { width: 30%; height: 10px; }
.skeleton-price-lg { width: 70%; height: 32px; }
.skeleton-pill { width: 80px; height: 22px; border-radius: 6px; }
.skeleton-spec { height: 72px; }
.skeleton-sidebar-card {
  min-height: 160px;
  padding: 28px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  background: white;
  border: 1px solid #e2e8f0;
}
.skeleton-avatar { width: 44px; height: 44px; border-radius: 50%; }
.skeleton-agent-row { display: flex; align-items: center; gap: 12px; }
.skeleton-btn-block { height: 44px; border-radius: 8px; }

@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

/* Error State */
.error-wrap {
  text-align: center;
  padding: 100px 24px;
  background: white;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 4px 20px rgba(0,0,0,0.01);
  max-width: 600px;
  margin: 60px auto;
}

.error-icon {
  font-size: 40px;
  margin-bottom: 16px;
  display: block;
}

.error-wrap h3 {
  font-family: 'Outfit', sans-serif;
  font-size: 22px;
  color: #0f172a;
  margin: 0 0 12px 0;
}

.error-wrap p {
  font-size: 14.5px;
  color: #64748b;
  line-height: 1.6;
  margin: 0 0 24px 0;
}

.btn-back-home {
  padding: 12px 28px;
  background: #0052cc;
  border: none;
  color: white;
  border-radius: 8px;
  font-weight: 700;
  cursor: pointer;
}

/* Real Layout Details */
.detail-layout {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.nav-breadcrumb {
  display: flex;
  align-items: center;
}

.btn-nav-back {
  background: none;
  border: none;
  font-size: 13.5px;
  font-weight: 700;
  color: #0052cc;
  cursor: pointer;
  padding: 0;
}

.btn-nav-back:hover {
  text-decoration: underline;
}

.main-split-grid {
  display: grid;
  grid-template-columns: 2.2fr 1fr;
  gap: 40px;
  align-items: start;
}

/* Content Side (Left) */
.content-side {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.gallery-hero-wrapper {
  position: relative;
  aspect-ratio: 16 / 9;
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid #e2e8f0;
  box-shadow: 0 8px 30px rgba(0,0,0,0.02);
}

.gallery-hero-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.badge-type-float {
  position: absolute;
  top: 20px;
  left: 20px;
  padding: 8px 18px;
  border-radius: 6px;
  font-family: 'Outfit', sans-serif;
  font-size: 12px;
  font-weight: 800;
  color: white;
  box-shadow: 0 8px 16px rgba(0,0,0,0.15);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.badge-type-float.jual { background: #0052cc; }
.badge-type-float.sewa { background: #14b8a6; }

.property-header-card {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 28px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.01);
}

.property-detail-title {
  font-family: 'Outfit', sans-serif;
  font-size: 28px;
  font-weight: 800;
  color: #0f172a;
  margin: 0 0 10px 0;
  line-height: 1.25;
}

.property-detail-location {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14.5px;
  color: #475569;
  font-weight: 500;
}

/* Specs Bar */
.property-specs-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.spec-badge-box {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 18px;
  display: flex;
  align-items: center;
  gap: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.01);
}

.spec-icon {
  font-size: 24px;
}

.spec-meta {
  display: flex;
  flex-direction: column;
}

.spec-label {
  font-size: 10px;
  font-weight: 700;
  color: #64748b;
  text-transform: uppercase;
}

.spec-val {
  font-family: 'Outfit', sans-serif;
  font-size: 13.5px;
  font-weight: 800;
  color: #0f172a;
  margin-top: 1px;
}

/* Description Section */
.property-desc-section {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.01);
}

.section-sub-title {
  font-family: 'Outfit', sans-serif;
  font-size: 18px;
  font-weight: 850;
  color: #0f172a;
  margin: 0 0 16px 0;
  border-bottom: 2px solid #f1f5f9;
  padding-bottom: 8px;
}

.desc-text-content {
  font-size: 14.5px;
  color: #334155;
  line-height: 1.7;
  white-space: pre-line;
  margin: 0;
}

/* Sidebar Side (Right) */
.sidebar-side {
  display: flex;
  flex-direction: column;
}

.sticky-card {
  position: sticky;
  top: 100px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.pricing-card-sidebar {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 28px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.02);
  display: flex;
  flex-direction: column;
}

.price-header {
  font-size: 10px;
  font-weight: 800;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 6px;
}

.price-amount-sidebar {
  font-family: 'Outfit', sans-serif;
  font-size: 28px;
  font-weight: 800;
  color: #0052cc;
  margin: 0 0 12px 0;
  line-height: 1.15;
}

.price-period-label {
  font-size: 16px;
  color: #475569;
  font-weight: 600;
}

.negotiable-pill {
  font-size: 11px;
  font-weight: 700;
  color: #10b981;
  background: #ecfdf5;
  border: 1px solid rgba(16, 185, 129, 0.1);
  padding: 3px 8px;
  border-radius: 6px;
  align-self: flex-start;
}

/* Agent Card */
.agent-contact-sidebar {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 28px;
  box-shadow: 0 10px 35px rgba(0,0,0,0.02);
  display: flex;
  flex-direction: column;
}

.agent-card-title {
  font-family: 'Outfit', sans-serif;
  font-size: 15px;
  font-weight: 750;
  color: #0f172a;
  margin: 0 0 20px 0;
  border-bottom: 1px solid #f1f5f9;
  padding-bottom: 10px;
}

.agent-profile-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
}

.agent-avatar-sidebar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: #eff6ff;
  color: #0052cc;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
}

.agent-info-sidebar {
  display: flex;
  flex-direction: column;
}

.agent-name-sidebar {
  font-weight: 750;
  color: #0f172a;
  font-size: 14px;
}

.agent-license-sidebar {
  font-size: 11.5px;
  color: #64748b;
  margin-top: 1px;
}

.agent-contacts-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.btn-sidebar-contact {
  display: block;
  text-align: center;
  padding: 12px 20px;
  border-radius: 8px;
  font-size: 13.5px;
  font-weight: 700;
  text-decoration: none;
  transition: all 0.15s ease;
}

.btn-wa-sidebar {
  background: #25d366;
  color: white;
  box-shadow: 0 4px 12px rgba(37,211,102,0.25);
}

.btn-wa-sidebar:hover {
  background: #128c7e;
  box-shadow: 0 6px 18px rgba(37,211,102,0.35);
  transform: translateY(-0.5px);
}

.btn-tel-sidebar {
  background: #f1f5f9;
  color: #334155;
  border: 1px solid #cbd5e1;
}

.btn-tel-sidebar:hover {
  background: #e2e8f0;
  color: #0f172a;
}

.agent-safety-tip {
  margin-top: 20px;
  font-size: 11px;
  color: #64748b;
  text-align: center;
  border-top: 1px dashed #e2e8f0;
  padding-top: 16px;
}

@media (max-width: 1024px) {
  .main-split-grid {
    grid-template-columns: 1.8fr 1fr;
    gap: 24px;
  }
}

@media (max-width: 768px) {
  .main-split-grid {
    grid-template-columns: 1fr;
    gap: 32px;
  }
  
  .sticky-card {
    position: static;
  }
  
  .property-specs-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .property-detail-title {
    font-size: 22px;
  }
}
</style>
