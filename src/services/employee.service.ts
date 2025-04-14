import axios from '@/config/api'

interface User {
  name: string
  email: string
  phone: string
  role: string[]
  active: boolean
}

interface EdittedBy {
  _id: string
  name: string
}

export interface EmployeeEditHistory {
  edited_at: string
  edited_by: EdittedBy
  reason: string
}

export interface Employee {
  userId: string
  type: string
  disable: boolean
  image_url: string
  created_at: string
  deleted: boolean
  edit_history: EmployeeEditHistory[]
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

export interface EmployeeCreateData {
  userId: string
  name: string
  email: string
  phone: string
  role: string[]
  type: string
  image_url?: string
  created_by?: string
  reason?: string
  edited_by?: string
  active?: boolean
  disable?: boolean
}

// interface EmployeeResponse {
//   message: string
//   data: Employee[]
// }
class EmployeeService {
  async getEmployees(accessToken: string, page?: number, limit?: number) {
    const response = await axios.get<ResponsePagination<Employee>>(`/employee?page=${page}&limit${limit}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
    return response.data
  }

  async getEmployeeDetail({ accessToken, id }: { accessToken: string; id: string }) {
    const response = await axios.get<{ message: string; employee: Employee }>(`/employee/${id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
    return response.data
  }

  async createEmployee({ accessToken, data }: { accessToken: string; data: EmployeeCreateData }) {
    const response = await axios.post<EmployeeCreateData>('/employee', data, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
    return response.data
  }

  async updateEmployee({ accessToken, id, data }: { accessToken: string; id: string; data: EmployeeCreateData }) {
    const response = await axios.patch<EmployeeCreateData>(`/employee/${id}`, data, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
    return response.data
  }

  async deleteEmployee({ accessToken, id }: { accessToken: string; id: string }) {
    const response = await axios.delete<string>(`/employee/${id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
    return response.data
  }
}

const employeeService = new EmployeeService()
export default employeeService
