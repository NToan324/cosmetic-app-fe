import axios from 'axios'
import { toast } from 'react-toastify'

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 20000
})

instance.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.data) {
      const status = error.response.status
      const errorMessage = error.response.data.error?.message || 'An error occurred'

      if (status === 401 || status === 403) {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('ordered_info_user')
        localStorage.removeItem('user')
        localStorage.removeItem('ordered_temp_product')

        toast.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.')
      }

      return Promise.reject(new Error(errorMessage))
    }

    return Promise.reject(new Error('Network error'))
  }
)

export default instance
