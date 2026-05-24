import { defineStore } from 'pinia'
import type { Komisi } from '~/types/komisi'

export const useKomisiStore = defineStore('komisi', {
  state: () => ({
    komisiList: [] as Komisi[],
    selectedKomisi: null as Komisi | null,
    isDrawerOpen: false,
    isDrawerEditing: false,
    editingKomisiId: null as number | null,
    search: '',
    filterStatus: '',
  }),

  getters: {
    filteredKomisiList(state): Komisi[] {
      return state.komisiList.filter((item) => {
        const q = state.search.toLowerCase()
        const matchesSearch =
          item.properti.toLowerCase().includes(q) ||
          (item.klien && item.klien.nama.toLowerCase().includes(q)) ||
          (item.catatan && item.catatan.toLowerCase().includes(q))
        
        const matchesStatus = !state.filterStatus || item.status === state.filterStatus
        return matchesSearch && matchesStatus
      })
    },

    totalKomisi(state): number {
      // Total komisi is only for closed/closing deals (status === 'Dibayar' or 'Diproses')
      return state.komisiList
        .filter((k) => k.status === 'Dibayar' || k.status === 'Diproses')
        .reduce((acc, curr) => acc + curr.komisi, 0)
    },

    totalPending(state): number {
      return state.komisiList
        .filter((k) => k.status === 'Pending')
        .reduce((acc, curr) => acc + curr.komisi, 0)
    },

    totalDibayar(state): number {
      return state.komisiList
        .filter((k) => k.status === 'Dibayar')
        .reduce((acc, curr) => acc + curr.komisi, 0)
    },
  },

  actions: {
    async fetchKomisiList() {
      const supabase = useSupabaseClient<any>()
      const { data, error } = await supabase
        .from('komisi')
        .select('*, klien:kliens(*), deal:deals(*)')
        .order('id', { ascending: true })

      if (error) {
        console.error('Error fetching commission data:', error.message)
        return
      }
      if (data) {
        this.komisiList = data as Komisi[]
        // Sync selectedKomisi if drawer is open
        if (this.selectedKomisi && this.isDrawerOpen) {
          const updated = this.komisiList.find((item) => item.id === this.selectedKomisi?.id)
          if (updated) this.selectedKomisi = updated
        }
      }
    },

    async saveKomisi(payload: Partial<Komisi>, editingId: number | null) {
      const supabase = useSupabaseClient<any>()

      const rawPayload = {
        properti: payload.properti || '',
        komisi: Number(payload.komisi) || 0,
        tanggal: payload.tanggal || new Date().toISOString().substring(0, 10),
        status: payload.status || 'Pending',
        klien_id: payload.klien_id || null,
        deal_id: payload.deal_id || null,
        komisi_persen: Number(payload.komisi_persen) || 0,
        tanggal_deal: payload.tanggal_deal || null,
        tanggal_bayar: payload.tanggal_bayar || null,
        metode_bayar: payload.metode_bayar || 'Transfer',
        catatan: payload.catatan || '',
      }

      if (editingId !== null) {
        const { error } = await supabase.from('komisi').update(rawPayload).eq('id', editingId)
        if (error) throw new Error('Gagal mengupdate komisi: ' + error.message)
      } else {
        const { error } = await supabase.from('komisi').insert([rawPayload])
        if (error) throw new Error('Gagal menambahkan komisi: ' + error.message)
      }

      await this.fetchKomisiList()

      if (editingId !== null) {
        const updated = this.komisiList.find((item) => item.id === editingId)
        if (updated) this.selectedKomisi = updated
        this.isDrawerEditing = false
      } else {
        this.isDrawerOpen = false
        this.selectedKomisi = null
        this.isDrawerEditing = false
      }
    },

    async deleteKomisi(komisi: Komisi) {
      if (!komisi.id) return
      const supabase = useSupabaseClient<any>()
      const { error } = await supabase.from('komisi').delete().eq('id', komisi.id)
      if (error) throw new Error(error.message)

      this.closeDrawer()
      await this.fetchKomisiList()
    },

    openDrawer(komisi: Komisi) {
      this.selectedKomisi = {
        ...komisi
      }
      this.isDrawerOpen = true
      this.isDrawerEditing = false
    },

    closeDrawer() {
      this.isDrawerOpen = false
      this.selectedKomisi = null
      this.isDrawerEditing = false
    },

    openCreateDrawer() {
      this.editingKomisiId = null
      const todayStr = new Date().toISOString().substring(0, 10)
      this.selectedKomisi = {
        properti: '',
        komisi: 0,
        tanggal: todayStr,
        status: 'Pending',
        klien_id: undefined,
        deal_id: undefined,
        komisi_persen: 0,
        tanggal_deal: todayStr,
        tanggal_bayar: '',
        metode_bayar: 'Transfer',
        catatan: ''
      } as Komisi
      this.isDrawerOpen = true
      this.isDrawerEditing = true
    },

    startEditing(komisi: Komisi) {
      this.editingKomisiId = komisi.id || null
      this.isDrawerEditing = true
    },

    cancelEditing() {
      this.isDrawerEditing = false
      if (this.editingKomisiId === null) {
        this.isDrawerOpen = false
        this.selectedKomisi = null
      }
    },
  },
})
