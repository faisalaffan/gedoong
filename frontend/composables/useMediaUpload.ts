import { ref } from 'vue'
import type { ImageFileItem } from '~/types/listing'

export function useMediaUpload() {
  const imageFiles = ref<ImageFileItem[]>([])
  const floorPlanFile = ref<File | null>(null)
  const floorPlanPreview = ref<string | null>(null)
  const videoUrl = ref('')
  const isUploading = ref(false)
  const uploadStatusMsg = ref('')

  function addImages(files: FileList, showToast: (msg: string, type: 'success' | 'error') => void) {
    for (const file of Array.from(files)) {
      if (!file.type.startsWith('image/')) {
        showToast('Format file harus berupa gambar!', 'error')
        continue
      }
      imageFiles.value.push({
        id: `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        file,
        url: URL.createObjectURL(file),
      })
    }
  }

  function removeImage(index: number) {
    imageFiles.value.splice(index, 1)
  }

  function setFloorPlan(file: File, showToast: (msg: string, type: 'success' | 'error') => void) {
    if (!file.type.startsWith('image/')) {
      showToast('Format file harus berupa gambar!', 'error')
      return
    }
    floorPlanFile.value = file
    floorPlanPreview.value = URL.createObjectURL(file)
  }

  function removeFloorPlan() {
    floorPlanFile.value = null
    floorPlanPreview.value = null
  }

  async function uploadAllMedia(supabase: any): Promise<{ imageUrls: string[]; floorPlanUrl: string }> {
    const finalImageUrls: string[] = []
    const filesToUpload = imageFiles.value.filter((img) => img.file)
    let currentUploadCount = 1

    for (const img of imageFiles.value) {
      if (img.file) {
        uploadStatusMsg.value = `Mengupload foto ${currentUploadCount} dari ${filesToUpload.length}...`
        const cleanFileName = img.file.name.replace(/[^a-zA-Z0-9.]/g, '')
        const filePath = `${Date.now()}-${cleanFileName}`

        const { error: uploadError } = await supabase.storage
          .from('listings')
          .upload(filePath, img.file)

        if (uploadError) {
          throw new Error(`Gagal mengupload foto ke-${currentUploadCount}: ${uploadError.message}`)
        }

        const { data: publicUrlData } = supabase.storage.from('listings').getPublicUrl(filePath)
        if (!publicUrlData?.publicUrl) {
          throw new Error(`Gagal mendapatkan URL foto ke-${currentUploadCount}`)
        }

        finalImageUrls.push(publicUrlData.publicUrl)
        currentUploadCount++
      } else {
        finalImageUrls.push(img.url)
      }
    }

    let finalFloorPlanUrl = floorPlanPreview.value || ''
    if (floorPlanFile.value) {
      uploadStatusMsg.value = 'Mengupload Denah Lantai...'
      const cleanFileName = floorPlanFile.value.name.replace(/[^a-zA-Z0-9.]/g, '')
      const filePath = `floorplan-${Date.now()}-${cleanFileName}`

      const { error: fpUploadError } = await supabase.storage
        .from('listings')
        .upload(filePath, floorPlanFile.value)

      if (fpUploadError) {
        throw new Error(`Gagal mengupload Denah Lantai: ${fpUploadError.message}`)
      }

      const { data: fpPublicUrlData } = supabase.storage.from('listings').getPublicUrl(filePath)
      if (fpPublicUrlData?.publicUrl) {
        finalFloorPlanUrl = fpPublicUrlData.publicUrl
      }
    }

    return { imageUrls: finalImageUrls, floorPlanUrl: finalFloorPlanUrl }
  }

  function populateFromListing(listing: any) {
    imageFiles.value = (listing.image_urls || []).map((url: string, index: number) => ({
      id: `existing-${index}-${Date.now()}`,
      url,
    }))
    floorPlanPreview.value = listing.floor_plan_url || null
    floorPlanFile.value = null
    videoUrl.value = listing.video_url || ''
  }

  function resetMedia() {
    imageFiles.value = []
    floorPlanFile.value = null
    floorPlanPreview.value = null
    videoUrl.value = ''
    isUploading.value = false
    uploadStatusMsg.value = ''
  }

  return {
    imageFiles,
    floorPlanFile,
    floorPlanPreview,
    videoUrl,
    isUploading,
    uploadStatusMsg,
    addImages,
    removeImage,
    setFloorPlan,
    removeFloorPlan,
    uploadAllMedia,
    populateFromListing,
    resetMedia,
  }
}
