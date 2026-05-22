<script setup lang="ts">
useHead({
  title: 'Portal Properti'
})

const dbListings = ref<any[]>([]);
const isLoading = ref(true);

const activeType = ref("Semua");
const activeSort = ref("terbaru");

const searchFilters = ref({
  location: "",
  propertyType: "",
  priceRange: "",
});

async function fetchSupabaseListings() {
  isLoading.value = true;
  const supabase = useSupabaseClient();
  const { data, error } = await supabase
    .from("listings")
    .select("*")
    .eq("status", "Aktif")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching dashboard listings:", error.message);
  } else if (data) {
    dbListings.value = data;
  }
  isLoading.value = false;
}

function handleTypeChange(type: string) {
  activeType.value = type;
  visibleCount.value = 6; // Reset pagination
}

function handleSortChange(sort: string) {
  activeSort.value = sort;
}

function handleSearch(filters: {
  location: string;
  propertyType: string;
  priceRange: string;
}) {
  searchFilters.value = filters;
  visibleCount.value = 6; // Reset pagination
}

function resetFilters() {
  activeType.value = "Semua";
  activeSort.value = "terbaru";
  searchFilters.value = {
    location: "",
    propertyType: "",
    priceRange: "",
  };
  visibleCount.value = 6;
  fetchSupabaseListings();
}

function formatRupiah(value: number | null) {
  if (value === null) return "-";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

function mapDbListingToCard(dbItem: any) {
  let imageUrl =
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&h=340&fit=crop";
  if (dbItem.image_urls && dbItem.image_urls.length > 0) {
    imageUrl = dbItem.image_urls[0];
  } else if (dbItem.image_url) {
    imageUrl = dbItem.image_url;
  }

  const formattedPrice =
    formatRupiah(dbItem.harga) +
    (dbItem.tipe === "Sewa" && dbItem.periode_sewa
      ? ` / ${dbItem.periode_sewa.toLowerCase()}`
      : "");

  const isNew = dbItem.created_at
    ? new Date().getTime() - new Date(dbItem.created_at).getTime() <
      3 * 24 * 60 * 60 * 1000
    : false;

  let locationStr = dbItem.lokasi || "";
  if (dbItem.kecamatan && dbItem.kota) {
    locationStr = `${dbItem.kecamatan}, ${dbItem.kota}`;
  } else if (dbItem.kota) {
    locationStr = dbItem.kota;
  }

  return {
    image: imageUrl,
    title: dbItem.properti || "Tanpa Nama",
    price: formattedPrice,
    location: locationStr,
    type: dbItem.tipe as "Jual" | "Sewa",
    beds: dbItem.kamar_tidur || 0,
    baths: dbItem.kamar_mandi || 0,
    area: dbItem.luas || 0,
    isNew: isNew,
  };
}

const filteredListings = computed(() => {
  let list = [...dbListings.value];

  // 1. Filter by activeType chip (Semua, Jual, Sewa)
  if (activeType.value !== "Semua") {
    list = list.filter((item) => item.tipe === activeType.value);
  }

  // 2. Filter by search location
  if (searchFilters.value.location) {
    const locQuery = searchFilters.value.location.toLowerCase();
    list = list.filter(
      (item) =>
        (item.properti && item.properti.toLowerCase().includes(locQuery)) ||
        (item.lokasi && item.lokasi.toLowerCase().includes(locQuery)) ||
        (item.kota && item.kota.toLowerCase().includes(locQuery)) ||
        (item.kecamatan && item.kecamatan.toLowerCase().includes(locQuery)),
    );
  }

  // 3. Filter by search transaction type
  if (searchFilters.value.propertyType) {
    const typeQuery = searchFilters.value.propertyType.toLowerCase();
    list = list.filter(
      (item) => item.tipe && item.tipe.toLowerCase() === typeQuery,
    );
  }

  // 4. Filter by search price range
  if (searchFilters.value.priceRange) {
    const range = searchFilters.value.priceRange;
    list = list.filter((item) => {
      const price = item.harga || 0;
      if (range === "0-500jt") return price <= 500000000;
      if (range === "500jt-1m") return price > 500000000 && price <= 1000000000;
      if (range === "1m-3m") return price > 1000000000 && price <= 3000000000;
      if (range === "3m-5m") return price > 3000000000 && price <= 5000000000;
      if (range === "5m+") return price > 5000000000;
      return true;
    });
  }

  // 5. Sort listings
  if (activeSort.value === "terbaru") {
    list.sort((a, b) => b.id - a.id);
  } else if (activeSort.value === "harga-rendah") {
    list.sort((a, b) => (a.harga || 0) - (b.harga || 0));
  } else if (activeSort.value === "harga-tinggi") {
    list.sort((a, b) => (b.harga || 0) - (a.harga || 0));
  }

  return list;
});

const visibleCount = ref(6);
const increment = 6;

const visibleListings = computed(() => {
  return filteredListings.value.slice(0, visibleCount.value);
});

function loadMore() {
  visibleCount.value = Math.min(
    visibleCount.value + increment,
    filteredListings.value.length,
  );
}

onMounted(() => {
  fetchSupabaseListings();
});
</script>

<template>
  <div>
    <SearchHero @search="handleSearch" />

    <FilterBar
      @update:type="handleTypeChange"
      @update:sort="handleSortChange"
    />

    <main class="listings-section">
      <div class="listings-header">
        <h2 class="listings-title">Properti Pilihan</h2>
        <p v-if="!isLoading" class="listings-count">
          {{ filteredListings.length > 0 ? visibleListings.length : 0 }} dari
          {{ filteredListings.length }} properti
        </p>
        <p v-else class="listings-count">Memuat properti...</p>
      </div>

      <!-- Loading Skeleton State -->
      <div v-if="isLoading" class="listings-grid">
        <div v-for="n in 6" :key="n" class="skeleton-card">
          <div class="skeleton-image"></div>
          <div class="skeleton-body">
            <div class="skeleton-price"></div>
            <div class="skeleton-title"></div>
            <div class="skeleton-location"></div>
            <div class="skeleton-features"></div>
          </div>
        </div>
      </div>

      <!-- Empty Results State -->
      <div v-else-if="filteredListings.length === 0" class="empty-state">
        <div class="empty-icon-wrap">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            <line x1="11" y1="8" x2="11" y2="14"></line>
            <line x1="8" y1="11" x2="14" y2="11"></line>
          </svg>
        </div>
        <h3>Properti Tidak Ditemukan</h3>
        <p>
          Maaf, kami tidak dapat menemukan properti aktif yang cocok dengan
          kriteria pencarian Anda. Silakan ubah filter atau kata kunci Anda.
        </p>
        <button class="btn-reset" @click="resetFilters">Reset Pencarian</button>
      </div>

      <!-- Real Cards Grid -->
      <div v-else class="listings-grid">
        <ListingCard
          v-for="(listing, i) in visibleListings"
          :key="listing.id || i"
          v-bind="mapDbListingToCard(listing)"
        />
      </div>

      <div
        v-if="!isLoading && visibleCount < filteredListings.length"
        class="load-more"
      >
        <button class="btn-load" @click="loadMore">Muat Lebih Banyak</button>
      </div>
    </main>
  </div>
</template>

<style scoped>
.listings-section {
  max-width: 1280px;
  margin: 0 auto;
  padding: 64px 24px 80px;
}

.listings-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 36px;
  border-bottom: 2px solid var(--border-light);
  padding-bottom: 16px;
}

