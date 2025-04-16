const rankLevels = [
  { min: 0, max: 7499, rank: 'MEMBER', label: 'Thành viên', percent: '1.5%' },
  { min: 7500, max: 21249, rank: 'BRONZE', label: 'Đồng', percent: '1.7%' },
  { min: 21250, max: 44999, rank: 'SILVER', label: 'Bạc', percent: '2%' },
  { min: 45000, max: 106249, rank: 'GOLD', label: 'Vàng', percent: '2.5%' },
  { min: 106250, max: 224999, rank: 'DIAMOND', label: 'Kim cương', percent: '3%' },
  { min: 225000, max: Infinity, rank: 'PLATINUM', label: 'Bạch kim', percent: '5%' }
]

type Props = {
  point: number
}

const CustomerPointProgress = ({ point }: Props) => {
  const currentRank = rankLevels.find((r) => point >= r.min && point <= r.max)!
  const nextRank = rankLevels.find((r) => r.min > point)

  const percentToNext =
    nextRank && nextRank.min !== Infinity
      ? Math.min(((point - currentRank.min) / (nextRank.min - currentRank.min)) * 100, 100)
      : 100

  return (
    <div className='w-full p-4 bg-white rounded-2xl shadow flex flex-col gap-4'>
      <h2 className='text-xl font-semibold'>Điểm tích lũy của bạn</h2>

      <div className='flex justify-between items-center text-sm'>
        <span>
          Hạng: <strong>{currentRank.label}</strong> ({currentRank.percent})
        </span>
        <span>{point.toLocaleString()} điểm</span>
      </div>

      <div className='w-full h-4 bg-gray-200 rounded-full overflow-hidden'>
        <div
          className='h-full bg-gradient-to-r from-orange-400 to-yellow-400 rounded-full transition-all duration-500'
          style={{ width: `${percentToNext}%` }}
        />
      </div>

      {nextRank ? (
        <div className='text-sm text-gray-600'>
          Cần thêm <strong>{(nextRank.min - point).toLocaleString()}</strong> điểm để đạt hạng{' '}
          <strong>{nextRank.label}</strong> ({nextRank.percent})
        </div>
      ) : (
        <div className='text-sm text-green-600 font-medium'>Bạn đang ở hạng cao nhất 🎉</div>
      )}
    </div>
  )
}

export default CustomerPointProgress
