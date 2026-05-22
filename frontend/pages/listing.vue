<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import draggable from "vuedraggable";

definePageMeta({ layout: "dashboard" });

interface Listing {
  id?: number;
  created_at?: string;
  properti: string;
  tipe: "Jual" | "Sewa";
  harga: number; // Numerik murni
  status: "Aktif" | "Terjual" | "Draft";
  lokasi?: string;
  kamar_tidur?: number;
  kamar_mandi?: number;
  luas?: number; // Luas Bangunan
  image_url?: string; // Gambar Utama

  // 📍 Lokasi & Alamat
  alamat_lengkap?: string;
  kelurahan?: string;
  kecamatan?: string;
  kota?: string;
  provinsi?: string;
  kode_pos?: string;
  latitude?: number;
  longitude?: number;
  akses_jalan?: string;

  // 🏠 Detail Fisik
  tipe_properti?: string;
  kondisi?: string;
  lantai?: number;
  lantai_ke?: number;
  luas_tanah?: number;
  hadap?: string;
  daya_listrik?: string;
  sumber_air?: string;
  garasi_carport?: number;

  // 💰 Finansial Tambahan
  periode_sewa?: string;
  harga_negotiable?: boolean;
  biaya_ipl?: number;
  pajak_ditanggung?: string;
  sertifikat?: string;

  // 🛋️ Fasilitas Dalam
  furnished_status?: string;
  ac?: number;
  water_heater?: boolean;
  dapur?: string;
  internet_wifi?: boolean;
  keamanan_dalam?: string[];

  // 🏘️ Fasilitas Luar & Lingkungan
  kolam_renang?: boolean;
  area_bermain?: boolean;
  masjid_mushola?: boolean;
  keamanan_24j?: boolean;
  nama_kompleks?: string;

  // 📋 Administratif
  tersedia_untuk?: string;
  min_masa_sewa?: number;
  tanggal_tersedia?: string;
  virtual_tour_url?: string;
  deskripsi?: string;
  tags?: string[];

  // 📸 Media
  image_urls?: string[];
  video_url?: string;
  floor_plan_url?: string;
}

const listingsList = ref<Listing[]>([]);
const isModalOpen = ref(false);
const isDrawerEditing = ref(false);
const editingListingId = ref<number | null>(null);
const supabase = useSupabaseClient();

// Form wizard navigation tab
const activeTab = ref("umum"); // umum, lokasi, fisik, fasilitas, media

const tabsSequence = ["umum", "lokasi", "fisik", "fasilitas", "media"];

const activeTabIndex = computed(() => tabsSequence.indexOf(activeTab.value));

function getStepStatus(tabName: string) {
  const index = tabsSequence.indexOf(tabName);
  if (index < activeTabIndex.value) return "completed";
  if (index === activeTabIndex.value) return "active";
  return "upcoming";
}

function getStepClass(tabName: string) {
  const status = getStepStatus(tabName);
  return {
    "step-completed": status === "completed",
    "step-active": status === "active",
    "step-upcoming": status === "upcoming",
  };
}

function goToTab(tabName: string) {
  if (isUploading.value) return;
  activeTab.value = tabName;
}

// Form fields refs
const formProperti = ref("");
const formTipe = ref<"Jual" | "Sewa">("Jual");
const formHarga = ref<number | null>(null);
const formStatus = ref<"Aktif" | "Terjual" | "Draft">("Aktif");
const formLokasi = ref("");
const formKamarTidur = ref<number | null>(null);
const formKamarMandi = ref<number | null>(null);
const formLuas = ref<number | null>(null); // Luas bangunan

// 📍 Lokasi & Alamat
const formAlamatLengkap = ref("");
const formKelurahan = ref("");
const formKecamatan = ref("");
const formKota = ref("");
const formProvinsi = ref("");
const formKodePos = ref("");
const formLatitude = ref<number | null>(null);
const formLongitude = ref<number | null>(null);
const formAksesJalan = ref("Mobil");

// 🏠 Detail Fisik
const formTipeProperti = ref("Rumah");
const formKondisi = ref("Baru");
const formLantai = ref<number | null>(null);
const formLantaiKe = ref<number | null>(null);
const formLuasTanah = ref<number | null>(null);
const formHadap = ref("Utara");
const formDayaListrik = ref("1300W");
const formSumberAir = ref("PDAM");
const formGarasiCarport = ref<number | null>(null);

// 💰 Finansial Tambahan
const formPeriodeSewa = ref("Tahun");
const formHargaNegotiable = ref(false);
const formBiayaIpl = ref<number | null>(null);
const formPajakDitanggung = ref("Negotiable");
const formSertifikat = ref("SHM");

// 🛋️ Fasilitas Dalam
const formFurnishedStatus = ref("Unfurnished");
const formAc = ref<number | null>(null);
const formWaterHeater = ref(false);
const formDapur = ref("Keduanya");
const formInternetWifi = ref(false);
const formKeamananDalam = ref<string[]>([]); // CCTV, Intercom, One Gate

// 🏘️ Fasilitas Luar & Lingkungan
const formKolamRenang = ref(false);
const formAreaBermain = ref(false);
const formMasjidMushola = ref(false);
const formKeamanan24j = ref(false);
const formNamaKompleks = ref("");

// 📋 Administratif
const formTersediaUntuk = ref("Keduanya");
const formMinMasaSewa = ref<number | null>(null);
const formTanggalTersedia = ref("");
const formVirtualTourUrl = ref("");
const formDeskripsi = ref("");
const formTagsString = ref(""); // Comma separated tags

// 📸 Media uploads
const formImageFiles = ref<{ id: string; file?: File; url: string }[]>([]);
const formFloorPlanFile = ref<File | null>(null);
const formFloorPlanPreview = ref<string | null>(null);
const formVideoUrl = ref("");

const search = ref("");
const filterTipe = ref("");

// Global state for uploading & loading
const isUploading = ref(false);
const uploadStatusMsg = ref("");

// Reactive state for toast notification system
const toasts = ref<
  { id: number; message: string; type: "success" | "error" }[]
>([]);
let toastId = 0;

function showToast(message: string, type: "success" | "error" = "success") {
  const id = toastId++;
  toasts.value.push({ id, message, type });
  setTimeout(() => {
    toasts.value = toasts.value.filter((t) => t.id !== id);
  }, 4000);
}

