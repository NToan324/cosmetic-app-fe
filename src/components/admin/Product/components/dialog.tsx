import { useState } from 'react'
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
import { MdHistory } from 'react-icons/md'
import { Product } from '@/services/product'
import { useContext } from 'react'
import { AppContext } from '@/provider/appContext'

// Props cho dialog
interface ProductDialogProps {
  open: boolean
  onClose: () => void
  onSave: (product: Product) => void
  product?: Product | null
}

const ProductDialog = ({ open, onClose, product }: ProductDialogProps) => {
  const [formData, setFormData] = useState<Product>()
  const { categories } = useContext(AppContext)

  const handleOnClose = () => {
    setFormData({} as Product)
    onClose()
  }

  // Cập nhật dữ liệu nhập vào
  // const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const { name, value } = event.target
  //   setFormData((prev) => ({
  //     ...prev,
  //     [name]: value
  //   }))
  // }

  return (
    <Dialog open={open} maxWidth='md' fullWidth>
      <DialogTitle sx={{ textAlign: 'center' }}>{product ? product.name : 'Add Product'}</DialogTitle>
      <div className='border-t border-gray-300 w-full'></div>
      <DialogContent>
        <Grid container spacing={2} className='max-w-full'>
          <Grid size={{ xs: 12, md: 5 }}>
            <div className='flex justify-center'>
              <Box
                component='img'
                src={product?.image_url}
                alt='Product Image'
                sx={{ width: '20rem', height: '20rem', borderRadius: '8px', objectFit: 'contain' }}
              />
            </div>
          </Grid>

          {/* Phần thông tin sản phẩm (2/3 chiều rộng) */}
          <Grid size={{ xs: 12, md: 7 }} rowSpacing={4}>
            <TextField
              fullWidth
              margin='dense'
              label='Name'
              name='name'
              value={product?.name}
              // onChange={handleChange}
            />

            <Select
              fullWidth
              margin='dense'
              name='category'
              value={
                (categories &&
                  categories.length > 0 &&
                  categories.find((item) => item._id === product?.category_id)?.name) ||
                'default'
              }
              // onChange={(event) => setFormData((prev) => ({ ...prev, category: event.target.value }))}
            >
              <MenuItem value='default'>Category</MenuItem>
              {categories &&
                categories.length > 0 &&
                categories.map((categories) => {
                  return <MenuItem value={categories.name}>{categories.name}</MenuItem>
                })}
            </Select>
            <TextField
              fullWidth
              margin='dense'
              label='Stock'
              name='stock'
              value={product?.stock_quantity}
              // onChange={handleChange}
            />
            {/* Original, Selling, Status (cùng hàng khi rộng, xuống hàng khi hẹp) */}
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  margin='dense'
                  label='Original'
                  name='original'
                  value={formData?.price}
                  // onChange={handleChange}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  margin='dense'
                  label='Selling'
                  name='selling'
                  value={product?.price}
                  // onChange={handleChange}
                />
              </Grid>
            </Grid>

            <TextField
              fullWidth
              margin='dense'
              label='Description'
              name='des'
              value={product?.description}
              // onChange={handleChange}
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
              <Button
                variant='contained'
                className='text-white'
                startIcon={<MdOutlineCancel />}
                onClick={handleOnClose}
              >
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
                onClick={handleOnClose}
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