.listings-title {
  font-family: var(--font-display);
  font-size: 28px;
  font-weight: 800;
  color: var(--text-dark);
  position: relative;
}

.listings-title::after {
  content: "";
  position: absolute;
  bottom: -18px;
  left: 0;
  width: 60px;
  height: 4px;
  background: var(--primary);
  border-radius: var(--radius-full);
}

.listings-count {
  font-family: var(--font-body);
  font-size: 14px;
  color: var(--text-muted);
  font-weight: 500;
}

.listings-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
}

.load-more {
  text-align: center;
  margin-top: 64px;
}

.btn-load {
  padding: 14px 40px;
  border: 2px solid var(--primary);
  border-radius: var(--radius-md);
  background: transparent;
  color: var(--primary);
  font-family: var(--font-display);
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  transition: all var(--transition-fast);
  box-shadow: var(--shadow-sm);
}

.btn-load:hover {
  background: var(--primary);
  color: #fff;
  box-shadow: 0 6px 20px rgba(0, 82, 204, 0.25);
  transform: translateY(-1px);
}

.btn-load:active {
  transform: translateY(0);
}

@media (max-width: 1024px) {
  .listings-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
  }
}

@media (max-width: 640px) {
  .listings-grid {
    grid-template-columns: 1fr;
  }

  .listings-section {
    padding: 40px 16px 60px;
  }

  .listings-title {
    font-size: 22px;
  }

  .listings-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .listings-title::after {
    bottom: -14px;
  }
}

/* Skeleton Loading Shimmer */
.skeleton-card {
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  overflow: hidden;
  border: 1px solid var(--border-light);
  display: flex;
  flex-direction: column;
  height: 380px;
}

.skeleton-image {
  aspect-ratio: 16 / 10;
  background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

.skeleton-body {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex: 1;
}

.skeleton-price {
  width: 50%;
  height: 24px;
  background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 4px;
}

.skeleton-title {
  width: 90%;
  height: 20px;
  background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 4px;
}

.skeleton-location {
  width: 70%;
  height: 16px;
  background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 4px;
  margin-top: auto;
}

.skeleton-features {
  width: 100%;
  height: 24px;
  background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 4px;
  border-top: 1px solid var(--border-light);
  padding-top: 16px;
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

/* Empty State Styling */
.empty-state {
  text-align: center;
  padding: 64px 24px;
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  border: 2px dashed var(--border-light);
  max-width: 600px;
  margin: 40px auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  box-shadow: var(--shadow-sm);
}

.empty-icon-wrap {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: var(--primary-light);
  color: var(--primary);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 24px rgba(0, 82, 204, 0.08);
}

.empty-state h3 {
  font-family: var(--font-display);
  font-size: 20px;
  font-weight: 700;
  color: var(--text-dark);
  margin: 0;
}

.empty-state p {
  font-family: var(--font-body);
  font-size: 14px;
  color: var(--text-muted);
  line-height: 1.5;
  margin: 0 0 8px 0;
}

.btn-reset {
  padding: 12px 28px;
  background: var(--primary);
  border: none;
  color: #fff;
  border-radius: var(--radius-md);
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  box-shadow: 0 4px 12px var(--primary-glow);
  transition: all var(--transition-fast);
}

.btn-reset:hover {
  background: var(--primary-hover);
  box-shadow: 0 6px 16px var(--primary-glow);
  transform: translateY(-1px);
}

.btn-reset:active {
  transform: translateY(0);
}
</style>
