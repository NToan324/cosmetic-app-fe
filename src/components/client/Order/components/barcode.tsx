import ScanQRCodeDialog from '@/components/ui/dialogScanCode'
const BarCode = () => {
  return (
    <div className='w-full flex justify-between items-start gap-4'>
      <div className='flex flex-col justify-between items-start gap-4'>
        <p className='text-black/40'>Scan QR Code</p>
        <ScanQRCodeDialog />
      </div>
      <div className='flex flex-col justify-between items-start gap-4'>
        <p className='text-black/40'>Or enter the barcode</p>
        <div className='flex justify-between items-center gap-4'>
          <input
            type='text'
            placeholder='Product code'
            className='border-none outline-none rounded-2xl bg-gray-100 p-4 w-[200px]'
          />

          <input
            type='text'
            placeholder='Quantity'
            className='border-none outline-none rounded-2xl bg-gray-100 p-4 w-[200px]'
          />
        </div>
        <button className='cursor-pointer bg-primary rounded-xl py-2 px-4 w-[100px]'>
          <span className='text-white'>Add</span>
        </button>
      </div>
    </div>
  )
}

export default BarCode
