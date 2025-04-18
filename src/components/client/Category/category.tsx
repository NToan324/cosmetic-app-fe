import Filter from '@/components/filter'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '@/components/ui/pagination'
import Product from '@/components/product'
import OrderingFilter from '@/components/client/Category/components/orderingFilter'
import { useContext, useState } from 'react'
import { AppContext } from '@/provider/appContext'
import { useProduct } from '@/hooks/useProduct'
import { CircularProgress } from '@mui/material'
import { IoSearch } from 'react-icons/io5'

const Category = () => {
  const { categories } = useContext(AppContext)
  const [categoryId, setCategoryId] = useState<string>()
  const [price, setPrice] = useState<string>()
  const [page, setPage] = useState<number>(1)
  const limit = 9
  const { data, isLoading } = useProduct({ categoryId, price, page, limit })
  const products = data?.data.data
  const totalPages = data?.data.totalPages || 1

  return (
    <div className='p-4'>
      <div className='bg-white flex items-center w-2/3 max-w-[350px] justify-between gap-2 p-2 rounded-2xl px-4 border border-black/20'>
        <IoSearch size={25} color='black' />
        <input type='text' placeholder='Tìm kiếm sản phẩm' className='text-black w-full border-none outline-none' />
      </div>
      <Filter
        filterData={categories}
        filterCategory={categoryId || 'all'}
        setFilterCategory={(value) => {
          setCategoryId(value === 'all' ? undefined : value)
          setPage(1)
        }}
      />
      <div className='mt-12 flex flex-col justify-start items-start gap-4'>
        <div className='flex flex-wrap justify-between items-center w-full gap-2'>
          <h1 className='text-black text-2xl font-bold'>Skin Care</h1>
          <OrderingFilter
            filterPrice={price || ''}
            setFilterPrice={(value) => {
              setPrice(value)
              setPage(1)
            }}
          />
        </div>
        {!isLoading ? (
          <div className='grid grid-cols-1 gap-4 lg:grid-cols-3 sm:grid-cols-2'>
            {products &&
              products.length > 0 &&
              products.map((item) => {
                return (
                  <Product
                    name={item.name}
                    price={item.price}
                    quantity={item.stock_quantity}
                    image={item.image_url}
                    description={item.description}
                    expiration_date={item.expiration_date}
                    production_date={item.production_date}
                    key={item._id}
                    code={item.code}
                  />
                )
              })}
          </div>
        ) : (
          <div className='w-full h-[400px] flex justify-center items-center'>
            <CircularProgress
              size={30}
              sx={{
                color: 'black',
                opacity: 0.2
              }}
            />
          </div>
        )}

        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href='#' onClick={() => setPage((prev) => Math.max(prev - 1, 1))} />
            </PaginationItem>
            {Array.from({ length: totalPages }).map((_, i) => (
              <PaginationItem key={i}>
                <PaginationLink href='#' isActive={page === i + 1} onClick={() => setPage(i + 1)}>
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext href='#' onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))} />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  )
}

export default Category
