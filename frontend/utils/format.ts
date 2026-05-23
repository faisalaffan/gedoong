/**
 * Format angka ke Rupiah (IDR) menggunakan Intl.NumberFormat
 */
export function formatRupiah(value: number | null | undefined): string {
  if (value === undefined || value === null) return 'Rp -'
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(value)
}

/**
 * Mengembalikan CSS class berdasarkan status listing
 */
export function statusClass(status: string): string {
  if (status === 'Aktif') return 'status-aktif'
  if (status === 'Terjual') return 'status-terjual'
  if (status === 'Draft') return 'status-draft'
  return ''
}
