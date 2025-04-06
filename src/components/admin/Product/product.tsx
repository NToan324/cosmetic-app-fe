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
import ProductDialog from '@/components/admin/Product/components/dialog' // Thêm import của ProductDialog

// Thay thế bằng đường dẫn ảnh thực tế
import Stuff from '@/assets/images/product.png'

// Định nghĩa kiểu dữ liệu cho sản phẩm
interface Product {
  id: number
  name: string
  code: string
  category: string
  original: number
  selling: number
  status: string
  stock: number
  image: string
  des: string
  date: Date
}

// Dữ liệu mẫu
const products = Array(10)
  .fill(null)
  .map((_, index) => {
    const stock = Math.floor(Math.random() * 15) // random từ 0 đến 14
    return {
      id: index + 1,
      image: Stuff,
      name: 'Kẹo kera',
      code: 'SP001',
      category: 'A',
      original: 1 + index,
      selling: 300 + index * 2,
      stock: stock,
      status: stock === 0 ? 'Stop Selling' : 'On Sale',
      des: 'UIIAIUUIIAI',
      date: new Date(2025, index % 12, index + 1)
    }
  })

const ProductPage = () => {
  const [filters, setFilters] = useState<Record<string, string[]>>({})
  const [searchTerm, setSearchTerm] = useState('')
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const [selectedColumn, setSelectedColumn] = useState<string | null>(null)

  // Dialog State
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

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
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      searchTerm === '' ||
      Object.values(product).some((value) => value.toString().toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesFilters = Object.keys(filters).every((col) => {
      if (filters[col].length === 0) return true

      // Nếu đang lọc cột Name, sử dụng định dạng "name - code"
      const productValue =
        col === 'name' ? `${product.name} - ${product.code}` : product[col as keyof Product]?.toString()
      return filters[col].includes(productValue)
    })

    return matchesSearch && matchesFilters
  })

  // Mở Dialog Thêm Sản Phẩm
  const openDialogForAdd = () => {
    setSelectedProduct(null)
    setDialogOpen(true)
  }

  // Mở Dialog Chỉnh Sửa Sản Phẩm
  const openDialogForEdit = (product: Product) => {
    setSelectedProduct(product)
    setDialogOpen(true)
  }

  // Đóng Dialog
  const handleDialogClose = () => {
    setDialogOpen(false)
  }

  // Lưu sản phẩm
  const handleSaveProduct = (product: Product) => {
    console.log('Save product', product)
  }

  // Lấy các giá trị duy nhất của cột dựa trên danh sách đã được lọc (bao gồm cả search và các bộ lọc khác)
  const getUniqueOptions = (column: string): string[] => {
    const options = filteredProducts.map((product) =>
      column === 'name' ? `${product.name} - ${product.code}` : product[column as keyof Product]?.toString()
    )
    return Array.from(new Set(options))
  }

  return (
    <div className='p-4 pt-8'>
      {/* Header */}
      <Box display='flex' justifyContent='space-between' alignItems='center' mb={2}>
        <Button variant='contained' color='success' startIcon={<CiCirclePlus />} onClick={openDialogForAdd}>
          ADD PRODUCT
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
        <h2 style={{ textAlign: 'left', marginBottom: '10px', fontSize: '1.75rem' }}>Products</h2>
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
        <Table sx={{ minWidth: 650 }} aria-label='product table'>
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>
                Product
                <Button className='w-[0.5rem]' onClick={(e) => handleFilterClick(e, 'name')}>
                  &gt;
                </Button>
              </TableCell>
              <TableCell>
                Stock
                <Button onClick={(e) => handleFilterClick(e, 'stock')}>&gt;</Button>
              </TableCell>
              <TableCell>
                Original Price
                <Button onClick={(e) => handleFilterClick(e, 'original')}>&gt;</Button>
              </TableCell>
              <TableCell>
                Selling Price
                <Button onClick={(e) => handleFilterClick(e, 'selling')}>&gt;</Button>
              </TableCell>
              <TableCell>
                Status
                <Button onClick={(e) => handleFilterClick(e, 'status')}>&gt;</Button>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredProducts.map((product, index) => (
              <TableRow
                key={product.id}
                sx={{
                  backgroundColor: index % 2 === 0 ? 'action.hover' : 'inherit'
                }}
                onClick={() => openDialogForEdit(product)} // Mở dialog khi nhấn vào dòng
              >
                <TableCell>{product.id}</TableCell>
                <TableCell>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <img src={product.image} alt='product' style={{ width: 24, height: 24 }} />
                    <div>
                      {product.name} <br />
                      <span style={{ color: 'gray', fontSize: '0.875rem' }}>{product.code}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <span
                    className='rounded-xl py-2 px-4'
                    style={{
                      color: product.stock === 0 ? '#808080' : 'inherit',
                      backgroundColor: product.stock === 0 ? '#D3D3D3' : 'inherit',
                      padding: '4px 8px' // Thêm padding cho đẹp
                    }}
                  >
                    {product.stock === 0 ? 'Out of Stock' : product.stock}
                  </span>
                </TableCell>
                <TableCell>${product.original}</TableCell>
                <TableCell>${product.selling}</TableCell>
                <TableCell>
                  <span
                    className='rounded-xl py-2 px-4'
                    style={{
                      color: product.status === 'On Sale' ? 'green' : 'red',
                      backgroundColor: product.status === 'On Sale' ? '#c8e6c9' : '#ffcdd2'
                    }}
                  >
                    {product.status}
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

      {/* Dialog Thêm/Sửa sản phẩm */}
      <ProductDialog
        open={dialogOpen}
        onClose={handleDialogClose}
        onSave={handleSaveProduct}
        product={selectedProduct}
      />
    </div>
  )
}

export default ProductPage
