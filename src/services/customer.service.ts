import axios from '@/config/api'

interface User {
  name: string
  phone: string
  role: string[]
  active: boolean
}

interface EditedBy {
  _id: string
  name: string
}

export interface CustomerEditHistory {
  edited_at: string
  edited_by: EditedBy
  reason: string
}

export interface CustomerInfo {
  _id: string
  rank: string
  point: number
  phone: string
  name: string
}

// // Đây là kiểu dữ liệu gốc của khách hàng lưu trong CSDL
export interface Customer {
  userId: string
  rank: string
  point: number
  note: string
  created_at: string
  edit_history: CustomerEditHistory[]
  user: User
}

export interface ResponsePagination<T> {
  message: string
  status: number
  data: {
    total: number
    page: number
    limit: number
    totalPages: number
    data: T[]
  }
}

export interface CustomerCreateData {
  name?: string
  phone: string
  note?: string
  reason?: string
}

/*
  định nghĩa thêm một interface cho kết quả tìm kiếm khách hàng, 
  bao gồm các thuộc tính:
  - _id: id của user (đã có trong document mongoose)
  - name, phone: lấy từ user
  - customer: chứa thông tin của khách hàng (rank, point, note, …)
*/
export interface SearchCustomerData {
  name: string
  phone: string
  customer: {
    _id: string
    rank: string
    point: number
    note: string
    created_at: string
    edit_history: CustomerEditHistory[]
  }
}

export interface Customer {
  _id: string
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

interface CustomerSingleResponse {
  message: string
  status: number
  data: Customer
}

class CustomerService {
  async getCustomers(accessToken: string, page?: number, limit?: number) {
    const response = await axios.get<ResponsePagination<Customer>>(`/customer?page=${page}&limit=${limit}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
    return response.data
  }

  async getCustomerDetail({ accessToken, id }: { accessToken: string; id: string }) {
    const response = await axios.get<{ message: string; customer: Customer }>(`/customer/${id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
    return response.data
  }

  async createCustomer({ accessToken, data }: { accessToken: string; data: CustomerCreateData }) {
    const response = await axios.post<CustomerCreateData>('/customer', data, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
    return response.data
  }

  async updateCustomer({ accessToken, id, data }: { accessToken: string; id: string; data: CustomerCreateData }) {
    const response = await axios.patch<CustomerCreateData>(`/customer/${id}`, data, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
    return response.data
  }

  async deleteCustomer({ accessToken, id }: { accessToken: string; id: string }) {
    const response = await axios.delete<string>(`/customer/${id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
    return response.data
  }

  // Hàm searchCustomer trả về dữ liệu với kiểu SearchCustomerData
  async searchCustomer(phone: string) {
    const response = await axios.get<CustomerSingleResponse>(`/customer/search?phone=${phone}`)
    return response.data
  }
}

const customerService = new CustomerService()
export default customerService
