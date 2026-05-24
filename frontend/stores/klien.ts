import { defineStore } from 'pinia'
import type { Klien } from '~/types/klien'

export const useKlienStore = defineStore('klien', {
  state: () => ({
    kliens: [] as Klien[],
    selectedKlien: null as Klien | null,
    isDrawerOpen: false,
    isDrawerEditing: false,
    editingKlienId: null as number | null,
    search: '',
    filterPipeline: '',
  }),

  getters: {
    filteredKliens(state): Klien[] {
      return state.kliens.filter((item) => {
        const q = state.search.toLowerCase()
        const matchesSearch =
          item.nama.toLowerCase().includes(q) ||
          (item.kontak && item.kontak.toLowerCase().includes(q)) ||
          (item.properti && item.properti.toLowerCase().includes(q)) ||
          (item.catatan && item.catatan.toLowerCase().includes(q))
        
        const matchesPipeline = !state.filterPipeline || item.pipeline === state.filterPipeline
        return matchesSearch && matchesPipeline
      })
    },
  },

  actions: {
    async fetchKliens() {
      const supabase = useSupabaseClient()
      const { data, error } = await supabase
        .from('kliens')
        .select('*')
        .order('id', { ascending: true })

      if (error) {
        console.error('Error fetching clients:', error.message)
        return
      }
      if (data) {
        this.kliens = data as Klien[]
        // Sync selectedKlien if drawer is open
        if (this.selectedKlien && this.isDrawerOpen) {
          const updated = data.find((item: any) => item.id === this.selectedKlien?.id)
          if (updated) this.selectedKlien = updated as Klien
        }
      }
    },

    async saveKlien(payload: Partial<Klien>, editingId: number | null) {
      const supabase = useSupabaseClient()

      if (editingId !== null) {
        const { error } = await supabase.from('kliens').update(payload).eq('id', editingId)
        if (error) throw new Error('Gagal mengupdate klien: ' + error.message)
      } else {
        const { error } = await supabase.from('kliens').insert([payload])
        if (error) throw new Error('Gagal menambahkan klien: ' + error.message)
      }

      await this.fetchKliens()

      if (editingId !== null) {
        const updated = this.kliens.find((item) => item.id === editingId)
        if (updated) this.selectedKlien = updated
        this.isDrawerEditing = false
      } else {
        this.isDrawerOpen = false
        this.selectedKlien = null
        this.isDrawerEditing = false
      }
    },

    async deleteKlien(klien: Klien) {
      if (!klien.id) return
      const supabase = useSupabaseClient()
      const { error } = await supabase.from('kliens').delete().eq('id', klien.id)
      if (error) throw new Error(error.message)

      this.closeDrawer()
      await this.fetchKliens()
    },

    openDrawer(klien: Klien) {
      this.selectedKlien = klien
      this.isDrawerOpen = true
      this.isDrawerEditing = false
    },

    closeDrawer() {
      this.isDrawerOpen = false
      this.selectedKlien = null
      this.isDrawerEditing = false
    },

    openCreateDrawer() {
      this.editingKlienId = null
      this.selectedKlien = { nama: '', kontak: '', properti: '', pipeline: 'Prospek', catatan: '', foto_url: '', harga: '', order: 0 } as Klien
      this.isDrawerOpen = true
      this.isDrawerEditing = true
    },

    startEditing(klien: Klien) {
      this.editingKlienId = klien.id || null
      this.isDrawerEditing = true
    },

    cancelEditing() {
      this.isDrawerEditing = false
      if (this.editingKlienId === null) {
        this.isDrawerOpen = false
        this.selectedKlien = null
      }
    },
  },
})
