import { Doughnut } from "react-chartjs-2";

const ProgressCard = () => {
    const data = {
      labels: ["Completed", "On going"],
      datasets: [{ data: [40, 60], backgroundColor: ["blue", "orange"] }],
    };
  
    return (
      <div className="bg-white p-6 rounded-lg shadow flex flex-col items-center" style={{height: '100%'}}>
        <h3 className="text-lg font-semibold mb-4">40% Progress</h3>
        <Doughnut data={data} />
      </div>
    );
  };

export default ProgressCard