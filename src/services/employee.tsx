import axios from '@/config/api'

interface User {
  id: string
  name: string
  email: string
  phone: string
  role: string[]
  active: boolean
}

export interface Employee {
  type: string
  disable: boolean
  image_url: string
  created_at: string
  delete: boolean
  edit_history: []
  user: User
}

export interface EmployeeCreateData {
  name: string
  email: string
  phone: string
  role: string[]
  type: string
  image_url?: string
  created_by?: string
  reason?: string
  disable?: boolean
  edited_by?: string
  active?: boolean
}

interface EmployeeDeleteData {
  deleted_by: string
  reason?: string
}

interface EmployeeResponse {
  message: string
  data: Employee[]
}
class EmployeeService {
  async getEmployees() {
    const response = await axios.get<EmployeeResponse>('/employee')
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

  async updateEmployee({ accessToken, data }: { accessToken: string; data: EmployeeCreateData }) {
    const response = await axios.patch<EmployeeCreateData>(`/employee/`, data, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
    return response.data
  }

  async deleteEmployee(id: string, data: EmployeeDeleteData) {
    const formData = new FormData()
    formData.append('deleted_by', data.deleted_by)
    formData.append('reason', data.reason || 'Xóa bởi admin')

    console.log('FormData sent to BE (delete):', Object.fromEntries(formData))
    const response = await axios.put(`/employee/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return response.data
  }
}

const employeeService = new EmployeeService()
export default employeeService
