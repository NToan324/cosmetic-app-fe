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
import { IoSearch } from 'react-icons/io5'
import InvoiceDialog from '@/components/admin/Invoice/components/dialog' // Dialog cho Invoice

// Định nghĩa kiểu dữ liệu cho Invoice
interface Invoice {
  id: number
  code: string
  phone: string
  total: number
  payment: string
  received: number
  change: number
  dateExport: Date
}

// Dữ liệu mẫu
const invoices: Invoice[] = Array(10)
  .fill(null)
  .map((_, index) => ({
    id: index + 1,
    code: `INV-${1000 + index}`,
    phone: `0873547483633`,
    total: Number((Math.random() * 1000).toFixed()),
    payment: index % 2 === 0 ? 'card' : 'cash',
    received: Number((Math.random() * 1000).toFixed()),
    change: Number((Math.random() * 100).toFixed()),
    dateExport: new Date(2025, index % 12, index + 1)
  }))

const InvoicePage = () => {
  const [filters, setFilters] = useState<Record<string, string[]>>({})
  const [searchTerm, setSearchTerm] = useState('')
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const [selectedColumn, setSelectedColumn] = useState<string | null>(null)

  // Dialog State
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null)

  // Mở Menu lọc khi nhấn nút ">"
  const handleFilterClick = (event: MouseEvent<HTMLButtonElement>, column: string) => {
    setAnchorEl(event.currentTarget)
    setSelectedColumn(column)
  }

  // Đóng Menu lọc
  const handleMenuClose = () => {
    setAnchorEl(null)
    setSelectedColumn(null)
  }

  // Toggle giá trị lọc cho một cột
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

  // Xóa bộ lọc của một cột
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
  // Lọc sản phẩm dựa trên tất cả các bộ lọc (cơ chế AND)
  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch =
      searchTerm === '' ||
      Object.values(invoice).some((value) =>
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )

    const matchesFilters = Object.keys(filters).every((col) => {
      if (filters[col].length === 0) return true
      const invoiceValue = invoice[col as keyof Invoice]?.toString()
      return filters[col].includes(invoiceValue)
    })

    return matchesSearch && matchesFilters
  })

  // Mở dialog chỉnh sửa hóa đơn
  const openDialogForEdit = (invoice: Invoice) => {
    setSelectedInvoice(invoice)
    setDialogOpen(true)
  }

  const handleDialogClose = () => {
    setDialogOpen(false)
  }

  const handleSaveInvoice = (invoice: Invoice) => {
    console.log('Save invoice', invoice)
  }

  // Lấy các giá trị duy nhất của một cột (cho menu lọc)
  const getUniqueOptions = (column: string): string[] => {
    const filteredByOtherColumns = invoices.filter((invoice) =>
      Object.keys(filters).every((col) => {
        if (col === column) return true
        let invoiceValue: string
        if (col === 'code') {
          invoiceValue = invoice.code
        } else if (col === 'phone') {
          invoiceValue = invoice.phone
        } else if (col === 'total' || col === 'received' || col === 'change' || col === 'id') {
          invoiceValue = invoice[col as keyof Invoice].toString()
        } else if (col === 'payment') {
          invoiceValue = invoice.payment
        } else if (col === 'dateExport') {
          invoiceValue = invoice.dateExport.toDateString()
        } else {
          invoiceValue = ''
        }
        return filters[col].length === 0 || filters[col].includes(invoiceValue)
      })
    )
    const options = filteredByOtherColumns.map((invoice) => {
      if (column === 'code') return invoice.code
      else if (column === 'phone') return invoice.phone
      else if (column === 'total' || column === 'received' || column === 'change' || column === 'id')
        return invoice[column as keyof Invoice].toString()
      else if (column === 'payment') return invoice.payment
      else if (column === 'dateExport') return invoice.dateExport.toDateString()
      return ''
    })
    return Array.from(new Set(options))
  }

  return (
    <div className='p-4 pt-8'>
      {/* Header */}
      <Box display='flex' justifyContent='space-between' alignItems='center' mb={2}>
        <Box>
          {Object.entries(filters).map(([column, values]) =>
            values.length > 0 ? (
              <Chip
                key={column}
                label={`${values.join(', ')}`}
                onDelete={() => clearFilter(column)}
                style={{ marginRight: 8 }}
                className='rounded-xl'
              />
            ) : null
          )}
        </Box>
      </Box>
      <div className='border-t border-gray-300 w-full'></div>
      <Box display='flex' justifyContent='space-between' alignItems='center' my={1}>
        <h2 style={{ textAlign: 'left', marginBottom: '10px', fontSize: '1.75rem' }}>Invoices</h2>
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

      {/* Bảng hiển thị Invoice */}
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label='invoice table'>
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>
                ID
                <Button className='w-[0.5rem]' onClick={(e) => handleFilterClick(e, 'code')}>
                  &gt;
                </Button>
              </TableCell>
              <TableCell>
                Phone
                <Button onClick={(e) => handleFilterClick(e, 'phone')}>&gt;</Button>
              </TableCell>
              <TableCell>
                Total
                <Button onClick={(e) => handleFilterClick(e, 'total')}>&gt;</Button>
              </TableCell>
              <TableCell>
                Payment
                <Button onClick={(e) => handleFilterClick(e, 'payment')}>&gt;</Button>
              </TableCell>
              <TableCell>
                Date Export
                <Button onClick={(e) => handleFilterClick(e, 'dateExport')}>&gt;</Button>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredInvoices.map((invoice, index) => (
              <TableRow
                key={invoice.id}
                sx={{
                  backgroundColor: index % 2 === 0 ? 'action.hover' : 'inherit'
                }}
                onClick={() => openDialogForEdit(invoice)}
              >
                <TableCell>{invoice.id}</TableCell>
                <TableCell>{invoice.code}</TableCell>
                <TableCell>{invoice.phone}</TableCell>
                <TableCell>${invoice.total}</TableCell>
                <TableCell>{invoice.payment}</TableCell>
                <TableCell>{invoice.dateExport.toLocaleDateString()}</TableCell>
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

      {/* Dialog chỉnh sửa Invoice */}
      <InvoiceDialog
        open={dialogOpen}
        onClose={handleDialogClose}
        onSave={handleSaveInvoice}
        invoice={selectedInvoice}
      />
    </div>
  )
}

export default InvoicePage
