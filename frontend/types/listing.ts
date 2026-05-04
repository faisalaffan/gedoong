export interface Listing {
  image: string
  title: string
  price: string
  location: string
  type: 'Jual' | 'Sewa'
  beds: number
  baths: number
  area: number
  isNew?: boolean
}
