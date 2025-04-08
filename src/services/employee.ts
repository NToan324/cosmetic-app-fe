import axios from '@/config/api'

interface User {
  name: string
  email: string
  phone: string
  role: string[]
  active: boolean
}

export interface EmployeeEditHistory {
  edited_at: string
  edited_by: Employee
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

interface EmployeeResponse {
  message: string
  data: Employee[]
}
class EmployeeService {
  async getEmployees(accessToken: string) {
    const response = await axios.get<EmployeeResponse>('/employee', {
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
