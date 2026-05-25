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

// Image Gallery Slider State
const activeImageIndex = ref(0);

// Lightbox modal state
const isLightboxOpen = ref(false);
const lightboxUrl = ref("");

function openLightbox(url: string) {
  lightboxUrl.value = url;
  isLightboxOpen.value = true;
}

function closeLightbox() {
  isLightboxOpen.value = false;
  lightboxUrl.value = "";
}

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

// Formatting combined address nicely
const fullAddress = computed(() => {
  if (!listing.value) return "";
  const parts = [];
  if (listing.value.alamat_lengkap) parts.push(listing.value.alamat_lengkap);
  if (listing.value.kelurahan) parts.push(`Kel. ${listing.value.kelurahan}`);
  if (listing.value.kecamatan) parts.push(`Kec. ${listing.value.kecamatan}`);
  if (listing.value.kota) parts.push(listing.value.kota);
  if (listing.value.provinsi) parts.push(listing.value.provinsi);

  if (parts.length > 0) {
    return parts.join(", ");
  }
  return listing.value.lokasi || "Jakarta, Indonesia";
});

// Navigation Map coordinates URLs
const mapLink = computed(() => {
  if (!listing.value || !listing.value.latitude || !listing.value.longitude) return null;
  return `https://www.google.com/maps/search/?api=1&query=${listing.value.latitude},${listing.value.longitude}`;
});

const wazeLink = computed(() => {
  if (!listing.value || !listing.value.latitude || !listing.value.longitude) return null;
  return `https://waze.com/ul?ll=${listing.value.latitude},${listing.value.longitude}&navigate=yes`;
});

// YouTube video iframe utility
const youtubeEmbedUrl = computed(() => {
  if (!listing.value || !listing.value.video_url) return null;
  const url = listing.value.video_url;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  if (match && match[2].length === 11) {
    return `https://www.youtube.com/embed/${match[2]}`;
  }
  return null;
});

