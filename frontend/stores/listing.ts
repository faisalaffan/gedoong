import { defineStore } from 'pinia'
import type { Listing } from '~/types/listing'

export const useListingStore = defineStore('listing', {
  state: () => ({
    listings: [] as Listing[],
    selectedListing: null as Listing | null,
    isDrawerOpen: false,
    isDrawerEditing: false,
    editingListingId: null as number | null,
    search: '',
    filterTipe: '',
    activeGalleryIndex: 0,
    // Fullscreen modal
    isFullScreenOpen: false,
    fullScreenImageUrl: '',
  }),

  getters: {
    filteredListings(state): Listing[] {
      return state.listings.filter((item) => {
        const q = state.search.toLowerCase()
        const matchesSearch =
          item.properti.toLowerCase().includes(q) ||
          (item.lokasi && item.lokasi.toLowerCase().includes(q)) ||
          (item.kota && item.kota.toLowerCase().includes(q)) ||
          (item.kecamatan && item.kecamatan.toLowerCase().includes(q))
        const matchesTipe = !state.filterTipe || item.tipe === state.filterTipe
        return matchesSearch && matchesTipe
      })
    },
  },

  actions: {
    async fetchListings() {
      const supabase = useSupabaseClient<any>()
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .order('id', { ascending: true })

      if (error) {
        console.error('Error fetching listings:', error.message)
        return
      }
      if (data) {
        this.listings = data as Listing[]
        // Sync selectedListing if drawer is open
        if (this.selectedListing && this.isDrawerOpen) {
          const updated = data.find((item: any) => item.id === this.selectedListing?.id)
          if (updated) this.selectedListing = updated as Listing
        }
      }
    },

    async saveListing(payload: any, editingId: number | null) {
      const supabase = useSupabaseClient<any>()

      if (editingId !== null) {
        const { error } = await supabase.from('listings').update(payload).eq('id', editingId)
        if (error) throw new Error('Gagal mengupdate listing: ' + error.message)
        
        // Log activity to Supabase
        await supabase.from('activities').insert([{ description: `Memperbarui informasi properti "${payload.properti}".` }]).catch(() => {})
      } else {
        const { error } = await supabase.from('listings').insert([payload])
        if (error) throw new Error('Gagal menambahkan listing: ' + error.message)
        
        // Log activity to Supabase
        const formattedPrice = new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(Number(payload.harga || 0))
        await supabase.from('activities').insert([{ description: `Menambahkan properti baru "${payload.properti}" (${formattedPrice}).` }]).catch(() => {})
      }

      await this.fetchListings()

      if (editingId !== null) {
        const updated = this.listings.find((item) => item.id === editingId)
        if (updated) this.selectedListing = updated
        this.isDrawerEditing = false
      } else {
        this.isDrawerOpen = false
        this.selectedListing = null
        this.isDrawerEditing = false
      }
    },

    async deleteListing(listing: Listing) {
      if (!listing.id) return
      const supabase = useSupabaseClient<any>()
      const { error } = await supabase.from('listings').delete().eq('id', listing.id)
      if (error) throw new Error(error.message)

      // Log activity to Supabase
      await supabase.from('activities').insert([{ description: `Menghapus properti "${listing.properti}" secara permanen.` }]).catch(() => {})

      this.closeDrawer()
      await this.fetchListings()
    },

    openDrawer(listing: Listing) {
      this.selectedListing = listing
      this.activeGalleryIndex = 0
      this.isDrawerOpen = true
      this.isDrawerEditing = false
    },

    closeDrawer() {
      this.isDrawerOpen = false
      this.selectedListing = null
      this.isDrawerEditing = false
    },

    openCreateDrawer() {
      this.editingListingId = null
      this.selectedListing = { properti: 'Tambah Listing Baru', tipe: 'Jual', status: 'Aktif', harga: 0 } as Listing
      this.isDrawerOpen = true
      this.isDrawerEditing = true
    },

    startEditing(listing: Listing) {
      this.editingListingId = listing.id || null
      this.isDrawerEditing = true
    },

    cancelEditing() {
      this.isDrawerEditing = false
      if (this.editingListingId === null) {
        this.isDrawerOpen = false
        this.selectedListing = null
      }
    },

    openFullScreen(url: string) {
      this.fullScreenImageUrl = url
      this.isFullScreenOpen = true
    },

    closeFullScreen() {
      this.isFullScreenOpen = false
      this.fullScreenImageUrl = ''
    },

    setGalleryIndex(i: number) {
      this.activeGalleryIndex = i
    },
  },
})
