import axios from '@/config/api'

export interface Shift {
  _id: string
  employee_id: string
  opening_cash: number
  current_cash: number
  cash_revenue: number
  transfer_revenue: number
  order_count: number
  is_closed: boolean
  is_approved: boolean
  start_time: string
  end_time: string
}

interface ShiftResponse {
  message: string
  status: number
  data: Shift
}

class ShiftService {
  async openShift(accessToken: string, opening_cash: number) {
    const { data } = await axios.post<ShiftResponse>(
      '/shift',
      { opening_cash },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }
    )
    return data
  }
  async getShiftById(accessToken: string) {
    const { data } = await axios.get<ShiftResponse>('/shift/user', {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
    return data
  }

  async closeShift(accessToken: string, actual_cash: number, note?: string) {
    const { data } = await axios.patch<ShiftResponse>(
      '/shift',
      {
        actual_cash,
        note
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }
    )
    return data
  }
}

const shiftService = new ShiftService()
export default shiftService
