import { useEffect, useState } from 'react'
import ScanQRCodeDialog from '@/components/ui/dialogScanCode'
import { useCallback } from 'react'
import productService, { Product } from '@/services/product.service'
import OrderedProduct from './orderedProduct'
import CircularProgress from '@mui/material/CircularProgress'
import { OrderedProductInterface } from '../order'
import { toast } from 'react-toastify'

interface BarCodeProps {
  setOrderedTempProduct: React.Dispatch<React.SetStateAction<OrderedProductInterface[]>>
}

const BarCode = ({ setOrderedTempProduct }: BarCodeProps) => {
  const [productId, setProductId] = useState('')
  const [orderedQuantity, setOrderedQuantity] = useState<number>(1)
  const [products, setProducts] = useState<Array<Product>>([])

  const handleAdd = () => {
    if (!productId || !products || products[0].stock_quantity <= 0 || orderedQuantity <= 0) {
      toast.error('Sản phẩm đã hết hàng')
      return
    }
    setOrderedTempProduct((prev) => {
      const existingProduct = prev.find((item) => item.orderedProduct.code === products[0].code)
      if (existingProduct) {
        return prev.map((item) =>
          item.orderedProduct.code === products[0].code
            ? { ...item, orderedQuantity: item.orderedQuantity + orderedQuantity }
            : item
        )
      } else {
        return [{ orderedProduct: products[0], orderedQuantity }, ...prev]
      }
    })
    toast.success('Thêm sản phẩm thành công')
    handleClearSearch()
  }

  const handleClearSearch = () => {
    setProductId('')
    setProducts([])
    setOrderedQuantity(1)
  }

  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (productId.length > 0) {
        const data = await productService.searchProduct(productId)
        if (data) {
          setProducts(data.data)
        }
      }
    }, 100)

    return () => clearTimeout(delayDebounce)
  }, [productId])

  const handleSearchCode = useCallback((code: string) => {
    setProductId(code)
  }, [])
  return (
    <div className='w-full flex justify-start items-start gap-4 md:flex-row flex-col'>
      {/* Scan QR code */}
      <div className='flex flex-col flex-1/2 justify-between items-start gap-4'>
        <p className='text-black/40 text-left'>Vui lòng quét mã sản phẩm tại đây</p>
        <ScanQRCodeDialog setOrderedTempProduct={setOrderedTempProduct} />
      </div>

      {/* Manual barcode entry */}
      <div className='flex flex-1/2 flex-col justify-between items-start gap-4'>
        <p className='text-black/40'>Hoặc nhập mã sản phẩm</p>
        <div className='flex flex-wrap justify-between items-center gap-4 w-full'>
          <input
            type='text'
            placeholder='Mã sản phẩm'
            value={productId}
            onChange={(e) => handleSearchCode(e.target.value)}
            className='border-none outline-none rounded-2xl bg-gray-100 p-4 w-2/3 max-w-[350px] min-w-[250px]'
          />
          <div className='flex justify-start items-center gap-4 w-full'>
            <button
              disabled={products.length !== 1}
              onClick={handleAdd}
              className={`${products.length == 1 ? 'bg-primary' : 'bg-gray-300'} cursor-pointer  rounded-xl py-2 px-4 w-[100px]`}
            >
              <span className='text-white'>Thêm</span>
            </button>
            <button
              onClick={handleClearSearch}
              className={` cursor-pointer bg-red-600 text-white rounded-xl py-2 px-4 w-[100px]`}
            >
              <span className='text-white'>Xóa</span>
            </button>
          </div>
        </div>
        {productId && products.length === 0 ? (
          <CircularProgress disableShrink color='primary' />
        ) : (
          <div className='max-h-[200px] overflow-y-auto flex flex-col justify-start items-start gap-4 p-2 w-full'>
            {products &&
              products.length > 0 &&
              products.map((item) => {
                return (
                  <OrderedProduct
                    image={item.image_url}
                    quantity={item.stock_quantity}
                    price={item.price}
                    name={item.name}
                    key={item._id}
                    code={item.code}
                    edit={true}
                    setOrderedQuantity={setOrderedQuantity}
                    orderedQuantity={orderedQuantity}
                  />
                )
              })}
          </div>
        )}
      </div>
    </div>
  )
}

export default BarCode
