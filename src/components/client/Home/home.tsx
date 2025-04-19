import Product from '@/components/product'
import Filter from '@/components/filter'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '@/components/ui/pagination'
import Promotion from '@/components/client/Home/components/promotion'
import { useContext, useState } from 'react'
import { AppContext } from '@/provider/appContext'
import { useProduct } from '@/hooks/useProduct'
import { CircularProgress } from '@mui/material'

const Home = () => {
  const { categories } = useContext(AppContext)

  const [categoryId, setCategoryId] = useState<string>()
  const [page, setPage] = useState<number>(1)
  const limit = 9

  const { data, isLoading } = useProduct({ categoryId, page, limit })
  const products = data?.data.data
  const totalPages = data?.data.totalPages || 1

  const promotionImages = [
    'https://media.hcdn.vn/hsk/1732069393web.jpg',
    'https://media.hcdn.vn/hsk/1744971167homejnj1804.jpg',
    'https://media.hcdn.vn/hsk/1744778558homedove1604.jpg'
  ]

  return (
    <div className='p-4'>
      <Filter
        filterData={categories}
        filterCategory={categoryId || 'all'}
        setFilterCategory={(value) => {
          setCategoryId(value === 'all' ? undefined : value)
          setPage(1)
        }}
      />

      <div className='mt-12 flex flex-col justify-start items-start gap-4'>
        <h1 className='text-black text-2xl font-bold'>Skin Care</h1>
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
      <div className='mt-12 flex flex-col justify-start items-start gap-4'>
        <h1 className='text-black text-2xl font-bold'>Promotions</h1>
        {promotionImages &&
          promotionImages.length > 0 &&
          promotionImages.map((image, index) => {
            return <Promotion image={image} key={index} />
          })}
      </div>
    </div>
  )
}

export default Home
