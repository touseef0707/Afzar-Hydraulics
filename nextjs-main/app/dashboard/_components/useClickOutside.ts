// file: src/hooks/useClickOutside.ts

import { useEffect, RefObject } from 'react';

type Event = MouseEvent | TouchEvent;

/**
 * A custom hook that triggers a handler function when a click or touch event
 * occurs outside of the referenced element.
 * @param ref A React ref object pointing to the element to monitor.
 * @param handler The function to call when an outside click is detected.
 */
export const useClickOutside = (
  ref: RefObject<HTMLElement | null>, // Accepts a ref that can be null
  handler: (event: Event) => void
) => {
  useEffect(() => {
    const listener = (event: Event) => {
      // Do nothing if the click is on the referenced element or its children
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return;
      }
      handler(event);
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
};
