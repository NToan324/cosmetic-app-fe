import axios from 'axios'

const instance = axios.create({
  baseURL: 'http://localhost:8080',
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
  (response) => {
    // Handle response data
    return response
  },
  (error) => {
    // Handle response error
    return Promise.reject(error)
  }
)

export default instance
