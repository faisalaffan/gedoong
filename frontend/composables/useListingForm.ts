import { ref, computed } from 'vue'
import type { Listing, TabName } from '~/types/listing'
import { TABS_SEQUENCE } from '~/types/listing'

export function useListingForm() {
  // Tab wizard
  const activeTab = ref<TabName>('umum')
  const activeTabIndex = computed(() => TABS_SEQUENCE.indexOf(activeTab.value))

  function getStepStatus(tabName: TabName) {
    const index = TABS_SEQUENCE.indexOf(tabName)
    if (index < activeTabIndex.value) return 'completed'
    if (index === activeTabIndex.value) return 'active'
    return 'upcoming'
  }

  function getStepClass(tabName: TabName) {
    const status = getStepStatus(tabName)
    return {
      'step-completed': status === 'completed',
      'step-active': status === 'active',
      'step-upcoming': status === 'upcoming',
    }
  }

  function goToTab(tabName: TabName, isUploading: boolean) {
    if (isUploading) return
    activeTab.value = tabName
  }

  function goNext() {
    const idx = activeTabIndex.value
    if (idx < TABS_SEQUENCE.length - 1) activeTab.value = TABS_SEQUENCE[idx + 1] as TabName
  }

  function goPrev() {
    const idx = activeTabIndex.value
    if (idx > 0) activeTab.value = TABS_SEQUENCE[idx - 1] as TabName
  }

  // All form field refs
  const form = ref({
    properti: '',
    tipe: 'Jual' as 'Jual' | 'Sewa',
    harga: null as number | null,
    status: 'Aktif' as 'Aktif' | 'Terjual' | 'Draft',
    lokasi: '',
    kamar_tidur: null as number | null,
    kamar_mandi: null as number | null,
    luas: null as number | null,

    // Lokasi & Alamat
    alamat_lengkap: '',
    kelurahan: '',
    kecamatan: '',
    kota: '',
    provinsi: '',
    kode_pos: '',
    latitude: null as number | null,
    longitude: null as number | null,
    akses_jalan: 'Mobil',

    // Detail Fisik
    tipe_properti: 'Rumah',
    kondisi: 'Baru',
    lantai: null as number | null,
    lantai_ke: null as number | null,
    luas_tanah: null as number | null,
    hadap: 'Utara',
    daya_listrik: '1300W',
    sumber_air: 'PDAM',
    garasi_carport: null as number | null,

    // Finansial Tambahan
    periode_sewa: 'Tahun',
    harga_negotiable: false,
    biaya_ipl: null as number | null,
    pajak_ditanggung: 'Negotiable',
    sertifikat: 'SHM',

    // Fasilitas Dalam
    furnished_status: 'Unfurnished',
    ac: null as number | null,
    water_heater: false,
    dapur: 'Keduanya',
    internet_wifi: false,
    keamanan_dalam: [] as string[],

    // Fasilitas Luar
    kolam_renang: false,
    area_bermain: false,
    masjid_mushola: false,
    keamanan_24j: false,
    nama_kompleks: '',

    // Administratif
    tersedia_untuk: 'Keduanya',
    min_masa_sewa: null as number | null,
    tanggal_tersedia: '',
    virtual_tour_url: '',
    deskripsi: '',
    tags_string: '',
  })

  function resetForm() {
    activeTab.value = 'umum'
    form.value = {
      properti: '',
      tipe: 'Jual',
      harga: null,
      status: 'Aktif',
      lokasi: '',
      kamar_tidur: null,
      kamar_mandi: null,
      luas: null,
      alamat_lengkap: '',
      kelurahan: '',
      kecamatan: '',
      kota: '',
      provinsi: '',
      kode_pos: '',
      latitude: null,
      longitude: null,
      akses_jalan: 'Mobil',
      tipe_properti: 'Rumah',
      kondisi: 'Baru',
      lantai: null,
      lantai_ke: null,
      luas_tanah: null,
      hadap: 'Utara',
      daya_listrik: '1300W',
      sumber_air: 'PDAM',
      garasi_carport: null,
      periode_sewa: 'Tahun',
      harga_negotiable: false,
      biaya_ipl: null,
      pajak_ditanggung: 'Negotiable',
      sertifikat: 'SHM',
      furnished_status: 'Unfurnished',
      ac: null,
      water_heater: false,
      dapur: 'Keduanya',
      internet_wifi: false,
      keamanan_dalam: [],
      kolam_renang: false,
      area_bermain: false,
      masjid_mushola: false,
      keamanan_24j: false,
      nama_kompleks: '',
      tersedia_untuk: 'Keduanya',
      min_masa_sewa: null,
      tanggal_tersedia: '',
      virtual_tour_url: '',
      deskripsi: '',
      tags_string: '',
    }
  }

  function populateForm(listing: Listing) {
    activeTab.value = 'umum'
    form.value = {
      properti: listing.properti || '',
      tipe: listing.tipe || 'Jual',
      harga: listing.harga || null,
      status: listing.status || 'Aktif',
      lokasi: listing.lokasi || '',
      kamar_tidur: listing.kamar_tidur || null,
      kamar_mandi: listing.kamar_mandi || null,
      luas: listing.luas || null,
      alamat_lengkap: listing.alamat_lengkap || '',
      kelurahan: listing.kelurahan || '',
      kecamatan: listing.kecamatan || '',
      kota: listing.kota || '',
      provinsi: listing.provinsi || '',
      kode_pos: listing.kode_pos || '',
      latitude: listing.latitude || null,
      longitude: listing.longitude || null,
      akses_jalan: listing.akses_jalan || 'Mobil',
      tipe_properti: listing.tipe_properti || 'Rumah',
      kondisi: listing.kondisi || 'Baru',
      lantai: listing.lantai || null,
      lantai_ke: listing.lantai_ke || null,
      luas_tanah: listing.luas_tanah || null,
      hadap: listing.hadap || 'Utara',
      daya_listrik: listing.daya_listrik || '1300W',
      sumber_air: listing.sumber_air || 'PDAM',
      garasi_carport: listing.garasi_carport || null,
      periode_sewa: listing.periode_sewa || 'Tahun',
      harga_negotiable: listing.harga_negotiable || false,
      biaya_ipl: listing.biaya_ipl || null,
      pajak_ditanggung: listing.pajak_ditanggung || 'Negotiable',
      sertifikat: listing.sertifikat || 'SHM',
      furnished_status: listing.furnished_status || 'Unfurnished',
      ac: listing.ac || null,
      water_heater: listing.water_heater || false,
      dapur: listing.dapur || 'Keduanya',
      internet_wifi: listing.internet_wifi || false,
      keamanan_dalam: listing.keamanan_dalam || [],
      kolam_renang: listing.kolam_renang || false,
      area_bermain: listing.area_bermain || false,
      masjid_mushola: listing.masjid_mushola || false,
      keamanan_24j: listing.keamanan_24j || false,
      nama_kompleks: listing.nama_kompleks || '',
      tersedia_untuk: listing.tersedia_untuk || 'Keduanya',
      min_masa_sewa: listing.min_masa_sewa || null,
      tanggal_tersedia: listing.tanggal_tersedia || '',
      virtual_tour_url: listing.virtual_tour_url || '',
      deskripsi: listing.deskripsi || '',
      tags_string: listing.tags ? listing.tags.join(', ') : '',
    }
  }

  function buildPayload(imageUrls: string[], floorPlanUrl: string, videoUrl: string) {
    const f = form.value
    const finalTags = f.tags_string
      .split(',')
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0)

    const primaryImageUrl = imageUrls.length > 0 ? imageUrls[0] : ''

    return {
      properti: f.properti,
      tipe: f.tipe,
      harga: Number(f.harga),
      status: f.status,
      lokasi: f.lokasi || null,
      kamar_tidur: f.kamar_tidur !== null ? Number(f.kamar_tidur) : null,
      kamar_mandi: f.kamar_mandi !== null ? Number(f.kamar_mandi) : null,
      luas: f.luas !== null ? Number(f.luas) : null,
      image_url: primaryImageUrl,
      alamat_lengkap: f.alamat_lengkap || null,
      kelurahan: f.kelurahan || null,
      kecamatan: f.kecamatan || null,
      kota: f.kota || null,
      provinsi: f.provinsi || null,
      kode_pos: f.kode_pos || null,
      latitude: f.latitude !== null ? Number(f.latitude) : null,
      longitude: f.longitude !== null ? Number(f.longitude) : null,
      akses_jalan: f.akses_jalan || null,
      tipe_properti: f.tipe_properti || null,
      kondisi: f.kondisi || null,
      lantai: f.lantai !== null ? Number(f.lantai) : null,
      lantai_ke: f.lantai_ke !== null ? Number(f.lantai_ke) : null,
      luas_tanah: f.luas_tanah !== null ? Number(f.luas_tanah) : null,
      hadap: f.hadap || null,
      daya_listrik: f.daya_listrik || null,
      sumber_air: f.sumber_air || null,
      garasi_carport: f.garasi_carport !== null ? Number(f.garasi_carport) : null,
      periode_sewa: f.tipe === 'Sewa' ? f.periode_sewa : null,
      harga_negotiable: f.harga_negotiable,
      biaya_ipl: f.biaya_ipl !== null ? Number(f.biaya_ipl) : null,
      pajak_ditanggung: f.pajak_ditanggung || null,
      sertifikat: f.sertifikat || null,
      furnished_status: f.furnished_status || null,
      ac: f.ac !== null ? Number(f.ac) : null,
      water_heater: f.water_heater,
      dapur: f.dapur || null,
      internet_wifi: f.internet_wifi,
      keamanan_dalam: f.keamanan_dalam.length > 0 ? f.keamanan_dalam : null,
      kolam_renang: f.kolam_renang,
      area_bermain: f.area_bermain,
      masjid_mushola: f.masjid_mushola,
      keamanan_24j: f.keamanan_24j,
      nama_kompleks: f.nama_kompleks || null,
      tersedia_untuk: f.tersedia_untuk || null,
      min_masa_sewa: f.tipe === 'Sewa' && f.min_masa_sewa !== null ? Number(f.min_masa_sewa) : null,
      tanggal_tersedia: f.tanggal_tersedia || null,
      virtual_tour_url: f.virtual_tour_url || null,
      deskripsi: f.deskripsi || null,
      tags: finalTags.length > 0 ? finalTags : null,
      image_urls: imageUrls.length > 0 ? imageUrls : null,
      video_url: videoUrl || null,
      floor_plan_url: floorPlanUrl || null,
    }
  }

  return {
    form,
    activeTab,
    activeTabIndex,
    getStepStatus,
    getStepClass,
    goToTab,
    goNext,
    goPrev,
    resetForm,
    populateForm,
    buildPayload,
  }
}
