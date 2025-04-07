import axios from '@/config/api'

export interface User {
  id: string
  phone: string
  name: string
  email?: string
  role: string[]
  rank?: string
  point?: number
  type?: string
}

interface AuthLogin {
  accessToken: string
  user: User
}

export interface UserResponse {
  message: string
  data: User
}

export interface AuthSignUp {
  phone: string
  name: string
}

class AuthService {
  async signUp(data: AuthSignUp) {
    const response = await axios.post('/auth/signup', data)
    return response
  }
  async login(data: { phone: string; password: string }) {
    const response = await axios.post<AuthLogin>('/auth/login', data)
    return response
  }

  async loginWithEmail(data: { email: string; password: string }) {
    const response = await axios.post<AuthLogin>('/auth/login', data)
    return response
  }

  async getUser(accessToken: string) {
    const response = await axios.get<UserResponse>('/auth/me', {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
    return response.data
  }
}

const authService = new AuthService()
export default authService
