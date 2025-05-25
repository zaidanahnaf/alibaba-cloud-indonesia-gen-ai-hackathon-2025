import React, { useState, useEffect } from 'react';
import { MoodAssistantModal } from '../component/MoodAssistantModal';
import { useIdleTimer } from '../component/UserIdle';
import '../App.css';

const Dashboard: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userInteracted, setUserInteracted] = useState(false);
  const { isIdle, resetTimer } = useIdleTimer(3000);

  useEffect(() => {
    if (isIdle && !isModalOpen && userInteracted) {
      setIsModalOpen(true);
    }
  }, [isIdle, isModalOpen, userInteracted]);

  const handleUserInteraction = React.useCallback(() => {
    if (!userInteracted) {
      setUserInteracted(true);
    }
    resetTimer();
  }, [userInteracted, resetTimer]);

  useEffect(() => {
    const events = ['click', 'scroll', 'keydown'];
    events.forEach(event => {
      document.addEventListener(event, handleUserInteraction);
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleUserInteraction);
      });
    };
  }, [userInteracted, handleUserInteraction]);

  const foodItems = Array.from({ length: 8 }, (_, i) => ({
    id: i + 1,
    name: `Food Item ${i + 1}`,
    description: 'Delicious meal description...'
  }));

  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 font-sans"
      onClick={handleUserInteraction}
    >
      <div className="max-w-6xl mx-auto p-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl text-gray-700 font-bold mb-2">Food Recommendations</h1>
          <p className="text-gray-500 text-lg">Discover delicious meals based on your mood!</p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mb-8">
          {foodItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1 cursor-pointer"
            >
              <div className="w-full h-36 rounded-lg bg-gradient-to-br from-gray-200 to-gray-300 mb-4"></div>
              <h3 className="text-lg text-gray-700 font-semibold mb-2">{item.name}</h3>
              <p className="text-gray-500 leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>

        {userInteracted && (
          <div className="fixed bottom-4 right-4 bg-black/80 text-white text-sm px-4 py-2 rounded-md">
            Status: {isIdle ? 'Idle - Modal will appear' : 'User is active'}
          </div>
        )}
      </div>

      <MoodAssistantModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default Dashboard;