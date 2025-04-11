import * as React from 'react'
import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { formatCurrency } from '@/helpers'

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2)
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1)
  }
}))

interface DialogViewHistoryProps {
  customerName: string
  phoneNumber: string
  orderId: string
  paymentMethod: string
  orderDate: string
  employeeName: string
  products: {
    productId: string
    productName: string
    quantity: number
    unitPrice: number
    subtotal: number
  }[]
  total: number
}

export default function DialogViewHistory({
  customerName,
  phoneNumber,
  orderId,
  paymentMethod,
  orderDate,
  employeeName,
  products,
  total
}: DialogViewHistoryProps) {
  const [open, setOpen] = React.useState(false)

  const handleClickOpen = () => {
    setOpen(true)
  }
  const handleClose = () => {
    setOpen(false)
  }

  return (
    <React.Fragment>
      <Button
        variant='contained'
        onClick={handleClickOpen}
        sx={{
          backgroundColor: '#ff8108',
          borderColor: '#ff8108',
          color: 'white',
          borderRadius: '12px',
          textTransform: 'capitalize',
          '&:hover': {
            backgroundColor: '#ff8108'
          }
        }}
      >
        Chi tiết
      </Button>
      <BootstrapDialog onClose={handleClose} aria-labelledby='customized-dialog-title' open={open}>
        <DialogTitle sx={{ m: 0, p: 2 }} id='customized-dialog-title'>
          Order Details
        </DialogTitle>
        <IconButton
          aria-label='close'
          onClick={handleClose}
          sx={(theme) => ({
            position: 'absolute',
            right: 8,
            top: 8,
            color: theme.palette.grey[500]
          })}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent dividers>
          <h1 className='text-primary font-bold text-2xl'>
            ORR’ <span className='text-black'>COSMETIC</span>
          </h1>
          <h2 className='text-xl font-bold mt-4'>Thank you for your order</h2>
          <div className='flex flex-col justify-start items-start gap-2 mt-4'>
            <h3 className='text-base font-semibold'>Store Information</h3>
            <div className='flex justify-between items-center gap-8'>
              <div className='flex flex-col justify-start items-start gap-1'>
                <p className='text-base text-black/55'>Address</p>
                <p className='text-base'>District 7 Ho Chi Minh City</p>
              </div>
              <div className='flex flex-col justify-start items-start gap-1'>
                <p className='text-base text-black/55'>Phone number</p>
                <p className='text-base'>0939000111</p>
              </div>
            </div>
          </div>
          <div className='flex flex-col justify-start items-start gap-2 mt-4'>
            <h3 className='text-base font-semibold'>Customer Information</h3>
            <div className='flex justify-between items-center gap-8'>
              <div className='flex flex-col justify-start items-start gap-1'>
                <p className='text-base text-black/55'>Full Name</p>
                <p className='text-base'>{customerName}</p>
              </div>
              <div className='flex flex-col justify-start items-start gap-1'>
                <p className='text-base text-black/55'>Phone number</p>
                <p className='text-base'>{phoneNumber}</p>
              </div>
            </div>
          </div>
          <div className='flex flex-col justify-start items-start gap-2 mt-4'>
            <h3 className='text-base font-semibold'>Invoice Information</h3>
            <div className='flex justify-between items-center gap-8'>
              <div className='flex flex-col justify-start items-start gap-1'>
                <p className='text-base text-black/55'>OrderID</p>
                <p className='text-base'>{orderId}</p>
              </div>
              <div className='flex flex-col justify-start items-start gap-1'>
                <p className='text-base text-black/55'>Payment method</p>
                <p className='text-base'>{paymentMethod}</p>
              </div>
              <div className='flex flex-col justify-start items-start gap-1'>
                <p className='text-base text-black/55'>Date</p>
                <p className='text-base'>{orderDate}</p>
              </div>
              <div className='flex flex-col justify-start items-start gap-1'>
                <p className='text-base text-black/55'>Employee</p>
                <p className='text-base'>{employeeName}</p>
              </div>
            </div>
          </div>
          <Table className='border border-black mt-10'>
            <TableHeader>
              <TableRow>
                <TableHead className='w-[50px] border border-black'>Number</TableHead>
                <TableHead className='w-[50px] border border-black'>ID</TableHead>
                <TableHead className='border border-black'>Name</TableHead>
                <TableHead className='border border-black'>Quantity</TableHead>
                <TableHead className='border border-black'>Unit Price</TableHead>
                <TableHead className='border border-black'>Promotion</TableHead>
                <TableHead className='border border-black'>Total Price</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products && products.length > 0 ? (
                products.map((product, index) => (
                  <TableRow key={index}>
                    <TableCell className='border border-black'>{index + 1}</TableCell>
                    <TableCell className='border border-black'>{product.productId}</TableCell>
                    <TableCell className='max-w-[150px] border border-black'>{product.productName}</TableCell>
                    <TableCell className='text-center border border-black'>{product.quantity}</TableCell>
                    <TableCell className='border border-black'>{formatCurrency(product.unitPrice)}</TableCell>
                    <TableCell className='border border-black'>None</TableCell>
                    <TableCell className='border border-black'>{formatCurrency(product.subtotal)}</TableCell>
                  </TableRow>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className='text-center'>
                    No data available
                  </td>
                </tr>
              )}
            </TableBody>
          </Table>
          <div className='flex justify-end items-center mt-4 gap-2'>
            <h3 className='text-base font-semibold'>Total</h3>
            <h3 className='text-base font-semibold'>{formatCurrency(total)}</h3>
          </div>
        </DialogContent>
        <DialogActions>
          <Button
            autoFocus
            onClick={handleClose}
            sx={{
              textTransform: 'capitalize',
              color: '#ff8108'
            }}
          >
            Cancel
          </Button>
          <Button
            autoFocus
            onClick={handleClose}
            sx={{
              textTransform: 'capitalize',
              color: '#ff8108'
            }}
          >
            Print
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </React.Fragment>
  )
}
