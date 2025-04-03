import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '@/components/ui/pagination'

const products = [
  { id: 1, name: 'Kẹo Kera', code: 'SP001', original: '$1', selling: '$300', status: 'On Sale' },
  { id: 2, name: 'Kẹo Kera', code: 'SP001', original: '$1', selling: '$300', status: 'Stop Selling' },
  { id: 3, name: 'Kẹo Kera', code: 'SP001', original: '$1', selling: '$300', status: 'On Sale' },
  { id: 4, name: 'Kẹo Kera', code: 'SP001', original: '$1', selling: '$300', status: 'On Sale' },
  { id: 5, name: 'Kẹo Kera', code: 'SP001', original: '$1', selling: '$300', status: 'On Sale' },
  { id: 6, name: 'Kẹo Kera', code: 'SP001', original: '$1', selling: '$300', status: 'Stop Selling' },
  { id: 7, name: 'Kẹo Kera', code: 'SP001', original: '$1', selling: '$300', status: 'On Sale' },
  { id: 8, name: 'Kẹo Kera', code: 'SP001', original: '$1', selling: '$300', status: 'Stop Selling' },
  { id: 9, name: 'Kẹo Kera', code: 'SP001', original: '$1', selling: '$300', status: 'Stop Selling' },
  { id: 10, name: 'Kẹo Kera', code: 'SP001', original: '$1', selling: '$300', status: 'Stop Selling' }
]

const Product = () => {
  return (
    <div className='px-10'>
      <p className='font-bold text-2xl text-left'>Product</p>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>#</TableHead>
            <TableHead>Product</TableHead>
            <TableHead>Original Price</TableHead>
            <TableHead>Selling Price</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product, index) => (
            <TableRow key={product.id} className={index % 2 === 0 ? 'bg-gray-200' : 'py-2'}>
              <TableCell className='text-left'>{product.id}</TableCell>
              <TableCell className='text-left flex items-center gap-2'>
                <img className='w-6 h-6' alt='product' />
                <span>
                  {product.name} <br className='hidden md:block' />
                  <span className='text-gray-500'>{product.code}</span>
                </span>
              </TableCell>
              <TableCell className='text-left'>{product.original}</TableCell>
              <TableCell className='text-left'>{product.selling}</TableCell>
              <TableCell className={`text-left ${product.status === 'On Sale' ? 'text-green-600' : 'text-red-600'}`}>
                {product.status}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

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
  )
}

export default Product
