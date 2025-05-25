// components/MoodAssistantModal.tsx
import React, { useState } from 'react';
import type { MoodAssistantModalProps, ModalStage, MoodResult } from '../utils/Modals';
import { AIAvatar } from './AiAssistant';
import { getMoodAnalysis } from '../utils/MoodAnalyzer';
import '../assets/css/AIModal.css'

export const MoodAssistantModal: React.FC<MoodAssistantModalProps> = ({ isOpen, onClose }) => {
  const [stage, setStage] = useState<ModalStage>('initial');
  const [userInput, setUserInput] = useState('');
  const [result, setResult] = useState<MoodResult | null>(null);

  const handleSubmit = async () => {
    if (!userInput.trim()) return;

    setStage('thinking');

    // Simulate AI processing
    setTimeout(() => {
      const moodResult = getMoodAnalysis(userInput);
      setResult(moodResult);
      setStage('result');
    }, 2000);
  };

  const resetModal = () => {
    setStage('initial');
    setUserInput('');
    setResult(null);
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      {/* Avatar dipindah keluar dari modal container */}
      <AIAvatar 
        isThinking={stage === 'thinking'}
        isComplete={stage === 'result'} isOpen={false}      />
      
      <div 
        className={`modal-container ${isOpen ? 'slide-up' : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="close-button" onClick={handleClose}>
          ✕
        </button>

        <div className="modal-content">
          {stage === 'initial' && (
            <div className="initial-stage">
              <h2 className="greeting">
                HALLO !! SEKARANG MOOD KAMU LAGI GIMANA NIH ? CERITA DONGG
              </h2>
              <textarea
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Ceritakan mood kamu sekarang..."
                className="mood-textarea"
                rows={4}
              />
              <button
                onClick={handleSubmit}
                disabled={!userInput.trim()}
                className="submit-button"
              >
                Kirim
              </button>
            </div>
          )}

          {stage === 'thinking' && (
            <div className="thinking-stage">
              <div className="thinking-indicator">
                <div className="spinner"></div>
                <p>AI sedang berpikir...</p>
              </div>
            </div>
          )}

          {stage === 'result' && result && (
            <div className="result-stage">
              <div className="result-item">
                <h3>Mood:</h3>
                <p>{result.mood}</p>
              </div>
              <div className="result-item">
                <h3>Rekomendasi Makanan:</h3>
                <p>{result.recommendation}</p>
              </div>
              <div className="result-item">
                <h3>Alasan:</h3>
                <p>{result.reason}</p>
              </div>
              <button
                onClick={resetModal}
                className="reset-button"
              >
                Tanya Lagi
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}