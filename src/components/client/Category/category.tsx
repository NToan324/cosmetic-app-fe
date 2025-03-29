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
import { productsDataMockup } from '@/mockup/product'
import Product from '@/components/product'
import { filterDataMockupCategory } from '@/mockup/filter'
import OrderingFilter from '@/components/client/Category/components/orderingFilter'

const Category = () => {
  return (
    <div className='p-4'>
      <Filter filterData={filterDataMockupCategory} />
      <div className='mt-12 flex flex-col justify-start items-start gap-4'>
        <div className='flex flex-wrap justify-between items-center w-full gap-2'>
          <h1 className='text-black text-2xl font-bold'>Skin Care</h1>
          <OrderingFilter />
        </div>
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
    </div>
  )
}

export default Category
