import axios from '@/config/api'

interface ProductResponse {
  message: string
  status: number
  data: Product[]
}

interface edit_history {
  edited_at: Date
  edited_by: string
  reason: string
}

export interface Product {
  _id: string
  name: string
  description: string
  price: number
  discount_price?: number
  stock_quantity: number
  units: string
  category_id: string
  brand_id: string
  image_url: string
  production_date: string
  expiration_date: string
  release_date: string
  discontinued_date?: string | null
  disable: boolean
  created_by: string
  edit_history?: edit_history[]
  createdAt: string
  updatedAt: string
}

class ProductService {
  async getAllProducts(categoryId?: string, price?: string) {
    const url = categoryId
      ? `/product?category=${categoryId}${price ? `&price=${price}` : ''}`
      : `/product${price ? `?price=${price}` : ''}`
    const response = await axios.get<ProductResponse>(url)
    return response.data
  }
}

const productService = new ProductService()
export default productService
