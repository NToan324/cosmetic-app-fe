import { useState, MouseEvent, ChangeEvent } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Menu,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Pagination,
  Stack,
  Box,
  Chip
} from '@mui/material'
import { CiCirclePlus } from 'react-icons/ci'
import { IoSearch } from 'react-icons/io5'
import EmployeeDialog from '@/components/admin/Employee/components/dialog' // Thêm import của EmployeeDialog

// Thay thế bằng đường dẫn ảnh thực tế
import Avatar from '@/assets/images/avatar.png'

// Định nghĩa kiểu dữ liệu
interface Employee {
  id: number
  image: string
  name: string
  code: string
  Birth: Date
  gender: string
  email: string
  phone: string
  idpp: string
  addr: string
  role: string
  user: string
  salary: number
  datejoined: Date
  status: string
  active: string
}

// Dữ liệu mẫu
const employees = Array(10)
  .fill(null)
  .map((_, index) => ({
    id: index + 1,
    image: Avatar,
    name: 'Mirai Emula',
    code: 'NV001',
    Birth: new Date(2022, index % 12, index + 1),
    gender: 'Male',
    email: 'Exam@gmail.com',
    phone: '090927883920',
    idpp: '0863828723472',
    addr: 'Sugar Town',
    role: 'admin',
    user: 'user123',
    salary: 3950000,
    datejoined: new Date(2022, index % 12, index + 1),
    status: 'Working',
    active: 'active'
  }))

