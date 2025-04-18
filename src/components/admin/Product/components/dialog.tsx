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
  Checkbox,
  CircularProgress
} from '@mui/material'
import { MdOutlineCancel, MdHistory } from 'react-icons/md'
import { LuRecycle } from 'react-icons/lu'
import { CiCirclePlus, CiCircleMinus } from 'react-icons/ci'
import productService, { Product } from '@/services/product.service'
import { AppContext } from '@/provider/appContext'
import { useForm, SubmitHandler } from 'react-hook-form'
import { formatDateForInput } from '@/helpers'
import { urlImage } from '@/consts'
import ConfirmModalDelete from './dialogConfirmDelete'
import { useQueryClient } from '@tanstack/react-query'

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
  const [isLoading, setIsLoading] = useState(false)

  const accessToken = localStorage.getItem('accessToken')
  const queryClient = useQueryClient()

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
    setIsLoading(true)
    if (!product) return
    await productService.deleteProduct({
      accessToken: accessToken || '',
      id: product._id
    })
    setIsLoading(false)
    setReload(!reload)
    setOpenConfirmDelete(false)
    onClose()
    reset()
    queryClient.invalidateQueries({ queryKey: ['products'] })
  }

  const onSubmit: SubmitHandler<Product> = async (data) => {
    setIsLoading(true)
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
        queryClient.invalidateQueries({ queryKey: ['products'] })
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
    setIsLoading(false)
  }

  const onUpdate: SubmitHandler<Product> = async (data) => {
    setIsLoading(true)
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
        queryClient.invalidateQueries({ queryKey: ['products'] })
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
    setIsLoading(false)
  }

  return (
    <Dialog open={open} maxWidth='md' fullWidth>
      <DialogTitle sx={{ textAlign: 'center' }}>{product ? product.name : 'Thêm sản phẩm mới'}</DialogTitle>
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
                label='URL hình ảnh'
                defaultValue={product?.image_url}
              />
            </Grid>

            {/* Product Fields */}
            <Grid size={{ xs: 12, md: 7 }}>
              <TextField
                fullWidth
                margin='dense'
                type='text'
                label='Mã sản phẩm'
                value={product?.code}
                disabled
                slotProps={{ inputLabel: { shrink: true } }}
                sx={{ mb: 2 }}
              />
              <TextField
                {...register('name', { required: 'Vui lòng nhập tên sản phẩm' })}
                fullWidth
                margin='dense'
                label='Tên sản phẩm'
                defaultValue={product?.name}
                error={!!errors.name}
                helperText={errors.name?.message}
                sx={{ mb: 2 }}
              />

              <Select
                {...register('category_id', { required: 'Vui lòng chọn danh mục sản phẩm' })}
                fullWidth
                margin='dense'
                defaultValue={product?.category_id || ''}
                label='Danh mục'
                displayEmpty
                sx={{ mb: 2 }}
              >
                <MenuItem value=''>Danh mục sản phẩm</MenuItem>
                {categories?.map((cat) => (
                  <MenuItem key={cat._id} value={cat._id}>
                    {cat.name}
                  </MenuItem>
                ))}
              </Select>

              <Select
                {...register('brand_id', { required: 'Vui lòng chọn thương hiệu sản phẩm' })}
                fullWidth
                margin='dense'
                label='Thương hiệu'
                defaultValue={product?.brand_id || ''}
                displayEmpty
                sx={{ mb: 2 }}
              >
                <MenuItem value=''>Thương hiệu</MenuItem>
                {brands?.map((brand) => (
                  <MenuItem key={brand._id} value={brand._id}>
                    {brand.name}
                  </MenuItem>
                ))}
              </Select>

              <TextField
                {...register('stock_quantity', { required: 'Vui lòng nhập số lượng', valueAsNumber: true })}
                fullWidth
                margin='dense'
                label='Số lượng tồn kho'
                type='number'
                defaultValue={product?.stock_quantity}
                error={!!errors.stock_quantity}
                helperText={errors.stock_quantity?.message}
                sx={{ mb: 2 }}
              />

              <Select
                {...register('units', { required: 'Vui lòng chọn đơn vị tính' })}
                fullWidth
                label='Đơn vị tính'
                margin='dense'
                defaultValue={product?.units || ''}
                displayEmpty
                sx={{ mb: 2 }}
              >
                <MenuItem value=''>Đơn vị tính</MenuItem>
                <MenuItem value='BOX'>Hộp</MenuItem>
                <MenuItem value='TUBE'>Tuýp</MenuItem>
                <MenuItem value='PACK'>Gói</MenuItem>
                <MenuItem value='PCS'>Lọ</MenuItem>
              </Select>

              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    {...register('price', { required: 'Vui lòng nhập giá gốc', valueAsNumber: true })}
                    fullWidth
                    margin='dense'
                    label='Giá gốc'
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
                    label='Giá khuyến mãi'
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
                {...register('description', { required: 'Vui lòng nhập mô tả sản phẩm' })}
                fullWidth
                margin='dense'
                label='Mô tả sản phẩm'
                defaultValue={product?.description}
                multiline
                rows={4}
                error={!!errors.description}
                helperText={errors.description?.message}
              />

              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    {...register('production_date', { required: 'Vui lòng chọn ngày sản xuất' })}
                    fullWidth
                    margin='dense'
                    label='Ngày sản xuất'
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
                    {...register('expiration_date', { required: 'Vui lòng chọn ngày hết hạn' })}
                    fullWidth
                    margin='dense'
                    label='Ngày hết hạn'
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
                    label='Ngày bán ra'
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
                    label='Ngày ngừng bán'
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
                    disabled={isLoading}
                    variant='contained'
                    color='error'
                    startIcon={<CiCircleMinus />}
                    onClick={() => setOpenConfirmDelete(true)}
                  >
                    {isLoading && (
                      <CircularProgress
                        size={20}
                        className='absolute'
                        sx={{
                          color: 'black',
                          opacity: 0.5
                        }}
                      />
                    )}
                    Xóa
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
                    Đóng
                  </Button>
                  <Button
                    disabled={isLoading}
                    variant='contained'
                    color='success'
                    startIcon={<LuRecycle />}
                    type='submit'
                  >
                    {isLoading && (
                      <CircularProgress
                        size={20}
                        className='absolute'
                        sx={{
                          color: 'black',
                          opacity: 0.5
                        }}
                      />
                    )}
                    Lưu
                  </Button>
                </div>
                {errors.root && <div className='text-red-500 text-sm '>{errors.root.message}</div>}
              </div>
            </>
          ) : (
            <div className='flex flex-col justify-end items-end gap-2 px-4 w-full'>
              <div className='flex gap-2 justify-end items-center'>
                <Button
                  variant='contained'
                  className='!bg-red-500 text-white'
                  startIcon={<MdOutlineCancel />}
                  onClick={handleOnClose}
                >
                  Đóng
                </Button>
                <Button
                  disabled={isLoading}
                  variant='contained'
                  color='success'
                  startIcon={<CiCirclePlus />}
                  type='submit'
                >
                  {isLoading && (
                    <CircularProgress
                      size={20}
                      className='absolute'
                      sx={{
                        color: 'black',
                        opacity: 0.5
                      }}
                    />
                  )}
                  Thêm
                </Button>
              </div>
              {errors.root && <div className='text-red-500 text-sm '>{errors.root.message}</div>}
            </div>
          )}
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default ProductDialog
