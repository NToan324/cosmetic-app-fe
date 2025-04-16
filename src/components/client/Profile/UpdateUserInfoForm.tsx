import { useForm } from 'react-hook-form'

type UserInfoForm = {
  fullName: string
  phone: string
  address: string
  dateOfBirth: string
}

const UpdateUserInfoForm = () => {
  const { register, handleSubmit } = useForm<UserInfoForm>()

  const onSubmit = (data: UserInfoForm) => {
    console.log('Thông tin cập nhật:', data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='w-full max-w-3xl flex flex-col gap-4 bg-white p-4 rounded-2xl'>
      <h2 className='text-xl font-semibold'>Cập nhật thông tin cá nhân</h2>

      {/* Họ tên + Số điện thoại */}
      <div className='flex flex-wrap gap-4 w-full'>
        <input
          type='text'
          placeholder='Họ và tên'
          {...register('fullName')}
          className='border p-2 rounded-md w-full sm:w-[calc(50%-0.5rem)]'
        />

        <input
          type='text'
          placeholder='Số điện thoại'
          {...register('phone')}
          className='border p-2 rounded-md w-full sm:w-[calc(50%-0.5rem)]'
        />
      </div>

      {/* Địa chỉ + Ngày sinh */}
      <div className='flex flex-wrap gap-4 w-full'>
        <input
          type='text'
          placeholder='Địa chỉ'
          {...register('address')}
          className='border p-2 rounded-md w-full sm:w-[calc(50%-0.5rem)]'
        />

        <input
          type='date'
          {...register('dateOfBirth')}
          className='border p-2 rounded-md w-full sm:w-[calc(50%-0.5rem)]'
        />
      </div>

      <button type='submit' className='bg-primary text-white py-2 px-4 rounded-md self-start'>
        Lưu thay đổi
      </button>
    </form>
  )
}

export default UpdateUserInfoForm
