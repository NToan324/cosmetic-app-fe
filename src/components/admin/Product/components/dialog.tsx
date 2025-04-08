import { useContext, useEffect, useState } from 'react'
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
  Box,
  FormControlLabel,
  Checkbox
} from '@mui/material'
import { MdOutlineCancel, MdHistory } from 'react-icons/md'
import { LuRecycle } from 'react-icons/lu'
import { CiCirclePlus, CiCircleMinus } from 'react-icons/ci'
import productService, { Product } from '@/services/product'
import { AppContext } from '@/provider/appContext'
import { useForm, SubmitHandler } from 'react-hook-form'
import { formatDateForInput } from '@/helpers'
import { urlImage } from '@/consts'
import ConfirmModalDelete from './dialogConfirmDelete'

interface ProductDialogProps {
  open: boolean
  onClose: () => void
  onSave: (product: Product) => void
  product?: Product | null
}

const ProductDialog = ({ open, onClose, product }: ProductDialogProps) => {
  const { categories, brands, setReload, reload } = useContext(AppContext)
  const [imagePreview, setImagePreview] = useState<string>(product?.image_url || urlImage)
  const [openConfirmDelete, setOpenConfirmDelete] = useState(false)

  const accessToken = localStorage.getItem('accessToken')

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
    watch
  } = useForm<Product>({})

  useEffect(() => {
    if (product) {
      reset({
        ...product,
        production_date: formatDateForInput(product.production_date || ''),
        expiration_date: formatDateForInput(product.expiration_date || ''),
        release_date: formatDateForInput(product.release_date || ''),
        discontinued_date: formatDateForInput(product.discontinued_date || '')
      })
      setImagePreview(product.image_url || urlImage)
    } else {
      reset({})
      setImagePreview(urlImage)
    }
  }, [product, reset])

  const imageUrl = watch('image_url')

  useEffect(() => {
    if (imageUrl) {
      setImagePreview(imageUrl)
    }
  }, [imageUrl])

  const handleOnClose = () => {
    onClose()
    reset()
  }

  const handleDelete = async () => {
    if (!product) return
    await productService.deleteProduct({
      accessToken: accessToken || '',
      id: product._id
    })
    setReload(!reload)
    setOpenConfirmDelete(false)
    onClose()
    reset()
  }

  const onSubmit: SubmitHandler<Product> = async (data) => {
    try {
      const response = await productService.createProduct({
        accessToken: accessToken || '',
        product: {
          ...data,
          production_date: new Date(data.production_date).toISOString(),
          expiration_date: new Date(data.expiration_date).toISOString(),
          release_date: data.release_date ? new Date(data.release_date).toISOString() : '',
          discontinued_date: data.discontinued_date ? new Date(data.discontinued_date).toISOString() : null
        }
      })
      if (response.status === 200) {
        onClose()
        setReload(!reload)
        reset()
      }
    } catch (error) {
      if (error instanceof Error) {
        setError('root', {
          type: 'manual',
          message: error.message
        })
      } else {
        setError('root', {
          type: 'manual',
          message: 'An unknown error occurred'
        })
      }
    }
  }

  const onUpdate: SubmitHandler<Product> = async (data) => {
    if (!product) return
    try {
      const response = await productService.updateProduct({
        accessToken: accessToken || '',
        id: product._id,
        product: {
          ...data,
          production_date: new Date(data.production_date).toISOString(),
          expiration_date: new Date(data.expiration_date).toISOString(),
          release_date: data.release_date ? new Date(data.release_date).toISOString() : '',
          discontinued_date: data.discontinued_date ? new Date(data.discontinued_date).toISOString() : null
        }
      })
      if (response.status === 200) {
        setReload(!reload)
        onClose()
        reset()
      }
    } catch (error) {
      if (error instanceof Error) {
        setError('root', {
          type: 'manual',
          message: error.message
        })
      } else {
        setError('root', {
          type: 'manual',
          message: 'An unknown error occurred'
        })
      }
    }
  }

  return (
    <Dialog open={open} maxWidth='md' fullWidth>
      <DialogTitle sx={{ textAlign: 'center' }}>{product ? product.name : 'Add Product'}</DialogTitle>
      <div className='border-t border-gray-300 w-full'></div>
      <form onSubmit={handleSubmit(product ? onUpdate : onSubmit)}>
        <DialogContent>
          <Grid container spacing={2}>
            {/* Image Section */}
            <Grid size={{ xs: 12, md: 5 }}>
              <div className='flex justify-center'>
                <Box
                  component='img'
                  src={imagePreview}
                  alt='Product Image'
                  sx={{ width: '20rem', height: '20rem', borderRadius: '8px', objectFit: 'contain' }}
                />
              </div>
              <TextField
                {...register('image_url')}
                fullWidth
                margin='dense'
                label='Image URL'
                defaultValue={product?.image_url}
              />
            </Grid>

            {/* Product Fields */}
            <Grid size={{ xs: 12, md: 7 }}>
              <TextField
                {...register('name', { required: 'Name is required' })}
                fullWidth
                margin='dense'
                label='Name'
                defaultValue={product?.name}
                error={!!errors.name}
                helperText={errors.name?.message}
                sx={{ mb: 2 }}
              />

              <Select
                {...register('category_id', { required: 'Category is required' })}
                fullWidth
                margin='dense'
                defaultValue={product?.category_id || ''}
                displayEmpty
                sx={{ mb: 2 }}
              >
                <MenuItem value=''>Select Category</MenuItem>
                {categories?.map((cat) => (
                  <MenuItem key={cat._id} value={cat._id}>
                    {cat.name}
                  </MenuItem>
                ))}
              </Select>

              <Select
                {...register('brand_id', { required: 'Brand is required' })}
                fullWidth
                margin='dense'
                defaultValue={product?.brand_id || ''}
                displayEmpty
                sx={{ mb: 2 }}
              >
                <MenuItem value=''>Select Brand</MenuItem>
                {brands?.map((brand) => (
                  <MenuItem key={brand._id} value={brand._id}>
                    {brand.name}
                  </MenuItem>
                ))}
              </Select>

              <TextField
                {...register('stock_quantity', { required: 'Stock quantity is required', valueAsNumber: true })}
                fullWidth
                margin='dense'
                label='Stock Quantity'
                type='number'
                defaultValue={product?.stock_quantity}
                error={!!errors.stock_quantity}
                helperText={errors.stock_quantity?.message}
                sx={{ mb: 2 }}
              />

              <Select
                {...register('units', { required: 'Units is required' })}
                fullWidth
                margin='dense'
                defaultValue={product?.units || ''}
                displayEmpty
              >
                <MenuItem value=''>Select Unit</MenuItem>
                <MenuItem value='BOX'>Box</MenuItem>
                <MenuItem value='TUBE'>Tube</MenuItem>
                <MenuItem value='PACK'>Pack</MenuItem>
                <MenuItem value='PCS'>Piece</MenuItem>
              </Select>

              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    {...register('price', { required: 'Price is required', valueAsNumber: true })}
                    fullWidth
                    margin='dense'
                    label='Original Price'
                    type='number'
                    defaultValue={product?.price}
                    error={!!errors.price}
                    helperText={errors.price?.message}
                    sx={{ mb: 2 }}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    {...register('discount_price', { valueAsNumber: true })}
                    fullWidth
                    margin='dense'
                    label='Discount Price'
                    type='number'
                    defaultValue={product?.discount_price}
                    error={!!errors.discount_price}
                    helperText={errors.discount_price?.message}
                    sx={{ mb: 2 }}
                  />
                </Grid>
              </Grid>
              <FormControlLabel
                control={<Checkbox {...register('disable')} defaultChecked={product?.disable ?? true} />}
                label='Vô hiệu hóa sản phẩm'
                sx={{ mt: 1, mb: 2 }}
              />

              <TextField
                {...register('description', { required: 'Description is required' })}
                fullWidth
                margin='dense'
                label='Description'
                defaultValue={product?.description}
                multiline
                rows={4}
                error={!!errors.description}
                helperText={errors.description?.message}
              />

              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    {...register('production_date', { required: 'Production date is required' })}
                    fullWidth
                    margin='dense'
                    label='Production Date'
                    type='date'
                    defaultValue={formatDateForInput(product?.production_date || '')}
                    error={!!errors.production_date}
                    helperText={errors.production_date?.message}
                    slotProps={{ inputLabel: { shrink: true } }}
                    sx={{ mb: 2 }}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    {...register('expiration_date', { required: 'Expiration date is required' })}
                    fullWidth
                    margin='dense'
                    label='Expiration Date'
                    type='date'
                    defaultValue={formatDateForInput(product?.expiration_date || '')}
                    slotProps={{ inputLabel: { shrink: true } }}
                    error={!!errors.expiration_date}
                    helperText={errors.expiration_date?.message}
                    sx={{ mb: 2 }}
                  />
                </Grid>
              </Grid>

              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    {...register('release_date')}
                    fullWidth
                    margin='dense'
                    label='Release Date'
                    type='date'
                    slotProps={{ inputLabel: { shrink: true } }}
                    defaultValue={formatDateForInput(product?.release_date || '')}
                    sx={{ mb: 2 }}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    {...register('discontinued_date')}
                    fullWidth
                    margin='dense'
                    label='Discontinued Date'
                    type='date'
                    slotProps={{ inputLabel: { shrink: true } }}
                    defaultValue={formatDateForInput(product?.discontinued_date || '')}
                    sx={{ mb: 2 }}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </DialogContent>
        <div className='border-t border-gray-300 w-full'></div>
        <DialogActions className='flex !justify-between'>
          {product ? (
            <>
              <Button variant='contained' className='!bg-gray-400' startIcon={<MdHistory />} onClick={onClose}>
                Edit History
              </Button>
              <div className='flex flex-col items-end gap-2'>
                <div className='flex gap-2 justify-end items-center'>
                  <Button
                    variant='contained'
                    color='error'
                    startIcon={<CiCircleMinus />}
                    onClick={() => setOpenConfirmDelete(true)}
                  >
                    Delete
                  </Button>
                  <ConfirmModalDelete
                    open={openConfirmDelete}
                    onClose={() => setOpenConfirmDelete(false)}
                    onConfirm={handleDelete}
                  />
                  <Button
                    variant='contained'
                    className='text-white'
                    startIcon={<MdOutlineCancel />}
                    onClick={handleOnClose}
                  >
                    Close
                  </Button>
                  <Button variant='contained' color='success' startIcon={<LuRecycle />} type='submit'>
                    Save
                  </Button>
                </div>
                {errors.root && <div className='text-red-500 text-sm '>{errors.root.message}</div>}
              </div>
            </>
          ) : (
            <>
              <div></div>
              <div className='flex flex-col justify-end items-end gap-2 px-4'>
                <div className='flex gap-2 justify-end items-center'>
                  <Button
                    variant='contained'
                    className='!bg-red-500 text-white'
                    startIcon={<MdOutlineCancel />}
                    onClick={handleOnClose}
                  >
                    Close
                  </Button>
                  <Button variant='contained' color='success' startIcon={<CiCirclePlus />} type='submit'>
                    Add
                  </Button>
                </div>
                {errors.root && <div className='text-red-500 text-sm '>{errors.root.message}</div>}
              </div>
            </>
          )}
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default ProductDialog
