import { useState, ChangeEvent } from 'react'
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
  Chip
} from '@mui/material'
import { CiCirclePlus } from 'react-icons/ci'
import { IoSearch } from 'react-icons/io5'
import CustomerDialog from '@/components/admin/Customer/components/dialog'
import { useContext } from 'react'
import { AppContext } from '@/provider/appContext'
import { Customer } from '@/services/customer'
import { formatDate } from '@/helpers'

const CustomerPage = () => {
  const [filters, setFilters] = useState<Record<string, string[]>>({})
  const [searchTerm, setSearchTerm] = useState('')
  const { customers } = useContext(AppContext)

  const getRankColor = (rank: string) => {
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

  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)

  const clearFilter = (column: string) => {
    setFilters((prev) => {
      const newFilters = { ...prev }
      delete newFilters[column]
      return newFilters
    })
  }

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value)
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
              <TableCell>Name</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Date Joined</TableCell>
              <TableCell>Transaction</TableCell>
              <TableCell>Point</TableCell>
              <TableCell>Rank</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {customers.map((customer, index) => (
              <TableRow
                key={index}
                sx={{ backgroundColor: index % 2 === 0 ? 'action.hover' : 'inherit' }}
                onClick={() => openDialogForEdit(customer)}
              >
                <TableCell>{index}</TableCell>
                <TableCell>{customer.name}</TableCell>
                <TableCell>{customer.phone}</TableCell>
                <TableCell>{formatDate(customer.createdAt)}</TableCell>
                <TableCell>{2}</TableCell>
                <TableCell>{customer.customer.point}</TableCell>
                <TableCell>
                  <Chip
                    label={customer.customer.rank}
                    sx={{
                      borderRadius: '4px',
                      backgroundColor: getRankColor(customer.customer.rank).bgColor,
                      color: getRankColor(customer.customer.rank).textColor,
                      display: { xs: 'none', md: 'table-cell' }
                    }}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Stack spacing={2} sx={{ marginTop: 2, alignItems: 'center' }}>
        <Pagination count={5} variant='outlined' shape='rounded' />
      </Stack>
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
