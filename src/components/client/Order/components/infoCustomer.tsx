import { useNavigate } from 'react-router-dom'
const InfoCustomer = () => {
  const navigate = useNavigate()
  return (
    <div className='flex flex-col justify-start items-start gap-4 bg-white'>
      <h1 className='text-2xl font-bold'>Customer</h1>
      <input
        type='text'
        placeholder='Phone number'
        className='border-none outline-none rounded-2xl w-full bg-gray-100 p-4'
      />
      <input type='text' placeholder='Name' className='border-none outline-none rounded-2xl w-full bg-gray-100 p-4' />
      <div className='flex justify-start items-center gap-2'>
        <button className='px-4 py-2 border border-primary text-primary rounded-xl cursor-pointer'>Create</button>
        <button className='px-4 py-2 border border-primary text-primary rounded-xl cursor-pointer'>View History</button>
      </div>
      <button
        className='px-4 py-2 bg-primary text-white rounded-xl w-full cursor-pointer'
        onClick={() => navigate('/order/payment')}
      >
        Next Step
      </button>
    </div>
  )
}

export default InfoCustomer
