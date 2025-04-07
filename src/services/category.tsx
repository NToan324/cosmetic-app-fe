import axios from '@/config/api'

export interface CategoryResponse {
  message: string
  status: number
  data: Category[]
}

export interface Category {
  _id: string
  name: string
  description: string
  createdAt: string
  updatedAt: string
}

class CategoryService {
  async getAllCategories() {
    const response = await axios.get<CategoryResponse>('/category/')
    return response.data
  }

  async getCategoryById(id: string) {
    const response = await axios.get<CategoryResponse>(`/category/${id}`)
    return response.data
  }
}
const categoryService = new CategoryService()
export default categoryService
