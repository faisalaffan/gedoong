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
        .select('*')
        .order('order', { ascending: true })

      if (error) {
        console.error('Error fetching deals:', error.message)
        return
      }
      if (data) {
        this.deals = data as Deal[]
        // Sync selectedDeal if drawer is open
        if (this.selectedDeal && this.isDrawerOpen) {
          const updated = data.find((item: any) => item.id === this.selectedDeal?.id)
          if (updated) this.selectedDeal = updated as Deal
        }
      }
    },

    async saveNewDeal(payload: Partial<Deal>) {
      const supabase = useSupabaseClient()
      const { error } = await supabase.from('deals').insert([payload])

      if (error) {
        throw new Error('Gagal mencatat deal baru: ' + error.message)
      }
      await this.fetchDeals()
      this.closeModal()
    },

    async updateDealStageAndOrder(stageLabel: string, dealsList: Deal[]) {
      const supabase = useSupabaseClient()
      
      // Update each deal in the list with its new stage and order index
      const promises = dealsList.map((deal, index) => {
        if (!deal.id) return Promise.resolve()
        return supabase
          .from('deals')
          .update({ stage: stageLabel, order: index })
          .eq('id', deal.id)
      })

      const results = await Promise.all(promises)
      
      // Check if any updates encountered errors
      for (const res of results) {
        if (res && 'error' in res && res.error) {
          console.error('Error in batch order update:', res.error.message)
        }
      }

      await this.fetchDeals()
    },

    async updateDeal(payload: Partial<Deal>, id: number) {
      const supabase = useSupabaseClient()
      const { error } = await supabase.from('deals').update(payload).eq('id', id)

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
