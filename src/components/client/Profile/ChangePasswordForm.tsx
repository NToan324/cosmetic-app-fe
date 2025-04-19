import { useForm } from 'react-hook-form'

type PasswordForm = {
  oldPassword: string
  newPassword: string
  confirmPassword: string
}

const ChangePasswordForm = () => {
  const { register, handleSubmit } = useForm<PasswordForm>()

  const onSubmit = (data: PasswordForm) => {
    if (data.newPassword !== data.confirmPassword) {
      alert('Mật khẩu mới không khớp')
      return
    }
    // Gọi API đổi mật khẩu tại đây
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='w-full max-w-lg flex flex-col gap-4 bg-white p-4 rounded-2xl'>
      <h2 className='text-xl font-semibold'>Đổi mật khẩu</h2>

      <input
        type='password'
        placeholder='Mật khẩu hiện tại'
        {...register('oldPassword')}
        className='border p-2 rounded-md w-full'
      />

      <input
        type='password'
        placeholder='Mật khẩu mới'
        {...register('newPassword')}
        className='border p-2 rounded-md w-full'
      />

      <input
        type='password'
        placeholder='Xác nhận mật khẩu mới'
        {...register('confirmPassword')}
        className='border p-2 rounded-md w-full'
      />

      <button type='submit' className='bg-primary text-white py-2 px-4 rounded-md self-start'>
        Đổi mật khẩu
      </button>
    </form>
  )
}

export default ChangePasswordForm
