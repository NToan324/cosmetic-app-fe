import customerService from '@/services/customer.service'
import { useQuery } from '@tanstack/react-query'

export const useCustomer = ({ accessToken, page, limit }: { accessToken: string; page?: number; limit?: number }) => {
  return useQuery({
    queryKey: ['customers', { accessToken, page, limit }],
    queryFn: () => customerService.getCustomers(accessToken, page, limit),
    staleTime: 1000 * 60 * 5
  })
}
