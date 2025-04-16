import { useState } from 'react'
import { CONSULTING_CUSTOMER_STATUS } from '@/consts'
import { IoSearch } from 'react-icons/io5'
import ConsultingCreate from '@/components/client/CustomerConSulting/components/consultingCreate'
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table'
import consultations from '@/mockup/ConsultingCustomer'

const CustomerConsultation = () => {
  const [selectOptionMenu, setSelectOptionMenu] = useState(CONSULTING_CUSTOMER_STATUS.CREATE)
  return (
    <div className='p-4 flex flex-col justify-start items-center gap-4'>
      <div className='flex justify-start items-center gap-4 w-full'>
        <h1 className='text-2xl font-bold text-start'>Tư vấn khách hàng</h1>
      </div>
      <div className='w-full flex flex-col justify-between items-start gap-4'>
        <div className='p-4 bg-white rounded-2xl flex justify-start items-start gap-4'>
          <ul className='flex justify-start items-start gap-4 text-start'>
            <li
              className={`${selectOptionMenu === CONSULTING_CUSTOMER_STATUS.CREATE ? 'bg-[#ffe3c9] text-primary' : 'bg-white'} py-2 px-4 bg-[#ffe3c9] rounded-2xl cursor-pointer`}
              onClick={() => {
                setSelectOptionMenu(CONSULTING_CUSTOMER_STATUS.CREATE)
              }}
            >
              Tạo tư vấn mới
            </li>
            <li
              className={`${selectOptionMenu === CONSULTING_CUSTOMER_STATUS.SEARCH ? 'bg-[#ffe3c9] text-primary' : 'bg-white'} py-2 px-4 bg-[#ffe3c9] rounded-2xl cursor-pointer`}
              onClick={() => {
                setSelectOptionMenu(CONSULTING_CUSTOMER_STATUS.SEARCH)
              }}
            >
              Tìm kiếm tư vấn
            </li>
          </ul>
        </div>
        {/* Create New Consultation Form */}
        {selectOptionMenu === CONSULTING_CUSTOMER_STATUS.CREATE ? (
          <ConsultingCreate />
        ) : (
          <div className='w-full h-screen rounded-2xl bg-white p-4 '>
            <div className='bg-gray-100 flex items-center justify-between gap-2 p-2 rounded-2xl w-[300px] h-[50px] px-4'>
              <IoSearch size={25} color='black' />
              <input
                type='text'
                placeholder='Enter number phone'
                className='text-black border-none outline-none w-full'
              />
            </div>
            <Table className='mt-4'>
              <TableHeader>
                <TableRow>
                  <TableHead>Number</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Phone number</TableHead>
                  <TableHead>Date Consulting</TableHead>
                  <TableHead>View</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {consultations &&
                  consultations.length > 0 &&
                  consultations.map((consultation, index) => {
                    return (
                      <TableRow key={consultation.id}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{consultation.customerName}</TableCell>
                        <TableCell>{consultation.phoneNumber}</TableCell>
                        <TableCell>{consultation.date}</TableCell>
                        <TableCell>
                          <button className='bg-[#ffe3c9] text-primary py-2 px-4 rounded-2xl cursor-pointer'>
                            View
                          </button>
                        </TableCell>
                      </TableRow>
                    )
                  })}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  )
}

export default CustomerConsultation
