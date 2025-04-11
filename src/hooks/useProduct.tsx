import { useQuery } from '@tanstack/react-query'
import productService from '@/services/product.service'

export const useProduct = ({
  categoryId,
  price,
  page,
  limit
}: {
  categoryId?: string
  price?: string
  page?: number
  limit?: number
}) => {
  return useQuery({
    queryKey: ['products', { categoryId, price, page, limit }],
    queryFn: () => productService.getAllProducts(categoryId, price, page, limit),
    staleTime: 1000 * 60 * 5
  })
}
