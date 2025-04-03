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
import { CiImport } from 'react-icons/ci'
import { CiCircleMinus } from 'react-icons/ci'
import DEFAULT from '@/assets/images/default_avatar.jpg'

interface Employee {
  id: number
  image: string
  name: string
  code: string
  Birth: Date
  gender: string
  email: string
  phone: string
  idpp: string
  addr: string
  role: string
  user: string
  salary: number
  datejoined: Date
  status: string
  active: string
}

interface EmployeeDialogProps {
  open: boolean
  onClose: () => void
  onSave: (employee: Employee) => void
  onDelete?: (employee: Employee) => void
  employee?: Employee | null
}

const EmployeeDialog: React.FC<EmployeeDialogProps> = ({ open, onClose, onSave, onDelete, employee }) => {
  // Sử dụng chuỗi cho date để dễ hiển thị trong input type="date"
  const [formData, setFormData] = useState({
    id: employee?.id || 0,
    image: employee?.image || DEFAULT,
    name: employee?.name || '',
    code: employee?.code || '',
    Birth: employee ? employee.Birth.toISOString().slice(0, 10) : '',
    gender: employee?.gender || 'Male',
    email: employee?.email || '',
    phone: employee?.phone || '',
    idpp: employee?.idpp || '',
    addr: employee?.addr || '',
    role: employee?.role || '',
    user: employee?.user || '',
    salary: employee ? Number(employee.salary) : 0,
    datejoined: employee ? employee.datejoined.toISOString().slice(0, 10) : '',
    status: employee?.status || 'Working',
    active: employee?.active || 'Active'
  })

  useEffect(() => {
    if (employee) {
      setFormData({
        id: employee.id,
        image: employee.image,
        name: employee.name,
        code: employee.code,
        Birth: employee.Birth.toISOString().slice(0, 10),
        gender: employee.gender,
        email: employee.email,
        phone: employee.phone,
        idpp: employee.idpp,
        addr: employee.addr,
        role: employee.role,
        user: employee.user,
        salary: Number(employee.salary),
        datejoined: employee.datejoined.toISOString().slice(0, 10),
        status: employee.status,
        active: employee.active
      })
    } else {
      setFormData({
        id: 0,
        image: DEFAULT,
        name: '',
        code: '',
        Birth: '',
        gender: 'Male',
        email: '',
        phone: '',
        idpp: '',
        addr: '',
        role: '',
        user: '',
        salary: 0,
        datejoined: '',
        status: 'Working',
        active: 'Active'
      })
    }
  }, [employee])

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSave = () => {
    const employeeData: Employee = {
      id: formData.id,
      image: formData.image,
      name: formData.name,
      code: formData.code,
      Birth: new Date(formData.Birth),
      gender: formData.gender,
      email: formData.email,
      phone: formData.phone,
      idpp: formData.idpp,
      addr: formData.addr,
      role: formData.role,
      user: formData.user,
      salary: Number(formData.salary),
      datejoined: new Date(formData.datejoined),
      status: formData.status,
      active: formData.active
    }
    onSave(employeeData)
    onClose()
  }

  const handleDelete = () => {
    if (onDelete && employee) {
      onDelete(employee)
      onClose()
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth='md' fullWidth>
      <DialogTitle sx={{ textAlign: 'center' }}>
        {employee ? `Detail Employee: ${formData.code}` : 'Add Employee'}
      </DialogTitle>
      <Box className='border-t border-gray-300 w-full' />
      <DialogContent>
        <Grid container spacing={2}>
          {/* Hình ảnh nhân viên */}
          <Grid size={{ xs: 12, md: 5 }}>
            <Box display='flex' justifyContent='center'>
              <Box
                component='img'
                src={formData.image || DEFAULT}
                alt='Employee Image'
                sx={{ width: '20rem', height: '20rem', borderRadius: '8px', objectFit: 'cover' }}
              />
            </Box>
            <Box sx={{ textAlign: 'center', mt: 1 }}>
              <Button variant='contained' startIcon={<CiImport />} onClick={onClose} className='!bg-gray-400'>
                Import
              </Button>
            </Box>
          </Grid>

          {/* Thông tin nhân viên */}
          <Grid size={{ xs: 12, md: 7 }}>
            <Grid container spacing={2}>
              {/* Row 1: Name - Code */}
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  margin='dense'
                  label='Name'
                  name='name'
                  value={formData.name}
                  onChange={handleChange}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  margin='dense'
                  label='Code'
                  name='code'
                  value={formData.code}
                  onChange={handleChange}
                />
              </Grid>

              {/* Row 2: Birth - Gender */}
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  margin='dense'
                  label='Birth'
                  name='Birth'
                  type='date'
                  InputLabelProps={{ shrink: true }}
                  value={formData.Birth}
                  onChange={handleChange}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Select
                  fullWidth
                  margin='dense'
                  label='Gender'
                  name='gender'
                  value={formData.gender}
                  onChange={() => handleChange}
                >
                  <MenuItem value='Male'>Male</MenuItem>
                  <MenuItem value='Female'>Female</MenuItem>
                  <MenuItem value='Other'>Other</MenuItem>
                </Select>
              </Grid>

              {/* Row 3: Email - Phone */}
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  margin='dense'
                  label='Email'
                  name='email'
                  value={formData.email}
                  onChange={handleChange}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  margin='dense'
                  label='Phone'
                  name='phone'
                  value={formData.phone}
                  onChange={handleChange}
                />
              </Grid>

              {/* Row 4: IDPP - Address */}
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  margin='dense'
                  label='IDPP'
                  name='idpp'
                  value={formData.idpp}
                  onChange={handleChange}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  margin='dense'
                  label='Address'
                  name='addr'
                  value={formData.addr}
                  onChange={handleChange}
                />
              </Grid>

              {/* Row 5: Role - Username */}
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  margin='dense'
                  label='Role'
                  name='role'
                  value={formData.role}
                  onChange={handleChange}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  margin='dense'
                  label='Username'
                  name='user'
                  value={formData.user}
                  onChange={handleChange}
                />
              </Grid>

              {/* Row 6: Salary - Date Joined */}
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  margin='dense'
                  label='Salary'
                  name='salary'
                  type='number'
                  value={formData.salary}
                  onChange={handleChange}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  margin='dense'
                  label='Date Joined'
                  name='datejoined'
                  type='date'
                  InputLabelProps={{ shrink: true }}
                  value={formData.datejoined}
                  onChange={handleChange}
                />
              </Grid>

              {/* Row 7: Status - Active */}
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  margin='dense'
                  label='Status'
                  name='status'
                  value={formData.status}
                  onChange={handleChange}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  margin='dense'
                  label='Active'
                  name='active'
                  value={formData.active}
                  onChange={handleChange}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </DialogContent>
      <Box className='border-t border-gray-300 w-full' />
      <DialogActions>
        {employee ? (
          <>
            <Button variant='contained' color='error' startIcon={<CiCircleMinus />} onClick={handleDelete}>
              Disable
            </Button>
            <Button variant='contained' startIcon={<MdOutlineCancel />} onClick={onClose} className='text-white'>
              Close
            </Button>
            <Button
              variant='contained'
              sx={{ backgroundColor: '#4caf50' }}
              startIcon={<LuRecycle />}
              onClick={handleSave}
            >
              Save
            </Button>
          </>
        ) : (
          <>
            <Button
              variant='contained'
              className='!bg-red-500 text-white'
              startIcon={<MdOutlineCancel />}
              onClick={onClose}
            >
              Close
            </Button>
            <Button variant='contained' startIcon={<CiCirclePlus />} onClick={handleSave}>
              Add
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  )
}

export default EmployeeDialog