// WhatsApp chat deep link prefill message - Highly polished!
const waLink = computed(() => {
  if (!listing.value) return "#";
  const phone = config.public.supportPhone.replace(/[^0-9]/g, "");
  
  const propName = listing.value.properti;
  const propId = listing.value.id;
  const priceFormatted = formatRupiah(listing.value.harga);
  const transType = listing.value.tipe === "Jual" ? "Dijual" : "Disewakan";
  const loc = listing.value.kota || listing.value.lokasi || "Jakarta";
  
  const message = encodeURIComponent(
    `Halo Gedoong, saya sangat tertarik dengan properti berikut:\n\n` +
    `🏠 *${propName}*\n` +
    `📌 *ID:* ${propId}\n` +
    `🏷️ *Status:* ${transType}\n` +
    `💰 *Harga:* ${priceFormatted}${listing.value.tipe === 'Sewa' ? ' / ' + (listing.value.periode_sewa || 'tahun').toLowerCase() : ''}\n` +
    `📍 *Lokasi:* ${loc}\n` +
    `📄 *Sertifikat:* ${listing.value.sertifikat || 'SHM'}\n\n` +
    `Bisa dibantu berikan informasi lebih lengkap atau jadwal survey lokasi? Terima kasih!`
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
            <!-- Property Photo Gallery & Carousel Slider -->
            <div class="gallery-hero-wrapper">
              <div class="gallery-main-display" @click="openLightbox(listing.image_urls && listing.image_urls.length > 0 ? listing.image_urls[activeImageIndex] : (listing.image_url || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=900&fit=crop'))">
                <img
                  :src="listing.image_urls && listing.image_urls.length > 0 ? listing.image_urls[activeImageIndex] : (listing.image_url || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=900&fit=crop')"
                  :alt="listing.properti"
                  class="gallery-hero-img"
                />
                <div class="gallery-zoom-overlay">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>
                  <span>Klik untuk Perbesar</span>
                </div>
                <span class="badge-type-float" :class="listing.tipe === 'Jual' ? 'jual' : 'sewa'">
                  Di{{ listing.tipe }}
                </span>
                <span class="badge-status-float" v-if="listing.status && listing.status !== 'Aktif'">
                  {{ listing.status }}
                </span>
                <div class="gallery-counter-badge" v-if="listing.image_urls && listing.image_urls.length > 0">
                  📷 {{ activeImageIndex + 1 }} / {{ listing.image_urls.length }}
                </div>
              </div>
              
              <!-- Thumbnails Row -->
              <div class="gallery-thumbnails-row" v-if="listing.image_urls && listing.image_urls.length > 1">
                <div 
                  v-for="(img, idx) in listing.image_urls" 
                  :key="idx" 
                  class="thumb-card"
                  :class="{ active: idx === activeImageIndex }"
                  @click="activeImageIndex = idx"
                >
                  <img :src="img" :alt="listing.properti + ' - Thumbnail ' + (idx + 1)" class="thumb-img-el" />
                </div>
              </div>
            </div>

            <!-- Header Information Card -->
            <div class="property-header-card">
              <h1 class="property-detail-title">{{ listing.properti }}</h1>
              <p class="property-detail-location">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0052cc" stroke-width="2.5"><path d="M20 10c0 6-8 13-8 13s-8-7-8-13a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                {{ fullAddress }}
              </p>
              
              <!-- Tags List -->
              <div class="chips-list-container" v-if="listing.tags && listing.tags.length > 0">
                <span v-for="tag in listing.tags" :key="tag" class="tag-chip">
                  #{{ tag }}
                </span>
              </div>
            </div>

            <!-- Core Specs Quick Grid -->
            <div class="property-specs-grid">
              <div class="spec-badge-box" v-if="listing.kamar_tidur !== null">
                <span class="spec-icon">🛌</span>
                <div class="spec-meta">
                  <span class="spec-label">Kamar Tidur</span>
                  <span class="spec-val">{{ listing.kamar_tidur }} KT</span>
                </div>
              </div>
              <div class="spec-badge-box" v-if="listing.kamar_mandi !== null">
                <span class="spec-icon">🚿</span>
                <div class="spec-meta">
                  <span class="spec-label">Kamar Mandi</span>
                  <span class="spec-val">{{ listing.kamar_mandi }} KM</span>
                </div>
              </div>
              <div class="spec-badge-box" v-if="listing.luas !== null">
                <span class="spec-icon">📐</span>
                <div class="spec-meta">
                  <span class="spec-label">Luas Bangunan</span>
                  <span class="spec-val">{{ listing.luas }} m²</span>
                </div>
              </div>
              <div class="spec-badge-box" v-if="listing.luas_tanah !== null">
                <span class="spec-icon">🗺️</span>
                <div class="spec-meta">
                  <span class="spec-label">Luas Tanah</span>
                  <span class="spec-val">{{ listing.luas_tanah }} m²</span>
                </div>
              </div>
              <div class="spec-badge-box">
                <span class="spec-icon">🛡️</span>
                <div class="spec-meta">
                  <span class="spec-label">Sertifikasi</span>
                  <span class="spec-val">{{ listing.sertifikat || "SHM" }}</span>
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

            <!-- Building Details & Physical Specs Card (New!) -->
            <div class="property-details-section">
              <h3 class="section-sub-title">Spesifikasi Detail Properti</h3>
              <div class="details-spec-grid">
                <div class="detail-row" v-if="listing.tipe_properti">
                  <span class="detail-label">Tipe Properti</span>
                  <span class="detail-val">{{ listing.tipe_properti }}</span>
                </div>
                <div class="detail-row" v-if="listing.kondisi">
                  <span class="detail-label">Kondisi Bangunan</span>
                  <span class="detail-val">{{ listing.kondisi }}</span>
                </div>
                <div class="detail-row" v-if="listing.lantai">
                  <span class="detail-label">Jumlah Lantai</span>
                  <span class="detail-val">{{ listing.lantai }} Lantai</span>
                </div>
                <div class="detail-row" v-if="listing.lantai_ke && listing.tipe_properti === 'Apartemen'">
                  <span class="detail-label">Lantai Ke (Level)</span>
                  <span class="detail-val">Lantai {{ listing.lantai_ke }}</span>
                </div>
                <div class="detail-row" v-if="listing.hadap">
                  <span class="detail-label">Arah Hadap</span>
                  <span class="detail-val">Hadap {{ listing.hadap }}</span>
                </div>
                <div class="detail-row" v-if="listing.daya_listrik">
                  <span class="detail-label">Daya Listrik</span>
                  <span class="detail-val">{{ listing.daya_listrik }}</span>
                </div>
                <div class="detail-row" v-if="listing.sumber_air">
                  <span class="detail-label">Sumber Air</span>
                  <span class="detail-val">{{ listing.sumber_air }}</span>
                </div>
                <div class="detail-row" v-if="listing.garasi_carport !== null">
                  <span class="detail-label">Kapasitas Garasi</span>
                  <span class="detail-val">{{ listing.garasi_carport }} Mobil</span>
                </div>
                <div class="detail-row" v-if="listing.akses_jalan">
                  <span class="detail-label">Akses Jalan</span>
                  <span class="detail-val">{{ listing.akses_jalan }}</span>
                </div>
              </div>
            </div>

            <!-- Amenities & Facilities Section (New!) -->
            <div class="property-features-section">
              <h3 class="section-sub-title">Fasilitas & Fitur Unggulan</h3>
              
              <!-- Checklist Badges Grid -->
              <div class="features-checklist-grid">
                <div class="feature-checklist-item" :class="{ active: listing.water_heater }">
                  <span class="check-icon">{{ listing.water_heater ? "✓" : "✗" }}</span>
                  <span class="feature-txt">Water Heater</span>
                </div>
                <div class="feature-checklist-item" :class="{ active: listing.internet_wifi }">
                  <span class="check-icon">{{ listing.internet_wifi ? "✓" : "✗" }}</span>
                  <span class="feature-txt">WiFi / Internet</span>
                </div>
                <div class="feature-checklist-item" :class="{ active: listing.kolam_renang }">
                  <span class="check-icon">{{ listing.kolam_renang ? "✓" : "✗" }}</span>
                  <span class="feature-txt">Kolam Renang</span>
                </div>
                <div class="feature-checklist-item" :class="{ active: listing.area_bermain }">
                  <span class="check-icon">{{ listing.area_bermain ? "✓" : "✗" }}</span>
                  <span class="feature-txt">Playground Anak</span>
                </div>
                <div class="feature-checklist-item" :class="{ active: listing.masjid_mushola }">
                  <span class="check-icon">{{ listing.masjid_mushola ? "✓" : "✗" }}</span>
                  <span class="feature-txt">Masjid / Mushola</span>
                </div>
                <div class="feature-checklist-item" :class="{ active: listing.keamanan_24j }">
                  <span class="check-icon">{{ listing.keamanan_24j ? "✓" : "✗" }}</span>
                  <span class="feature-txt">Keamanan 24 Jam</span>
                </div>
              </div>

              <!-- Supplementary Amenities Grid -->
              <div class="features-meta-grid" v-if="listing.furnished_status || listing.ac || listing.dapur || listing.keamanan_dalam || listing.nama_kompleks">
                <div class="detail-row" v-if="listing.furnished_status">
                  <span class="detail-label">Status Furnished</span>
                  <span class="detail-val">{{ listing.furnished_status }}</span>
                </div>
                <div class="detail-row" v-if="listing.ac">
                  <span class="detail-label">Jumlah AC</span>
                  <span class="detail-val">{{ listing.ac }} Unit</span>
                </div>
                <div class="detail-row" v-if="listing.dapur">
                  <span class="detail-label">Dapur</span>
                  <span class="detail-val">{{ listing.dapur }}</span>
                </div>
                <div class="detail-row" v-if="listing.keamanan_dalam && listing.keamanan_dalam.length > 0">
                  <span class="detail-label">Keamanan Unit</span>
                  <span class="detail-val">{{ listing.keamanan_dalam.join(', ') }}</span>
                </div>
                <div class="detail-row" v-if="listing.nama_kompleks">
                  <span class="detail-label">Kompleks / Cluster</span>
                  <span class="detail-val">{{ listing.nama_kompleks }}</span>
                </div>
              </div>
            </div>

            <!-- Floor Plan Section (New!) -->
            <div class="property-floorplan-section" v-if="listing.floor_plan_url">
              <h3 class="section-sub-title">📐 Denah Lantai (Floor Plan)</h3>
              <div class="floorplan-image-box" @click="openLightbox(listing.floor_plan_url)">
                <img :src="listing.floor_plan_url" alt="Denah Lantai Properti" class="floorplan-image-el" />
                <div class="floorplan-overlay">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>
                  <span>Klik untuk Perbesar Denah</span>
                </div>
              </div>
            </div>

            <!-- Video & Virtual Tour Sections (New!) -->
            <div class="property-media-section" v-if="youtubeEmbedUrl || listing.virtual_tour_url">
              <h3 class="section-sub-title">🎥 Video & Virtual Tour 360°</h3>
              
              <!-- Matterport Virtual Tour CTA -->
              <div class="virtual-tour-cta-card" v-if="listing.virtual_tour_url">
                <div class="vt-content">
                  <div class="vt-badge">VR 360°</div>
                  <h4>Virtual Tour Matterport</h4>
                  <p>Jelajahi setiap sudut ruangan properti secara real-time dan interaktif langsung dari gadget Anda.</p>
                </div>
                <a :href="listing.virtual_tour_url" target="_blank" class="btn-virtual-tour">
                  🌐 Buka 360° Virtual Tour
                </a>
              </div>

              <!-- YouTube Embed -->
              <div class="video-embed-box" v-if="youtubeEmbedUrl">
                <iframe
                  class="video-iframe"
                  :src="youtubeEmbedUrl"
                  title="YouTube video player"
                  frameborder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowfullscreen
                ></iframe>
              </div>
            </div>

            <!-- Directions & Interactive GPS Cards (New!) -->
            <div class="property-location-section" v-if="listing.latitude && listing.longitude">
              <h3 class="section-sub-title">📍 Lokasi & Navigasi GPS</h3>
              <p class="map-desc">Koordinat koordinasi: {{ listing.latitude.toFixed(6) }}, {{ listing.longitude.toFixed(6) }}. Gunakan aplikasi navigasi favorit Anda untuk menuju lokasi properti secara instan.</p>
              
              <div class="directions-buttons-grid">
                <a :href="mapLink" target="_blank" class="direction-btn btn-gmaps" v-if="mapLink">
                  🗺️ Navigasi Google Maps
                </a>
                <a :href="wazeLink" target="_blank" class="direction-btn btn-waze" v-if="wazeLink">
                  🚗 Navigasi Waze App
                </a>
              </div>
            </div>

          </div>

          <!-- Right side content: Sticky Pricing & Agent contacts -->
          <div class="sidebar-side">
            <div class="sticky-card">
              <!-- Pricing Card -->
              <div class="pricing-card-sidebar">
                <span class="price-header">HARGA DITAWARKAN</span>
                <h2 class="price-amount-sidebar">
                  {{ formatRupiah(listing.harga) }}
                  <span class="price-period-label" v-if="listing.tipe === 'Sewa'">/{{ (listing.periode_sewa || "Tahun").toLowerCase() }}</span>
                </h2>
                
                <div class="pricing-pills-row">
                  <span class="negotiable-pill" v-if="listing.harga_negotiable">Harga Nego</span>
                  <span class="badge-status-sidebar" v-if="listing.tipe">{{ listing.tipe === 'Jual' ? 'Status: Dijual' : 'Status: Disewakan' }}</span>
                </div>

                <!-- Financial details inside price box -->
                <div class="pricing-financial-details" v-if="listing.biaya_ipl !== null || listing.pajak_ditanggung">
                  <div class="fin-row" v-if="listing.biaya_ipl !== null">
                    <span class="fin-label">Biaya IPL / Service</span>
                    <span class="fin-val">{{ formatRupiah(listing.biaya_ipl) }}</span>
                  </div>
                  <div class="fin-row" v-if="listing.pajak_ditanggung">
                    <span class="fin-label">Pajak Ditanggung</span>
                    <span class="fin-val">{{ listing.pajak_ditanggung }}</span>
                  </div>
                </div>
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

              <!-- Administrative Card Details (New!) -->
              <div class="agent-contact-sidebar admin-details-sidebar" v-if="listing.tersedia_untuk || listing.min_masa_sewa || listing.tanggal_tersedia">
                <h4 class="agent-card-title">Ketersediaan & Aturan</h4>
                <div class="pricing-financial-details border-none p-0 m-0">
                  <div class="fin-row" v-if="listing.tersedia_untuk">
                    <span class="fin-label">Tersedia Untuk</span>
                    <span class="fin-val">{{ listing.tersedia_untuk }}</span>
                  </div>
                  <div class="fin-row" v-if="listing.min_masa_sewa && listing.tipe === 'Sewa'">
                    <span class="fin-label">Minimal Masa Sewa</span>
                    <span class="fin-val">{{ listing.min_masa_sewa }} Bulan</span>
                  </div>
                  <div class="fin-row" v-if="listing.tanggal_tersedia">
                    <span class="fin-label">Tanggal Tersedia</span>
                    <span class="fin-val">{{ listing.tanggal_tersedia }}</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>

    <!-- Lightbox Zoom Overlay (New!) -->
    <div class="lightbox-overlay" v-if="isLightboxOpen" @click.self="closeLightbox">
      <button class="btn-lightbox-close" @click="closeLightbox">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
      </button>
      <div class="lightbox-content">
        <img :src="lightboxUrl" class="lightbox-img-el" />
      </div>
    </div>

  </div>
</template>

<style scoped>
.listing-detail-page {
  background: var(--bg-default, #f8fafc);
  color: var(--text-dark, #0f172a);
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

/* Interactive Photo Gallery */
.gallery-hero-wrapper {
  display: flex;
  flex-direction: column;
  gap: 16px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  padding: 12px;
  box-shadow: 0 8px 30px rgba(0,0,0,0.02);
}

.gallery-main-display {
  position: relative;
  aspect-ratio: 16 / 9;
  border-radius: 14px;
  overflow: hidden;
  cursor: pointer;
  background: #f1f5f9;
}

.gallery-hero-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.gallery-main-display:hover .gallery-hero-img {
  transform: scale(1.02);
}

.gallery-zoom-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: white;
  font-size: 13px;
  font-weight: 600;
  opacity: 0;
  transition: opacity 0.25s ease;
}

.gallery-main-display:hover .gallery-zoom-overlay {
  opacity: 1;
}

.badge-type-float {
  position: absolute;
  top: 16px;
  left: 16px;
  padding: 6px 14px;
  border-radius: 6px;
  font-family: 'Outfit', sans-serif;
  font-size: 11px;
  font-weight: 800;
  color: white;
  box-shadow: 0 4px 10px rgba(0,0,0,0.15);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.badge-type-float.jual { background: #0052cc; }
.badge-type-float.sewa { background: #14b8a6; }

.badge-status-float {
  position: absolute;
  top: 16px;
  right: 16px;
  background: #f59e0b;
  color: white;
  padding: 6px 14px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 800;
  box-shadow: 0 4px 10px rgba(0,0,0,0.15);
  text-transform: uppercase;
}

.gallery-counter-badge {
  position: absolute;
  bottom: 16px;
  right: 16px;
  background: rgba(15, 23, 42, 0.85);
  color: white;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 600;
  backdrop-filter: blur(4px);
}

.gallery-thumbnails-row {
  display: flex;
  gap: 12px;
  overflow-x: auto;
  padding-bottom: 6px;
  scrollbar-width: thin;
  scrollbar-color: #cbd5e1 transparent;
}

.thumb-card {
  width: 90px;
  height: 60px;
  flex-shrink: 0;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  border: 2px solid transparent;
  opacity: 0.7;
  transition: all 0.2s ease;
}

.thumb-card:hover {
  opacity: 1;
}

.thumb-card.active {
  border-color: #0052cc;
  opacity: 1;
  box-shadow: 0 4px 8px rgba(0, 82, 204, 0.2);
}

.thumb-img-el {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Header Info Card */
.property-header-card {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  padding: 32px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.01);
}

.property-detail-title {
  font-family: 'Outfit', sans-serif;
  font-size: 30px;
  font-weight: 850;
  color: #0f172a;
  margin: 0 0 12px 0;
  line-height: 1.25;
}

.property-detail-location {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 15px;
  color: #475569;
  font-weight: 500;
  line-height: 1.5;
}

/* Tag Chips */
.chips-list-container {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 18px;
}

.tag-chip {
  font-size: 11.5px;
  font-weight: 700;
  color: #0052cc;
  background: #eff6ff;
  padding: 4px 12px;
  border-radius: 20px;
  border: 1px solid rgba(0, 82, 204, 0.08);
}

/* Specs Quick Grid */
.property-specs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
  gap: 16px;
}

.spec-badge-box {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 20px 16px;
  display: flex;
  align-items: center;
  gap: 14px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.01);
}

.spec-icon {
  font-size: 28px;
}

.spec-meta {
  display: flex;
  flex-direction: column;
}

.spec-label {
  font-size: 9.5px;
  font-weight: 800;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.spec-val {
  font-family: 'Outfit', sans-serif;
  font-size: 15px;
  font-weight: 800;
  color: #0f172a;
  margin-top: 1px;
}

/* Sections */
.property-desc-section,
.property-details-section,
.property-features-section,
.property-floorplan-section,
.property-media-section,
.property-location-section {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  padding: 32px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.01);
}

.section-sub-title {
  font-family: 'Outfit', sans-serif;
  font-size: 20px;
  font-weight: 850;
  color: #0f172a;
  margin: 0 0 20px 0;
  border-bottom: 2px solid #f1f5f9;
  padding-bottom: 10px;
}

.desc-text-content {
  font-size: 15px;
  color: #334155;
  line-height: 1.75;
  white-space: pre-line;
  margin: 0;
}

/* Detailed Specifications Grid */
.details-spec-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px 40px;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 12px;
  border-bottom: 1px solid #f1f5f9;
}

.detail-row:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.detail-label {
  font-size: 13.5px;
  font-weight: 600;
  color: #64748b;
}

.detail-val {
  font-size: 14px;
  font-weight: 750;
  color: #0f172a;
  text-align: right;
}

/* Facilities Features Grid */
.features-checklist-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
  margin-bottom: 28px;
}

.feature-checklist-item {
  display: flex;
  align-items: center;
  gap: 10px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 14px 16px;
  opacity: 0.55;
  transition: all 0.2s ease;
}

.feature-checklist-item.active {
  background: #f0fdf4;
  border-color: #bbf7d0;
  opacity: 1;
}

.check-icon {
  font-size: 13px;
  font-weight: 850;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: #cbd5e1;
  color: #64748b;
  display: flex;
  align-items: center;
  justify-content: center;
}

.feature-checklist-item.active .check-icon {
  background: #22c55e;
  color: white;
}

.feature-txt {
  font-size: 13.5px;
  font-weight: 700;
  color: #334155;
}

.feature-checklist-item.active .feature-txt {
  color: #14532d;
}

.features-meta-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px 40px;
  border-top: 1px dashed #e2e8f0;
  padding-top: 24px;
}

/* Floor Plan Container */
.floorplan-image-box {
  position: relative;
  border-radius: 14px;
  overflow: hidden;
  cursor: pointer;
  border: 1px solid #e2e8f0;
  max-width: 480px;
  margin: 0 auto;
}

.floorplan-image-el {
  width: 100%;
  height: auto;
  display: block;
}

.floorplan-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: white;
  font-size: 13px;
  font-weight: 600;
  opacity: 0;
  transition: opacity 0.25s ease;
}

.floorplan-image-box:hover .floorplan-overlay {
  opacity: 1;
}

/* Media (Virtual Tour / Video) */
.virtual-tour-cta-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(135deg, #0f172a, #1e293b);
  border-radius: 16px;
  padding: 24px;
  color: white;
  margin-bottom: 24px;
  gap: 20px;
}

.vt-content {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.vt-badge {
  background: #3b82f6;
  color: white;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 10px;
  font-weight: 800;
  align-self: flex-start;
  letter-spacing: 0.05em;
}

.vt-content h4 {
  font-size: 16px;
  font-weight: 800;
  margin: 0;
  font-family: 'Outfit', sans-serif;
}

.vt-content p {
  font-size: 12.5px;
  color: #94a3b8;
  margin: 0;
  line-height: 1.5;
}

.btn-virtual-tour {
  background: #3b82f6;
  color: white;
  text-decoration: none;
  font-weight: 750;
  font-size: 13px;
  padding: 12px 24px;
  border-radius: 8px;
  white-space: nowrap;
  transition: all 0.2s ease;
}

.btn-virtual-tour:hover {
  background: #2563eb;
  transform: translateY(-0.5px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.video-embed-box {
  position: relative;
  aspect-ratio: 16 / 9;
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid #cbd5e1;
}

.video-iframe {
  width: 100%;
  height: 100%;
}

/* Locations Direction Card */
.map-desc {
  font-size: 14px;
  color: #64748b;
  line-height: 1.6;
  margin: 0 0 20px 0;
}

.directions-buttons-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.direction-btn {
  display: block;
  text-align: center;
  padding: 14px 20px;
  border-radius: 10px;
  font-size: 13.5px;
  font-weight: 750;
  text-decoration: none;
  transition: all 0.2s ease;
}

.btn-gmaps {
  background: #f1f5f9;
  color: #1e293b;
  border: 1px solid #cbd5e1;
}

.btn-gmaps:hover {
  background: #e2e8f0;
}

.btn-waze {
  background: #33ccff;
  color: white;
  box-shadow: 0 4px 12px rgba(51, 204, 255, 0.2);
}

.btn-waze:hover {
  background: #00bfff;
  transform: translateY(-0.5px);
  box-shadow: 0 6px 16px rgba(51, 204, 255, 0.3);
}

/* Sidebar Styling */
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
  border-radius: 20px;
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
  font-size: 32px;
  font-weight: 850;
  color: #0052cc;
  margin: 0 0 14px 0;
  line-height: 1.15;
}

.price-period-label {
  font-size: 18px;
  color: #475569;
  font-weight: 600;
}

.pricing-pills-row {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
}

.negotiable-pill {
  font-size: 11px;
  font-weight: 750;
  color: #10b981;
  background: #ecfdf5;
  border: 1px solid rgba(16, 185, 129, 0.1);
  padding: 4px 10px;
  border-radius: 6px;
}

.badge-status-sidebar {
  font-size: 11px;
  font-weight: 750;
  color: #475569;
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  padding: 4px 10px;
  border-radius: 6px;
}

.pricing-financial-details {
  border-top: 1px solid #f1f5f9;
  padding-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.fin-row {
  display: flex;
  justify-content: space-between;
  font-size: 12.5px;
}

.fin-label {
  color: #64748b;
  font-weight: 600;
}

.fin-val {
  color: #0f172a;
  font-weight: 750;
}

.border-none {
  border: none !important;
}

.p-0 {
  padding: 0 !important;
}

.m-0 {
  margin: 0 !important;
}

/* Agent Card */
.agent-contact-sidebar {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  padding: 28px;
  box-shadow: 0 10px 35px rgba(0,0,0,0.02);
  display: flex;
  flex-direction: column;
}

.admin-details-sidebar {
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.01) !important;
}

.agent-card-title {
  font-family: 'Outfit', sans-serif;
  font-size: 15px;
  font-weight: 800;
  color: #0f172a;
  margin: 0 0 18px 0;
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

/* Lightbox Modal */
.lightbox-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.95);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  padding: 24px;
}

.btn-lightbox-close {
  position: absolute;
  top: 24px;
  right: 24px;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: white;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.2s ease;
}

.btn-lightbox-close:hover {
  background: rgba(255, 255, 255, 0.25);
}

.lightbox-content {
  max-width: 100%;
  max-height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.lightbox-img-el {
  max-width: 100%;
  max-height: 90vh;
  object-fit: contain;
  border-radius: 8px;
  box-shadow: 0 20px 50px rgba(0,0,0,0.5);
}

/* Responsiveness */
@media (max-width: 1024px) {
  .main-split-grid {
    grid-template-columns: 1.8fr 1fr;
    gap: 24px;
  }
  
  .details-spec-grid,
  .features-meta-grid {
    grid-template-columns: 1fr;
    gap: 12px;
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
  
  .features-checklist-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .property-detail-title {
    font-size: 24px;
  }
  
  .directions-buttons-grid {
    grid-template-columns: 1fr;
  }
}
</style>
