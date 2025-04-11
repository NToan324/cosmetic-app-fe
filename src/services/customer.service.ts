import axios from '@/config/api'

export interface Customer {
  id: string
  name: string
  phone: string
  role: string[]
  createdAt: string
  customer: CustomerDetails
}

interface CustomerResponsePagination {
  message: string
  status: number
  data: {
    total: number
    page: number
    limit: number
    totalPages: number
    data: Customer[]
  }
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

interface CustomerSingleResponse {
  message: string
  status: number
  data: Customer
}

class CustomerService {
  async getCustomers(accessToken: string, page?: number, limit?: number) {
    const response = await axios.get<CustomerResponsePagination>(`/customer?page=${page}&limit=${limit}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
    return response.data
  }

  async searchCustomer(phone: string) {
    const response = await axios.get<CustomerSingleResponse>(`/customer/search?phone=${phone}`)
    return response.data
  }
}

const customerService = new CustomerService()
export default customerService
