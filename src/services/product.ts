import axios from '@/config/api'

interface ProductResponsePagination {
  message: string
  status: number
  data: {
    total: number
    page: number
    limit: number
    totalPages: number
    data: Product[]
  }
}

interface ProductResponse {
  message: string
  status: number
  data: Product[]
}

interface ProductResponseSingle {
  message: string
  status: number
  data: Product
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
  code: string
  price: number
  discount_price: number
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
  async getAllProducts(categoryId?: string, price?: string, page?: number, limit?: number) {
    const params = new URLSearchParams()

    if (categoryId) params.append('category', categoryId)
    if (price) params.append('price', price)
    if (page) params.append('page', page.toString())
    if (limit) params.append('limit', limit.toString())

    const url = `/product?${params.toString()}`
    const response = await axios.get<ProductResponsePagination>(url)
    return response.data
  }

  async getProduct(id: string) {
    const response = await axios.get<ProductResponseSingle>(`/product/${id}`)
    return response.data
  }

  async searchProduct(code: string) {
    const response = await axios.get<ProductResponse>(`/product/search?code=${code}`)
    return response.data
  }

  async updateProduct({ accessToken, id, product }: { accessToken: string; id: string; product: Product }) {
    const response = await axios.put<ProductResponse>(`/product/${id}`, product, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
    return response.data
  }
  async createProduct({ accessToken, product }: { accessToken: string; product: Product }) {
    const response = await axios.post<ProductResponse>(`/product`, product, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
    return response.data
  }
  async deleteProduct({ accessToken, id }: { accessToken: string; id: string }) {
    const response = await axios.delete<ProductResponse>(`/product/${id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
    return response.data
  }
}

const productService = new ProductService()
export default productService
