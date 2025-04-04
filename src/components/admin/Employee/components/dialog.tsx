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
  Box,
} from '@mui/material'
import { RadioGroup, FormControlLabel, Radio, FormLabel } from '@mui/material';
import { MdHistory, MdOutlineCancel } from 'react-icons/md'
import { LuRecycle } from 'react-icons/lu'
import { CiCirclePlus } from 'react-icons/ci'
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
    role: employee?.role || 'admin',
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
        role: 'admin',
        user: '',
        salary: 0,
        datejoined: '',
        status: 'Working',
        active: 'notactive'
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
          {/* Hình ảnh nhân viên */}
          <Grid container spacing={2}>
            <Grid size={{xs:12, md:4}} className='flex justify-center'>
              <Box display='flex'>
                <Box
                  component='img'
                  src={formData.image || DEFAULT}
                  alt='Employee Image'
                  sx={{ width: '12rem', height: '12rem', borderRadius: '8px', objectFit: 'cover' }}
                />
              </Box>
            </Grid>
            <Grid size={{xs:12, md:8}}>
              <TextField
                fullWidth
                margin='dense'
                label='Name'
                name='name'
                value={formData.name}
                onChange={handleChange}
                sx={{ mt: 4 }}
              />
              <Grid container spacing={2}>
                <Grid size={{xs:12, md:6}}>
                  <TextField                  
                    fullWidth
                    margin='dense'
                    label='Birth'
                    name='Birth'
                    type='date'
                    value={formData.Birth}
                    onChange={handleChange}
                    sx={{ mt: 4}}
                  />
                </Grid>
                <Grid size={{xs:12, md:6}}>
                  <FormLabel component="legend" sx={{ mt: 4 }}>Gender</FormLabel>
                    <RadioGroup
                      row
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                    >
                      <FormControlLabel value="Male" control={<Radio />} label="Male" />
                      <FormControlLabel value="Female" control={<Radio />} label="Female" />
                      </RadioGroup>
                </Grid>
                
              
              </Grid>
              
            </Grid>
          </Grid>
        {/* Row 2: Birth - Gender */}
        <Grid container columnSpacing={2}>
          <Grid size={{xs: 12, md: 8}}>

          </Grid>
          <Grid size={{xs: 12, md: 4}}>

          </Grid>
        </Grid>

        {/* Row 3: Email - Phone */}
        <Grid container columnSpacing={2}>
          <Grid size={{xs: 12, md: 8}}>
            <TextField
              fullWidth
              margin='dense'
              label='Email'
              name='email'
              value={formData.email}
              onChange={handleChange}
              sx={{ mt: 4 }}
            />
          </Grid>
          <Grid size={{xs: 12, md: 4}}>
            <TextField
              fullWidth
              margin='dense'
              label='Phone'
              name='phone'
              value={formData.phone}
              onChange={handleChange}
              sx={{ mt: 4 }}
            />
          </Grid>
        </Grid>

        {/* Row 4: IDPP - Address */}
        <TextField
          fullWidth
          margin='dense'
          label='IDPP'
          name='idpp'
          value={formData.idpp}
          onChange={handleChange}
          sx={{ mt: 4 }}
        />

        <TextField
          fullWidth
          margin='dense'
          label='Address'
          name='addr'
          value={formData.addr}
          onChange={handleChange}
          sx={{ mt: 4 }}
        />
        <Box className='border-t border-gray-300 w-full mt-4' />
        <p className='font-bold text-2xl pt-2'>Company</p>
        {/* Row 5: Role - Username */}
        <Select
          fullWidth
          margin='dense'
          label='Role'
          name='role'
          value={formData.role}
          onChange={(event) => setFormData((prev) => ({ ...prev, role: event.target.value }))}
          sx={{ mt: 4 }}
        >
          <MenuItem value='admin'>Admin</MenuItem>
          <MenuItem value='staff'>Staff</MenuItem>
        </Select>

{employee? (<>
  <Grid container columnSpacing={2}>
            <Grid size={{xs: 12, md: 8}}>
              <TextField
                fullWidth
                margin='dense'
                label='Username'
                name='user'
                value={formData.user}
                onChange={handleChange}
                sx={{ mt: 4 }}
              />
            </Grid>
            <Grid size={{xs: 12, md: 4}}>
              <FormLabel component="legend" sx={{ mt: 4 }}>Status</FormLabel>
              <RadioGroup
                row
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <FormControlLabel value="Working" control={<Radio />} label="Working" />
                <FormControlLabel value="Disable" control={<Radio />} label="Disable" />
              </RadioGroup>
            </Grid>
          </Grid>
        </>):('')}
        

        <TextField
          fullWidth
          margin='dense'
          label='Salary'
          name='salary'
          type='number'
          value={formData.salary}
          onChange={handleChange}
          sx={{ mt: 4 }}
        />
  {employee? (<>
  <Grid container columnSpacing={2}>
          <Grid size={{xs: 12, md: 8}}>
            <TextField
              fullWidth
              margin='dense'
              label='Date Joined'
              name='datejoined'
              value={formData.datejoined}
              onChange={handleChange}
              sx={{ mt: 4 }}
            />
          </Grid>
          <Grid size={{xs: 12, md: 4}}>
            <FormLabel component="legend" sx={{ mt: 4 }}>Activation Status</FormLabel>
            <RadioGroup
              row
              name="active"
              value={formData.active}
              onChange={handleChange}
            >
              <FormControlLabel value="active" control={<Radio />} label="Active" />
              <FormControlLabel value="notactive" control={<Radio />} label="Not active" />
            </RadioGroup>
          </Grid>
        </Grid>
  </>):('')}
        
        
      </DialogContent>
      <Box className='border-t border-gray-300 w-full' />
      <DialogActions className='flex !justify-between'>
        {employee ? (
          <>
          <Button variant='contained' className='!bg-gray-400' startIcon={<MdHistory />} onClick={onClose}>
              Edit History
             </Button>
             <div className='flex gap-2'>
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
             </div>
            
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
