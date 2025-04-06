import axios from '@/config/api';

interface EmployeeCreateData {
  name: string;
  email: string;
  phone: string;
  role: string[];
  type: 'PARTTIME' | 'FULLTIME';
  image_url?: string;
  created_by?: string;
  reason: string;
}

interface EmployeeUpdateData {
  name?: string;
  email?: string;
  phone?: string;
  role?: string[];
  type?: 'PARTTIME' | 'FULLTIME';
  image_url?: string;
  disable?: boolean;
  edited_by: string;
  reason: string;
}

interface EmployeeDeleteData {
  deleted_by: string;
  reason?: string;
}

class EmployeeService {
  async getEmployees() {
    const response = await axios.get('/employee');
    return response.data;
  }

  async createEmployee(data: EmployeeCreateData) {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('email', data.email);
    formData.append('phone', data.phone);
    data.role.forEach((role) => formData.append('role', role)); // Gửi từng phần tử với key 'role'
    formData.append('type', data.type);
    if (data.image_url) formData.append('image_url', data.image_url);
    if (data.created_by) formData.append('created_by', data.created_by);
    formData.append('reason', data.reason);
  
    console.log('FormData sent to BE (create):', Object.fromEntries(formData));
    const response = await axios.post('/employee', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  }
  
  async updateEmployee(id: string, data: EmployeeUpdateData) {
    const formData = new FormData();
    if (data.name) formData.append('name', data.name);
    if (data.email) formData.append('email', data.email);
    if (data.phone) formData.append('phone', data.phone);
    if (data.role) data.role.forEach((role) => formData.append('role', role)); // Gửi từng phần tử với key 'role'
    if (data.type) formData.append('type', data.type);
    if (data.image_url) formData.append('image_url', data.image_url);
    if (data.disable !== undefined) formData.append('disable', data.disable.toString());
    formData.append('edited_by', data.edited_by);
    formData.append('reason', data.reason);
  
    console.log('FormData sent to BE (update):', Object.fromEntries(formData));
    const response = await axios.put(`/employee/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  }
  

  async deleteEmployee(id: string, data: EmployeeDeleteData) {
    const formData = new FormData();
    formData.append('deleted_by', data.deleted_by);
    formData.append('reason', data.reason || 'Xóa bởi admin');

    console.log('FormData sent to BE (delete):', Object.fromEntries(formData));
    const response = await axios.put(`/employee/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  }
}

const employeeService = new EmployeeService();
export default employeeService;