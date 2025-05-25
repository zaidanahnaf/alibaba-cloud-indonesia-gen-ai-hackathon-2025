    // hooks/useIdleTimer.tsx
    import { useState, useEffect, useRef } from 'react';
    import { useCallback } from 'react';
    import type { UseIdleTimerReturn } from '../utils/Modals';

    export const useIdleTimer = (timeout: number = 10000): UseIdleTimerReturn => {
    const [isIdle, setIsIdle] = useState(false);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const resetTimer = useCallback(() => {
        setIsIdle(false);
        if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(() => {
        setIsIdle(true);
        }, timeout);
    }, [timeout]);

    useEffect(() => {
        const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
        
        const resetTimerHandler = () => resetTimer();
        
        events.forEach(event => {
        document.addEventListener(event, resetTimerHandler, true);
        });

        resetTimer();

        return () => {
        events.forEach(event => {
            document.removeEventListener(event, resetTimerHandler, true);
        });
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        };
    }, [timeout, resetTimer]);

    return { isIdle, resetTimer };
    };