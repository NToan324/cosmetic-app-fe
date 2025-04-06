import { Bar } from 'react-chartjs-2'

const BarChart = () => {
  const data = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      { label: 'Sales', data: [200, 250, 300, 280, 320, 400, 150], backgroundColor: 'rgba(54, 162, 235, 0.5)' }
    ]
  }

  return (
    <div className='bg-white p-6 rounded-lg shadow'>
      <h3 className='text-lg font-semibold mb-2'>Sales Column Chart</h3>
      <Bar data={data} />
    </div>
  )
}

export default BarChart
