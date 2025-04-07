import axios from 'axios'

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 20000
})

instance.interceptors.request.use(
  (config) => {
    // Add any request headers or configurations here
    return config
  },
  (error) => {
    // Handle request error
    return Promise.reject(error)
  }
)

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.data) {
      const errorMessage = error.response.data.error?.message || 'An error occurred'
      return Promise.reject(new Error(errorMessage))
    }
    return Promise.reject(new Error('Network error'))
  }
)

export default instance
