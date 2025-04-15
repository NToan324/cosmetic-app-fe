import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import { LuScanQrCode } from 'react-icons/lu'
import { Html5QrcodeScanner } from 'html5-qrcode'
import { useEffect, useState, useCallback } from 'react'
import { AiOutlineDelete, AiOutlinePlus } from 'react-icons/ai'
import { FiMinus } from 'react-icons/fi'
import productService, { Product } from '@/services/product.service'
import { formatCurrency } from '@/helpers'
import { toast } from 'react-toastify'

interface ProductInterface {
  orderedProduct: Product
  orderedQuantity: number
}

interface ScanQRCodeDialogProps {
  setOrderedTempProduct: React.Dispatch<React.SetStateAction<ProductInterface[]>>
}

export default function ScanQRCodeDialog({ setOrderedTempProduct }: ScanQRCodeDialogProps) {
  const [open, setOpen] = useState(false)
  const [scanneredProduct, setScanneredProduct] = useState<Array<ProductInterface>>([])
  const [errorMessage, setErrorMessage] = useState('')

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setScanneredProduct([])
    setOpen(false)
  }

  useEffect(() => {
    if (!open) return

    const scannerDebounce = setTimeout(() => {
      handleScanner()
    }, 300)
    return () => {
      clearTimeout(scannerDebounce)
    }
  }, [open])

  const handleScanner = useCallback(() => {
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
      async (decodedText) => {
        try {
          const data = await productService.getProduct(decodedText)
          if (data) {
            setScanneredProduct((prev) => {
              const isExist = prev.some((item) => item.orderedProduct._id === decodedText)

              if (isExist) {
                return prev.map((item) =>
                  item.orderedProduct._id === decodedText
                    ? { ...item, orderedQuantity: item.orderedQuantity + 1 }
                    : item
                )
              }

              return [
                {
                  orderedProduct: data.data,
                  orderedQuantity: 1
                },
                ...prev
              ]
            })
          }
        } catch (error) {
          setErrorMessage('Lỗi khi lấy sản phẩm:' + error)
        } finally {
          await scanner.clear()
          setTimeout(() => {
            handleScanner()
          }, 1500)
        }
      },
      () => {
        setErrorMessage('Vui đặt mã sản phẩm vào giữa khung quét')
      }
    )
  }, [])

  const handldeIncrease = (code: string) => {
    setScanneredProduct((prev) => {
      return prev.map((item) =>
        item.orderedProduct.code === code ? { ...item, orderedQuantity: item.orderedQuantity + 1 } : item
      )
    })
  }

  const handleDecrease = (code: string) => {
    setScanneredProduct((prev) => {
      return prev.map((item) =>
        item.orderedProduct.code === code ? { ...item, orderedQuantity: Math.max(item.orderedQuantity - 1, 1) } : item
      )
    })
  }

  const handleDelete = (code: string) => {
    toast.success('Xóa sản phẩm thành công')
    setScanneredProduct((prev) => {
      return prev.filter((item) => item.orderedProduct.code !== code)
    })
  }

  const handleAddTempProduct = () => {
    // Check if there are any products in the scanneredProduct array
    if (scanneredProduct.length === 0) {
      toast.error('Không có sản phẩm nào để thêm')
      return
    }

    //check if there are any products with stock_quantity = 0
    const outOfStockProducts = scanneredProduct.filter((item) => item.orderedProduct.stock_quantity <= 0)
    if (outOfStockProducts.length > 0) {
      toast.error('Sản phẩm ' + outOfStockProducts[0].orderedProduct.name + ' đã hết hàng')
      return
    }
    setOrderedTempProduct((prev) => {
      const isExist = prev.some((item) => item.orderedProduct._id === scanneredProduct[0].orderedProduct._id)
      if (isExist) {
        const oldProduct = prev.filter((item) => item.orderedProduct._id === scanneredProduct[0].orderedProduct._id)
        const newProducts = scanneredProduct.map((item) => {
          return {
            orderedProduct: item.orderedProduct,
            orderedQuantity: item.orderedQuantity + oldProduct[0].orderedQuantity
          }
        })
        return [
          ...newProducts,
          ...prev.filter((item) => item.orderedProduct._id !== scanneredProduct[0].orderedProduct._id)
        ]
      }
      const newProducts = scanneredProduct.map((item) => {
        return {
          orderedProduct: item.orderedProduct,
          orderedQuantity: item.orderedQuantity
        }
      })
      return [...newProducts, ...prev]
    })
    toast.success('Thêm sản phẩm thành công')
    setScanneredProduct([])
    handleClose()
  }

  return (
    <>
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
        <span className='text-primary'>Nhấp vào đây</span>
      </Button>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle id='alert-dialog-title'>Quét barcode</DialogTitle>
        <DialogContent
          sx={{
            width: '500px',
            height: '700px'
          }}
        >
          <div className='text-red-500 mb-2'>{errorMessage}</div>
          <div className='w-full h-[400px]'>
            <div className='' id='reader'></div>
          </div>
          {scanneredProduct.length > 0 ? (
            scanneredProduct.map((item) => {
              return (
                <div className='' key={item.orderedProduct._id}>
                  <div className='w-full h-[180px] shadow-[0_5px_10px_rgba(0,0,0,0.2)] p-4 bg-white rounded-xl flex justify-between items-center gap-4 my-4'>
                    <div className='w-[140px] h-full bg-white rounded-xl flex justify-center items-center'>
                      <img src={item.orderedProduct.image_url} alt='product' className='object-cover' />
                    </div>
                    <div className='flex flex-col justify-between items-start gap-2'>
                      <p className='text-start line-clamp-2'>{item.orderedProduct.name}</p>
                      <p className='text-base truncate w-64'>Code: {item.orderedProduct.code}</p>
                      <div className='w-full flex justify-between items-center gap-2'>
                        <p className='text-base'>
                          {item.orderedProduct.stock_quantity === 0
                            ? 'Hết hàng'
                            : `Còn hàng: ${item.orderedProduct.stock_quantity}`}
                        </p>
                        <span className='text-red-600 text-xl'>{formatCurrency(item.orderedProduct.price)}</span>
                      </div>
                      <div className='w-full flex justify-between items-center gap-4'>
                        <div className='flex justify-between items-center gap-4'>
                          <button
                            onClick={() => handldeIncrease(item.orderedProduct.code)}
                            className='flex justify-center items-center rounded-full p-2 bg-gray-300 w-[30px] h-[30px] cursor-pointer hover:bg-gray-400'
                          >
                            <AiOutlinePlus />
                          </button>
                          <span className='font-bold'>{item.orderedQuantity}</span>
                          <button
                            onClick={() => handleDecrease(item.orderedProduct.code)}
                            className='flex justify-center items-center rounded-full p-2 bg-gray-300 w-[30px] h-[30px] cursor-pointer hover:bg-gray-400'
                          >
                            <FiMinus />
                          </button>
                        </div>
                        <div
                          onClick={() => handleDelete(item.orderedProduct.code)}
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
            <p>Bạn chưa thêm sản phẩm nào</p>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} sx={{ color: '#ff8108' }}>
            Hủy
          </Button>
          <Button onClick={handleAddTempProduct} autoFocus sx={{ color: '#ff8108' }}>
            Thêm sản phẩm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
