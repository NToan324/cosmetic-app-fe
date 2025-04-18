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
import ProductDialog from '@/components/admin/Product/components/dialog'
import { Product } from '@/services/product.service'
import { formatCurrency } from '@/helpers'
import { useProduct } from '@/hooks/useProduct'

const ProductPage = () => {
  const [filters, setFilters] = useState<Record<string, string[]>>({})
  const [searchTerm, setSearchTerm] = useState('')
  const [page, setPage] = useState(1)
  const limit = 10
  const { data, isLoading, isError } = useProduct({ page, limit })

  const products = data?.data.data || []
  const totalPages = data?.data.totalPages || 1
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

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

  return (
    <div className='p-4 pt-8'>
      {/* Header */}
      <Box display='flex' justifyContent='space-between' alignItems='center' mb={2}>
        <Button variant='contained' color='success' startIcon={<CiCirclePlus />} onClick={openDialogForAdd}>
          Thêm sản phẩm
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
        <h2 style={{ textAlign: 'left', marginBottom: '10px', fontSize: '1.75rem' }}>Quản lý sản phẩm</h2>
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
              <TableCell>Số thứ tự</TableCell>
              <TableCell>Sản phẩm</TableCell>
              <TableCell>Số lượng</TableCell>
              <TableCell>Giá gốc</TableCell>
              <TableCell>Giá khuyến mãi</TableCell>
              <TableCell>Tình trạng hàng</TableCell>
              <TableCell>Trạng thái</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products && products.length > 0 ? (
              products.map((product, index) => (
                <TableRow
                  key={product._id}
                  sx={{
                    backgroundColor: index % 2 === 0 ? 'action.hover' : 'inherit'
                  }}
                  onClick={() => openDialogForEdit(product)}
                >
                  <TableCell>{index}</TableCell>
                  <TableCell>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <img src={product.image_url} alt='product' style={{ width: 24, height: 24 }} />
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
                        color: product.stock_quantity === 0 ? '#808080' : 'inherit',
                        backgroundColor: product.stock_quantity === 0 ? '#D3D3D3' : 'inherit',
                        padding: '4px 8px'
                      }}
                    >
                      {product.stock_quantity === 0 ? 'Out of Stock' : product.stock_quantity}
                    </span>
                  </TableCell>
                  <TableCell>{formatCurrency(product.price)}</TableCell>
                  <TableCell>{formatCurrency(product.price)}</TableCell>
                  <TableCell
                    style={{
                      color: product.stock_quantity < 20 ? 'red' : 'black'
                    }}
                  >
                    {product.stock_quantity < 20 ? 'Sắp hết' : 'Còn hàng'}
                  </TableCell>
                  <TableCell>
                    {product.disable ? (
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
                <TableCell colSpan={6} align='center'>
                  {isLoading ? 'Loading...' : isError ? 'Error loading products' : 'No products found'}
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
          variant='outlined'
          shape='rounded'
          onChange={(_event, value) => {
            setPage(value)
          }}
        />
      </Stack>

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
