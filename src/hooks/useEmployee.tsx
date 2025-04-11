import employeeService from '@/services/employee.service'
import { useQuery } from '@tanstack/react-query'

export const useEmployee = ({ accessToken, page, limit }: { accessToken: string; page?: number; limit?: number }) => {
  return useQuery({
    queryKey: ['employees', { accessToken, page, limit }],
    queryFn: () => employeeService.getEmployees(accessToken, page, limit),
    staleTime: 1000 * 60 * 5
  })
}
