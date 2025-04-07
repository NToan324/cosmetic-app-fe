import React, { useState, useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  SelectChangeEvent,
  MenuItem,
  Button,
  Grid,
  Box,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormLabel
} from '@mui/material'
import { MdOutlineCancel } from 'react-icons/md'
import { LuRecycle } from 'react-icons/lu'
import { CiCirclePlus } from 'react-icons/ci'
import { CiCircleMinus } from 'react-icons/ci'
import DEFAULT from '@/assets/images/default_avatar.jpg'
import employeeService, { Employee, EmployeeCreateData } from '@/services/employee'
import { useForm, SubmitHandler } from 'react-hook-form'

interface EmployeeDialogProps {
  open: boolean
  onClose: () => void
  onSave: (employee: any) => void
  employee?: Employee | null
  accessToken: string
  userId?: string
}

const EmployeeDialog: React.FC<EmployeeDialogProps> = ({ open, onClose, onSave, employee, accessToken, userId }) => {
  const [formData, setFormData] = useState<EmployeeCreateData>({
    name: '',
    email: '',
    phone: '',
    role: ['SALESTAFF'],
    type: 'FULLTIME',
    active: true,
    disable: false,
    image_url: DEFAULT,
    created_by: undefined,
    edited_by: userId,
    reason: ''
  })
  const [editHistory, setEditHistory] = useState<any[]>([])
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError
  } = useForm<EmployeeCreateData>()

  useEffect(() => {
    if (open) {
      setFormData({
        name: employee?.user.name || '',
        email: employee?.user.email || '',
        phone: employee?.user.phone || '',
        role: employee?.user.role || ['SALESTAFF'],
        type: employee?.type || 'FULLTIME',
        active: employee?.user?.active ?? true,
        disable: employee?.disable ?? false,
        image_url: employee?.image_url || DEFAULT,
        created_by: userId,
        edited_by: userId,
        reason: ''
      })
      setEditHistory(employee?.edit_history || [])
    }
  }, [open, employee, userId])

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'active' || name === 'disable' ? value === 'true' : value
    }))
  }

  const handleSelectChange = (event: SelectChangeEvent<string>) => {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const imageUrl = URL.createObjectURL(file)
      setFormData((prev) => ({ ...prev, image_url: imageUrl }))
    }
  }

  const handleSave: SubmitHandler<EmployeeCreateData> = async (data: EmployeeCreateData) => {
    console.log('Form data:', data)
    try {
      const response = await employeeService.createEmployee({
        accessToken: accessToken,
        data
      })
      if (response) {
        onClose()
      }
    } catch (error) {
      if (error instanceof Error) {
        setError('root', {
          message: error.message
        })
      } else {
        setError('root', {
          message: 'An unknown error occurred'
        })
      }
    }
  }

  const handleDelete = () => {
    if (!employee) return
    const deleteData = {
      deleted_by: '67f2d1bcbbc14768a52717df',
      reason: formData.reason || 'Xóa bởi admin'
    }
    onSave({ ...employee, ...deleteData })
    onClose()
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth='md' fullWidth>
      <DialogTitle sx={{ textAlign: 'center' }}>
        {employee ? `Chi tiết nhân viên: ${employee.user.id}` : 'Thêm nhân viên'}
      </DialogTitle>
      <Box className='border-t border-gray-300 w-full' />
      <form action='' onSubmit={handleSubmit(handleSave)}>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 4 }}>
              <Box display='flex' flexDirection='column' alignItems='center'>
                <img
                  src={formData.image_url}
                  alt='Avatar'
                  style={{ width: '100px', height: '100px', borderRadius: '8px', objectFit: 'cover' }}
                />
                <Button variant='contained' component='label' sx={{ mt: 1 }}>
                  Chọn ảnh
                  <input type='file' hidden accept='image/*' onChange={handleImageChange} />
                </Button>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, md: 8 }}>
              <TextField
                {...register('name', {
                  required: 'Tên là bắt buộc',
                  maxLength: { value: 50, message: 'Tên không được vượt quá 50 ký tự' }
                })}
                fullWidth
                margin='dense'
                label='Tên'
                name='name'
              />
              {errors.name && (
                <Typography variant='body2' color='error' textAlign={'start'}>
                  {errors.name.message}
                </Typography>
              )}
              <TextField
                {...register('email', {
                  required: 'Email là bắt buộc',
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    message: 'Email không hợp lệ'
                  }
                })}
                fullWidth
                margin='dense'
                label='Email'
                name='email'
              />
              {errors.email && (
                <Typography variant='body2' color='error' textAlign={'start'}>
                  {errors.email.message}
                </Typography>
              )}
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
              />
              {errors.phone && (
                <Typography variant='body2' color='error' textAlign={'start'}>
                  {errors.phone.message}
                </Typography>
              )}
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Select
                {...register('role', { required: 'Vai trò là bắt buộc' })}
                fullWidth
                margin='dense'
                label='Vai trò'
                name='role'
                multiple
                value={formData.role}
                onChange={handleSelectChange}
              >
                <MenuItem value='MANAGER'>Quản lý</MenuItem>
                <MenuItem value='SALESTAFF'>Nhân viên bán hàng</MenuItem>
                <MenuItem value='CONSULTANT'>Tư vấn viên</MenuItem>
              </Select>
              {errors.role && (
                <Typography variant='body2' color='error' textAlign={'start'}>
                  {errors.role.message}
                </Typography>
              )}
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Select
                {...register('type', { required: 'Loại là bắt buộc' })}
                fullWidth
                margin='dense'
                label='Loại'
                name='type'
                value={formData.type}
                onChange={handleSelectChange}
              >
                <MenuItem value='PARTTIME'>Bán thời gian</MenuItem>
                <MenuItem value='FULLTIME'>Toàn thời gian</MenuItem>
              </Select>
              {errors.type && (
                <Typography variant='body2' color='error' textAlign={'start'}>
                  {errors.type.message}
                </Typography>
              )}
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <FormLabel component='legend'>Hoạt động</FormLabel>
              <RadioGroup row name='active' value={(formData.active ?? true).toString()} onChange={handleChange}>
                <FormControlLabel value='true' control={<Radio />} label='Hoạt động' />
                <FormControlLabel value='false' control={<Radio />} label='Không hoạt động' />
              </RadioGroup>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <FormLabel component='legend'>Tắt</FormLabel>
              <RadioGroup row name='disable' value={(formData.disable ?? false).toString()} onChange={handleChange}>
                <FormControlLabel value='true' control={<Radio />} label='Tắt' />
                <FormControlLabel value='false' control={<Radio />} label='Bật' />
              </RadioGroup>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                margin='dense'
                label='Lý do'
                name='reason'
                value={formData.reason}
                onChange={handleChange}
              />
            </Grid>
          </Grid>

          {editHistory.length > 0 && (
            <Box mt={4}>
              <Typography variant='h6'>Lịch sử chỉnh sửa</Typography>
              {editHistory.map((history, index) => (
                <Box key={index} mt={2}>
                  <Typography variant='body1'>
                    <strong>Thời gian chỉnh sửa:</strong> {new Date(history.edited_at).toLocaleString()}
                  </Typography>
                  <Typography variant='body1'>
                    <strong>Người chỉnh sửa:</strong> {history.edited_by?.name || 'Admin'} (ID:{' '}
                    {history.edited_by?._id || '67f2d1bcbbc14768a52717dd'})
                  </Typography>
                  <Typography variant='body1'>
                    <strong>Lý do:</strong> {history.reason}
                  </Typography>
                  <Typography variant='body1'>
                    <strong>Thay đổi:</strong>
                  </Typography>
                  {history.changes?.before && history.changes?.after ? (
                    Object.entries(history.changes.after).map(([key, value]) => (
                      <Typography key={key} variant='body2'>
                        {key}: {history.changes.before[key] ?? 'N/A'} → {value ?? 'N/A'}
                      </Typography>
                    ))
                  ) : (
                    <Typography variant='body2'>Không có thay đổi chi tiết</Typography>
                  )}
                </Box>
              ))}
            </Box>
          )}
        </DialogContent>
        <Box className='border-t border-gray-300 w-full' />
        <DialogActions className='flex !justify-between'>
          {employee ? (
            <>
              <div className='flex gap-2'>
                <Button variant='contained' color='error' startIcon={<CiCircleMinus />} onClick={handleDelete}>
                  Xóa
                </Button>
                <Button variant='contained' startIcon={<MdOutlineCancel />} onClick={onClose} className='text-white'>
                  Đóng
                </Button>
                <Button variant='contained' sx={{ backgroundColor: '#4caf50' }} startIcon={<LuRecycle />}>
                  Lưu
                </Button>
              </div>
            </>
          ) : (
            <div className='flex flex-col justify-center items-end gap-2 w-full'>
              <div className='flex justify-end gap-2'>
                <Button
                  variant='contained'
                  className='!bg-red-500 text-white'
                  startIcon={<MdOutlineCancel />}
                  onClick={onClose}
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

export default EmployeeDialog
