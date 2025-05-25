export interface MoodResult {
  mood: string;
  recommendation: string;
  reason: string;
}

export type ModalStage = 'initial' | 'thinking' | 'result';

// utils/Modals.ts
export interface AIAvatarProps {
  isThinking: boolean;
  isComplete?: boolean; // Prop baru untuk menandakan AI telah selesai menentukan hasil
  isOpen: boolean; // Prop untuk kontrol transisi open/close
}

export interface MoodAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface UseIdleTimerReturn {
  isIdle: boolean;
  resetTimer: () => void;
}