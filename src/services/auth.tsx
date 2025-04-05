import axios from '@/config/api'
export interface AuthSignUp {
  phone: string
  name: string
}

class AuthService {
  async signUp(data: AuthSignUp) {
    const response = await axios.post('/auth/signup', data)
    return response
  }
}

const authService = new AuthService()
export default authService
