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
        .from('kliens') // Fetch directly from unified 'kliens' table!
        .select('*')
        .order('order', { ascending: true })

      if (error) {
        console.error('Error fetching deals from kliens:', error.message)
        return
      }
      if (data) {
        // Map Kliens schema to the Deal model expected by pipeline.vue template
        this.deals = data.map((item: any) => ({
          ...item,
          name: item.nama, // pipeline.vue expects .name
          stage: item.pipeline, // pipeline.vue expects .stage
          deskripsi: item.catatan || '' // pipeline.vue expects .deskripsi
        })) as Deal[]
        
        // Sync selectedDeal if drawer is open
        if (this.selectedDeal && this.isDrawerOpen) {
          const updated = this.deals.find((item: any) => item.id === this.selectedDeal?.id)
          if (updated) this.selectedDeal = updated as Deal
        }
      }
    },

    async saveNewDeal(payload: Partial<Deal>) {
      const supabase = useSupabaseClient()
      
      // Map properties to fit the Kliens table column schema
      const mappedPayload = {
        nama: payload.name || payload.nama || '',
        kontak: '0812-3456-7890', // Default fallback contact number
        properti: payload.properti || '',
        harga: payload.harga || '',
        pipeline: payload.stage || payload.pipeline || 'Prospek',
        order: payload.order || 0,
        catatan: payload.deskripsi || payload.catatan || ''
      }

      const { error } = await supabase.from('kliens').insert([mappedPayload])

      if (error) {
        throw new Error('Gagal mencatat deal baru ke klien: ' + error.message)
      }
      await this.fetchDeals()
      this.closeModal()
    },

    async updateDealStageAndOrder(stageLabel: string, dealsList: Deal[]) {
      const supabase = useSupabaseClient()
      
      // Update each client record in the list with its new stage and order index
      const promises = dealsList.map((deal, index) => {
        if (!deal.id) return Promise.resolve()
        return supabase
          .from('kliens') // Target 'kliens' table!
          .update({ pipeline: stageLabel, order: index }) // pipeline replaces stage
          .eq('id', deal.id)
      })

      const results = await Promise.all(promises)
      
      // Check if any updates encountered errors
      for (const res of results) {
        if (res && 'error' in res && res.error) {
          console.error('Error in batch order update on kliens:', res.error.message)
        }
      }

      await this.fetchDeals()
    },

    async updateDeal(payload: Partial<Deal>, id: number) {
      const supabase = useSupabaseClient()

      // Map payload to Kliens columns
      const mappedPayload = {
        nama: payload.name || payload.nama || '',
        properti: payload.properti || '',
        harga: payload.harga || '',
        pipeline: payload.stage || payload.pipeline || 'Prospek',
        order: payload.order || 0,
        catatan: payload.deskripsi || payload.catatan || ''
      }

      const { error } = await supabase.from('kliens').update(mappedPayload).eq('id', id)

      if (error) {
        throw new Error('Gagal memperbarui deal klien: ' + error.message)
      }
      await this.fetchDeals()
      this.closeDrawer()
    },

    async deleteDeal(id: number) {
      const supabase = useSupabaseClient()
      const { error } = await supabase.from('kliens').delete().eq('id', id)

      if (error) {
        throw new Error('Gagal menghapus deal klien: ' + error.message)
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
