import ScanQRCodeDialog from '@/components/ui/dialogScanCode'
const BarCode = () => {
  return (
    <div className='w-full flex justify-between items-start gap-4'>
      <div className='flex flex-col justify-between items-start gap-4'>
        <p className='text-black/40'>Scan QR Code</p>
        <ScanQRCodeDialog />
      </div>
      <div className='flex flex-col justify-between items-center gap-2'>
        <div className='border-r border-black/40 h-[80px]'></div>
        <span className='text-black/40'>Or</span>
        <div className='border-r border-black/40 h-[80px]'></div>
      </div>
      <div className='flex flex-col justify-between items-start gap-4'>
        <p className='text-black/40'>Enter the barcode</p>
        <input
          type='text'
          placeholder='Product code'
          className='p-2 outline-none rounded-xl bg-white border border-primary w-[300px]'
        />
        <input
          type='text'
          placeholder='Quantity'
          className='p-2 outline-none rounded-xl bg-white border border-primary w-[300px]'
        />
        <button className='cursor-pointer bg-primary rounded-xl py-2 px-4 w-[100px]'>
          <span className='text-white'>Add</span>
        </button>
      </div>
    </div>
  )
}

export default BarCode
