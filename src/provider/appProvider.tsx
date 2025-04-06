import { useEffect, useState } from 'react'
import { AppContext } from '@/provider/appContext'
import authService from '@/services/auth'

const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [user, setUser] = useState<{
    id: string
    phone: string
    name: string
    email?: string
    role: string[]
    rank?: string
    point?: number
    type?: string
  } | null>(null)

  useEffect(() => {
    const getUser = async () => {
      const userStorage = localStorage.getItem('accessToken')
      if (userStorage) {
        try {
          const data = await authService.getUser(userStorage)
          if (data) {
            setUser(data)
          }
        } catch (error) {
          throw new Error(error instanceof Error ? error.message : 'Unknown error')
        }
      }
    }
    getUser()
  }, [])
  return <AppContext.Provider value={{ isOpen, setIsOpen, user, setUser }}>{children}</AppContext.Provider>
}

export default AppProvider
