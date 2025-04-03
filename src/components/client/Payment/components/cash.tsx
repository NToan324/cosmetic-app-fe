import { formatCurrency } from '@/helpers'
import { useState } from 'react'
import { NumericFormat } from 'react-number-format'

const Cash = () => {
  const [amount, setAmount] = useState('')
  const [change, setChange] = useState('')
  const listMoney = [
    { id: 1, amount: 100000 },
    { id: 2, amount: 200000 },
    { id: 3, amount: 500000 },
    { id: 4, amount: 100000 },
    { id: 5, amount: 200000 },
    { id: 6, amount: 500000 }
  ]
  return (
    <div className='w-full space-y-4'>
      <div className='flex flex-col justify-start items-start gap-4'>
        <label htmlFor='amount'>Amount</label>
        <NumericFormat
          id='amount'
          value={amount}
          thousandSeparator='.'
          decimalSeparator=','
          placeholder='100.000'
          className='bg-white border border-black/50 px-4 h-[55px] rounded-2xl w-[300px] outline-none'
        />
      </div>
      <div className='flex flex-wrap justify-start items-center gap-4'>
        {listMoney.map((item) => {
          return (
            <button
              className='p-4 rounded-2xl bg-[#F8F8F8] cursor-pointer hover:text-[#ff8108] transition-all duration-300 ease-in-out'
              key={item.id}
              onClick={() => setAmount(item.amount.toString())}
            >
              {formatCurrency(item.amount)}
            </button>
          )
        })}
      </div>
      <div className='flex flex-col justify-start items-start gap-4'>
        <label htmlFor='change'>Change</label>
        <NumericFormat
          id='change'
          value={change}
          thousandSeparator='.'
          decimalSeparator=','
          placeholder='100.000'
          className='bg-white border border-black/50 px-4 h-[55px] rounded-2xl w-[300px] outline-none'
        />
      </div>
    </div>
  )
}

export default Cash
