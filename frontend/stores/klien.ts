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
          (item.catatan && item.catatan.toLowerCase().includes(q)) ||
          (item.email && item.email.toLowerCase().includes(q)) ||
          (item.sumber_klien && item.sumber_klien.toLowerCase().includes(q)) ||
          (item.tipe_klien && item.tipe_klien.toLowerCase().includes(q))
        
        const matchesPipeline = !state.filterPipeline || item.pipeline === state.filterPipeline
        return matchesSearch && matchesPipeline
      })
    },
  },

  actions: {
    async fetchKliens() {
      const supabase = useSupabaseClient<any>()
      const { data, error } = await supabase
        .from('kliens')
        .select('*')
        .order('id', { ascending: true })

      if (error) {
        console.error('Error fetching clients:', error.message)
        return
      }
      if (data) {
        this.kliens = (data as Klien[]).map(item => ({
          ...item,
          catatan_aktivitas: item.catatan_aktivitas || []
        }))
        // Sync selectedKlien if drawer is open
        if (this.selectedKlien && this.isDrawerOpen) {
          const updated = this.kliens.find((item) => item.id === this.selectedKlien?.id)
          if (updated) this.selectedKlien = updated
        }
      }
    },

    async saveKlien(payload: Partial<Klien>, editingId: number | null) {
      const supabase = useSupabaseClient<any>()

      const rawPayload = {
        nama: payload.nama || '',
        kontak: payload.kontak || '',
        properti: payload.properti || '',
        pipeline: payload.pipeline || 'Prospek',
        catatan: payload.catatan || '',
        foto_url: payload.foto_url || '',
        harga: payload.harga || '',
        order: payload.order || 0,
        email: payload.email || '',
        sumber_klien: payload.sumber_klien || 'Referral',
        tipe_klien: payload.tipe_klien || 'Pembeli',
        catatan_aktivitas: payload.catatan_aktivitas || []
      }

      if (editingId !== null) {
        const { error } = await supabase.from('kliens').update(rawPayload).eq('id', editingId)
        if (error) throw new Error('Gagal mengupdate klien: ' + error.message)

        // Log activity to Supabase
        try {
          await supabase.from('activities').insert([{ description: `Memperbarui data klien "${rawPayload.nama}".` }])
        } catch (err) {
          console.error('Failed to log activity:', err)
        }
      } else {
        const { error } = await supabase.from('kliens').insert([rawPayload])
        if (error) throw new Error('Gagal menambahkan klien: ' + error.message)

        // Log activity to Supabase
        try {
          await supabase.from('activities').insert([{ description: `Menambahkan klien baru "${rawPayload.nama}" dengan kontak ${rawPayload.kontak}.` }])
        } catch (err) {
          console.error('Failed to log activity:', err)
        }
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
      const supabase = useSupabaseClient<any>()
      const { error } = await supabase.from('kliens').delete().eq('id', klien.id)
      if (error) throw new Error(error.message)

      // Log activity to Supabase
      try {
        await supabase.from('activities').insert([{ description: `Menghapus data klien "${klien.nama}".` }])
      } catch (err) {
        console.error('Failed to log activity:', err)
      }

      this.closeDrawer()
      await this.fetchKliens()
    },

    openDrawer(klien: Klien) {
      this.selectedKlien = {
        ...klien,
        catatan_aktivitas: klien.catatan_aktivitas || []
      }
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
      this.selectedKlien = {
        nama: '',
        kontak: '',
        properti: '',
        pipeline: 'Prospek',
        catatan: '',
        foto_url: '',
        harga: '',
        order: 0,
        email: '',
        sumber_klien: 'Referral',
        tipe_klien: 'Pembeli',
        catatan_aktivitas: []
      } as Klien
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
