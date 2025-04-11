import React from 'react'
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Grid } from '@mui/material'
import { MdHistory, MdOutlineCancel } from 'react-icons/md'
import { LuRecycle } from 'react-icons/lu'
import { CiCirclePlus } from 'react-icons/ci'
import { CiCircleMinus } from 'react-icons/ci'
import { Customer } from '@/services/customer.service'
import { formatDate } from '@/helpers'
import { useForm, SubmitHandler } from 'react-hook-form'

interface CustomerDialogProps {
  open: boolean
  onClose: () => void
  onSave: (customer: Customer) => void
  onDelete?: (customer: Customer) => void
  customer: Customer | null
}

const CustomerDialog: React.FC<CustomerDialogProps> = ({ open, onClose, onDelete, customer }) => {
  const handleDelete = () => {
    if (onDelete && customer) {
      onDelete(customer)
      onClose()
    }
  }
  const { register, handleSubmit } = useForm<Customer>()

  const onSubmit: SubmitHandler<Customer> = async (data) => {
    console.log('Form data:', data)
  }

  return (
    <Dialog open={open} maxWidth='md' fullWidth>
      <DialogTitle sx={{ textAlign: 'center' }}>{customer ? customer.name : 'Add Customer'}</DialogTitle>
      <div className='border-t border-gray-300 w-full '></div>
      <form action='' onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          {customer ? (
            <>
              <Grid container columnSpacing={2}>
                <Grid size={{ xs: 12, md: 4 }}>
                  <TextField
                    {...register('phone', {
                      required: 'Phone number is required',
                      pattern: {
                        value: /^\d{10}$/,
                        message: 'Phone number must be 10 digits'
                      }
                    })}
                    fullWidth
                    margin='dense'
                    label='Phone Number'
                    name='phone'
                    defaultValue={customer.phone}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 8 }}>
                  <TextField
                    {...register('name', {
                      required: 'Name is required',
                      minLength: {
                        value: 3,
                        message: 'Name must be at least 3 characters'
                      }
                    })}
                    fullWidth
                    margin='dense'
                    label='Name'
                    name='name'
                    defaultValue={customer.name}
                  />
                </Grid>
              </Grid>
              <Grid container columnSpacing={2}>
                <Grid size={{ xs: 12, md: 4 }}>
                  <TextField
                    {...register('transaction', {
                      required: 'Transaction is required'
                    })}
                    fullWidth
                    margin='dense'
                    label='Transaction'
                    name='transaction'
                    defaultValue={1}
                    disabled
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <TextField
                    {...register('customer.point', {
                      required: 'Point is required',
                      pattern: {
                        value: /^\d+$/,
                        message: 'Point must be a number'
                      }
                    })}
                    fullWidth
                    margin='dense'
                    label='Point'
                    name='point'
                    defaultValue={customer.customer.point}
                    disabled
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <TextField
                    {...register('customer.rank', {
                      required: 'Rank is required'
                    })}
                    fullWidth
                    margin='dense'
                    label='Rank'
                    name='rank'
                    defaultValue={customer.customer.rank}
                    disabled
                  />
                </Grid>
              </Grid>
              <Grid container columnSpacing={2}>
                <Grid size={{ xs: 12, md: 4 }}>
                  <TextField
                    {...register('createdAt', {
                      required: 'Date Joined is required'
                    })}
                    fullWidth
                    margin='dense'
                    label='Date Joined'
                    name='dateJoined'
                    defaultValue={formatDate(customer.createdAt)}
                    disabled
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 4 }} className='flex justify-center my-2'>
                  <Button variant='contained' fullWidth className='!bg-gray-400'>
                    Transaction History
                  </Button>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }} className='flex justify-center my-2'>
                  <Button variant='contained' fullWidth>
                    Reset Password
                  </Button>
                </Grid>
              </Grid>
            </>
          ) : (
            <>
              <Grid container columnSpacing={2}>
                <Grid size={{ xs: 12, md: 4 }}>
                  <TextField fullWidth margin='dense' label='Phone Number' name='phone' />
                </Grid>
                <Grid size={{ xs: 12, md: 8 }}>
                  <TextField fullWidth margin='dense' label='Name' name='name' />
                </Grid>
              </Grid>
            </>
          )}
        </DialogContent>
        <div className='border-t border-gray-300 w-full '></div>
        <DialogActions className='flex !justify-between'>
          {customer ? (
            <>
              <Button variant='contained' className='!bg-gray-400' startIcon={<MdHistory />} onClick={onClose}>
                Edit History
              </Button>

              <div className='flex gap-2'>
                <Button variant='contained' color='error' startIcon={<CiCircleMinus />} onClick={handleDelete}>
                  Xóa
                </Button>
                <Button variant='contained' startIcon={<MdOutlineCancel />} onClick={onClose} className='text-white'>
                  Đóng
                </Button>
                <Button type='submit' variant='contained' sx={{ backgroundColor: '#4caf50' }} startIcon={<LuRecycle />}>
                  Lưu
                </Button>
              </div>
            </>
          ) : (
            <>
              <div></div>
              <div className='flex gap-2'>
                <Button
                  variant='contained'
                  startIcon={<MdOutlineCancel />}
                  onClick={onClose}
                  className='!bg-red-500 text-white'
                >
                  Đóng
                </Button>
                <Button variant='contained' startIcon={<CiCirclePlus />}>
                  Thêm
                </Button>
              </div>
            </>
          )}
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default CustomerDialog
