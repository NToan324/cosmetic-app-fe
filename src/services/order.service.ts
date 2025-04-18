import axios from '@/config/api'
import { Product } from './product.service'
import { ResponsePagination } from './employee.service'

export interface OrderDetails {
  items: Array<Partial<Product>>
  discount_point: number
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

export interface orderReponse {
  message: string
  status: number
  // data: {
  //   order_id: string
  //   total_price: number
  // }
  data: {
    order: {
      order_id: string
      total_price: number
    }
  }
}

export interface Order {
  userId?: string
  createdBy?: string
  paymentMethod?: string
  order: OrderDetails
}
class OrderService {
  async createOrder({ userId, createdBy, paymentMethod, order }: Order) {
    const response = await axios.post<orderReponse>('/order', {
      userId,
      createdBy,
      paymentMethod,
      order
    })
    return response.data
  }

  async updateOrderStatus(
    id: string,
    payload: { createdBy: string; paymentMethod: string; total_amount: number; status: string }
  ) {
    const response = await axios.patch(`/order/${id}`, {
      ...payload
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

  async searcOrderHistory(orderId: string) {
    const response = await axios.get(`/order/search?${orderId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`
      }
    })
    return response.data
  }
}
const orderService = new OrderService()
export default orderService
