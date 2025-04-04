interface StatCardProps {
  title: string;
  value: string | number;
  icon: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon }) => (
    <div className="bg-white p-4 rounded-lg shadow flex items-center">
      <span className="text-3xl mr-3">{icon}</span>
      <div>
        <h4 className="text-gray-500">{title}</h4>
        <p className="text-xl font-semibold">{value}</p>
      </div>
    </div>
);

export default StatCard;