// Format Rupiah Utility
function formatRupiah(value: number | null | undefined) {
  if (value === undefined || value === null) return "Rp -";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

// Load all listings from Supabase
async function loadListings() {
  const { data, error } = await supabase
    .from("listings")
    .select("*")
    .order("id", { ascending: true });

  if (error) {
    console.error("Error fetching listings:", error.message);
    return;
  }
  if (data) {
    listingsList.value = data;
    // Update selected listing in drawer if currently open to keep in sync
    if (selectedListing.value && isDrawerOpen.value) {
      const updated = data.find(
        (item) => item.id === selectedListing.value?.id,
      );
      if (updated) {
        selectedListing.value = updated;
      }
    }
  }
}

onMounted(() => {
  loadListings();
});

// Reset Form State & Open in Side Drawer (Create Mode)
function openCreateDrawer() {
  editingListingId.value = null;
  activeTab.value = "umum";

  formProperti.value = "";
  formTipe.value = "Jual";
  formHarga.value = null;
  formStatus.value = "Aktif";
  formLokasi.value = "";
  formKamarTidur.value = null;
  formKamarMandi.value = null;
  formLuas.value = null;

  formAlamatLengkap.value = "";
  formKelurahan.value = "";
  formKecamatan.value = "";
  formKota.value = "";
  formProvinsi.value = "";
  formKodePos.value = "";
  formLatitude.value = null;
  formLongitude.value = null;
  formAksesJalan.value = "Mobil";

  formTipeProperti.value = "Rumah";
  formKondisi.value = "Baru";
  formLantai.value = null;
  formLantaiKe.value = null;
  formLuasTanah.value = null;
  formHadap.value = "Utara";
  formDayaListrik.value = "1300W";
  formSumberAir.value = "PDAM";
  formGarasiCarport.value = null;

  formPeriodeSewa.value = "Tahun";
  formHargaNegotiable.value = false;
  formBiayaIpl.value = null;
  formPajakDitanggung.value = "Negotiable";
  formSertifikat.value = "SHM";

  formFurnishedStatus.value = "Unfurnished";
  formAc.value = null;
  formWaterHeater.value = false;
  formDapur.value = "Keduanya";
  formInternetWifi.value = false;
  formKeamananDalam.value = [];

  formKolamRenang.value = false;
  formAreaBermain.value = false;
  formMasjidMushola.value = false;
  formKeamanan24j.value = false;
  formNamaKompleks.value = "";

  formTersediaUntuk.value = "Keduanya";
  formMinMasaSewa.value = null;
  formTanggalTersedia.value = "";
  formVirtualTourUrl.value = "";
  formDeskripsi.value = "";
  formTagsString.value = "";

  formImageFiles.value = [];
  formFloorPlanFile.value = null;
  formFloorPlanPreview.value = null;
  formVideoUrl.value = "";

  isUploading.value = false;
  uploadStatusMsg.value = "";

  // Set placeholder selectedListing to render drawer
  selectedListing.value = {
    properti: "Tambah Listing Baru",
    tipe: "Jual",
    status: "Aktif",
  } as Listing;

  isDrawerOpen.value = true;
  isDrawerEditing.value = true;
}

// Open Side Drawer in Edit Mode with Preloaded Data
function startDrawerEdit(listing: Listing) {
  editingListingId.value = listing.id || null;
  activeTab.value = "umum";

  formProperti.value = listing.properti || "";
  formTipe.value = listing.tipe || "Jual";
  formHarga.value = listing.harga || null;
  formStatus.value = listing.status || "Aktif";
  formLokasi.value = listing.lokasi || "";
  formKamarTidur.value = listing.kamar_tidur || null;
  formKamarMandi.value = listing.kamar_mandi || null;
  formLuas.value = listing.luas || null;

  formAlamatLengkap.value = listing.alamat_lengkap || "";
  formKelurahan.value = listing.kelurahan || "";
  formKecamatan.value = listing.kecamatan || "";
  formKota.value = listing.kota || "";
  formProvinsi.value = listing.provinsi || "";
  formKodePos.value = listing.kode_pos || "";
  formLatitude.value = listing.latitude || null;
  formLongitude.value = listing.longitude || null;
  formAksesJalan.value = listing.akses_jalan || "Mobil";

  formTipeProperti.value = listing.tipe_properti || "Rumah";
  formKondisi.value = listing.kondisi || "Baru";
  formLantai.value = listing.lantai || null;
  formLantaiKe.value = listing.lantai_ke || null;
  formLuasTanah.value = listing.luas_tanah || null;
  formHadap.value = listing.hadap || "Utara";
  formDayaListrik.value = listing.daya_listrik || "1300W";
  formSumberAir.value = listing.sumber_air || "PDAM";
  formGarasiCarport.value = listing.garasi_carport || null;

  formPeriodeSewa.value = listing.periode_sewa || "Tahun";
  formHargaNegotiable.value = listing.harga_negotiable || false;
  formBiayaIpl.value = listing.biaya_ipl || null;
  formPajakDitanggung.value = listing.pajak_ditanggung || "Negotiable";
  formSertifikat.value = listing.sertifikat || "SHM";

  formFurnishedStatus.value = listing.furnished_status || "Unfurnished";
  formAc.value = listing.ac || null;
  formWaterHeater.value = listing.water_heater || false;
  formDapur.value = listing.dapur || "Keduanya";
  formInternetWifi.value = listing.internet_wifi || false;
  formKeamananDalam.value = listing.keamanan_dalam || [];

  formKolamRenang.value = listing.kolam_renang || false;
  formAreaBermain.value = listing.area_bermain || false;
  formMasjidMushola.value = listing.masjid_mushola || false;
  formKeamanan24j.value = listing.keamanan_24j || false;
  formNamaKompleks.value = listing.nama_kompleks || "";

  formTersediaUntuk.value = listing.tersedia_untuk || "Keduanya";
  formMinMasaSewa.value = listing.min_masa_sewa || null;
  formTanggalTersedia.value = listing.tanggal_tersedia || "";
  formVirtualTourUrl.value = listing.virtual_tour_url || "";
  formDeskripsi.value = listing.deskripsi || "";
  formTagsString.value = listing.tags ? listing.tags.join(", ") : "";

  // Map existing images to uploader format
  formImageFiles.value = (listing.image_urls || []).map((url, index) => ({
    id: `existing-${index}-${Date.now()}`,
    url: url,
  }));

  formFloorPlanPreview.value = listing.floor_plan_url || null;
  formFloorPlanFile.value = null;
  formVideoUrl.value = listing.video_url || "";

  isUploading.value = false;
  uploadStatusMsg.value = "";

  isDrawerEditing.value = true;
}

// Cancel Drawer Editing mode
function cancelDrawerEdit() {
  if (isUploading.value) return;
  isDrawerEditing.value = false;
  if (editingListingId.value === null) {
    // If it was creation mode, close the drawer completely
    isDrawerOpen.value = false;
    selectedListing.value = null;
  }
}

// Media file change triggers
function handleMultipleFilesChange(event: Event) {
  const target = event.target as HTMLInputElement;
  if (target.files) {
    const filesArray = Array.from(target.files);
    for (const file of filesArray) {
      if (!file.type.startsWith("image/")) {
        showToast("Format file harus berupa gambar!", "error");
        continue;
      }
      formImageFiles.value.push({
        id: `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        file: file,
        url: URL.createObjectURL(file),
      });
    }
  }
}

function removeImageItem(index: number) {
  formImageFiles.value.splice(index, 1);
}

function handleFloorPlanChange(event: Event) {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    const file = target.files[0];
    if (!file.type.startsWith("image/")) {
      showToast("Format file harus berupa gambar!", "error");
      return;
    }
    formFloorPlanFile.value = file;
    formFloorPlanPreview.value = URL.createObjectURL(file);
  }
}

function removeFloorPlan() {
  formFloorPlanFile.value = null;
  formFloorPlanPreview.value = null;
}

// Form Submit (Create & Update)
async function handleSaveListing() {
  if (!formProperti.value.trim() || formHarga.value === null) {
    showToast("Nama properti dan harga wajib diisi!", "error");
    return;
  }

  isUploading.value = true;
  uploadStatusMsg.value = "Menyiapkan upload gambar...";

  try {
    // 1. Upload multiple images to Supabase Storage listings bucket
    const finalImageUrls: string[] = [];
    const filesToUpload = formImageFiles.value.filter((img) => img.file);
    let currentUploadCount = 1;

    for (const img of formImageFiles.value) {
      if (img.file) {
        uploadStatusMsg.value = `Mengupload foto ${currentUploadCount} dari ${filesToUpload.length}...`;
        const cleanFileName = img.file.name.replace(/[^a-zA-Z0-9.]/g, "");
        const filePath = `${Date.now()}-${cleanFileName}`;

        const { error: uploadError } = await supabase.storage
          .from("listings")
          .upload(filePath, img.file);

        if (uploadError) {
          throw new Error(
            `Gagal mengupload foto ke-${currentUploadCount}: ${uploadError.message}`,
          );
        }

        const { data: publicUrlData } = supabase.storage
          .from("listings")
          .getPublicUrl(filePath);

        if (!publicUrlData || !publicUrlData.publicUrl) {
          throw new Error(
            `Gagal mendapatkan URL foto ke-${currentUploadCount}`,
          );
        }

        finalImageUrls.push(publicUrlData.publicUrl);
        currentUploadCount++;
      } else {
        // Pre-existing image URL
        finalImageUrls.push(img.url);
      }
    }

    // Set first image as the primary image_url
    const primaryImageUrl = finalImageUrls.length > 0 ? finalImageUrls[0] : "";

    // 2. Upload Floor Plan denah if selected
    let finalFloorPlanUrl = formFloorPlanPreview.value || "";
    if (formFloorPlanFile.value) {
      uploadStatusMsg.value = "Mengupload Denah Lantai...";
      const cleanFileName = formFloorPlanFile.value.name.replace(
        /[^a-zA-Z0-9.]/g,
        "",
      );
      const filePath = `floorplan-${Date.now()}-${cleanFileName}`;

      const { error: fpUploadError } = await supabase.storage
        .from("listings")
        .upload(filePath, formFloorPlanFile.value);

      if (fpUploadError) {
        throw new Error(
          `Gagal mengupload Denah Lantai: ${fpUploadError.message}`,
        );
      }

      const { data: fpPublicUrlData } = supabase.storage
        .from("listings")
        .getPublicUrl(filePath);

      if (fpPublicUrlData && fpPublicUrlData.publicUrl) {
        finalFloorPlanUrl = fpPublicUrlData.publicUrl;
      }
    }

    // 3. Process Tags Array
    const finalTags = formTagsString.value
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);

    // 4. Construct Listing Payload
    const listingPayload = {
      properti: formProperti.value,
      tipe: formTipe.value,
      harga: Number(formHarga.value),
      status: formStatus.value,
      lokasi: formLokasi.value || null,
      kamar_tidur:
        formKamarTidur.value !== null ? Number(formKamarTidur.value) : null,
      kamar_mandi:
        formKamarMandi.value !== null ? Number(formKamarMandi.value) : null,
      luas: formLuas.value !== null ? Number(formLuas.value) : null,
      image_url: primaryImageUrl,

      // 📍 Lokasi & Alamat
      alamat_lengkap: formAlamatLengkap.value || null,
      kelurahan: formKelurahan.value || null,
      kecamatan: formKecamatan.value || null,
      kota: formKota.value || null,
      provinsi: formProvinsi.value || null,
      kode_pos: formKodePos.value || null,
      latitude: formLatitude.value !== null ? Number(formLatitude.value) : null,
      longitude:
        formLongitude.value !== null ? Number(formLongitude.value) : null,
      akses_jalan: formAksesJalan.value || null,

      // 🏠 Detail Fisik
      tipe_properti: formTipeProperti.value || null,
      kondisi: formKondisi.value || null,
      lantai: formLantai.value !== null ? Number(formLantai.value) : null,
      lantai_ke:
        formLantaiKe.value !== null ? Number(formLantaiKe.value) : null,
      luas_tanah:
        formLuasTanah.value !== null ? Number(formLuasTanah.value) : null,
      hadap: formHadap.value || null,
      daya_listrik: formDayaListrik.value || null,
      sumber_air: formSumberAir.value || null,
      garasi_carport:
        formGarasiCarport.value !== null
          ? Number(formGarasiCarport.value)
          : null,

      // 💰 Finansial Tambahan
      periode_sewa: formTipe.value === "Sewa" ? formPeriodeSewa.value : null,
      harga_negotiable: formHargaNegotiable.value,
      biaya_ipl:
        formBiayaIpl.value !== null ? Number(formBiayaIpl.value) : null,
      pajak_ditanggung: formPajakDitanggung.value || null,
      sertifikat: formSertifikat.value || null,

      // 🛋️ Fasilitas Dalam
      furnished_status: formFurnishedStatus.value || null,
      ac: formAc.value !== null ? Number(formAc.value) : null,
      water_heater: formWaterHeater.value,
      dapur: formDapur.value || null,
      internet_wifi: formInternetWifi.value,
      keamanan_dalam:
        formKeamananDalam.value.length > 0 ? formKeamananDalam.value : null,

      // 🏘️ Fasilitas Luar & Lingkungan
      kolam_renang: formKolamRenang.value,
      area_bermain: formAreaBermain.value,
      masjid_mushola: formMasjidMushola.value,
      keamanan_24j: formKeamanan24j.value,
      nama_kompleks: formNamaKompleks.value || null,

      // 📋 Administratif
      tersedia_untuk: formTersediaUntuk.value || null,
      min_masa_sewa:
        formTipe.value === "Sewa" && formMinMasaSewa.value !== null
          ? Number(formMinMasaSewa.value)
          : null,
      tanggal_tersedia: formTanggalTersedia.value || null,
      virtual_tour_url: formVirtualTourUrl.value || null,
      deskripsi: formDeskripsi.value || null,
      tags: finalTags.length > 0 ? finalTags : null,

      // 📸 Media
      image_urls: finalImageUrls.length > 0 ? finalImageUrls : null,
      video_url: formVideoUrl.value || null,
      floor_plan_url: finalFloorPlanUrl || null,
    };

    uploadStatusMsg.value = "Menyimpan data ke database...";

    if (editingListingId.value !== null) {
      // Perform Update
      const { error } = await supabase
        .from("listings")
        .update(listingPayload)
        .eq("id", editingListingId.value);

      if (error) {
        throw new Error("Gagal mengupdate listing: " + error.message);
      }
      showToast("Listing berhasil diperbarui!", "success");
    } else {
      // Perform Insert
      const { error } = await supabase
        .from("listings")
        .insert([listingPayload]);

      if (error) {
        throw new Error("Gagal menambahkan listing: " + error.message);
      }
      showToast("Listing baru berhasil ditambahkan!", "success");
    }

    await loadListings();
    isUploading.value = false;
    isDrawerEditing.value = false;
    if (editingListingId.value === null) {
      isDrawerOpen.value = false;
      selectedListing.value = null;
    } else {
      const updated = listingsList.value.find(
        (item) => item.id === editingListingId.value,
      );
      if (updated) {
        selectedListing.value = updated;
      }
    }
  } catch (err: any) {
    showToast(
      err.message || "Terjadi kesalahan saat menyimpan listing.",
      "error",
    );
  } finally {
    isUploading.value = false;
    uploadStatusMsg.value = "";
  }
}

// Delete Listing Trigger
async function handleDeleteListing(listing: Listing) {
  if (!listing.id) return;
  if (
    confirm(
      `Apakah Anda yakin ingin menghapus properti "${listing.properti}" secara permanen?`,
    )
  ) {
    isUploading.value = true;
    try {
      const { error } = await supabase
        .from("listings")
        .delete()
        .eq("id", listing.id);

      if (error) {
        throw new Error(error.message);
      }

      showToast("Listing berhasil dihapus secara permanen!", "success");
      closeDrawer();
      await loadListings();
    } catch (err: any) {
      showToast(`Gagal menghapus listing: ${err.message}`, "error");
    } finally {
      isUploading.value = false;
    }
  }
}

// Sliding Detail Drawer State
const isDrawerOpen = ref(false);
const selectedListing = ref<Listing | null>(null);
const activeGalleryIndex = ref(0);

// Full Screen Image Modal State
const isFullScreenModalOpen = ref(false);
const fullScreenImageUrl = ref("");

function openFullScreen(url: string) {
  fullScreenImageUrl.value = url;
  isFullScreenModalOpen.value = true;
  window.addEventListener("keydown", handleFullScreenEsc);
}

function closeFullScreen() {
  isFullScreenModalOpen.value = false;
  fullScreenImageUrl.value = "";
  window.removeEventListener("keydown", handleFullScreenEsc);
}

function handleFullScreenEsc(e: KeyboardEvent) {
  if (e.key === "Escape") {
    closeFullScreen();
  }
}

function setGalleryIndex(i: number) {
  activeGalleryIndex.value = i;
}

function openDrawer(listing: Listing) {
  if (isUploading.value) return; // Prevent clicking other rows while uploading
  selectedListing.value = listing;
  activeGalleryIndex.value = 0;
  isDrawerOpen.value = true;
  isDrawerEditing.value = false; // Always open in read-only details mode first
}

function closeDrawer() {
  if (isUploading.value) return; // Prevent closing while uploading/saving
  isDrawerOpen.value = false;
  selectedListing.value = null;
  isDrawerEditing.value = false;
}

// Filtering computed logic
const filteredListings = computed(() => {
  return listingsList.value.filter((item) => {
    const matchesSearch =
      item.properti.toLowerCase().includes(search.value.toLowerCase()) ||
      (item.lokasi &&
        item.lokasi.toLowerCase().includes(search.value.toLowerCase())) ||
      (item.kota &&
        item.kota.toLowerCase().includes(search.value.toLowerCase())) ||
      (item.kecamatan &&
        item.kecamatan.toLowerCase().includes(search.value.toLowerCase()));
    const matchesTipe = !filterTipe.value || item.tipe === filterTipe.value;
    return matchesSearch && matchesTipe;
  });
});

function statusClass(status: string) {
  if (status === "Aktif") return "status-aktif";
  if (status === "Terjual") return "status-terjual";
  if (status === "Draft") return "status-draft";
  return "";
}
</script>

<template>
  <div class="listing-page">
    <!-- Toast Notification System -->
    <div class="toast-container">
      <TransitionGroup name="toast-fade">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          class="toast-item"
          :class="'toast-' + toast.type"
        >
          <span class="toast-icon">
            <svg
              v-if="toast.type === 'success'"
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            <svg
              v-else
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
          </span>
          <span class="toast-message">{{ toast.message }}</span>
        </div>
      </TransitionGroup>
    </div>

    <div class="listing-layout">
      <div class="listing-main-content">
        <h2 class="page-title">Manajemen Listing</h2>

        <div class="toolbar">
          <button class="btn-add" @click="openCreateDrawer">
            + Tambah Listing
          </button>
          <div class="toolbar-right">
            <input
              v-model="search"
              type="text"
              class="search-input"
              placeholder="Cari properti, lokasi..."
            />
            <select v-model="filterTipe" class="filter-select">
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
                v-for="l in filteredListings"
                :key="l.id"
                @click="openDrawer(l)"
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
                  <span class="status-badge" :class="statusClass(l.status)">{{
                    l.status
                  }}</span>
                </td>
              </tr>
              <tr v-if="filteredListings.length === 0">
                <td colspan="6" class="no-data">
                  Tidak ada listing properti yang ditemukan di Supabase.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <!-- .listing-main-content -->

      <!-- Modal Form (Tambah/Edit Listing) -->

      <!-- Sliding Details Drawer (Jira Style) -->
      <div
        class="detail-drawer-overlay"
        v-if="isDrawerOpen"
        @click="closeDrawer"
      ></div>
      <div class="detail-drawer" :class="{ 'is-open': isDrawerOpen }">
        <div v-if="selectedListing" class="drawer-inner">
          <!-- Edit/Create Form View inside Drawer -->
          <template v-if="isDrawerEditing">
            <form
              @submit.prevent="handleSaveListing"
              class="drawer-form-wizard"
            >
              <!-- Header Section -->
              <div class="drawer-header">
                <div class="drawer-header-left">
                  <h3 class="drawer-edit-title">
                    {{
                      editingListingId
                        ? "Edit Properti"
                        : "Tambah Properti Baru"
                    }}
                  </h3>
                </div>
                <button
                  class="drawer-close"
                  type="button"
                  @click="cancelDrawerEdit"
                  :disabled="isUploading"
                >
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

              <!-- Connected Premium Stepper for Drawer Form Wizard -->
              <div class="drawer-stepper-container">
                <!-- Stepper Progress Track Bar Behind Circles -->
                <div class="stepper-progress-track">
                  <div
                    class="stepper-progress-fill"
                    :style="{ width: activeTabIndex * 25 + '%' }"
                  ></div>
                </div>

                <div class="stepper-steps-wrapper">
                  <button
                    type="button"
                    class="stepper-step"
                    :class="getStepClass('umum')"
                    @click="goToTab('umum')"
                    :disabled="isUploading"
                  >
                    <div class="step-icon-circle">
                      <span
                        v-if="getStepStatus('umum') === 'completed'"
                        class="step-check-icon"
                        >✓</span
                      >
                      <span v-else>1</span>
                    </div>
                    <span class="step-label">Umum</span>
                  </button>

                  <button
                    type="button"
                    class="stepper-step"
                    :class="getStepClass('lokasi')"
                    @click="goToTab('lokasi')"
                    :disabled="isUploading"
                  >
                    <div class="step-icon-circle">
                      <span
                        v-if="getStepStatus('lokasi') === 'completed'"
                        class="step-check-icon"
                        >✓</span
                      >
                      <span v-else>2</span>
                    </div>
                    <span class="step-label">Lokasi</span>
                  </button>

                  <button
                    type="button"
                    class="stepper-step"
                    :class="getStepClass('fisik')"
                    @click="goToTab('fisik')"
                    :disabled="isUploading"
                  >
                    <div class="step-icon-circle">
                      <span
                        v-if="getStepStatus('fisik') === 'completed'"
                        class="step-check-icon"
                        >✓</span
                      >
                      <span v-else>3</span>
                    </div>
                    <span class="step-label">Fisik</span>
                  </button>

                  <button
                    type="button"
                    class="stepper-step"
                    :class="getStepClass('fasilitas')"
                    @click="goToTab('fasilitas')"
                    :disabled="isUploading"
                  >
                    <div class="step-icon-circle">
                      <span
                        v-if="getStepStatus('fasilitas') === 'completed'"
                        class="step-check-icon"
                        >✓</span
                      >
                      <span v-else>4</span>
                    </div>
                    <span class="step-label">Fasilitas</span>
                  </button>

                  <button
                    type="button"
                    class="stepper-step"
                    :class="getStepClass('media')"
                    @click="goToTab('media')"
                    :disabled="isUploading"
                  >
                    <div class="step-icon-circle">
                      <span
                        v-if="getStepStatus('media') === 'completed'"
                        class="step-check-icon"
                        >✓</span
                      >
                      <span v-else>5</span>
                    </div>
                    <span class="step-label">Media</span>
                  </button>
                </div>
              </div>

              <!-- Scrollable Body for Editing -->
              <div class="drawer-body-edit">
                <div v-if="isUploading" class="uploading-overlay-drawer">
                  <div class="spinner"></div>
                  <p class="uploading-msg">{{ uploadStatusMsg }}</p>
                </div>

                <!-- TAB 1: UMUM & FINANSIAL -->
                <div v-show="activeTab === 'umum'" class="tab-pane">
                  <div class="form-grid-2">
                    <div class="form-group span-2">
                      <label class="form-label">Nama Properti *</label>
                      <input
                        v-model="formProperti"
                        type="text"
                        class="form-input"
                        placeholder="Contoh: Rumah Minimalis Modern BSD"
                        required
                      />
                    </div>

                    <div class="form-group">
                      <label class="form-label">Tipe Transaksi *</label>
                      <select v-model="formTipe" class="form-select" required>
                        <option value="Jual">Jual</option>
                        <option value="Sewa">Sewa</option>
                      </select>
                    </div>

                    <div class="form-group">
                      <label class="form-label">Status Listing *</label>
                      <select v-model="formStatus" class="form-select" required>
                        <option value="Aktif">Aktif</option>
                        <option value="Draft">Draft</option>
                        <option value="Terjual">Terjual</option>
                      </select>
                    </div>

                    <div class="form-group">
                      <label class="form-label">Harga (Rupiah) *</label>
                      <input
                        v-model="formHarga"
                        type="number"
                        class="form-input"
                        placeholder="Contoh: 1500000000"
                        required
                        min="0"
                      />
                      <span class="input-helper" v-if="formHarga">{{
                        formatRupiah(formHarga)
                      }}</span>
                    </div>

                    <div class="form-group" v-if="formTipe === 'Sewa'">
                      <label class="form-label">Periode Sewa</label>
                      <select v-model="formPeriodeSewa" class="form-select">
                        <option value="Bulan">Per Bulan</option>
                        <option value="Tahun">Per Tahun</option>
                      </select>
                    </div>

                    <div class="form-group flex-row-align">
                      <label class="form-switch-label">
                        <input
                          type="checkbox"
                          v-model="formHargaNegotiable"
                          class="form-switch"
                        />
                        Harga Negotiable
                      </label>
                    </div>

                    <div class="form-group">
                      <label class="form-label">Sertifikat</label>
                      <select v-model="formSertifikat" class="form-select">
                        <option value="SHM">SHM (Sertifikat Hak Milik)</option>
                        <option value="HGB">HGB (Hak Guna Bangunan)</option>
                        <option value="AJB">AJB (Akta Jual Beli)</option>
                        <option value="Girik">Girik / Letter C</option>
                        <option value="Strata Title">
                          Strata Title (Apartemen)
                        </option>
                      </select>
                    </div>

                    <div class="form-group">
                      <label class="form-label"
                        >Biaya IPL / Service Charge (Rp)</label
                      >
                      <input
                        v-model="formBiayaIpl"
                        type="number"
                        class="form-input"
                        placeholder="Contoh: 250000"
                        min="0"
                      />
                    </div>

                    <div class="form-group">
                      <label class="form-label">Pajak Ditanggung</label>
                      <select v-model="formPajakDitanggung" class="form-select">
                        <option value="Penjual">Penjual</option>
                        <option value="Pembeli">Pembeli</option>
                        <option value="Negotiable">
                          Negotiable / Masing-masing
                        </option>
                      </select>
                    </div>
                  </div>
                </div>

                <!-- TAB 2: ALAMAT & LOKASI -->
                <div v-show="activeTab === 'lokasi'" class="tab-pane">
                  <div class="form-grid-2">
                    <div class="form-group span-2">
                      <label class="form-label"
                        >Alamat Lengkap (Jalan & Nomor)</label
                      >
                      <textarea
                        v-model="formAlamatLengkap"
                        class="form-textarea"
                        rows="2"
                        placeholder="Contoh: Jl. Boulevard Raya Blok M3 No. 12"
                      ></textarea>
                    </div>

                    <div class="form-group">
                      <label class="form-label">Kecamatan</label>
                      <input
                        v-model="formKecamatan"
                        type="text"
                        class="form-input"
                        placeholder="Contoh: Serpong"
                      />
                    </div>

                    <div class="form-group">
                      <label class="form-label">Kelurahan</label>
                      <input
                        v-model="formKelurahan"
                        type="text"
                        class="form-input"
                        placeholder="Contoh: Lengkong Gudang"
                      />
                    </div>

                    <div class="form-group">
                      <label class="form-label">Kota / Kabupaten</label>
                      <input
                        v-model="formKota"
                        type="text"
                        class="form-input"
                        placeholder="Contoh: Tangerang Selatan"
                      />
                    </div>

                    <div class="form-group">
                      <label class="form-label">Provinsi</label>
                      <input
                        v-model="formProvinsi"
                        type="text"
                        class="form-input"
                        placeholder="Contoh: Banten"
                      />
                    </div>

                    <div class="form-group">
                      <label class="form-label">Kode Pos</label>
                      <input
                        v-model="formKodePos"
                        type="text"
                        class="form-input"
                        placeholder="Contoh: 15310"
                      />
                    </div>

                    <div class="form-group">
                      <label class="form-label">Akses Jalan Utama</label>
                      <select v-model="formAksesJalan" class="form-select">
                        <option value="Mobil">Bisa Masuk Mobil</option>
                        <option value="Motor">Bisa Masuk Motor</option>
                        <option value="Jalan Kaki">Jalan Kaki Saja</option>
                      </select>
                    </div>

                    <div class="form-group">
                      <label class="form-label">Latitude GPS</label>
                      <input
                        v-model="formLatitude"
                        type="number"
                        step="any"
                        class="form-input"
                        placeholder="Contoh: -6.3024"
                      />
                    </div>

                    <div class="form-group">
                      <label class="form-label">Longitude GPS</label>
                      <input
                        v-model="formLongitude"
                        type="number"
                        step="any"
                        class="form-input"
                        placeholder="Contoh: 106.6894"
                      />
                    </div>
                  </div>
                </div>

                <!-- TAB 3: SPESIFIKASI FISIK -->
                <div v-show="activeTab === 'fisik'" class="tab-pane">
                  <div class="form-grid-3">
                    <div class="form-group">
                      <label class="form-label">Tipe Properti</label>
                      <select v-model="formTipeProperti" class="form-select">
                        <option value="Rumah">Rumah</option>
                        <option value="Apartemen">Apartemen</option>
                        <option value="Ruko">Ruko</option>
                        <option value="Kavling">Kavling Tanah</option>
                        <option value="Kost">Kost</option>
                      </select>
                    </div>

                    <div class="form-group">
                      <label class="form-label">Kondisi</label>
                      <select v-model="formKondisi" class="form-select">
                        <option value="Baru">Baru / Gress</option>
                        <option value="Bekas">Bekas / Pernah Dihuni</option>
                        <option value="Renovasi">Butuh Renovasi</option>
                      </select>
                    </div>

                    <div class="form-group">
                      <label class="form-label">Arah Hadap</label>
                      <select v-model="formHadap" class="form-select">
                        <option value="Utara">Utara</option>
                        <option value="Selatan">Selatan</option>
                        <option value="Timur">Timur</option>
                        <option value="Barat">Barat</option>
                      </select>
                    </div>

                    <div class="form-group">
                      <label class="form-label">Luas Bangunan (m²)</label>
                      <input
                        v-model="formLuas"
                        type="number"
                        class="form-input"
                        placeholder="e.g. 120"
                        min="0"
                      />
                    </div>

                    <div class="form-group">
                      <label class="form-label">Luas Tanah (m²)</label>
                      <input
                        v-model="formLuasTanah"
                        type="number"
                        class="form-input"
                        placeholder="e.g. 150"
                        min="0"
                      />
                    </div>

                    <div class="form-group">
                      <label class="form-label">Jumlah Lantai</label>
                      <input
                        v-model="formLantai"
                        type="number"
                        class="form-input"
                        placeholder="e.g. 2"
                        min="0"
                      />
                    </div>

                    <div
                      class="form-group"
                      v-if="formTipeProperti === 'Apartemen'"
                    >
                      <label class="form-label">Lantai Ke-</label>
                      <input
                        v-model="formLantaiKe"
                        type="number"
                        class="form-input"
                        placeholder="e.g. 15"
                        min="0"
                      />
                    </div>

                    <div class="form-group">
                      <label class="form-label">Kamar Tidur (KT)</label>
                      <input
                        v-model="formKamarTidur"
                        type="number"
                        class="form-input"
                        placeholder="e.g. 3"
                        min="0"
                      />
                    </div>

                    <div class="form-group">
                      <label class="form-label">Kamar Mandi (KM)</label>
                      <input
                        v-model="formKamarMandi"
                        type="number"
                        class="form-input"
                        placeholder="e.g. 2"
                        min="0"
                      />
                    </div>

                    <div class="form-group">
                      <label class="form-label">Daya Listrik (VA)</label>
                      <select v-model="formDayaListrik" class="form-select">
                        <option value="900W">900 VA</option>
                        <option value="1300W">1300 VA</option>
                        <option value="2200W">2200 VA</option>
                        <option value="3500W">3500 VA</option>
                        <option value="4400W">4400 VA</option>
                        <option value="5500W">5500 VA</option>
                        <option value="Lebih Besar">Diatas 5500 VA</option>
                      </select>
                    </div>

                    <div class="form-group">
                      <label class="form-label">Sumber Air</label>
                      <select v-model="formSumberAir" class="form-select">
                        <option value="PAM">PAM / WTP Kompleks</option>
                        <option value="PDAM">PDAM Kota</option>
                        <option value="Sumur">Sumur Bor / Jetpump</option>
                      </select>
                    </div>

                    <div class="form-group">
                      <label class="form-label"
                        >Kapasitas Garasi / Carport</label
                      >
                      <input
                        v-model="formGarasiCarport"
                        type="number"
                        class="form-input"
                        placeholder="e.g. 2 Mobil"
                        min="0"
                      />
                    </div>
                  </div>
                </div>

                <!-- TAB 4: FASILITAS -->
                <div v-show="activeTab === 'fasilitas'" class="tab-pane">
                  <h4 class="section-subtitle">🛋️ Fasilitas Dalam Properti</h4>
                  <div class="form-grid-3">
                    <div class="form-group">
                      <label class="form-label">Status Furnished</label>
                      <select v-model="formFurnishedStatus" class="form-select">
                        <option value="Unfurnished">
                          Kosong (Unfurnished)
                        </option>
                        <option value="Semi">Semi Furnished</option>
                        <option value="Full">Fully Furnished</option>
                      </select>
                    </div>

                    <div class="form-group">
                      <label class="form-label">Kondisi Dapur</label>
                      <select v-model="formDapur" class="form-select">
                        <option value="Kering">Dapur Bersih / Kering</option>
                        <option value="Basah">Dapur Basah</option>
                        <option value="Keduanya">
                          Keduanya (Dapur Kering & Basah)
                        </option>
                      </select>
                    </div>

                    <div class="form-group">
                      <label class="form-label">Jumlah AC (Unit)</label>
                      <input
                        v-model="formAc"
                        type="number"
                        class="form-input"
                        placeholder="e.g. 3"
                        min="0"
                      />
                    </div>

                    <div class="form-group flex-row-align">
                      <label class="form-switch-label">
                        <input
                          type="checkbox"
                          v-model="formWaterHeater"
                          class="form-switch"
                        />
                        Water Heater Tersedia
                      </label>
                    </div>

                    <div class="form-group flex-row-align">
                      <label class="form-switch-label">
                        <input
                          type="checkbox"
                          v-model="formInternetWifi"
                          class="form-switch"
                        />
                        Koneksi Internet/WiFi
                      </label>
                    </div>
                  </div>

                  <div class="form-group mt-12">
                    <label class="form-label"
                      >Fitur Keamanan Dalam Properti</label
                    >
                    <div class="checkbox-row-container">
                      <label class="check-box-label">
                        <input
                          type="checkbox"
                          value="CCTV"
                          v-model="formKeamananDalam"
                        />
                        CCTV Internal
                      </label>
                      <label class="check-box-label">
                        <input
                          type="checkbox"
                          value="Intercom"
                          v-model="formKeamananDalam"
                        />
                        Intercom System
                      </label>
                      <label class="check-box-label">
                        <input
                          type="checkbox"
                          value="One Gate"
                          v-model="formKeamananDalam"
                        />
                        Gerbang Khusus / Kartu Akses
                      </label>
                    </div>
                  </div>

                  <h4 class="section-subtitle mt-24">
                    🏘️ Fasilitas Kompleks / Lingkungan
                  </h4>
                  <div class="form-grid-3">
                    <div class="form-group">
                      <label class="form-label">Nama Kompleks / Cluster</label>
                      <input
                        v-model="formNamaKompleks"
                        type="text"
                        class="form-input"
                        placeholder="Contoh: Green Residence Cluster A"
                      />
                    </div>

                    <div class="form-group flex-row-align">
                      <label class="form-switch-label">
                        <input
                          type="checkbox"
                          v-model="formKolamRenang"
                          class="form-switch"
                        />
                        Kolam Renang
                      </label>
                    </div>

                    <div class="form-group flex-row-align">
                      <label class="form-switch-label">
                        <input
                          type="checkbox"
                          v-model="formAreaBermain"
                          class="form-switch"
                        />
                        Playground Anak
                      </label>
                    </div>

                    <div class="form-group flex-row-align">
                      <label class="form-switch-label">
                        <input
                          type="checkbox"
                          v-model="formMasjidMushola"
                          class="form-switch"
                        />
                        Masjid / Mushola Kompleks
                      </label>
                    </div>

                    <div class="form-group flex-row-align">
                      <label class="form-switch-label">
                        <input
                          type="checkbox"
                          v-model="formKeamanan24j"
                          class="form-switch"
                        />
                        Keamanan Kompleks 24 Jam
                      </label>
                    </div>
                  </div>
                </div>

                <!-- TAB 5: MEDIA & ADMINISTRATIF -->
                <div v-show="activeTab === 'media'" class="tab-pane">
                  <h4 class="section-subtitle">
                    📸 Galeri Media Foto (Min 5, Max 20)
                  </h4>

                  <!-- Custom drag & drop multiple files preview -->
                  <div class="multiple-upload-zone">
                    <input
                      type="file"
                      id="multiple-property-photos"
                      class="hidden-file-input"
                      accept="image/*"
                      multiple
                      @change="handleMultipleFilesChange"
                    />
                    <label
                      for="multiple-property-photos"
                      class="multiple-upload-label"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        class="upload-icon"
                      >
                        <rect
                          x="3"
                          y="3"
                          width="18"
                          height="18"
                          rx="2"
                          ry="2"
                        ></rect>
                        <circle cx="8.5" cy="8.5" r="1.5"></circle>
                        <polyline points="21 15 16 10 5 21"></polyline>
                      </svg>
                      <span class="upload-text"
                        >Klik untuk pilih multiple foto properti</span
                      >
                      <span class="upload-subtext"
                        >Foto pertama otomatis menjadi foto utama cover listing.
                        Drag & drop untuk atur urutan.</span
                      >
                    </label>
                  </div>

                  <!-- Reorderable images thumbnails -->
                  <div
                    class="reorderable-gallery-container"
                    v-if="formImageFiles.length > 0"
                  >
                    <draggable
                      v-model="formImageFiles"
                      item-key="id"
                      class="image-grid-draggable"
                      ghost-class="ghost-card"
                      animation="200"
                    >
                      <template #item="{ element, index }">
                        <div class="image-thumb-card">
                          <div class="drag-handle-badge">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="12"
                              height="12"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              stroke-width="2.5"
                            >
                              <circle cx="9" cy="5" r="1"></circle>
                              <circle cx="9" cy="12" r="1"></circle>
                              <circle cx="9" cy="19" r="1"></circle>
                              <circle cx="15" cy="5" r="1"></circle>
                              <circle cx="15" cy="12" r="1"></circle>
                              <circle cx="15" cy="19" r="1"></circle>
                            </svg>
                          </div>
                          <img :src="element.url" class="thumb-preview" />
                          <div class="index-badge">{{ index + 1 }}</div>
                          <button
                            type="button"
                            class="thumb-delete-btn"
                            @click="removeImageItem(index)"
                            :disabled="isUploading"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="12"
                              height="12"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              stroke-width="2"
                            >
                              <line x1="18" y1="6" x2="6" y2="18"></line>
                              <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                          </button>
                        </div>
                      </template>
                    </draggable>
                  </div>

                  <div class="form-grid-2 mt-20">
                    <!-- Floor Plan / Denah -->
                    <div class="form-group">
                      <label class="form-label"
                        >Denah Lantai (Floor Plan)</label
                      >
                      <div
                        v-if="formFloorPlanPreview"
                        class="floorplan-preview-container"
                      >
                        <img
                          :src="formFloorPlanPreview"
                          class="floorplan-preview"
                        />
                        <button
                          type="button"
                          class="floorplan-remove"
                          @click="removeFloorPlan"
                          :disabled="isUploading"
                        >
                          Hapus Denah
                        </button>
                      </div>
                      <div v-else class="upload-dropzone">
                        <input
                          type="file"
                          id="fp-upload"
                          class="hidden-file-input"
                          accept="image/*"
                          @change="handleFloorPlanChange"
                        />
                        <label for="fp-upload" class="upload-label">
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
                            <path
                              d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"
                            ></path>
                          </svg>
                          <span class="upload-text">Unggah Denah Lantai</span>
                        </label>
                      </div>
                    </div>

                    <div class="form-group flex-col-container">
                      <div class="form-group w-full">
                        <label class="form-label"
                          >Video URL (YouTube/Vimeo)</label
                        >
                        <input
                          v-model="formVideoUrl"
                          type="url"
                          class="form-input"
                          placeholder="e.g. https://youtube.com/watch?v=..."
                        />
                      </div>
                      <div class="form-group w-full mt-10">
                        <label class="form-label"
                          >Virtual Tour URL (YouTube / Matterport)</label
                        >
                        <input
                          v-model="formVirtualTourUrl"
                          type="url"
                          class="form-input"
                          placeholder="e.g. https://my.matterport.com/show/..."
                        />
                      </div>
                    </div>
                  </div>

                  <h4 class="section-subtitle mt-24">
                    📋 Administratif & Keterangan
                  </h4>
                  <div class="form-grid-3">
                    <div class="form-group">
                      <label class="form-label">Tersedia Untuk</label>
                      <select v-model="formTersediaUntuk" class="form-select">
                        <option value="WNI">
                          WNI (Warga Negara Indonesia)
                        </option>
                        <option value="WNA">WNA (Warga Negara Asing)</option>
                        <option value="Keduanya">Keduanya (WNA / WNI)</option>
                      </select>
                    </div>

                    <div class="form-group" v-if="formTipe === 'Sewa'">
                      <label class="form-label"
                        >Masa Sewa Minimum (Bulan)</label
                      >
                      <input
                        v-model="formMinMasaSewa"
                        type="number"
                        class="form-input"
                        placeholder="e.g. 12 bulan"
                        min="1"
                      />
                    </div>

                    <div class="form-group">
                      <label class="form-label"
                        >Tanggal Tersedia (Available Date)</label
                      >
                      <input
                        v-model="formTanggalTersedia"
                        type="date"
                        class="form-input"
                      />
                    </div>
                  </div>

                  <div class="form-group mt-12">
                    <label class="form-label"
                      >Tag / Highlights Properti (Dipisahkan koma)</label
                    >
                    <input
                      v-model="formTagsString"
                      type="text"
                      class="form-input"
                      placeholder="dekat tol, hook, pinggir jalan utama, minimalis"
                    />
                    <div class="chips-list-container" v-if="formTagsString">
                      <span
                        v-for="tag in formTagsString
                          .split(',')
                          .map((t) => t.trim())
                          .filter((t) => t.length > 0)"
                        :key="tag"
                        class="tag-chip"
                      >
                        #{{ tag }}
                      </span>
                    </div>
                  </div>

                  <div class="form-group mt-12">
                    <label class="form-label">Deskripsi Lengkap Properti</label>
                    <textarea
                      v-model="formDeskripsi"
                      class="form-textarea"
                      rows="4"
                      placeholder="Deskripsikan kelebihan properti, lingkungan sekitar, akses strategis, dll secara mendetail..."
                    ></textarea>
                  </div>
                </div>
              </div>

              <!-- Footer Navigation/Submit actions docked at the bottom -->
              <div class="drawer-footer-edit">
                <button
                  type="button"
                  class="btn-drawer-prev"
                  v-if="activeTab !== 'umum'"
                  @click="
                    activeTab =
                      activeTab === 'media'
                        ? 'fasilitas'
                        : activeTab === 'fasilitas'
                          ? 'fisik'
                          : activeTab === 'fisik'
                            ? 'lokasi'
                            : 'umum'
                  "
                  :disabled="isUploading"
                >
                  Sebelumnya
                </button>
                <div class="flex-spacer" v-else></div>

                <div class="drawer-footer-edit-right">
                  <button
                    type="button"
                    class="btn-drawer-cancel"
                    @click="cancelDrawerEdit"
                    :disabled="isUploading"
                  >
                    Batal
                  </button>
                  <button
                    type="button"
                    class="btn-drawer-next"
                    v-if="activeTab !== 'media'"
                    @click="
                      activeTab =
                        activeTab === 'umum'
                          ? 'lokasi'
                          : activeTab === 'lokasi'
                            ? 'fisik'
                            : activeTab === 'fisik'
                              ? 'fasilitas'
                              : 'media'
                    "
                    :disabled="isUploading"
                  >
                    Lanjut
                  </button>
                  <button
                    type="submit"
                    class="btn-drawer-submit"
                    v-else
                    :disabled="isUploading"
                  >
                    {{ editingListingId ? "Simpan" : "Simpan" }}
                  </button>
                </div>
              </div>
            </form>
          </template>

          <!-- Read-Only Details View inside Drawer -->
          <template v-else>
            <!-- Header Section -->
            <div class="drawer-header">
              <div class="drawer-header-left">
                <span
                  class="drawer-type-label"
                  :class="
                    selectedListing.tipe === 'Jual' ? 'type-jual' : 'type-sewa'
                  "
                >
                  {{ selectedListing.tipe }}
                </span>
                <span
                  class="drawer-status-badge"
                  :class="statusClass(selectedListing.status)"
                >
                  {{ selectedListing.status }}
                </span>
              </div>
              <button class="drawer-close" @click="closeDrawer">
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
              <h3 class="drawer-title">{{ selectedListing.properti }}</h3>

              <div class="drawer-price-section">
                <div class="drawer-price-label">Harga</div>
                <div class="drawer-price-value">
                  {{ formatRupiah(selectedListing.harga) }}
                  <span
                    v-if="
                      selectedListing.tipe === 'Sewa' &&
                      selectedListing.periode_sewa
                    "
                    class="period-suffix"
                    >/{{ selectedListing.periode_sewa.toLowerCase() }}</span
                  >
                  <span
                    class="negotiable-pill"
                    v-if="selectedListing.harga_negotiable"
                    >Nego</span
                  >
                </div>
              </div>

              <!-- Multiple images Gallery Carousel -->
              <div
                class="drawer-media-gallery"
                v-if="
                  selectedListing.image_urls &&
                  selectedListing.image_urls.length > 0
                "
              >
                <div
                  class="gallery-main-container"
                  @click="
                    openFullScreen(
                      selectedListing.image_urls[activeGalleryIndex],
                    )
                  "
                >
                  <img
                    :src="selectedListing.image_urls[activeGalleryIndex]"
                    class="gallery-main-img"
                  />
                  <div class="gallery-hover-overlay">
                    <svg
                      class="eye-icon"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <path
                        d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
                      ></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  </div>
                  <div class="gallery-counter">
                    {{ activeGalleryIndex + 1 }} /
                    {{ selectedListing.image_urls.length }}
                  </div>
                </div>
                <div class="gallery-thumbnails">
                  <div
                    v-for="(url, i) in selectedListing.image_urls"
                    :key="i"
                    class="gallery-thumb-item"
                    :class="{ active: i === activeGalleryIndex }"
                    @click="setGalleryIndex(i)"
                  >
                    <img :src="url" class="thumb-img" />
                  </div>
                </div>
              </div>
              <div
                class="drawer-media-gallery"
                v-else-if="selectedListing.image_url"
              >
                <div
                  class="gallery-main-container"
                  @click="openFullScreen(selectedListing.image_url)"
                >
                  <img
                    :src="selectedListing.image_url"
                    class="gallery-main-img"
                  />
                  <div class="gallery-hover-overlay">
                    <svg
                      class="eye-icon"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <path
                        d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
                      ></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  </div>
                </div>
              </div>

              <!-- Highlight Tags -->
              <div
                class="drawer-tags-list"
                v-if="selectedListing.tags && selectedListing.tags.length > 0"
              >
                <span
                  v-for="tag in selectedListing.tags"
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
                    selectedListing.tipe_properti || "Rumah"
                  }}</span>
                  <span class="spec-card-lbl">Tipe Properti</span>
                </div>
                <div class="spec-card-item" v-if="selectedListing.kamar_tidur">
                  <span class="spec-card-num">{{
                    selectedListing.kamar_tidur
                  }}</span>
                  <span class="spec-card-lbl">KT</span>
                </div>
                <div class="spec-card-item" v-if="selectedListing.kamar_mandi">
                  <span class="spec-card-num">{{
                    selectedListing.kamar_mandi
                  }}</span>
                  <span class="spec-card-lbl">KM</span>
                </div>
                <div class="spec-card-item" v-if="selectedListing.luas">
                  <span class="spec-card-num"
                    >{{ selectedListing.luas }} m²</span
                  >
                  <span class="spec-card-lbl">Bangunan</span>
                </div>
                <div class="spec-card-item" v-if="selectedListing.luas_tanah">
                  <span class="spec-card-num"
                    >{{ selectedListing.luas_tanah }} m²</span
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
                    v-if="selectedListing.alamat_lengkap"
                  >
                    <span class="spec-label">Alamat Lengkap</span>
                    <span class="spec-val text-right font-medium">{{
                      selectedListing.alamat_lengkap
                    }}</span>
                  </div>
                  <div
                    class="drawer-spec-row"
                    v-if="
                      selectedListing.kelurahan || selectedListing.kecamatan
                    "
                  >
                    <span class="spec-label">Kelurahan / Kecamatan</span>
                    <span class="spec-val"
                      >{{ selectedListing.kelurahan || "-" }} /
                      {{ selectedListing.kecamatan || "-" }}</span
                    >
                  </div>
                  <div
                    class="drawer-spec-row"
                    v-if="selectedListing.kota || selectedListing.provinsi"
                  >
                    <span class="spec-label">Kota / Provinsi</span>
                    <span class="spec-val"
                      >{{ selectedListing.kota || "-" }},
                      {{ selectedListing.provinsi || "-" }}</span
                    >
                  </div>
                  <div class="drawer-spec-row" v-if="selectedListing.kode_pos">
                    <span class="spec-label">Kode Pos</span>
                    <span class="spec-val">{{ selectedListing.kode_pos }}</span>
                  </div>
                  <div
                    class="drawer-spec-row"
                    v-if="selectedListing.akses_jalan"
                  >
                    <span class="spec-label">Akses Jalan</span>
                    <span class="spec-val">{{
                      selectedListing.akses_jalan
                    }}</span>
                  </div>
                  <div
                    class="drawer-spec-row"
                    v-if="selectedListing.latitude && selectedListing.longitude"
                  >
                    <span class="spec-label">Koordinat GPS</span>
                    <span class="spec-val">
                      <a
                        :href="
                          'https://www.google.com/maps/search/?api=1&query=' +
                          selectedListing.latitude +
                          ',' +
                          selectedListing.longitude
                        "
                        target="_blank"
                        class="maps-link"
                      >
                        Buka Google Maps ({{
                          selectedListing.latitude.toFixed(4)
                        }}, {{ selectedListing.longitude.toFixed(4) }})
                      </a>
                    </span>
                  </div>
                </div>
              </div>

              <div class="drawer-section">
                <h4 class="drawer-section-title">🏠 Spesifikasi Fisik</h4>
                <div class="drawer-spec-list">
                  <div class="drawer-spec-row" v-if="selectedListing.kondisi">
                    <span class="spec-label">Kondisi Bangunan</span>
                    <span class="spec-val">{{ selectedListing.kondisi }}</span>
                  </div>
                  <div class="drawer-spec-row" v-if="selectedListing.lantai">
                    <span class="spec-label">Jumlah Lantai</span>
                    <span class="spec-val"
                      >{{ selectedListing.lantai }} Lantai</span
                    >
                  </div>
                  <div
                    class="drawer-spec-row"
                    v-if="
                      selectedListing.lantai_ke &&
                      selectedListing.tipe_properti === 'Apartemen'
                    "
                  >
                    <span class="spec-label">Lantai Ke</span>
                    <span class="spec-val"
                      >Lantai {{ selectedListing.lantai_ke }}</span
                    >
                  </div>
                  <div class="drawer-spec-row" v-if="selectedListing.hadap">
                    <span class="spec-label">Arah Hadap</span>
                    <span class="spec-val"
                      >Hadap {{ selectedListing.hadap }}</span
                    >
                  </div>
                  <div
                    class="drawer-spec-row"
                    v-if="selectedListing.daya_listrik"
                  >
                    <span class="spec-label">Daya Listrik</span>
                    <span class="spec-val">{{
                      selectedListing.daya_listrik
                    }}</span>
                  </div>
                  <div
                    class="drawer-spec-row"
                    v-if="selectedListing.sumber_air"
                  >
                    <span class="spec-label">Sumber Air</span>
                    <span class="spec-val">{{
                      selectedListing.sumber_air
                    }}</span>
                  </div>
                  <div
                    class="drawer-spec-row"
                    v-if="selectedListing.garasi_carport"
                  >
                    <span class="spec-label">Kapasitas Garasi</span>
                    <span class="spec-val"
                      >{{ selectedListing.garasi_carport }} Mobil</span
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
                      selectedListing.sertifikat || "Tidak Ada"
                    }}</span>
                  </div>
                  <div class="drawer-spec-row" v-if="selectedListing.biaya_ipl">
                    <span class="spec-label">Biaya IPL / Service</span>
                    <span class="spec-val">{{
                      formatRupiah(selectedListing.biaya_ipl)
                    }}</span>
                  </div>
                  <div
                    class="drawer-spec-row"
                    v-if="selectedListing.pajak_ditanggung"
                  >
                    <span class="spec-label">Pajak Ditanggung</span>
                    <span class="spec-val">{{
                      selectedListing.pajak_ditanggung
                    }}</span>
                  </div>
                </div>
              </div>

              <div class="drawer-section">
                <h4 class="drawer-section-title">🛋️ Fasilitas Dalam & Luar</h4>
                <div class="drawer-features-grid">
                  <div
                    class="feature-item"
                    :class="{ disabled: !selectedListing.water_heater }"
                  >
                    <span class="feature-bullet">✓</span> Water Heater
                  </div>
                  <div
                    class="feature-item"
                    :class="{ disabled: !selectedListing.internet_wifi }"
                  >
                    <span class="feature-bullet">✓</span> Internet / WiFi
                  </div>
                  <div
                    class="feature-item"
                    :class="{ disabled: !selectedListing.kolam_renang }"
                  >
                    <span class="feature-bullet">✓</span> Kolam Renang
                  </div>
                  <div
                    class="feature-item"
                    :class="{ disabled: !selectedListing.area_bermain }"
                  >
                    <span class="feature-bullet">✓</span> Playground
                  </div>
                  <div
                    class="feature-item"
                    :class="{ disabled: !selectedListing.masjid_mushola }"
                  >
                    <span class="feature-bullet">✓</span> Mushola
                  </div>
                  <div
                    class="feature-item"
                    :class="{ disabled: !selectedListing.keamanan_24j }"
                  >
                    <span class="feature-bullet">✓</span> Security 24 Jam
                  </div>
                </div>

                <div class="drawer-spec-list mt-10">
                  <div
                    class="drawer-spec-row"
                    v-if="selectedListing.furnished_status"
                  >
                    <span class="spec-label">Status Furnished</span>
                    <span class="spec-val">{{
                      selectedListing.furnished_status
                    }}</span>
                  </div>
                  <div class="drawer-spec-row" v-if="selectedListing.ac">
                    <span class="spec-label">Jumlah AC</span>
                    <span class="spec-val">{{ selectedListing.ac }} Unit</span>
                  </div>
                  <div class="drawer-spec-row" v-if="selectedListing.dapur">
                    <span class="spec-label">Dapur</span>
                    <span class="spec-val">{{ selectedListing.dapur }}</span>
                  </div>
                  <div
                    class="drawer-spec-row"
                    v-if="
                      selectedListing.keamanan_dalam &&
                      selectedListing.keamanan_dalam.length > 0
                    "
                  >
                    <span class="spec-label">Keamanan Unit</span>
                    <span class="spec-val text-right font-medium">{{
                      selectedListing.keamanan_dalam.join(", ")
                    }}</span>
                  </div>
                  <div
                    class="drawer-spec-row"
                    v-if="selectedListing.nama_kompleks"
                  >
                    <span class="spec-label">Kompleks / Cluster</span>
                    <span class="spec-val">{{
                      selectedListing.nama_kompleks
                    }}</span>
                  </div>
                </div>
              </div>

              <div class="drawer-section" v-if="selectedListing.floor_plan_url">
                <h4 class="drawer-section-title">
                  📐 Denah Lantai (Floor Plan)
                </h4>
                <div class="drawer-floorplan-container">
                  <img
                    :src="selectedListing.floor_plan_url"
                    class="drawer-floorplan-img"
                  />
                </div>
              </div>

              <div class="drawer-section" v-if="selectedListing.deskripsi">
                <h4 class="drawer-section-title">📋 Deskripsi Lengkap</h4>
                <p class="drawer-description-text">
                  {{ selectedListing.deskripsi }}
                </p>
              </div>

              <div class="drawer-section">
                <h4 class="drawer-section-title">📋 Administratif</h4>
                <div class="drawer-spec-list">
                  <div
                    class="drawer-spec-row"
                    v-if="selectedListing.tersedia_untuk"
                  >
                    <span class="spec-label">Tersedia Untuk</span>
                    <span class="spec-val">{{
                      selectedListing.tersedia_untuk
                    }}</span>
                  </div>
                  <div
                    class="drawer-spec-row"
                    v-if="
                      selectedListing.min_masa_sewa &&
                      selectedListing.tipe === 'Sewa'
                    "
                  >
                    <span class="spec-label">Min. Masa Sewa</span>
                    <span class="spec-val"
                      >{{ selectedListing.min_masa_sewa }} Bulan</span
                    >
                  </div>
                  <div
                    class="drawer-spec-row"
                    v-if="selectedListing.tanggal_tersedia"
                  >
                    <span class="spec-label">Tersedia Sejak</span>
                    <span class="spec-val">{{
                      selectedListing.tanggal_tersedia
                    }}</span>
                  </div>
                  <div
                    class="drawer-spec-row"
                    v-if="selectedListing.virtual_tour_url"
                  >
                    <span class="spec-label">Virtual Tour</span>
                    <span class="spec-val">
                      <a
                        :href="selectedListing.virtual_tour_url"
                        target="_blank"
                        class="maps-link"
                      >
                        Buka Virtual Tour 🔗
                      </a>
                    </span>
                  </div>
                  <div class="drawer-spec-row" v-if="selectedListing.video_url">
                    <span class="spec-label">Video Properti</span>
                    <span class="spec-val">
                      <a
                        :href="selectedListing.video_url"
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
                @click="handleDeleteListing(selectedListing)"
                :disabled="isUploading"
              >
                Hapus Properti
              </button>
              <button
                type="button"
                class="btn-drawer-edit"
                @click="startDrawerEdit(selectedListing)"
              >
                Edit Properti
              </button>
            </div>
          </template>
        </div>
      </div>
    </div>
    <!-- Full Screen Image Modal Viewer -->
    <div
      class="fullscreen-image-modal"
      :class="{ 'is-active': isFullScreenModalOpen }"
      @click="closeFullScreen"
    >
      <div class="fullscreen-image-content" @click.stop>
        <button
          class="fullscreen-close-btn"
          @click="closeFullScreen"
          aria-label="Close Preview"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
        <img
          v-if="fullScreenImageUrl"
          :src="fullScreenImageUrl"
          class="fullscreen-img"
          alt="Preview Properti"
        />
        <div class="fullscreen-caption" v-if="selectedListing">
          {{ selectedListing.properti }}
        </div>
      </div>
    </div>
    <!-- .listing-layout -->
  </div>
</template>

<style scoped>
.listing-page {
  width: 100%;
  max-width: 1600px;
  position: relative;
}

.page-title {
  font-size: 22px;
  font-weight: 700;
  color: #041b3c;
  margin-bottom: 24px;
}

.toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  gap: 12px;
}

.btn-add {
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  background: #0052cc;
  color: #fff;
  font-size: 13px;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  transition: background 0.15s;
  white-space: nowrap;
}

.btn-add:hover {
  background: #003d9b;
}

.toolbar-right {
  display: flex;
  gap: 8px;
}

.search-input {
  height: 38px;
  padding: 0 12px;
  border: 1px solid #d7e2ff;
  border-radius: 8px;
  font-size: 13px;
  font-family: inherit;
  color: #041b3c;
  outline: none;
  width: 220px;
  background: #fff;
}

.search-input:focus {
  border-color: #0052cc;
}

.filter-select {
  height: 38px;
  padding: 0 10px;
  border: 1px solid #d7e2ff;
  border-radius: 8px;
  font-size: 13px;
  font-family: inherit;
  color: #041b3c;
  background: #fff;
  cursor: pointer;
  outline: none;
}

.table-card {
  background: #fff;
  border: 1px solid #e8ecf1;
  border-radius: 12px;
  overflow: hidden;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

.data-table th {
  text-align: left;
  padding: 12px 16px;
  color: #737685;
  font-weight: 600;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  border-bottom: 1px solid #e8ecf1;
  background: #fafaf8;
}

.data-table td {
  padding: 14px 16px;
  border-bottom: 1px solid #f0f0f0;
  color: #434654;
}

.table-row-clickable {
  cursor: pointer;
  transition: background 0.15s;
}

.table-row-clickable:hover {
  background: #fafcff;
}

.cell-properti {
  font-weight: 600;
  color: #041b3c;
}

.properti-cell-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.properti-thumb {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  object-fit: cover;
  border: 1px solid #e8ecf1;
}

.properti-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.properti-name {
  font-weight: 600;
  color: #041b3c;
}

.properti-location {
  font-size: 11px;
  color: #737685;
  max-width: 250px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.type-badge {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
}

.type-jual {
  background: #e0f2fe;
  color: #0369a1;
}

.type-sewa {
  background: #fef3c7;
  color: #b45309;
}

.cell-harga {
  font-weight: 600;
  color: #041b3c;
}

.period-suffix {
  font-size: 11px;
  font-weight: normal;
  color: #737685;
}

.status-badge {
  display: inline-block;
  padding: 3px 10px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 600;
}

.status-aktif {
  background: #e8f0fe;
  color: #0052cc;
}

.status-terjual {
  background: #dcfce7;
  color: #16a34a;
}

.status-draft {
  background: #f3f4f6;
  color: #4b5563;
}

.no-data {
  text-align: center;
  padding: 32px !important;
  color: #737685;
  font-style: italic;
}

/* Modal Multi-Tab Wizard Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(11, 28, 48, 0.4);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}

.modal-content {
  width: 90vw;
  max-width: 900px;
  max-height: 90vh;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border-radius: 16px;
  padding: 24px 32px;
  box-shadow: 0 24px 64px rgba(11, 28, 48, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.6);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  flex-shrink: 0;
}

.modal-title {
  font-size: 20px;
  font-weight: 800;
  color: #041b3c;
}

.close-btn {
  background: transparent;
  border: none;
  color: #737685;
  cursor: pointer;
  padding: 6px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.close-btn:hover {
  background: rgba(11, 28, 48, 0.05);
  color: #041b3c;
  transform: rotate(90deg);
}

.wizard-tabs {
  display: flex;
  gap: 6px;
  border-bottom: 1px solid #e8ecf1;
  padding-bottom: 12px;
  margin-bottom: 20px;
  overflow-x: auto;
  flex-shrink: 0;
}

.wizard-tab-btn {
  background: transparent;
  border: none;
  padding: 8px 12px;
  font-size: 13px;
  font-weight: 600;
  font-family: inherit;
  color: #737685;
  cursor: pointer;
  border-radius: 8px;
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;
}

.wizard-tab-btn:hover {
  background: rgba(11, 28, 48, 0.03);
  color: #041b3c;
}

.wizard-tab-btn.active {
  background: rgba(0, 82, 204, 0.08);
  color: #0052cc;
}

.tab-number {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: rgba(115, 118, 133, 0.15);
  font-size: 11px;
  color: inherit;
}

.wizard-tab-btn.active .tab-number {
  background: #0052cc;
  color: #fff;
}

.modal-form-wizard {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  padding-right: 6px;
  position: relative;
}

.tab-pane {
  flex: 1;
}

.form-grid-2 {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.form-grid-3 {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.span-2 {
  grid-column: span 2;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-label {
  font-size: 12px;
  font-weight: 600;
  color: #334155;
  display: flex;
  align-items: center;
  gap: 4px;
}

.form-input,
.form-select,
.form-textarea {
  width: 100%;
  box-sizing: border-box;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 13px;
  font-family: inherit;
  color: #0f172a;
  outline: none;
  background: #ffffff;
  box-shadow: 0 1px 2px rgba(11, 28, 48, 0.02);
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.form-input,
.form-select {
  height: 40px;
  padding: 0 12px;
}

.form-textarea {
  padding: 12px;
  resize: vertical;
  min-height: 90px;
}

.form-input:focus,
.form-select:focus,
.form-textarea:focus {
  background: #ffffff;
  border-color: #0052cc;
  box-shadow:
    0 0 0 3px rgba(0, 82, 204, 0.12),
    0 1px 2px rgba(11, 28, 48, 0.05);
}

.input-helper {
  font-size: 11px;
  color: #0052cc;
  font-weight: 600;
  margin-top: 2px;
}

.flex-row-align {
  flex-direction: row;
  align-items: center;
  height: 40px;
}

.form-switch-label {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-size: 13px;
  font-weight: 600;
  color: #334155;
  cursor: pointer;
  user-select: none;
}

.form-switch {
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: #0052cc;
}

.section-subtitle {
  font-size: 12px;
  font-weight: 800;
  color: #0052cc;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 16px;
  border-left: 3px solid #0052cc;
  padding-left: 10px;
}

.mt-10 {
  margin-top: 10px;
}
.mt-12 {
  margin-top: 12px;
}
.mt-20 {
  margin-top: 20px;
}
.mt-24 {
  margin-top: 24px;
}
.w-full {
  width: 100%;
}

.checkbox-row-container {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  padding: 8px 0;
}

.check-box-label {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 500;
  color: #434654;
  cursor: pointer;
}

/* Media Uploader Section */
.multiple-upload-zone {
  border: 2px dashed rgba(115, 118, 133, 0.25);
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.4);
  transition: all 0.2s;
  cursor: pointer;
  margin-bottom: 16px;
}

.multiple-upload-zone:hover {
  border-color: #0052cc;
  background: rgba(0, 82, 204, 0.02);
}

.multiple-upload-label {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  width: 100%;
  box-sizing: border-box;
  cursor: pointer;
  gap: 8px;
  text-align: center;
}

.upload-icon {
  color: #737685;
}

.multiple-upload-zone:hover .upload-icon {
  color: #0052cc;
}

.upload-text {
  font-size: 13px;
  font-weight: 600;
  color: #434654;
}

.upload-subtext {
  font-size: 11px;
  color: #737685;
  max-width: 450px;
}

.hidden-file-input {
  display: none;
}

.reorderable-gallery-container {
  background: #f8fafc;
  border: 1px solid #e8ecf1;
  border-radius: 8px;
  padding: 12px;
  max-height: 180px;
  overflow-y: auto;
}

.image-grid-draggable {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  gap: 12px;
}

.image-thumb-card {
  position: relative;
  height: 80px;
  border-radius: 6px;
  overflow: hidden;
  border: 1px solid #e8ecf1;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
  cursor: grab;
}

.image-thumb-card:active {
  cursor: grabbing;
}

.thumb-preview {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.drag-handle-badge {
  position: absolute;
  top: 4px;
  left: 4px;
  background: rgba(255, 255, 255, 0.85);
  border-radius: 4px;
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #434654;
  backdrop-filter: blur(2px);
}

.index-badge {
  position: absolute;
  bottom: 4px;
  right: 4px;
  background: #0052cc;
  color: #fff;
  font-size: 9px;
  font-weight: 700;
  padding: 1px 5px;
  border-radius: 10px;
}

.thumb-delete-btn {
  position: absolute;
  top: 4px;
  right: 4px;
  background: rgba(186, 26, 26, 0.85);
  border: none;
  color: #fff;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: scale 0.15s;
}

.thumb-delete-btn:hover {
  scale: 1.1;
}

.upload-dropzone {
  border: 2px dashed rgba(115, 118, 133, 0.2);
  border-radius: 8px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.4);
  cursor: pointer;
}

.upload-label {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  cursor: pointer;
}

.floorplan-preview-container {
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  height: 100px;
  border: 1px solid #e8ecf1;
}

.floorplan-preview {
  width: 100%;
  height: 100%;
  object-fit: contain;
  background: #f8fafc;
}

.floorplan-remove {
  position: absolute;
  bottom: 6px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(11, 28, 48, 0.85);
  border: none;
  color: #fff;
  font-size: 9px;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 4px;
  cursor: pointer;
}

.floorplan-remove:hover {
  background: #ba1a1a;
}

.flex-col-container {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.chips-list-container {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 8px;
}

.tag-chip {
  background: #f1f5f9;
  color: #475569;
  font-size: 11px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 12px;
}

.form-actions-wizard {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid #e8ecf1;
  flex-shrink: 0;
}

.right-btns {
  display: flex;
  gap: 8px;
}

.btn-cancel {
  background: transparent;
  border: 1px solid rgba(115, 118, 133, 0.3);
  padding: 9px 18px;
  font-size: 13px;
  font-weight: 600;
  color: #434654;
  border-radius: 8px;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.2s;
}

.btn-cancel:hover {
  background: rgba(11, 28, 48, 0.03);
}

.btn-wizard-nav {
  background: #f1f5f9;
  border: 1px solid #cbd5e1;
  padding: 9px 18px;
  font-size: 13px;
  font-weight: 600;
  color: #475569;
  border-radius: 8px;
  cursor: pointer;
  font-family: inherit;
}

.btn-wizard-next {
  background: #0052cc;
  border: none;
  padding: 9px 20px;
  font-size: 13px;
  font-weight: 600;
  color: #fff;
  border-radius: 8px;
  cursor: pointer;
  font-family: inherit;
}

.btn-submit {
  background: #16a34a;
  border: none;
  padding: 9px 20px;
  font-size: 13px;
  font-weight: 600;
  color: #fff;
  border-radius: 8px;
  cursor: pointer;
  font-family: inherit;
}

.btn-submit:hover {
  background: #15803d;
}

.btn-wizard-next:hover {
  background: #003d9b;
}

/* Uploading Overlay Status */
.upload-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  border-radius: 12px;
}

.upload-loader {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  text-align: center;
}

.spinner {
  width: 32px;
  height: 32px;
  border: 4px solid rgba(0, 82, 204, 0.1);
  border-left-color: #0052cc;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.upload-message {
  font-size: 14px;
  font-weight: 700;
  color: #041b3c;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Sliding details drawer styles (Jira style) */
.detail-drawer-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(11, 28, 48, 0.2);
  backdrop-filter: blur(4px);
  z-index: 1500;
  display: block;
}

.detail-drawer {
  position: fixed;
  top: 0;
  right: 0;
  width: 480px;
  max-width: 90vw;
  height: 100vh;
  background: #fff;
  box-shadow: -10px 0 40px rgba(11, 28, 48, 0.1);
  z-index: 1600;
  display: flex;
  flex-direction: column;
  transform: translateX(100%);
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.detail-drawer.is-open {
  transform: translateX(0);
}

/* Side-by-side Jira-style layout for desktop */
@media (min-width: 1025px) {
  .detail-drawer-overlay {
    display: none !important; /* Hide backdrop on desktop so table is interactive */
  }

  .listing-layout {
    display: flex;
    gap: 24px;
    align-items: flex-start;
    width: 100%;
  }

  .listing-main-content {
    flex: 1;
    min-width: 0; /* Prevents flex items from overflowing */
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .detail-drawer {
    position: sticky;
    top: 0;
    right: auto;
    width: 0;
    height: calc(
      100vh - 110px
    ); /* Beautiful sticky height filling the available workspace */
    box-shadow: none;
    border: 1px solid transparent;
    border-radius: 12px;
    transform: none; /* No translateX overlay translation */
    opacity: 0;
    pointer-events: none;
    flex-shrink: 0;
    transition:
      width 0.35s cubic-bezier(0.4, 0, 0.2, 1),
      opacity 0.3s ease,
      border-color 0.35s ease;
    overflow: hidden;
  }

  .detail-drawer.is-open {
    width: 480px;
    opacity: 1;
    pointer-events: auto;
    border-color: #e8ecf1;
    box-shadow: 0 4px 20px rgba(11, 28, 48, 0.03);
  }
}

.drawer-inner {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

.drawer-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #e8ecf1;
  flex-shrink: 0;
}

.drawer-header-left {
  display: flex;
  gap: 8px;
  align-items: center;
}

.drawer-type-label {
  display: inline-block;
  padding: 3px 8px;
  border-radius: 4px;
  font-size: 9px;
  font-weight: 800;
  text-transform: uppercase;
}

.drawer-status-badge {
  display: inline-block;
  padding: 3px 10px;
  border-radius: 20px;
  font-size: 10px;
  font-weight: 700;
}

.drawer-close {
  background: transparent;
  border: none;
  color: #737685;
  cursor: pointer;
  padding: 6px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.drawer-close:hover {
  background: rgba(11, 28, 48, 0.05);
  color: #041b3c;
}

.drawer-body {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.drawer-title {
  font-size: 18px;
  font-weight: 800;
  color: #041b3c;
  line-height: 1.3;
}

.drawer-price-section {
  background: #f8fafc;
  border: 1px solid #e8ecf1;
  border-radius: 8px;
  padding: 12px 16px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.drawer-price-label {
  font-size: 11px;
  font-weight: 600;
  color: #737685;
}

.drawer-price-value {
  font-size: 20px;
  font-weight: 800;
  color: #0052cc;
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.negotiable-pill {
  font-size: 10px;
  font-weight: 700;
  background: #dcfce7;
  color: #16a34a;
  padding: 2px 6px;
  border-radius: 4px;
}

/* Media Gallery in Drawer */
.drawer-media-gallery {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.gallery-main-container {
  position: relative;
  height: 200px;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #e8ecf1;
  cursor: pointer;
}

.gallery-main-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition:
    transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94),
    filter 0.4s ease;
}

.gallery-main-container:hover .gallery-main-img {
  transform: scale(1.08);
  filter: blur(2px) brightness(0.85);
}

.gallery-hover-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(11, 28, 48, 0.25);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.gallery-main-container:hover .gallery-hover-overlay {
  opacity: 1;
}

.gallery-hover-overlay .eye-icon {
  color: #ffffff;
  width: 32px;
  height: 32px;
  transform: scale(0.8);
  transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.gallery-main-container:hover .gallery-hover-overlay .eye-icon {
  transform: scale(1);
}

.gallery-counter {
  position: absolute;
  bottom: 8px;
  right: 8px;
  background: rgba(11, 28, 48, 0.7);
  color: #fff;
  font-size: 10px;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 10px;
}

.gallery-thumbnails {
  display: flex;
  gap: 6px;
  overflow-x: auto;
  padding-bottom: 4px;
}

.gallery-thumb-item {
  width: 50px;
  height: 40px;
  border-radius: 4px;
  overflow: hidden;
  border: 2px solid transparent;
  cursor: pointer;
  flex-shrink: 0;
}

.gallery-thumb-item.active {
  border-color: #0052cc;
}

.thumb-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.drawer-tags-list {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.drawer-tag-chip {
  background: #f1f5f9;
  color: #475569;
  font-size: 11px;
  font-weight: 600;
  padding: 3px 8px;
  border-radius: 6px;
}

.drawer-quick-specs {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  gap: 8px;
}

.spec-card-item {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 10px;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.spec-card-num {
  font-size: 13px;
  font-weight: 700;
  color: #041b3c;
}

.spec-card-lbl {
  font-size: 10px;
  color: #64748b;
  font-weight: 600;
}

.drawer-section {
  display: flex;
  flex-direction: column;
  gap: 10px;
  border-top: 1px solid #f1f5f9;
  padding-top: 16px;
}

.drawer-section-title {
  font-size: 13px;
  font-weight: 800;
  color: #041b3c;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.drawer-spec-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.drawer-spec-row {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  padding: 2px 0;
}

.spec-label {
  color: #64748b;
  font-weight: 500;
}

.spec-val {
  color: #0f172a;
  font-weight: 600;
}

.maps-link {
  color: #0052cc;
  text-decoration: none;
  font-weight: 700;
}

.maps-link:hover {
  text-decoration: underline;
}

.drawer-features-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
}

.feature-item {
  font-size: 12px;
  font-weight: 600;
  color: #1e293b;
  display: flex;
  align-items: center;
  gap: 6px;
}

.feature-item.disabled {
  color: #cbd5e1;
  text-decoration: line-through;
}

.feature-bullet {
  color: #16a34a;
  font-weight: 800;
}

.feature-item.disabled .feature-bullet {
  color: #cbd5e1;
}

.drawer-floorplan-container {
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  overflow: hidden;
  background: #f8fafc;
  max-height: 250px;
}

.drawer-floorplan-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.drawer-description-text {
  font-size: 13px;
  color: #334155;
  line-height: 1.5;
  white-space: pre-line;
}

.drawer-footer {
  display: flex;
  padding: 16px 20px;
  border-top: 1px solid #e8ecf1;
  gap: 10px;
  flex-shrink: 0;
  background: #fff;
}

.btn-drawer-delete {
  flex: 1;
  background: transparent;
  border: 1px solid #ba1a1a;
  color: #ba1a1a;
  padding: 10px;
  font-size: 13px;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.2s;
}

.btn-drawer-delete:hover {
  background: rgba(186, 26, 26, 0.05);
}

.btn-drawer-edit {
  flex: 2;
  background: #0052cc;
  border: none;
  color: #fff;
  padding: 10px;
  font-size: 13px;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.2s;
}

.btn-drawer-edit:hover {
  background: #003d9b;
}

/* Toast CSS */
.toast-container {
  position: fixed;
  top: 24px;
  right: 24px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  z-index: 9999;
  pointer-events: none;
}

.toast-item {
  pointer-events: auto;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 20px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  box-shadow: 0 10px 30px rgba(11, 28, 48, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.5);
  min-width: 280px;
  max-width: 400px;
  animation: slide-in 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.toast-success {
  border-left: 4px solid #16a34a;
  color: #16a34a;
}

.toast-error {
  border-left: 4px solid #ba1a1a;
  color: #ba1a1a;
}

.toast-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.toast-message {
  font-size: 13px;
  font-weight: 600;
  color: #041b3c;
}

@keyframes slide-in {
  from {
    opacity: 0;
    transform: translateX(40px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateX(0) scale(1);
  }
}

.toast-fade-enter-from,
.toast-fade-leave-to {
  opacity: 0;
  transform: translateY(-20px) scale(0.9);
}

.toast-fade-enter-active,
.toast-fade-leave-active {
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

/* side drawer edit view styles */
.drawer-form-wizard {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  position: relative;
}

/* Premium Stepper Styles */
.drawer-stepper-container {
  position: relative;
  padding: 20px 24px;
  background: #ffffff;
  border-bottom: 1px solid #f0f4f8;
  flex-shrink: 0;
}

.stepper-progress-track {
  position: absolute;
  top: 34px;
  left: 45px;
  right: 45px;
  height: 3px;
  background: #f1f5f9;
  border-radius: 2px;
  z-index: 1;
}

.stepper-progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #10b981 0%, #0052cc 100%);
  border-radius: 2px;
  transition: width 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}

.stepper-steps-wrapper {
  display: flex;
  justify-content: space-between;
  position: relative;
  z-index: 2;
  width: 100%;
}

.stepper-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  width: 54px;
  outline: none;
  transition: all 0.2s ease;
}

.step-icon-circle {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 700;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.step-label {
  font-size: 11px;
  font-weight: 600;
  color: #64748b;
  transition: all 0.25s ease;
  white-space: nowrap;
}

/* Stepper States styling */

/* Upcoming state */
.step-upcoming .step-icon-circle {
  background: #ffffff;
  border: 2px solid #e2e8f0;
  color: #94a3b8;
}

.step-upcoming:hover:not(:disabled) .step-icon-circle {
  border-color: #cbd5e1;
  color: #64748b;
  transform: translateY(-1px);
}

/* Active state */
.step-active .step-icon-circle {
  background: #0052cc;
  border: 2px solid #0052cc;
  color: #ffffff;
  box-shadow:
    0 0 0 4px rgba(0, 82, 204, 0.15),
    0 4px 10px rgba(0, 82, 204, 0.2);
}

.step-active .step-label {
  color: #0052cc;
  font-weight: 700;
}

/* Completed state */
.step-completed .step-icon-circle {
  background: #10b981;
  border: 2px solid #10b981;
  color: #ffffff;
  box-shadow: 0 4px 8px rgba(16, 185, 129, 0.15);
}

.step-completed .step-label {
  color: #10b981;
  font-weight: 600;
}

.step-completed:hover:not(:disabled) .step-icon-circle {
  background: #059669;
  border-color: #059669;
  transform: scale(1.05);
}

.step-check-icon {
  font-size: 12px;
  font-weight: 800;
}

.drawer-body-edit {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  position: relative;
  background: #f8fafc;
}

.drawer-body-edit .form-grid-2,
.drawer-body-edit .form-grid-3 {
  grid-template-columns: 1fr !important;
  gap: 16px !important;
}

.drawer-body-edit .span-2 {
  grid-column: span 1 !important;
}

.drawer-footer-edit {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-top: 1px solid #e8ecf1;
  background: #fff;
}

.drawer-footer-edit-right {
  display: flex;
  gap: 8px;
}

.btn-drawer-cancel {
  padding: 8px 16px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  background: #fff;
  color: #475569;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;
}

.btn-drawer-cancel:hover:not(:disabled) {
  background: #f8fafc;
  border-color: #cbd5e1;
}

.btn-drawer-prev {
  padding: 8px 16px;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  background: #fff;
  color: #334155;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;
}

.btn-drawer-prev:hover:not(:disabled) {
  background: #f1f5f9;
}

.btn-drawer-next,
.btn-drawer-submit {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  background: #0052cc;
  color: #fff;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;
}

.btn-drawer-next:hover:not(:disabled),
.btn-drawer-submit:hover:not(:disabled) {
  background: #0040a3;
}

.drawer-edit-title {
  font-size: 16px;
  font-weight: 700;
  color: #041b3c;
  margin: 0;
}

.uploading-overlay-drawer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(4px);
  z-index: 100;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
}

.uploading-msg {
  font-size: 13px;
  font-weight: 600;
  color: #0052cc;
}

/* Fullscreen Image Modal Styles */
.fullscreen-image-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(11, 28, 48, 0.85);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 3000;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.fullscreen-image-modal.is-active {
  opacity: 1;
  pointer-events: auto;
}

.fullscreen-image-content {
  position: relative;
  max-width: 90vw;
  max-height: 90vh;
  display: flex;
  align-items: center;
  justify-content: center;
  transform: scale(0.95);
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.fullscreen-image-modal.is-active .fullscreen-image-content {
  transform: scale(1);
}

.fullscreen-img {
  max-width: 100%;
  max-height: 85vh;
  border-radius: 12px;
  box-shadow: 0 32px 80px rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.15);
  object-fit: contain;
}

.fullscreen-close-btn {
  position: absolute;
  top: -48px;
  right: 0;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #ffffff;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.fullscreen-close-btn:hover {
  background: rgba(255, 255, 255, 0.25);
  transform: scale(1.1);
}

.fullscreen-caption {
  position: absolute;
  bottom: -48px;
  left: 50%;
  transform: translateX(-50%);
  color: #ffffff;
  font-size: 14px;
  font-weight: 500;
  background: rgba(11, 28, 48, 0.6);
  padding: 6px 16px;
  border-radius: 20px;
  white-space: nowrap;
  backdrop-filter: blur(4px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}
</style>
