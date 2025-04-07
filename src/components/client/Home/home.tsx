import Product from '@/components/product'
import Filter from '@/components/filter'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '@/components/ui/pagination'
import Promotion from '@/components/client/Home/components/promotion'
import { useContext, useEffect, useState } from 'react'
import { AppContext } from '@/provider/appContext'
import productService from '@/services/product'

const Home = () => {
  const { products, categories, setProducts } = useContext(AppContext)
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const promotionImages = ['src/assets/images/banner_1.png', 'src/assets/images/banner_2.png']

  useEffect(() => {
    const handleFilter = async (categoryId?: string, price?: string) => {
      try {
        if (categoryId === 'all') {
          categoryId = undefined
        }
        const filteredProducts = await productService.getAllProducts(categoryId, price)
        if (filteredProducts) {
          setProducts(filteredProducts.data)
          setFilterCategory(categoryId || 'all')
        }
      } catch (error) {
        console.error('Error fetching products:', error)
      }
    }

    handleFilter(filterCategory)
  }, [filterCategory, setProducts])

  return (
    <div className='p-4'>
      <Filter filterData={categories} filterCategory={filterCategory} setFilterCategory={setFilterCategory} />
      <div className='mt-12 flex flex-col justify-start items-start gap-4'>
        <h1 className='text-black text-2xl font-bold'>Skin Care</h1>
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
                  key={item._id}
                />
              )
            })}
        </div>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href='#' />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href='#' isActive>
                1
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href='#'>2</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href='#'>3</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href='#' />
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
