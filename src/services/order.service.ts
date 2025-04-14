import axios from '@/config/api'
import { Product } from './product.service'
import { ResponsePagination } from './employee.service'

export interface OrderDetails {
  items: Array<Partial<Product>>
  discount_point: number
  payment_method: string
}

export interface OrderHistory {
  _id: string
  orderId: string
  customerName: string
  phoneNumber: string
  createdAt: string
  status: string
  totalPrice: number
  discount_point: number
  payment_method: string
  createdBy: string
  items: Array<{
    productId: string
    productName: string
    quantity: number
    price: number
  }>
}

export interface Order {
  userId?: string
  createdBy?: string
  order: OrderDetails
}
class OrderService {
  async createOrder({ userId, createdBy, order }: Order) {
    const response = await axios.post('/order', {
      userId,
      createdBy,
      order
    })
    return response.data
  }

  async getOrderHistory(accessToken: string, page?: number, limit?: number) {
    const response = await axios.get<ResponsePagination<OrderHistory>>(`/order?page=${page}&limit=${limit}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
    return response.data
  }

  async getOrderHistoryById(id: string) {
    const response = await axios.get(`/order/${id}`)
    return response.data
  }
}
const orderService = new OrderService()
export default orderService
