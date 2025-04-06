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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material'
import { MdOutlineCancel } from 'react-icons/md'
import { CiCircleMinus } from 'react-icons/ci'
import { CiImport } from 'react-icons/ci'
import { BiRecycle } from 'react-icons/bi'
import { MdHistory } from 'react-icons/md'

// Định nghĩa kiểu dữ liệu cho hóa đơn
interface Invoice {
  id: number
  code: string
  phone: string
  total: number
  payment: string
  received: number
  change: number
  dateExport: Date
}

// Props cho dialog
interface InvoiceDialogProps {
  open: boolean
  onClose: () => void
  onSave: (invoice: Invoice) => void
  invoice?: Invoice | null
}

const InvoiceDialog: React.FC<InvoiceDialogProps> = ({
  open,
  onClose,
  // onSave,
  invoice
}) => {
  const [formData, setFormData] = useState<Invoice>({
    id: invoice ? invoice.id : 0,
    code: invoice?.code || '',
    phone: invoice?.phone || '',
    total: invoice?.total || 0,
    payment: invoice?.payment || 'cash',
    received: invoice?.received || 0,
    change: invoice?.change || 0,
    dateExport: invoice?.dateExport || new Date()
  })

  useEffect(() => {
    if (invoice) {
      setFormData(invoice)
    } else {
      setFormData({
        id: 0,
        code: '',
        phone: '',
        total: 0,
        payment: 'cash',
        received: 0,
        change: 0,
        dateExport: new Date()
      })
    }
  }, [invoice])

  // Cập nhật dữ liệu nhập vào
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    // Nếu là các trường số, chuyển đổi giá trị thành number
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'total' || name === 'received' || name === 'change' ? parseFloat(value) : value
    }))
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth='md' fullWidth>
      <DialogTitle sx={{ textAlign: 'center' }}>{invoice ? `Invoice: ${formData.code}` : 'Add Invoice'}</DialogTitle>
      <div className='border-t border-gray-300 w-full'></div>
      <DialogContent>
        <Grid container spacing={2} className='max-w-full'>
          {/* Phần thông tin hóa đơn (2/3 chiều rộng) */}
          <Grid size={{ xs: 12, md: 12 }} rowSpacing={4}>
            <TextField
              fullWidth
              margin='dense'
              label='Phone Number'
              name='phone'
              value={formData.phone}
              onChange={handleChange}
            />

            <Select
              fullWidth
              margin='dense'
              name='payment'
              value={formData.payment}
              onChange={(event) => setFormData((prev) => ({ ...prev, payment: event.target.value }))}
            >
              <MenuItem value='cash'>Cash</MenuItem>
              <MenuItem value='card'>Card</MenuItem>
            </Select>

            <TextField
              fullWidth
              margin='dense'
              label='Total'
              name='total'
              type='number'
              value={formData.total}
              onChange={handleChange}
            />

            <TextField
              fullWidth
              margin='dense'
              label='Amount Received'
              name='received'
              type='number'
              value={formData.received}
              onChange={handleChange}
            />

            <TextField
              fullWidth
              margin='dense'
              label='Change'
              name='change'
              type='number'
              value={formData.change}
              onChange={handleChange}
              disabled
            />
          </Grid>
          <Grid size={{ xs: 12, md: 12 }}>
            <TableContainer component={Paper} className='my-4'>
              <Table sx={{ minWidth: 650 }} aria-label='product table'>
                <TableHead>
                  <TableRow>
                    <TableCell>#</TableCell>
                    <TableCell>Product</TableCell>
                    <TableCell>Price</TableCell>
                    <TableCell>Total</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>1</TableCell>
                    <TableCell>
                      Kera
                      <br />
                      <TextField value='SP001' />
                    </TableCell>
                    <TableCell>
                      300.000
                      <br />
                      <TextField value='3' />
                    </TableCell>
                    <TableCell>900.000</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell>-0</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell>900.000</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
            <p className='text-gray-400'>Data Exported: {formData.dateExport.toISOString().split('T')[0]}</p>
          </Grid>
        </Grid>
      </DialogContent>
      <div className='border-t border-gray-300 w-full'></div>
      <DialogActions className='flex !justify-between'>
        <div className='flex gap-2'>
          <Button variant='contained' className='!bg-gray-400' startIcon={<MdHistory />} onClick={onClose}>
            Edit History
          </Button>
          <Button variant='contained' color='success' startIcon={<CiImport />} onClick={onClose}>
            Download
          </Button>
        </div>
        <div className='flex gap-2'>
          <Button variant='contained' color='error' startIcon={<CiCircleMinus />} onClick={onClose}>
            Disable
          </Button>
          <Button variant='contained' startIcon={<MdOutlineCancel />} onClick={onClose}>
            Close
          </Button>
          <Button variant='contained' color='success' startIcon={<BiRecycle />} onClick={onClose}>
            Save
          </Button>
        </div>
      </DialogActions>
    </Dialog>
  )
}

export default InvoiceDialog
