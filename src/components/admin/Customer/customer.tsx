import { useState } from 'react'
import 'react-toastify/dist/ReactToastify.css'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Pagination,
  Stack,
  Box,
  Snackbar
} from '@mui/material'
import { CiCirclePlus } from 'react-icons/ci'
import { IoSearch } from 'react-icons/io5'
import CustomerDialog from '@/components/admin/Customer/components/dialog'
import { Customer } from '@/services/customer.service'
import { useCustomer } from '@/hooks/useCustomer'

const CustomerPage = () => {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [page, setPage] = useState(1)
  const limit = 10
  const accessToken = localStorage.getItem('accessToken') || ''
  const { data, isLoading, isError } = useCustomer({ accessToken, page, limit })
  const customers = data?.data.data || []
  const totalPages = data?.data.totalPages || 1
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState('')

  const openDialogForAdd = () => {
    setSelectedCustomer(null)
    setDialogOpen(true)
  }

  const openDialogForEdit = (customer: Customer) => {
    setSelectedCustomer(customer)
    setDialogOpen(true)
  }

  const handleDialogClose = () => {
    setDialogOpen(false)
  }

  const handleSnackbar = (message: string) => {
    setSnackbarMessage(message)
    setSnackbarOpen(true)
  }

  const handleSnackbarClose = () => {
    setSnackbarOpen(false)
  }

  return (
    <div className='p-4 pt-8'>
      <Box display='flex' justifyContent='space-between' alignItems='center' mb={2}>
        <Button variant='contained' color='success' startIcon={<CiCirclePlus />} onClick={openDialogForAdd}>
          Thêm khách hàng
        </Button>
      </Box>
      <div className='border-t border-gray-300 w-full'></div>
      <Box display='flex' justifyContent='space-between' alignItems='center' my={1}>
        <h2 style={{ textAlign: 'left', marginBottom: '10px', fontSize: '1.75rem' }}>Quản lý khách hàng</h2>
        <div className='bg-white flex items-center justify-between gap-2 p-2 rounded-2xl px-4 md:w-[300px] md:h-[50px] md:bg-gray-100'>
          <IoSearch size={25} color='black' />
          <input
            type='text'
            placeholder='Search'
            className='text-black border-none outline-none w-full hidden md:block'
          />
        </div>
      </Box>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label='customer table'>
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Tên khách hàng</TableCell>
              <TableCell>Số điện thoại</TableCell>
              <TableCell>Rank</TableCell>
              <TableCell>Point</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {customers && customers.length > 0 ? (
              customers.map((customer, index) => (
                <TableRow
                  key={index}
                  sx={{
                    backgroundColor: index % 2 === 0 ? 'action.hover' : 'inherit'
                  }}
                  onClick={() => openDialogForEdit(customer)}
                >
                  <TableCell>{(page - 1) * limit + index + 1}</TableCell>
                  <TableCell>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div>
                        {customer.user.name} <br />
                        <span style={{ color: 'gray', fontSize: '0.875rem' }}>{customer.userId}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{customer.user.phone}</TableCell>
                  <TableCell>{customer.point}</TableCell>
                  <TableCell>{customer.rank}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align='center'>
                  {isLoading ? 'Đang tải...' : isError ? 'Lỗi khi tải khách hàng' : 'Không tìm thấy khách hàng'}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Stack spacing={2} sx={{ marginTop: 2, alignItems: 'center' }}>
        <Pagination
          count={totalPages}
          page={page}
          onChange={(_, value) => setPage(value)}
          variant='outlined'
          shape='rounded'
        />
      </Stack>
      <CustomerDialog
        open={dialogOpen}
        onClose={handleDialogClose}
        customer={selectedCustomer}
        accessToken={accessToken}
        onActionSuccess={handleSnackbar}
      />
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        open={snackbarOpen}
        autoHideDuration={5000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
      />
    </div>
  )
}

export default CustomerPage
