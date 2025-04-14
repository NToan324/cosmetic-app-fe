import orderService from '@/services/order.service'
import { useQuery } from '@tanstack/react-query'

export const useHistory = ({ accessToken, page, limit }: { accessToken: string; page?: number; limit?: number }) => {
  return useQuery({
    queryKey: ['histories', { accessToken, page, limit }],
    queryFn: () => orderService.getOrderHistory(accessToken, page, limit),
    staleTime: 1000 * 60 * 5
  })
}
