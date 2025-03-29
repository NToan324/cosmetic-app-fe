import * as React from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import { LuScanQrCode } from 'react-icons/lu'
import { Html5QrcodeScanner } from 'html5-qrcode'
import { useEffect, useState } from 'react'
import image from '@/assets/images/product.png'
import { AiOutlineDelete, AiOutlinePlus } from 'react-icons/ai'
import { FiMinus } from 'react-icons/fi'

interface Product {
  id: string
  code: string
  name: string
  image: string
  price: number
  quantity: number
}

export default function ScanQRCodeDialog() {
  const [open, setOpen] = useState(false)
  const [scanneredProduct, setScanneredProduct] = useState<Array<Product>>([])
  const [errorMessage, setErrorMessage] = useState('')
  const [quantity, setQuantity] = useState(1)

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setScanneredProduct([])
    setOpen(false)
  }

  useEffect(() => {
    if (!open) return
    setTimeout(() => {
      const scanner = new Html5QrcodeScanner(
        'reader',
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          supportedScanTypes: []
        },
        false
      )

      scanner.render(
        (decodedText) => {
          setScanneredProduct((prev) => {
            if (prev.some((item) => item.code === decodedText)) {
              // If the product already exists, increment the quantity
              const updatedProducts = prev.map((item) => {
                if (item.code === decodedText) {
                  return { ...item, quantity: item.quantity + 1 }
                }
                return item
              })
              return updatedProducts
            }
            // If the product does not exist, add it to the list
            const newProduct: Product = {
              id: Date.now().toString(),
              name: 'Sữa Rửa Mặt CeraVe Sạch Sâu Cho Da Thường Đến Da Dầu 473ml',
              image: image,
              price: 336000,
              quantity: quantity,
              code: decodedText
            }
            return [newProduct, ...prev]
          })
          scanner.clear()
        },
        () => {
          setErrorMessage('Please put the product into the frame')
        }
      )

      return () => {
        scanner.clear()
      }
    }, 300)
  }, [open, scanneredProduct, quantity])

  const handldeIncrease = (code: string) => {
    setScanneredProduct((prev) =>
      prev.map((item) => (item.code === code ? { ...item, quantity: item.quantity + 1 } : item))
    )
  }

  const handleDecrease = (code: string) => {
    setScanneredProduct((prev) =>
      prev.map((item) => (item.code === code && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item))
    )
  }

  const handleDelete = (code: string) => {
    setScanneredProduct((prev) => prev.filter((product) => product.code !== code))
  }

  return (
    <React.Fragment>
      <Button
        variant='outlined'
        sx={{
          borderColor: '#ff8108',
          borderWidth: '1px',
          borderRadius: '12px',
          textTransform: 'none'
        }}
        className='flex justify-center items-center gap-2 p-2 bg-white rounded-xl border-primary border cursor-pointer'
        onClick={handleClickOpen}
      >
        <LuScanQrCode size={35} className='text-primary' />
        <span className='text-primary'>Click here</span>
      </Button>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle id='alert-dialog-title'>Scan barcode</DialogTitle>
        <DialogContent
          sx={{
            width: '500px',
            height: '700px'
          }}
        >
          <div className='text-red-500'>{errorMessage}</div>
          <div className='w-full h-[400px]'>
            <div className='' id='reader'></div>
          </div>
          {scanneredProduct.length > 0 ? (
            scanneredProduct.map((item) => {
              return (
                <div className=''>
                  <div className='w-full h-[180px] shadow-[0_5px_10px_rgba(0,0,0,0.2)] p-4 bg-white rounded-xl flex justify-between items-center gap-4 my-4'>
                    <div className='w-[140px] h-full bg-gray-200 rounded-xl flex justify-center items-center'>
                      <img src={image} alt='product' className='object-cover w-[40px]' />
                    </div>
                    <div className='flex flex-col justify-between items-start gap-2'>
                      <p className='text-start line-clamp-2'>
                        Sữa Rửa Mặt CeraVe Sạch Sâu Cho Da Thường Đến Da Dầu 473ml
                      </p>
                      <p className='text-base truncate w-64'>Code: {item.code}</p>
                      <div className='w-full flex justify-between items-center gap-2'>
                        <p className='text-base'>Remaining: 20</p>
                        <span className='text-red-600 text-xl'>336000đ</span>
                      </div>
                      <div className='w-full flex justify-between items-center gap-4'>
                        <div className='flex justify-between items-center gap-4'>
                          <button
                            onClick={() => handldeIncrease(item.code)}
                            className='flex justify-center items-center rounded-full p-2 bg-gray-300 w-[30px] h-[30px] cursor-pointer hover:bg-gray-400'
                          >
                            <AiOutlinePlus />
                          </button>
                          <span className='font-bold'>{item.quantity}</span>
                          <button
                            onClick={() => handleDecrease(item.code)}
                            className='flex justify-center items-center rounded-full p-2 bg-gray-300 w-[30px] h-[30px] cursor-pointer hover:bg-gray-400'
                          >
                            <FiMinus />
                          </button>
                        </div>
                        <div
                          onClick={() => handleDelete(item.code)}
                          className='flex justify-center items-center rounded-xl bg-red-500 text-white cursor-pointer w-[40px] h-[40px] hover:bg-red-600'
                        >
                          <AiOutlineDelete size={25} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })
          ) : (
            <p>There are currently no products</p>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} sx={{ color: '#ff8108' }}>
            Cancel
          </Button>
          <Button onClick={handleClose} autoFocus sx={{ color: '#ff8108' }}>
            Add Product
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  )
}