const EmployeePage = () => {
  const [filters, setFilters] = useState<Record<string, string[]>>({})
  const [searchTerm, setSearchTerm] = useState('')
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const [selectedColumn, setSelectedColumn] = useState<string | null>(null)

  // Dialog State
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)

  // Mở Menu khi bấm nút ">"
  const handleFilterClick = (event: MouseEvent<HTMLButtonElement>, column: string) => {
    setAnchorEl(event.currentTarget)
    setSelectedColumn(column)
  }

  // Đóng Menu
  const handleMenuClose = () => {
    setAnchorEl(null)
    setSelectedColumn(null)
  }

  // Khi toggle một option trong checkbox
  const handleCheckboxToggle = (value: string) => {
    if (!selectedColumn) return
    setFilters((prev) => {
      const current = prev[selectedColumn] || []
      const newValues = current.includes(value) ? current.filter((v) => v !== value) : [...current, value]
      return {
        ...prev,
        [selectedColumn]: newValues
      }
    })
  }

  // Xóa lọc cho một cột (clear toàn bộ giá trị đã chọn của cột đó)
  const clearFilter = (column: string) => {
    setFilters((prev) => {
      const newFilters = { ...prev }
      delete newFilters[column]
      return newFilters
    })
  }

  // Handle search input change
  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value)
  }

  // Lọc nhân viên dựa trên search và các bộ lọc (cơ chế AND)
  const filteredEmployees = employees.filter((employee) => {
    const matchesSearch =
      searchTerm === '' ||
      Object.values(employee).some((value) => value.toString().toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesFilters = Object.keys(filters).every((col) => {
      if (filters[col].length === 0) return true

      // Nếu đang lọc cột Name, sử dụng định dạng "name - code"
      const employeeValue =
        col === 'name' ? `${employee.name} - ${employee.code}` : employee[col as keyof Employee]?.toString()
      return filters[col].includes(employeeValue)
    })

    return matchesSearch && matchesFilters
  })

  // Lấy các giá trị duy nhất của cột dựa trên danh sách đã được lọc (bao gồm cả search và các bộ lọc khác)
  const getUniqueOptions = (column: string): string[] => {
    const options = filteredEmployees.map((employee) =>
      column === 'name' ? `${employee.name} - ${employee.code}` : employee[column as keyof Employee]?.toString()
    )
    return Array.from(new Set(options))
  }

  // Mở Dialog Thêm Nhân viên
  const openDialogForAdd = () => {
    setSelectedEmployee(null)
    setDialogOpen(true)
  }

  // Mở Dialog Chỉnh Sửa Nhân viên
  const openDialogForEdit = (employee: Employee) => {
    setSelectedEmployee(employee)
    setDialogOpen(true)
  }

  // Đóng Dialog
  const handleDialogClose = () => {
    setDialogOpen(false)
  }

  // Lưu nhân viên
  const handleSaveEmployee = (employee: Employee) => {
    console.log('Save employee', employee)
  }

  return (
    <div className='p-4 pt-8'>
      {/* Header */}
      <Box display='flex' justifyContent='space-between' alignItems='center' mb={2}>
        <Button variant='contained' color='success' startIcon={<CiCirclePlus />} onClick={openDialogForAdd}>
          ADD EMPLOYEE
        </Button>
        {/* Hiển thị danh sách bộ lọc đang được chọn */}
        <Box>
          {Object.entries(filters).map(([column, values]) =>
            values.length > 0 ? (
              <Chip
                key={column}
                label={`${values.join(', ')}`}
                onDelete={() => clearFilter(column)}
                style={{ marginRight: 8 }}
              />
            ) : null
          )}
        </Box>
      </Box>
      <div className='border-t border-gray-300 w-full'></div>
      <Box display='flex' justifyContent='space-between' alignItems='center' my={1}>
        <h2 style={{ textAlign: 'left', marginBottom: '10px', fontSize: '1.75rem' }}>Employees</h2>
        <div className='bg-white flex items-center justify-between gap-2 p-2 rounded-2xl px-4 md:w-[300px] md:h-[50px] md:bg-gray-100'>
          <IoSearch size={25} color='black' />
          <input
            type='text'
            placeholder='Search'
            className='text-black border-none outline-none w-full hidden md:block'
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
      </Box>
      {/* Bảng */}
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label='employee table'>
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>
                Name
                <Button className='w-[0.5rem]' onClick={(e) => handleFilterClick(e, 'name')}>
                  &gt;
                </Button>
              </TableCell>
              <TableCell>
                Phone Number
                <Button onClick={(e) => handleFilterClick(e, 'phone')}>&gt;</Button>
              </TableCell>
              <TableCell>
                Email
                <Button onClick={(e) => handleFilterClick(e, 'email')}>&gt;</Button>
              </TableCell>
              <TableCell>
                Salary
                <Button onClick={(e) => handleFilterClick(e, 'salary')}>&gt;</Button>
              </TableCell>
              <TableCell>
                Status
                <Button onClick={(e) => handleFilterClick(e, 'status')}>&gt;</Button>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredEmployees.map((employee, index) => (
              <TableRow
                key={employee.id}
                sx={{
                  backgroundColor: index % 2 === 0 ? 'action.hover' : 'inherit'
                }}
                onClick={() => openDialogForEdit(employee)}
              >
                <TableCell>{employee.id}</TableCell>
                <TableCell>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <img src={employee.image} alt='employee' style={{ width: 24, height: 24 }} />
                    <div>
                      {employee.name} <br />
                      <span style={{ color: 'gray', fontSize: '0.875rem' }}>{employee.code}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{employee.phone}</TableCell>
                <TableCell>{employee.email}</TableCell>
                <TableCell>${employee.salary}</TableCell>
                <TableCell>
                  <span
                    style={{
                      color: employee.status === 'Working' ? 'green' : 'red',
                      backgroundColor: employee.status === 'Working' ? '#c8e6c9' : '#ffcdd2',
                      borderRadius: '4px',
                      padding: '4px 8px'
                    }}
                  >
                    {employee.status}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Menu lọc với checkbox */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        {selectedColumn &&
          getUniqueOptions(selectedColumn).map((option, idx) => {
            const checked = filters[selectedColumn]?.includes(option) || false
            return (
              <MenuItem key={idx}>
                <FormControlLabel
                  control={<Checkbox checked={checked} onChange={() => handleCheckboxToggle(option)} />}
                  label={option}
                />
              </MenuItem>
            )
          })}
        {selectedColumn && (
          <MenuItem
            onClick={() => {
              clearFilter(selectedColumn)
              handleMenuClose()
            }}
          >
            Clear Filter
          </MenuItem>
        )}
      </Menu>

      {/* Phân trang (chỉ là demo) */}
      <Stack spacing={2} sx={{ marginTop: 2, alignItems: 'center' }}>
        <Pagination count={5} variant='outlined' shape='rounded' />
      </Stack>

      {/* Dialog Thêm/Sửa nhân viên */}
      <EmployeeDialog
        open={dialogOpen}
        onClose={handleDialogClose}
        onSave={handleSaveEmployee}
        employee={selectedEmployee}
      />
    </div>
  )
}

export default EmployeePage
