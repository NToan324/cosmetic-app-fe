import axios from '@/config/api'

export interface Customer {
  id: string
  name: string
  phone: string
  role: string[]
  createdAt: string
  customer: CustomerDetails
}

interface CustomerDetails {
  rank: string
  point: number
}

export interface CustomerResponse {
  message: string
  status: number
  data: Customer[]
}

class CustomerService {
  async getCustomer(accessToken: string) {
    const response = await axios.get<CustomerResponse>('/customer', {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
    return response.data
  }
}

const customerService = new CustomerService()
export default customerService
