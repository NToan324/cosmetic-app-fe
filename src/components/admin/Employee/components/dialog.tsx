import { useEffect, useState } from 'react'
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
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormLabel,
  Collapse,
  CircularProgress
} from '@mui/material'
import { ExpandMore, ExpandLess } from '@mui/icons-material'
import { MdOutlineCancel } from 'react-icons/md'
import { LuRecycle } from 'react-icons/lu'
import { CiCircleMinus, CiCirclePlus } from 'react-icons/ci'
import employeeService, { Employee, EmployeeCreateData, EmployeeEditHistory } from '@/services/employee.service'
import { useForm, SubmitHandler } from 'react-hook-form'
import { useContext } from 'react'
import { AppContext } from '@/provider/appContext'
import ConfirmModalDelete from './dialogDelete'
import { Role } from '@/consts'
import { useQueryClient } from '@tanstack/react-query'

interface EmployeeDialogProps {
  open: boolean
  onClose: () => void
  employee: Employee | null
  accessToken: string
  onActionSuccess: (message: string) => void // Thêm prop callback
}

const EmployeeDialog = ({ open, onClose, employee, accessToken, onActionSuccess }: EmployeeDialogProps) => {
  const { reload, setReload } = useContext(AppContext)
  const [openConfirmDelete, setOpenConfirmDelete] = useState(false)
  const [disable, setDisable] = useState(employee ? employee.disable : true)
  const [role, setRole] = useState<Array<string>>(employee ? employee.user.role : [Role.CONSULTANT])
  const [editHistory, setEditHistory] = useState<EmployeeEditHistory[]>([])
  const [historyOpen, setHistoryOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset
  } = useForm<EmployeeCreateData>()
  const queryClient = useQueryClient()

  useEffect(() => {
    if (employee) {
      setDisable(employee.disable)
      setRole(employee.user.role)
    } else {
      setDisable(false)
      setRole([Role.CONSULTANT])
    }
  }, [employee])

  useEffect(() => {
    const fetchEmployeeDetail = async () => {
      if (employee && open) {
        try {
          const response = await employeeService.getEmployeeDetail({
            accessToken,
            id: employee.userId
          })
          setEditHistory(
            response.employee.edit_history.sort(
              (a, b) => new Date(b.edited_at).getTime() - new Date(a.edited_at).getTime()
            )
          )
        } catch (error) {
          console.error('Error fetching employee detail:', error)
        }
      }
    }
    fetchEmployeeDetail()
  }, [employee, open, accessToken])

  const handleAdd: SubmitHandler<EmployeeCreateData> = async (data: EmployeeCreateData) => {
    setIsLoading(true)
    data.disable = disable
    data.role = role
    try {
      const response = await employeeService.createEmployee({
        accessToken: accessToken,
        data
      })
      if (response) {
        queryClient.invalidateQueries({
          queryKey: ['employees']
        })
        setReload(!reload)
        onActionSuccess(`Đã thêm nhân viên ${data.name} thành công`) // Gọi callback
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
    setIsLoading(false)
  }

  const handleOnClose = () => {
    setEditHistory([])
    setHistoryOpen(false)
    onClose()
    reset()
  }

  const handleConfirmDelete = async () => {
    setIsLoading(true)
    if (!employee) return
    await employeeService.deleteEmployee({
      accessToken,
      id: employee?.userId
    })
    onClose()
    queryClient.invalidateQueries({
      queryKey: ['employees']
    })
    setIsLoading(false)
    setReload(!reload)
    onActionSuccess(`Đã xóa nhân viên ${employee.user.name} thành công`) // Gọi callback
    setOpenConfirmDelete(false)
    onClose()
    reset()
  }

  const handleUpdate: SubmitHandler<EmployeeCreateData> = async (data) => {
    setIsLoading(true)
    if (!employee) return
    data.disable = disable
    data.role = role
    const updateData = { ...data }
    try {
      const response = await employeeService.updateEmployee({
        accessToken,
        id: employee.userId,
        data: updateData
      })
      if (response) {
        queryClient.invalidateQueries({
          queryKey: ['employees']
        })
        setReload(!reload)
        onActionSuccess(`Đã cập nhật nhân viên ${employee.user.name} thành công`) // Gọi callback
        onClose()
        reset()
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Đã có lỗi xảy ra'
      setError('root', { message })
    }
    setIsLoading(false)
  }

  return (
    <Dialog open={open} maxWidth='md' fullWidth>
      <DialogTitle sx={{ textAlign: 'center' }}>{employee ? employee?.user.name : 'Thêm nhân viên'}</DialogTitle>
      <Box className='border-t border-gray-300 w-full' />
      <form action='' onSubmit={employee ? handleSubmit(handleUpdate) : handleSubmit(handleAdd)}>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 4 }}>
              <Box display='flex' flexDirection='column' alignItems='center'>
                <img
                  src={employee?.image_url}
                  alt='Avatar'
                  style={{ width: '100px', height: '100px', borderRadius: '8px', objectFit: 'cover' }}
                />
                <Button variant='contained' component='label' sx={{ mt: 1 }}>
                  Chọn ảnh
                  <input type='file' hidden accept='image/*' />
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
                defaultValue={employee?.user.name}
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
                defaultValue={employee?.user.email}
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
                defaultValue={employee?.user.phone}
              />
              {errors.phone && (
                <Typography variant='body2' color='error' textAlign={'start'}>
                  {errors.phone.message}
                </Typography>
              )}
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Select
                multiple
                fullWidth
                margin='dense'
                label='Vai trò'
                name='role'
                defaultValue={role}
                onChange={(e) => {
                  const selectedRoles = e.target.value as string[]
                  setRole(selectedRoles)
                }}
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
                defaultValue={employee ? employee.type : 'FULLTIME'}
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
              <FormLabel component='legend'>Trạng thái</FormLabel>
              <RadioGroup
                row
                name='disable'
                value={disable}
                defaultValue={disable}
                onChange={(e) => {
                  setDisable(e.target.value === 'true')
                }}
              >
                <FormControlLabel value={false} control={<Radio />} label='Hoạt động' />
                <FormControlLabel value={true} control={<Radio />} label='Vô hiệu hóa' />
              </RadioGroup>
              {errors.disable && (
                <Typography variant='body2' color='error' textAlign={'start'}>
                  {errors.disable.message}
                </Typography>
              )}
            </Grid>
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
              {errors.reason && (
                <Typography variant='body2' color='error' textAlign={'start'}>
                  {errors.reason.message}
                </Typography>
              )}
            </Grid>

            {employee && editHistory.length > 0 && (
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
                            <strong>Người thao tác:</strong> {history.edited_by?.name || 'Unknown'}
                            (ID: {history.edited_by?._id || 'Unknown'})
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
          {employee ? (
            <>
              <div className='flex flex-col justify-end items-end w-full gap-2'>
                <div className='flex justify-end gap-2'>
                  <Button
                    disabled={isLoading}
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
                    className='text-white'
                  >
                    Đóng
                  </Button>
                  <Button
                    disabled={isLoading}
                    type='submit'
                    variant='contained'
                    sx={{ backgroundColor: '#4caf50' }}
                    startIcon={<LuRecycle />}
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
                {errors.root && (
                  <Typography variant='body2' color='error' textAlign={'start'}>
                    {errors.root.message}
                  </Typography>
                )}
              </div>
            </>
          ) : (
            <div className='flex flex-col justify-center items-end gap-2 w-full'>
              <div className='flex justify-end gap-2'>
                <Button
                  variant='contained'
                  className='!bg-red-500 text-white'
                  startIcon={<MdOutlineCancel />}
                  onClick={handleOnClose}
                >
                  Đóng
                </Button>
                <Button disabled={isLoading} type='submit' variant='contained' startIcon={<CiCirclePlus />}>
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
