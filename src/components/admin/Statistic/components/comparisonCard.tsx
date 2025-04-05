const ComparisonCard = () => (
    <div className="bg-white p-6 rounded-lg shadow text-center" style={{height: '100%'}}>
      <h3 className="text-lg font-semibold mb-2">Comparison</h3>
      <div className="flex justify-around text-xl">
        <p className="text-blue-600">5.599.000</p>
        <p className="text-orange-500">9.599.000</p>
      </div>
      <p className="text-sm text-gray-500">This Week vs Last Week</p>
    </div>
  );

export default ComparisonCard;