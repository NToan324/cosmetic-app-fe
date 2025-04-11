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
import EmployeeDialog from '@/components/admin/Employee/components/dialog'
import { Employee } from '@/services/employee.service'
import DEFAULT from '@/assets/images/default_avatar.jpg'
import { useEmployee } from '@/hooks/useEmployee'

const EmployeePage = () => {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)
  const [page, setPage] = useState(1)
  const limit = 10
  const accessToken = localStorage.getItem('accessToken') || ''
  const { data, isLoading, isError } = useEmployee({ accessToken, page, limit })
  const employees = data?.data.data || []
  const totalPages = data?.data.totalPages || 1
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState('')

  const openDialogForAdd = () => {
    setSelectedEmployee(null)
    setDialogOpen(true)
  }

  const openDialogForEdit = (employee: Employee) => {
    setSelectedEmployee(employee)
    setDialogOpen(true)
  }

  const handleDialogClose = () => {
    setDialogOpen(false)
  }

  // Callback để hiển thị snackbar
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
          Thêm nhân viên
        </Button>
      </Box>
      <div className='border-t border-gray-300 w-full'></div>
      <Box display='flex' justifyContent='space-between' alignItems='center' my={1}>
        <h2 style={{ textAlign: 'left', marginBottom: '10px', fontSize: '1.75rem' }}>Quản lý nhân viên</h2>
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
        <Table sx={{ minWidth: 650 }} aria-label='employee table'>
          <TableHead>
            <TableRow>
              <TableCell>Số thứ tự</TableCell>
              <TableCell>Tên nhân viên</TableCell>
              <TableCell>Số điện thoại</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Vai trò</TableCell>
              <TableCell>Hình thức làm việc</TableCell>
              <TableCell>Hoạt động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {employees && employees.length > 0 ? (
              employees.map((employee, index) => (
                <TableRow
                  key={index}
                  sx={{
                    backgroundColor: index % 2 === 0 ? 'action.hover' : 'inherit'
                  }}
                  onClick={() => openDialogForEdit(employee)}
                >
                  <TableCell>{(page - 1) * limit + index + 1}</TableCell>
                  <TableCell>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <img src={employee.image_url || DEFAULT} alt='employee' style={{ width: 24, height: 24 }} />
                      <div>
                        {employee.user.name} <br />
                        <span style={{ color: 'gray', fontSize: '0.875rem' }}>{employee.userId}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{employee.user.phone}</TableCell>
                  <TableCell>{employee.user.email}</TableCell>
                  <TableCell>{employee.user.role.join(', ')}</TableCell>
                  <TableCell>{employee.type}</TableCell>
                  <TableCell>
                    {employee.disable ? (
                      <span
                        className='rounded-xl py-2 px-4'
                        style={{
                          color: 'red',
                          backgroundColor: '#ffcdd2'
                        }}
                      >
                        Disable
                      </span>
                    ) : (
                      <span
                        className='rounded-xl py-2 px-4'
                        style={{
                          color: 'green',
                          backgroundColor: '#c9eec7'
                        }}
                      >
                        Active
                      </span>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align='center'>
                  {isLoading ? 'Loading...' : isError ? 'Error loading employees' : 'No employees found'}
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
      <EmployeeDialog
        open={dialogOpen}
        onClose={handleDialogClose}
        employee={selectedEmployee}
        accessToken={accessToken}
        onActionSuccess={handleSnackbar} // Truyền callback vào dialog
      />
      {/* Thêm Snackbar */}
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        open={snackbarOpen}
        autoHideDuration={5000} // 5 giây
        onClose={handleSnackbarClose}
        message={snackbarMessage}
      />
    </div>
  )
}

export default EmployeePage
