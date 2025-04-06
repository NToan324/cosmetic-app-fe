import { Line } from 'react-chartjs-2'

const LineChart = () => {
  const data = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      { label: 'This Week', data: [200, 400, 500, 600, 450, 300, 100], borderColor: 'blue', fill: false },
      { label: 'Last Week', data: [100, 150, 400, 300, 500, 600, 200], borderColor: 'orange', fill: false }
    ]
  }

  return (
    <div className='bg-white p-6 rounded-lg shadow'>
      <h3 className='text-lg font-semibold mb-2'>Weekly Trend</h3>
      <Line data={data} />
    </div>
  )
}

export default LineChart
