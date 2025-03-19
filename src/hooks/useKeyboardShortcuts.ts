'use client';

import { useEffect, useCallback } from 'react';

type KeyHandler = (event: KeyboardEvent) => void;

interface ShortcutMap {
  [key: string]: KeyHandler;
}

export const useKeyboardShortcuts = (shortcuts: ShortcutMap) => {
  const handleKeyPress = useCallback(
    (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      const handler = shortcuts[key];
      if (handler) {
        event.preventDefault();
        handler(event);
      }
    },
    [shortcuts]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleKeyPress]);
}; 