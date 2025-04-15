import axios from '@/config/api'

export interface User {
  id?: string
  _id: string
  phone: string
  name: string
  email?: string
  role: string[]
  rank?: string
  point?: number
  type?: string
}

export interface Otp {
  user_id: string
}

export interface OtpResponse {
  message: string
  status: number
  data: Otp
}

interface AuthLogin {
  accessToken: string
  user: User
}

export interface UserResponse {
  message: string
  status: number
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

  async getUserByEmailOrPhone(data: { phone?: string; email?: string }) {
    const response = await axios.get<UserResponse>(
      `/auth/user?${data.phone ? `phone=${data.phone}` : `email=${data.email}`}`
    )
    return response.data
  }

  async forgotPassword(data: { phone?: string; email?: string }) {
    const response = await axios.post<OtpResponse>('/auth/forgot-password', data)
    return response.data
  }

  async verifyCode({ otp_code, id }: { otp_code: string; id: string }) {
    const response = await axios.post<OtpResponse>(`/auth/verify-otp?id=${id}`, { otp_code })
    return response.data
  }

  async resendCode(id: string) {
    const response = await axios.post<OtpResponse>(`/auth/resend-otp`, { id })
    return response.data
  }

  async resetPassword({ password, id }: { password: string; id: string }) {
    const response = await axios.post<OtpResponse>(`/auth/reset-password?id=${id}`, { password })
    return response.data
  }
}

const authService = new AuthService()
export default authService
