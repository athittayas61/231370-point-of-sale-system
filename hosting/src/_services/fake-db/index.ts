import { Product } from '@/store/models'
import { keyBy } from 'lodash'

export const products: Array<Product> = [
  { barcode: '1234', name: 'VueJS Training Voucher', priceSatang: 400000 },
  { barcode: '1305610001416', name: 'Amazon Water (500ml)', priceSatang: 800 },
  { barcode: '8858893901896', name: 'Tesco Water (1500ml)', priceSatang: 1200 }
]

const productsKeyed = keyBy(products, 'barcode')

export const findProductById = (id: string): Product =>
  productsKeyed[id] ??
  { barcode: id, name: 'Unknown Product', priceSatang: Number.NaN }
