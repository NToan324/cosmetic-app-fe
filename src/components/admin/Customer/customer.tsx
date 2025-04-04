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
import CustomerDialog from '@/components/admin/Customer/components/dialog' // Dialog cho Customer

// Định nghĩa kiểu dữ liệu cho Customer
interface Customer {
  id: number
  name: string
  phone: string
  dateJoined: Date
  transaction: number
  point: number
  rank: 'Bronze' | 'Silver' | 'Gold' | 'Diamond'
}

// Dữ liệu mẫu
const customers: Customer[] = Array(10)
  .fill(null)
  .map((_, index) => {
    const ranks: Customer['rank'][] = ['Bronze', 'Silver', 'Gold', 'Diamond']
    return {
      id: index + 1,
      name: `Customer ${index + 1}`,
      phone: `012345678${index}`,
      dateJoined: new Date(2022, index % 12, index + 1),
      transaction: 5 + index,
      point: 100 + index * 10,
      rank: ranks[index % ranks.length]
    }
  })

// Hàm trả về màu cho từng rank
const getRankColor = (rank: Customer['rank']) => {
  switch (rank) {
    case 'Bronze':
      return { textColor: 'brown', bgColor: 'rgba(216, 155, 99, 0.8)' }
    case 'Silver':
      return { textColor: 'gray', bgColor: 'rgba(211, 211, 211, 0.8)' }
    case 'Gold':
      return { textColor: '#FF8000', bgColor: 'rgba(245, 224, 110, 0.8)' }
    case 'Diamond':
      return { textColor: '#0080FF', bgColor: 'rgba(224, 247, 255, 0.8)' }
    default:
      return { textColor: '#000', bgColor: 'rgba(204, 204, 204, 0.8)' }
  }
}

const CustomerPage = () => {
  const [filters, setFilters] = useState<Record<string, string[]>>({})
  const [searchTerm, setSearchTerm] = useState('')
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const [selectedColumn, setSelectedColumn] = useState<string | null>(null)

  // Dialog State
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)

  // Mở Menu lọc
  const handleFilterClick = (event: MouseEvent<HTMLButtonElement>, column: string) => {
    setAnchorEl(event.currentTarget)
    setSelectedColumn(column)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
    setSelectedColumn(null)
  }

  const handleCheckboxToggle = (value: string) => {
    if (!selectedColumn) return
    setFilters((prev) => {
      const current = prev[selectedColumn] || []
      const newValues = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value]
      return {
        ...prev,
        [selectedColumn]: newValues
      }
    })
  }

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

  // Lọc Customer theo search và các bộ lọc (cơ chế AND)
  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      searchTerm === '' ||
      Object.values(customer).some((value) =>
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )

    const matchesFilters = Object.keys(filters).every((col) => {
      if (filters[col].length === 0) return true
      let customerValue: string
      if (col === 'name') {
        customerValue = customer.name
      } else if (col === 'phone') {
        customerValue = customer.phone
      } else if (col === 'dateJoined') {
        customerValue = customer.dateJoined.toDateString()
      } else if (col === 'transaction' || col === 'point' || col === 'id') {
        customerValue = customer[col as keyof Customer].toString()
      } else if (col === 'rank') {
        customerValue = customer.rank
      } else {
        customerValue = ''
      }
      return filters[col].includes(customerValue)
    })

    return matchesSearch && matchesFilters
  })

  // Lấy các giá trị duy nhất của một cột cho bộ lọc dựa trên danh sách đã được lọc (bao gồm cả search)
  const getUniqueOptions = (column: string): string[] => {
    const options = filteredCustomers.map((customer) => {
      if (column === 'name') return customer.name
      else if (column === 'phone') return customer.phone
      else if (column === 'dateJoined') return customer.dateJoined.toDateString()
      else if (column === 'transaction' || column === 'point' || column === 'id')
        return customer[column as keyof Customer].toString()
      else if (column === 'rank') return customer.rank
      return ''
    })
    return Array.from(new Set(options))
  }

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

  const handleSaveCustomer = (customer: Customer) => {
    console.log('Save customer', customer)
  }

  return (
    <div className='p-4 pt-8'>
      {/* Header */}
      <Box display='flex' justifyContent='space-between' alignItems='center' mb={2}>
        <Button variant='contained' color='success' startIcon={<CiCirclePlus />} onClick={openDialogForAdd}>
          ADD CUSTOMER
        </Button>
        <Box>
          {Object.entries(filters).map(([column, values]) =>
            values.length > 0 ? (
              <Chip
                className='rounded-xl'
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
        <h2 style={{ textAlign: 'left', marginBottom: '10px', fontSize: '1.75rem' }}>Customers</h2>
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

      {/* Bảng hiển thị Customer */}
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label='customer table'>
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
                Phone
                <Button onClick={(e) => handleFilterClick(e, 'phone')}>&gt;</Button>
              </TableCell>
              <TableCell>
                Date Joined
                <Button onClick={(e) => handleFilterClick(e, 'dateJoined')}>&gt;</Button>
              </TableCell>
              <TableCell>
                Transaction
                <Button onClick={(e) => handleFilterClick(e, 'transaction')}>&gt;</Button>
              </TableCell>
              <TableCell>
                Point
                <Button onClick={(e) => handleFilterClick(e, 'point')}>&gt;</Button>
              </TableCell>
              <TableCell>
                Rank
                <Button onClick={(e) => handleFilterClick(e, 'rank')}>&gt;</Button>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredCustomers.map((customer, index) => (
              <TableRow
                key={customer.id}
                sx={{ backgroundColor: index % 2 === 0 ? 'action.hover' : 'inherit' }}
                onClick={() => openDialogForEdit(customer)}
              >
                <TableCell>{customer.id}</TableCell>
                <TableCell>{customer.name}</TableCell>
                <TableCell>{customer.phone}</TableCell>
                <TableCell>{customer.dateJoined.toLocaleDateString()}</TableCell>
                <TableCell>{customer.transaction}</TableCell>
                <TableCell>{customer.point}</TableCell>
                <TableCell>
                  <Chip
                    label={customer.rank}
                    sx={{
                      borderRadius: '4px',
                      backgroundColor: getRankColor(customer.rank).bgColor,
                      color: getRankColor(customer.rank).textColor,
                      display: { xs: 'none', md: 'table-cell' }
                    }}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Menu lọc */}
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

      {/* Phân trang */}
      <Stack spacing={2} sx={{ marginTop: 2, alignItems: 'center' }}>
        <Pagination count={5} variant='outlined' shape='rounded' />
      </Stack>

      {/* Dialog thêm/chỉnh sửa Customer */}
      <CustomerDialog
        open={dialogOpen}
        onClose={handleDialogClose}
        onSave={handleSaveCustomer}
        customer={selectedCustomer}
      />
    </div>
  )
}

export default CustomerPage
