<script setup lang="ts">
import { useListingStore } from "~/stores/listing";
import { formatRupiah, statusClass } from "~/utils/format";

const store = useListingStore();
</script>

<template>
  <div class="listing-main-content">
    <h2 class="page-title">
      Listing Properti
      <span
        style="
          font-size: 13px;
          font-weight: 500;
          color: #737685;
          margin-left: 8px;
          display: inline-block;
        "
      >
        (Total {{ store.listings.length }} properti terdaftar)
      </span>
    </h2>

    <!-- Top Toolbar Control Area -->
    <div class="toolbar">
      <button class="btn-add" @click="store.openCreateDrawer">
        + Tambah Properti
      </button>
      <div class="toolbar-right">
        <input
          type="text"
          v-model="store.search"
          class="search-input"
          placeholder="Cari nama properti, lokasi, kota..."
        />
        <select v-model="store.filterTipe" class="filter-select">
          <option value="">Semua Tipe</option>
          <option value="Jual">Jual</option>
          <option value="Sewa">Sewa</option>
        </select>
      </div>
    </div>

    <!-- Table of Listings -->
    <div class="table-card">
      <table class="data-table">
        <thead>
          <tr>
            <th>Properti</th>
            <th>Tipe Properti</th>
            <th>Tipe</th>
            <th>Harga</th>
            <th>Sertifikat</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="l in store.filteredListings"
            :key="l.id"
            @click="store.openDrawer(l)"
            class="table-row-clickable"
          >
            <td class="cell-properti">
              <div class="properti-cell-content">
                <img
                  v-if="l.image_url"
                  :src="l.image_url"
                  class="properti-thumb"
                />
                <div class="properti-info">
                  <span class="properti-name">{{ l.properti }}</span>
                  <span
                    class="properti-location"
                    v-if="l.lokasi || l.alamat_lengkap"
                  >
                    {{ l.lokasi || l.alamat_lengkap }}
                  </span>
                </div>
              </div>
            </td>
            <td>{{ l.tipe_properti || "Rumah" }}</td>
            <td>
              <span
                class="type-badge"
                :class="l.tipe === 'Jual' ? 'type-jual' : 'type-sewa'"
              >
                {{ l.tipe }}
              </span>
            </td>
            <td class="cell-harga">
              {{ formatRupiah(l.harga) }}
              <span
                v-if="l.tipe === 'Sewa' && l.periode_sewa"
                class="period-suffix"
                >/{{ l.periode_sewa.toLowerCase() }}</span
              >
            </td>
            <td>{{ l.sertifikat || "-" }}</td>
            <td>
              <span class="status-badge" :class="statusClass(l.status)">
                {{ l.status }}
              </span>
            </td>
          </tr>
          <tr v-if="store.filteredListings.length === 0">
            <td colspan="6" class="no-data">
              Tidak ada listing properti yang ditemukan di Supabase.
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
