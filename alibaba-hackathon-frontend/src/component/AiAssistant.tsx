// components/AIAvatar.tsx
import React from 'react';
import type { AIAvatarProps } from '../utils/Modals';
import '../assets/css/AIAvatar.css';

// Import avatar SVGs
import avatar1 from '../assets/icons/avatar1.svg'; // Avatar ketika berhasil menentukan hasil
import avatar3 from '../assets/icons/avatar3.svg'; // Avatar default ketika popup muncul
import avatar4 from '../assets/icons/avatar4.svg'; // Avatar ketika sedang berpikir

export const AIAvatar: React.FC<AIAvatarProps> = ({ isThinking, isComplete = false }) => {
  // Menentukan avatar yang akan ditampilkan berdasarkan kondisi
  const getAvatarImage = () => {
    if (isComplete) {
      return avatar1; // Avatar ketika berhasil menentukan hasil
    } else if (isThinking) {
      return avatar4; // Avatar ketika sedang berpikir
    } else {
      return avatar3; // Avatar default ketika popup muncul
    }
  };

  return (
    <div className="avatar-container-floating">
      <div className={`avatar-floating ${isThinking ? 'thinking' : ''} ${isComplete ? 'complete' : ''}`}>
        <img 
          src={getAvatarImage()} 
          alt="AI Avatar" 
          className="avatar-image"
        />
        {isThinking && (
          <div className="thinking-bubbles">
            <div className="bubble"></div>
            <div className="bubble"></div>
            <div className="bubble"></div>
          </div>
        )}
      </div>
    </div>
  );
};