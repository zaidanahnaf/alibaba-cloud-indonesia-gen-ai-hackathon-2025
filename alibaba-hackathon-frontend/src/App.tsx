import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './page/Dahsboard';
import FoodDetail from './utils/FoodDetail';
import './App.css';

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/food-detail" element={<FoodDetail />} />
    </Routes>
  );
};

export default App;