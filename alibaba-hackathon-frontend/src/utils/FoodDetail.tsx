import { useLocation } from 'react-router-dom';

const FoodDetail = () => {
  const location = useLocation();
  const data = location.state;

  if (!data) return <p>Data tidak ditemukan</p>;

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md space-y-4">
      <h1 className="text-2xl font-bold">{data.name}</h1>
      <p className="text-gray-700">{data.description}</p>
      <p className="text-green-600 font-medium mt-2">Kenapa direkomendasikan?</p>
      <p className="text-gray-800">{data.reason}</p>
    </div>
  );
};

export default FoodDetail;