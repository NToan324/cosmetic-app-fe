import axios from '@/config/api'

export interface Brand {
  _id: string
  name: string
  description: string
  country: string
  logo_url: string
  created_by: string
}

interface BrandResponse {
  message: string
  status: number
  data: Brand[]
}

class BrandService {
  async getAllBrands() {
    const response = await axios.get<BrandResponse>('/brand')
    return response.data
  }
}
const brandService = new BrandService()
export default brandService
