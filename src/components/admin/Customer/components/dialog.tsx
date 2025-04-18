import { useEffect, useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  Box,
  Typography,
  Collapse
} from '@mui/material'
import { ExpandMore, ExpandLess } from '@mui/icons-material'
import { MdOutlineCancel } from 'react-icons/md'
import { LuRecycle } from 'react-icons/lu'
import { CiCirclePlus, CiCircleMinus } from 'react-icons/ci'
import customerService, { Customer, CustomerCreateData, CustomerEditHistory } from '@/services/customer.service'
import { useForm } from 'react-hook-form'
import { useContext } from 'react'
import { AppContext } from '@/provider/appContext'
import { useQueryClient } from '@tanstack/react-query'
import ConfirmModalDelete from './dialogDelete'

interface CustomerDialogProps {
  open: boolean
  onClose: () => void
  customer: Customer | null
  accessToken: string
  onActionSuccess: (message: string) => void
}


const CustomerDialog = ({ open, onClose, customer, accessToken, onActionSuccess }: CustomerDialogProps) => {
  const { reload, setReload } = useContext(AppContext)
  const [openConfirmDelete, setOpenConfirmDelete] = useState(false)
  const [editHistory, setEditHistory] = useState<CustomerEditHistory[]>([])
  const [historyOpen, setHistoryOpen] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset
  } = useForm<CustomerCreateData>({
    defaultValues: {
      name: customer?.user?.name  || '',
      phone: customer?.user?.phone || '',
      note: customer?.note         || '',
      reason: ''
    }
  })
  const queryClient = useQueryClient()

  // Khi customer thay đổi hoặc dialog mở, reset lại giá trị của form.
  useEffect(() => {
    reset({
      name:    customer?.user?.name  || '',
      phone:   customer?.user?.phone || '',
      note:    customer?.note         || '',
      reason:  ''
    })
  }, [customer, open, reset])
  

  useEffect(() => {
    const fetchCustomerDetail = async () => {
      if (customer && open) {
        try {
          const response = await customerService.getCustomerDetail({
            accessToken,
            id: customer.userId
          })
          setEditHistory(
            response.customer.edit_history.sort(
              (a, b) => new Date(b.edited_at).getTime() - new Date(a.edited_at).getTime()
            )
          )
        } catch (error) {
          console.error('Error fetching customer detail:', error)
        }
      }
    }
    fetchCustomerDetail()
  }, [customer, open, accessToken])

  const handleAdd = async (data: CustomerCreateData) => {
    try {
      const response = await customerService.createCustomer({
        accessToken,
        data
      })
      if (response) {
        queryClient.invalidateQueries({
          queryKey: ['customers']
        })
        setReload(!reload)
        onActionSuccess(`Đã thêm khách hàng ${data.name || 'KH' + data.phone.slice(-4)} thành công`)
        onClose()
        reset()
      }
    } catch (error) {
      if (error instanceof Error) {
        setError('root', { message: error.message })
      } else {
        setError('root', { message: 'An unknown error occurred' })
      }
    }
  }

  const handleUpdate = async (data: CustomerCreateData) => {
    if (!customer) return
    try {
      const response = await customerService.updateCustomer({
        accessToken,
        id: customer.userId,
        data
      })
      if (response) {
        queryClient.invalidateQueries({
          queryKey: ['customers']
        })
        setReload(!reload)
        onActionSuccess(`Đã cập nhật khách hàng ${customer.user.name} thành công`)
        onClose()
        reset()
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Đã có lỗi xảy ra'
      setError('root', { message })
    }
  }

  const handleConfirmDelete = async () => {
    if (!customer) return
    await customerService.deleteCustomer({
      accessToken,
      id: customer.userId
    })
    onClose()
    queryClient.invalidateQueries({
      queryKey: ['customers']
    })
    setReload(!reload)
    onActionSuccess(`Đã xóa khách hàng ${customer.user.name} thành công`)
    setOpenConfirmDelete(false)
    onClose()
    reset()
  }

  const handleOnClose = () => {
    setEditHistory([])
    setHistoryOpen(false)
    onClose()
    reset()
  }
  
  return (
    <Dialog open={open} maxWidth='md' fullWidth>
      <DialogTitle sx={{ textAlign: 'center' }}>
        {customer?.user?.name ?? 'Thêm khách hàng'}
      </DialogTitle>
      <Box className='border-t border-gray-300 w-full' />
      <form
        onSubmit={handleSubmit((data) => {
          if (customer) {
            handleUpdate(data as CustomerCreateData)
          } else {
            handleAdd(data as CustomerCreateData)
          }
        })}
      >
        <DialogContent>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                {...register('name', {
                  maxLength: { value: 50, message: 'Tên không được vượt quá 50 ký tự' }
                })}
                fullWidth
                margin='dense'
                label='Tên'
                name='name'
                defaultValue={customer?.user.name}
              />
              {errors.name && (
                <Typography variant='body2' color='error' textAlign={'start'}>
                  {errors.name.message}
                </Typography>
              )}
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                {...register('phone', {
                  required: 'Số điện thoại là bắt buộc',
                  pattern: {
                    value: /^(0[3|5|7|8|9]|01[2|6|8|9])[0-9]{8}$/,
                    message: 'Số điện thoại không hợp lệ'
                  }
                })}
                fullWidth
                margin='dense'
                label='Số điện thoại'
                name='phone'
                defaultValue={customer?.user.phone}
              />
              {errors.phone && (
                <Typography variant='body2' color='error' textAlign={'start'}>
                  {errors.phone.message}
                </Typography>
              )}
            </Grid>
            {customer && (
              <>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    label="Point"
                    value={customer.point}
                    fullWidth
                    margin="dense"
                    disabled
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    label="Rank"
                    value={customer.rank}
                    fullWidth
                    margin="dense"
                    disabled
                  />
                </Grid>
              </>
            )}
            <Grid size={{ xs: 12 }}>
              <TextField
                {...register('note')}
                fullWidth
                margin='dense'
                label='Ghi chú'
                name='note'
                defaultValue={customer?.note}
              />
            </Grid>
            {customer && (
              <Grid size={{ xs: 12 }}>
                <TextField
                  {...register('reason', {
                    required: 'Vui lòng nhập lý do',
                    maxLength: { value: 200, message: 'Lý do không được vượt quá 200 ký tự' }
                  })}
                  fullWidth
                  margin='dense'
                  label='Lý do'
                  name='reason'
                />
                {errors.reason?.message && (
                  <Typography variant='body2' color='error' textAlign={'start'}>
                    {errors.reason.message}
                  </Typography>
                )}
              </Grid>
            )}
            {customer && editHistory.length > 0 && (
              <Grid size={{ xs: 12 }}>
                <Box mt={2}>
                  <Button
                    onClick={() => setHistoryOpen(!historyOpen)}
                    endIcon={historyOpen ? <ExpandLess /> : <ExpandMore />}
                    variant='outlined'
                    fullWidth
                  >
                    Lịch sử chỉnh sửa
                  </Button>
                  <Collapse in={historyOpen}>
                    <Box mt={2} sx={{ maxHeight: '200px', overflowY: 'auto' }}>
                      {editHistory.map((history, index) => (
                        <Box
                          key={index}
                          sx={{
                            p: 1,
                            mb: 1,
                            border: '1px solid #e0e0e0',
                            borderRadius: '4px',
                            backgroundColor: '#f5f5f5'
                          }}
                        >
                          <Typography variant='body2'>
                            <strong>Ngày:</strong> {new Date(history.edited_at).toLocaleString()}
                          </Typography>
                          <Typography variant='body2'>
                            <strong>Người thao tác:</strong> {history.edited_by?.name || 'Unknown'} (ID:{' '}
                            {history.edited_by?._id || 'Unknown'})
                          </Typography>
                          <Typography variant='body2'>
                            <strong>Lý do:</strong> {history.reason}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  </Collapse>
                </Box>
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <Box className='border-t border-gray-300 w-full' />
        <DialogActions className='flex !justify-between'>
          {customer ? (
            <div className='flex flex-col justify-end items-end w-full gap-2'>
              <div className='flex justify-end gap-2'>
                <Button
                  variant='contained'
                  color='error'
                  startIcon={<CiCircleMinus />}
                  onClick={() => setOpenConfirmDelete(true)}
                >
                  Xóa
                </Button>
                <ConfirmModalDelete
                  open={openConfirmDelete}
                  onClose={() => setOpenConfirmDelete(false)}
                  onConfirm={handleConfirmDelete}
                />
                <Button
                  variant='contained'
                  startIcon={<MdOutlineCancel />}
                  onClick={handleOnClose}
                  sx={{ backgroundColor: '#ef5350', color: 'white' }}
                >
                  Đóng
                </Button>
                <Button type='submit' variant='contained' sx={{ backgroundColor: '#4caf50' }} startIcon={<LuRecycle />}>
                  Sửa
                </Button>
              </div>
              {errors.root && (
                <Typography variant='body2' color='error' textAlign={'start'}>
                  {errors.root.message}
                </Typography>
              )}
            </div>
          ) : (
            <div className='flex flex-col justify-end items-end w-full gap-2'>
              <div className='flex justify-end gap-2'>
                <Button
                  variant='contained'
                  startIcon={<MdOutlineCancel />}
                  onClick={handleOnClose}
                  sx={{ backgroundColor: '#ef5350', color: 'white' }}
                >
                  Đóng
                </Button>
                <Button type='submit' variant='contained' startIcon={<CiCirclePlus />}>
                  Thêm
                </Button>
              </div>
              {errors.root && (
                <Typography variant='body2' color='error' textAlign={'start'}>
                  {errors.root.message}
                </Typography>
              )}
            </div>
          )}
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default CustomerDialog
