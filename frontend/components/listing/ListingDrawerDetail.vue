<script setup lang="ts">
import { useListingStore } from "~/stores/listing";
import { useToast } from "~/composables/useToast";
import { formatRupiah, statusClass } from "~/utils/format";
import ImageGallery from "./ImageGallery.vue";

const store = useListingStore();
const { showToast } = useToast();

const emit = defineEmits<{
  (e: "edit"): void;
}>();

async function handleConfirmDelete() {
  if (!store.selectedListing || !store.selectedListing.id) return;
  
  const isConfirmed = confirm(
    `Apakah Anda yakin ingin menghapus properti "${store.selectedListing.properti}" secara permanen?`
  );
  
  if (isConfirmed) {
    try {
      await store.deleteListing(store.selectedListing);
      showToast("Listing berhasil dihapus secara permanen!", "success");
    } catch (err: any) {
      showToast(`Gagal menghapus listing: ${err.message}`, "error");
    }
  }
}
</script>

<template>
  <div v-if="store.selectedListing" class="drawer-inner">
    <!-- Header Section -->
    <div class="drawer-header">
      <div class="drawer-header-left">
        <span
          class="drawer-type-label"
          :class="
            store.selectedListing.tipe === 'Jual' ? 'type-jual' : 'type-sewa'
          "
        >
          {{ store.selectedListing.tipe }}
        </span>
        <span
          class="drawer-status-badge"
          :class="statusClass(store.selectedListing.status)"
        >
          {{ store.selectedListing.status }}
        </span>
      </div>
      <button class="drawer-close" @click="store.closeDrawer">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </div>

    <div class="drawer-body">
      <h3 class="drawer-title">{{ store.selectedListing.properti }}</h3>

      <div class="drawer-price-section">
        <div class="drawer-price-label">Harga</div>
        <div class="drawer-price-value">
          {{ formatRupiah(store.selectedListing.harga) }}
          <span
            v-if="
              store.selectedListing.tipe === 'Sewa' &&
              store.selectedListing.periode_sewa
            "
            class="period-suffix"
            >/{{ store.selectedListing.periode_sewa.toLowerCase() }}</span
          >
          <span
            class="negotiable-pill"
            v-if="store.selectedListing.harga_negotiable"
            >Nego</span
          >
        </div>
      </div>

      <!-- Multiple images Gallery Carousel -->
      <ImageGallery
        :image-urls="store.selectedListing.image_urls"
        :image-url="store.selectedListing.image_url"
        @open-full-screen="store.openFullScreen"
      />

      <!-- Highlight Tags -->
      <div
        class="drawer-tags-list"
        v-if="store.selectedListing.tags && store.selectedListing.tags.length > 0"
      >
        <span
          v-for="tag in store.selectedListing.tags"
          :key="tag"
          class="drawer-tag-chip"
        >
          #{{ tag }}
        </span>
      </div>

      <!-- Main spec cards -->
      <div class="drawer-quick-specs">
        <div class="spec-card-item">
          <span class="spec-card-num">{{
            store.selectedListing.tipe_properti || "Rumah"
          }}</span>
          <span class="spec-card-lbl">Tipe Properti</span>
        </div>
        <div class="spec-card-item" v-if="store.selectedListing.kamar_tidur">
          <span class="spec-card-num">{{
            store.selectedListing.kamar_tidur
          }}</span>
          <span class="spec-card-lbl">KT</span>
        </div>
        <div class="spec-card-item" v-if="store.selectedListing.kamar_mandi">
          <span class="spec-card-num">{{
            store.selectedListing.kamar_mandi
          }}</span>
          <span class="spec-card-lbl">KM</span>
        </div>
        <div class="spec-card-item" v-if="store.selectedListing.luas">
          <span class="spec-card-num"
            >{{ store.selectedListing.luas }} m²</span
          >
          <span class="spec-card-lbl">Bangunan</span>
        </div>
        <div class="spec-card-item" v-if="store.selectedListing.luas_tanah">
          <span class="spec-card-num"
            >{{ store.selectedListing.luas_tanah }} m²</span
          >
          <span class="spec-card-lbl">Tanah</span>
        </div>
      </div>

      <!-- Details Sections -->
      <div class="drawer-section">
        <h4 class="drawer-section-title">📍 Lokasi & Alamat</h4>
        <div class="drawer-spec-list">
          <div
            class="drawer-spec-row"
            v-if="store.selectedListing.alamat_lengkap"
          >
            <span class="spec-label">Alamat Lengkap</span>
            <span class="spec-val text-right font-medium">{{
              store.selectedListing.alamat_lengkap
            }}</span>
          </div>
          <div
            class="drawer-spec-row"
            v-if="
              store.selectedListing.kelurahan || store.selectedListing.kecamatan
            "
          >
            <span class="spec-label">Kelurahan / Kecamatan</span>
            <span class="spec-val"
              >{{ store.selectedListing.kelurahan || "-" }} /
              {{ store.selectedListing.kecamatan || "-" }}</span
            >
          </div>
          <div
            class="drawer-spec-row"
            v-if="store.selectedListing.kota || store.selectedListing.provinsi"
          >
            <span class="spec-label">Kota / Provinsi</span>
            <span class="spec-val"
              >{{ store.selectedListing.kota || "-" }},
              {{ store.selectedListing.provinsi || "-" }}</span
            >
          </div>
          <div class="drawer-spec-row" v-if="store.selectedListing.kode_pos">
            <span class="spec-label">Kode Pos</span>
            <span class="spec-val">{{ store.selectedListing.kode_pos }}</span>
          </div>
          <div
            class="drawer-spec-row"
            v-if="store.selectedListing.akses_jalan"
          >
            <span class="spec-label">Akses Jalan</span>
            <span class="spec-val">{{
              store.selectedListing.akses_jalan
            }}</span>
          </div>
          <div
            class="drawer-spec-row"
            v-if="store.selectedListing.latitude && store.selectedListing.longitude"
          >
            <span class="spec-label">Koordinat GPS</span>
            <span class="spec-val">
              <a
                :href="
                  'https://www.google.com/maps/search/?api=1&query=' +
                  store.selectedListing.latitude +
                  ',' +
                  store.selectedListing.longitude
                "
                target="_blank"
                class="maps-link"
              >
                Buka Google Maps ({{
                  store.selectedListing.latitude.toFixed(4)
                }}, {{ store.selectedListing.longitude.toFixed(4) }})
              </a>
            </span>
          </div>
        </div>
      </div>

      <div class="drawer-section">
        <h4 class="drawer-section-title">🏠 Spesifikasi Fisik</h4>
        <div class="drawer-spec-list">
          <div class="drawer-spec-row" v-if="store.selectedListing.kondisi">
            <span class="spec-label">Kondisi Bangunan</span>
            <span class="spec-val">{{ store.selectedListing.kondisi }}</span>
          </div>
          <div class="drawer-spec-row" v-if="store.selectedListing.lantai">
            <span class="spec-label">Jumlah Lantai</span>
            <span class="spec-val"
              >{{ store.selectedListing.lantai }} Lantai</span
            >
          </div>
          <div
            class="drawer-spec-row"
            v-if="
              store.selectedListing.lantai_ke &&
              store.selectedListing.tipe_properti === 'Apartemen'
            "
          >
            <span class="spec-label">Lantai Ke</span>
            <span class="spec-val"
              >Lantai {{ store.selectedListing.lantai_ke }}</span
            >
          </div>
          <div class="drawer-spec-row" v-if="store.selectedListing.hadap">
            <span class="spec-label">Arah Hadap</span>
            <span class="spec-val"
              >Hadap {{ store.selectedListing.hadap }}</span
            >
          </div>
          <div
            class="drawer-spec-row"
            v-if="store.selectedListing.daya_listrik"
          >
            <span class="spec-label">Daya Listrik</span>
            <span class="spec-val">{{
              store.selectedListing.daya_listrik
            }}</span>
          </div>
          <div
            class="drawer-spec-row"
            v-if="store.selectedListing.sumber_air"
          >
            <span class="spec-label">Sumber Air</span>
            <span class="spec-val">{{
              store.selectedListing.sumber_air
            }}</span>
          </div>
          <div
            class="drawer-spec-row"
            v-if="store.selectedListing.garasi_carport"
          >
            <span class="spec-label">Kapasitas Garasi</span>
            <span class="spec-val"
              >{{ store.selectedListing.garasi_carport }} Mobil</span
            >
          </div>
        </div>
      </div>

      <div class="drawer-section">
        <h4 class="drawer-section-title">💰 Finansial & Legalitas</h4>
        <div class="drawer-spec-list">
          <div class="drawer-spec-row">
            <span class="spec-label">Sertifikat / Surat</span>
            <span class="spec-val font-semibold">{{
              store.selectedListing.sertifikat || "Tidak Ada"
            }}</span>
          </div>
          <div class="drawer-spec-row" v-if="store.selectedListing.biaya_ipl">
            <span class="spec-label">Biaya IPL / Service</span>
            <span class="spec-val">{{
              formatRupiah(store.selectedListing.biaya_ipl)
            }}</span>
          </div>
          <div
            class="drawer-spec-row"
            v-if="store.selectedListing.pajak_ditanggung"
          >
            <span class="spec-label">Pajak Ditanggung</span>
            <span class="spec-val">{{
              store.selectedListing.pajak_ditanggung
            }}</span>
          </div>
        </div>
      </div>

      <div class="drawer-section">
        <h4 class="drawer-section-title">🛋️ Fasilitas Dalam & Luar</h4>
        <div class="drawer-features-grid">
          <div
            class="feature-item"
            :class="{ disabled: !store.selectedListing.water_heater }"
          >
            <span class="feature-bullet">✓</span> Water Heater
          </div>
          <div
            class="feature-item"
            :class="{ disabled: !store.selectedListing.internet_wifi }"
          >
            <span class="feature-bullet">✓</span> Internet / WiFi
          </div>
          <div
            class="feature-item"
            :class="{ disabled: !store.selectedListing.kolam_renang }"
          >
            <span class="feature-bullet">✓</span> Kolam Renang
          </div>
          <div
            class="feature-item"
            :class="{ disabled: !store.selectedListing.area_bermain }"
          >
            <span class="feature-bullet">✓</span> Playground
          </div>
          <div
            class="feature-item"
            :class="{ disabled: !store.selectedListing.masjid_mushola }"
          >
            <span class="feature-bullet">✓</span> Mushola
          </div>
          <div
            class="feature-item"
            :class="{ disabled: !store.selectedListing.keamanan_24j }"
          >
            <span class="feature-bullet">✓</span> Security 24 Jam
          </div>
        </div>

        <div class="drawer-spec-list mt-10">
          <div
            class="drawer-spec-row"
            v-if="store.selectedListing.furnished_status"
          >
            <span class="spec-label">Status Furnished</span>
            <span class="spec-val">{{
              store.selectedListing.furnished_status
            }}</span>
          </div>
          <div class="drawer-spec-row" v-if="store.selectedListing.ac">
            <span class="spec-label">Jumlah AC</span>
            <span class="spec-val">{{ store.selectedListing.ac }} Unit</span>
          </div>
          <div class="drawer-spec-row" v-if="store.selectedListing.dapur">
            <span class="spec-label">Dapur</span>
            <span class="spec-val">{{ store.selectedListing.dapur }}</span>
          </div>
          <div
            class="drawer-spec-row"
            v-if="
              store.selectedListing.keamanan_dalam &&
              store.selectedListing.keamanan_dalam.length > 0
            "
          >
            <span class="spec-label">Keamanan Unit</span>
            <span class="spec-val text-right font-medium">{{
              store.selectedListing.keamanan_dalam.join(", ")
            }}</span>
          </div>
          <div
            class="drawer-spec-row"
            v-if="store.selectedListing.nama_kompleks"
          >
            <span class="spec-label">Kompleks / Cluster</span>
            <span class="spec-val">{{
              store.selectedListing.nama_kompleks
            }}</span>
          </div>
        </div>
      </div>

      <div class="drawer-section" v-if="store.selectedListing.floor_plan_url">
        <h4 class="drawer-section-title">
          📐 Denah Lantai (Floor Plan)
        </h4>
        <div class="drawer-floorplan-container">
          <img
            :src="store.selectedListing.floor_plan_url"
            class="drawer-floorplan-img"
          />
        </div>
      </div>

      <div class="drawer-section" v-if="store.selectedListing.deskripsi">
        <h4 class="drawer-section-title">📋 Deskripsi Lengkap</h4>
        <p class="drawer-description-text">
          {{ store.selectedListing.deskripsi }}
        </p>
      </div>

      <div class="drawer-section">
        <h4 class="drawer-section-title">📋 Administratif</h4>
        <div class="drawer-spec-list">
          <div
            class="drawer-spec-row"
            v-if="store.selectedListing.tersedia_untuk"
          >
            <span class="spec-label">Tersedia Untuk</span>
            <span class="spec-val">{{
              store.selectedListing.tersedia_untuk
            }}</span>
          </div>
          <div
            class="drawer-spec-row"
            v-if="
              store.selectedListing.min_masa_sewa &&
              store.selectedListing.tipe === 'Sewa'
            "
          >
            <span class="spec-label">Min. Masa Sewa</span>
            <span class="spec-val"
              >{{ store.selectedListing.min_masa_sewa }} Bulan</span
            >
          </div>
          <div
            class="drawer-spec-row"
            v-if="store.selectedListing.tanggal_tersedia"
          >
            <span class="spec-label">Tersedia Sejak</span>
            <span class="spec-val">{{
              store.selectedListing.tanggal_tersedia
            }}</span>
          </div>
          <div
            class="drawer-spec-row"
            v-if="store.selectedListing.virtual_tour_url"
          >
            <span class="spec-label">Virtual Tour</span>
            <span class="spec-val">
              <a
                :href="store.selectedListing.virtual_tour_url"
                target="_blank"
                class="maps-link"
              >
                Buka Virtual Tour 🔗
              </a>
            </span>
          </div>
          <div class="drawer-spec-row" v-if="store.selectedListing.video_url">
            <span class="spec-label">Video Properti</span>
            <span class="spec-val">
              <a
                :href="store.selectedListing.video_url"
                target="_blank"
                class="maps-link"
              >
                Buka Video Properti 🔗
              </a>
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer Actions in Drawer -->
    <div class="drawer-footer">
      <button
        type="button"
        class="btn-drawer-delete"
        @click="handleConfirmDelete"
      >
        Hapus Properti
      </button>
      <button
        type="button"
        class="btn-drawer-edit"
        @click="emit('edit')"
      >
        Edit Properti
      </button>
    </div>
  </div>
</template>
