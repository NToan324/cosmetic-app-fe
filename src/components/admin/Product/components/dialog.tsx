import React, { useState, useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  Button,
  Grid,
  Box
} from '@mui/material'
import { MdOutlineCancel } from 'react-icons/md'
import { LuRecycle } from 'react-icons/lu'
import { CiCirclePlus } from 'react-icons/ci'
import { CiCircleMinus } from 'react-icons/ci'
import { MdHistory } from "react-icons/md";
import DEFAULT from '@/assets/images/default_product.png'

// Định nghĩa kiểu dữ liệu cho sản phẩm
interface Product {
  id: number
  name: string
  code: string
  original: number
  selling: number
  stock: number
  category: string
  status: string
  image: string
  des: string
  date: Date
}

// Props cho dialog
interface ProductDialogProps {
  open: boolean
  onClose: () => void
  onSave: (product: Product) => void
  product?: Product | null
}

const ProductDialog: React.FC<ProductDialogProps> = ({
  open,
  onClose,
  //onSave,
  product
}) => {
  const [formData, setFormData] = useState<Product>({
    id: product ? product.id : 0,
    name: product?.name || '',
    code: product?.code || '',
    original: product?.original || 0,
    selling: product?.selling || 0,
    stock: product?.stock || 0,
    category: product?.category || 'default',
    status: product?.status || 'On Sale',
    image: product?.image || DEFAULT,
    des: product?.image || '',
    date: product?.date || new Date()
  })

  useEffect(() => {
    if (product) {
      setFormData(product)
    } else {
      setFormData({
        id: 0,
        name: '',
        code: '',
        original: 0,
        selling: 0,
        stock: 0,
        category: 'default',
        status: 'On Sale',
        image: DEFAULT,
        des: '',
        date: new Date()
      })
    }
  }, [product])

  // Cập nhật dữ liệu nhập vào
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  // Lưu sản phẩm
  //   const handleSave = () => {
  //     if (!formData.name || !formData.code || !formData.original || !formData.selling) {
  //       alert("Vui lòng nhập đầy đủ thông tin!");
  //       return;
  //     }
  //     onSave(formData);
  //     onClose();
  //   };

  return (
    <Dialog open={open} onClose={onClose} maxWidth='md' fullWidth>
      {' '}
      {/* Tăng kích thước dialog */}
      <DialogTitle sx={{ textAlign: 'center' }}>
        {product ? `Detail Product: ${formData.code}` : 'Add Product'}
      </DialogTitle>
      <div className='border-t border-gray-300 w-full'></div>
      <DialogContent>
        <Grid container spacing={2} className='max-w-full'>
          {/* Phần hình ảnh (1/3 chiều rộng) */}
          <Grid size={{ xs: 12, md: 5 }}>
            <div className='flex justify-center'>
              <Box
                component='img'
                src={formData.image || '/default-image.png'}
                alt='Product Image'
                sx={{ width: '20rem', height: '20rem', borderRadius: '8px', objectFit: 'contain' }}
              />
            </div>
            <div className='text-gray-400 mt-4'> {product ? `Last Updated: ${formData.date.toLocaleDateString()}` : ' '}             
            </div>
          </Grid>

          {/* Phần thông tin sản phẩm (2/3 chiều rộng) */}
          <Grid size={{ xs: 12, md: 7 }} rowSpacing={4}>
            <TextField
              fullWidth
              margin='dense'
              label='Name'
              name='name'
              value={formData.name}
              onChange={handleChange}
            />

            <Select fullWidth margin='dense' name='category' value={formData.category} onChange={(event) => setFormData((prev) => ({...prev, category: event.target.value}))}>
              <MenuItem value='default'>Category</MenuItem>
              <MenuItem value='A'>A</MenuItem>
              <MenuItem value='B'>B</MenuItem>
            </Select>
            <TextField
              fullWidth
              margin='dense'
              label='Stock'
              name='stock'
              value={formData.stock}
              onChange={handleChange}
            />
            {/* Original, Selling, Status (cùng hàng khi rộng, xuống hàng khi hẹp) */}
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  margin='dense'
                  label='Original'
                  name='original'
                  value={formData.original}
                  onChange={handleChange}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  margin='dense'
                  label='Selling'
                  name='selling'
                  value={formData.selling}
                  onChange={handleChange}
                />
              </Grid>
            </Grid>

            <TextField
              fullWidth
              margin='dense'
              label='Description'
              name='des'
              value={formData.des}
              onChange={handleChange}
              multiline
              rows={4}
              variant='outlined'
            />
          </Grid>
        </Grid>
      </DialogContent>
      <div className='border-t border-gray-300 w-full '></div>
      <DialogActions className='flex !justify-between'>
        {product ? (
          <>
            <Button variant='contained' className='!bg-gray-400' startIcon={<MdHistory />} onClick={onClose}>
              Edit History
            </Button>
            <div className='flex gap-2'>
            <Button variant='contained' color='error' startIcon={<CiCircleMinus />} onClick={onClose}>
              Delete
            </Button>
            <Button variant='contained' className='text-white' startIcon={<MdOutlineCancel />} onClick={onClose}>
              Close
            </Button>
            <Button variant='contained' color='success' startIcon={<LuRecycle />} onClick={onClose}>
              Save
            </Button>
          </div>
            
          </>
        ) : (
          <>
          <div></div>
          <div className='flex gap-2'>
            <Button
              variant='contained'
              className='!bg-red-500 text-white'
              startIcon={<MdOutlineCancel />}
              onClick={onClose}
            >
              Close
            </Button>
            <Button variant='contained' color='success' startIcon={<CiCirclePlus />} onClick={onClose}>
              Add
            </Button>
          </div>
            
          </>
        )}
      </DialogActions>
    </Dialog>
  )
}

export default ProductDialog
