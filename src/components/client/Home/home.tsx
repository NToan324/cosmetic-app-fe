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
import { productsDataMockup } from '@/mockup/product'
import { filterDataMockupHome } from '@/mockup/filter'

const Home = () => {
  const promotionImages = ['src/assets/images/banner_1.png', 'src/assets/images/banner_2.png']
  return (
    <div className='p-4'>
      <Filter filterData={filterDataMockupHome} />
      <div className='mt-12 flex flex-col justify-start items-start gap-4'>
        <h1 className='text-black text-2xl font-bold'>Skin Care</h1>
        <div className='grid grid-cols-1 gap-4 lg:grid-cols-3 sm:grid-cols-2'>
          {productsDataMockup &&
            productsDataMockup.length > 0 &&
            productsDataMockup.map((item) => {
              return (
                <Product
                  name={item.name}
                  price={item.price}
                  quantity={item.quantity}
                  image={item.image}
                  key={item.id}
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
