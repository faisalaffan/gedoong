import { defineStore } from 'pinia'
import type { Deal } from '~/types/deal'

export const useDealStore = defineStore('deal', {
  state: () => ({
    deals: [] as Deal[],
    isModalOpen: false,
    isDrawerOpen: false,
    selectedDeal: null as Deal | null,
  }),

  actions: {
    async fetchDeals() {
      const supabase = useSupabaseClient()
      const { data, error } = await supabase
        .from('deals')
        .select('*, klien:kliens(*), listing:listings(*)')
        .order('order', { ascending: true })

      if (error) {
        console.error('Error fetching deals:', error.message)
        return
      }
      if (data) {
        this.deals = data as Deal[]
        
        // Sync selectedDeal if drawer is open
        if (this.selectedDeal && this.isDrawerOpen) {
          const updated = this.deals.find((item) => item.id === this.selectedDeal?.id)
          if (updated) this.selectedDeal = { ...updated }
        }
      }
    },

    async saveNewDeal(payload: Partial<Deal>) {
      const supabase = useSupabaseClient()
      
      const logEntry = {
        timestamp: new Date().toLocaleString('id-ID'),
        action: 'Deal berhasil dibuat'
      }

      const rawPayload = {
        klien_id: payload.klien_id,
        listing_id: payload.listing_id || null,
        name: payload.name || '',
        properti: payload.properti || '',
        harga: payload.harga || 0,
        stage: payload.stage || 'Prospek',
        order: payload.order || 0,
        deskripsi: payload.deskripsi || '',
        tipe_properti: payload.tipe_properti || 'Rumah',
        tipe_transaksi: payload.tipe_transaksi || 'Jual',
        tanggal_masuk: payload.tanggal_masuk || new Date().toISOString().split('T')[0],
        target_closing: payload.target_closing || null,
        sumber_lead: payload.sumber_lead || 'Referral',
        komisi_persen: payload.komisi_persen || 2.5,
        prioritas: payload.prioritas || 'Medium',
        tags: payload.tags || [],
        activity_log: [logEntry]
      }

      const { error } = await supabase.from('deals').insert([rawPayload])

      if (error) {
        throw new Error('Gagal mencatat deal baru: ' + error.message)
      }
      await this.fetchDeals()
      this.closeModal()
    },

    async updateDealStageAndOrder(stageLabel: string, dealsList: Deal[]) {
      const supabase = useSupabaseClient()
      
      const promises = dealsList.map((deal, index) => {
        if (!deal.id) return Promise.resolve()

        const updates: any = { stage: stageLabel, order: index }

        // If the stage actually changed, log it to activity_log!
        if (deal.stage !== stageLabel) {
          const logEntry = {
            timestamp: new Date().toLocaleString('id-ID'),
            action: `Pindah stage: ${deal.stage} ➔ ${stageLabel}`
          }
          updates.activity_log = [...(deal.activity_log || []), logEntry]
        }

        return supabase
          .from('deals')
          .update(updates)
          .eq('id', deal.id)
      })

      const results = await Promise.all(promises)
      
      for (const res of results) {
        if (res && 'error' in res && res.error) {
          console.error('Error in batch order update on deals:', res.error.message)
        }
      }

      await this.fetchDeals()
    },

    async updateDeal(payload: Partial<Deal>, id: number) {
      const supabase = useSupabaseClient()

      // Find old deal to append log entries
      const oldDeal = this.deals.find(d => d.id === id)
      const logs = oldDeal ? [...(oldDeal.activity_log || [])] : []

      if (oldDeal) {
        if (payload.stage && payload.stage !== oldDeal.stage) {
          logs.push({
            timestamp: new Date().toLocaleString('id-ID'),
            action: `Stage diubah: ${oldDeal.stage} ➔ ${payload.stage}`
          })
        }
        if (payload.prioritas && payload.prioritas !== oldDeal.prioritas) {
          logs.push({
            timestamp: new Date().toLocaleString('id-ID'),
            action: `Prioritas diubah: ${oldDeal.prioritas} ➔ ${payload.prioritas}`
          })
        }
        if (payload.harga !== undefined && Number(payload.harga) !== Number(oldDeal.harga)) {
          logs.push({
            timestamp: new Date().toLocaleString('id-ID'),
            action: `Nilai deal diperbarui ke Rp ${Number(payload.harga).toLocaleString('id-ID')}`
          })
        }
      }

      const rawPayload = {
        klien_id: payload.klien_id,
        listing_id: payload.listing_id || null,
        name: payload.name || '',
        properti: payload.properti || '',
        harga: payload.harga || 0,
        stage: payload.stage,
        order: payload.order,
        deskripsi: payload.deskripsi || '',
        tipe_properti: payload.tipe_properti,
        tipe_transaksi: payload.tipe_transaksi,
        tanggal_masuk: payload.tanggal_masuk,
        target_closing: payload.target_closing || null,
        sumber_lead: payload.sumber_lead,
        komisi_persen: payload.komisi_persen || 2.5,
        prioritas: payload.prioritas || 'Medium',
        tags: payload.tags || [],
        activity_log: logs
      }

      const { error } = await supabase.from('deals').update(rawPayload).eq('id', id)

      if (error) {
        throw new Error('Gagal memperbarui deal: ' + error.message)
      }
      await this.fetchDeals()
      this.closeDrawer()
    },

    async deleteDeal(id: number) {
      const supabase = useSupabaseClient()
      const { error } = await supabase.from('deals').delete().eq('id', id)

      if (error) {
        throw new Error('Gagal menghapus deal: ' + error.message)
      }
      await this.fetchDeals()
      this.closeDrawer()
    },

    openModal() {
      this.isModalOpen = true
    },

    closeModal() {
      this.isModalOpen = false
    },

    openDrawer(deal: Deal) {
      this.selectedDeal = { ...deal, deskripsi: deal.deskripsi || '' }
      this.isDrawerOpen = true
    },

    closeDrawer() {
      this.isDrawerOpen = false
      this.selectedDeal = null
    },
  },
})
