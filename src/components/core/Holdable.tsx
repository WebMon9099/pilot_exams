import React, { useCallback, useEffect, useRef, useState } from 'react';
import { animate } from '../../lib';

export interface HoldableProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  delay?: number;
  interval?: number;
  sticky?: boolean;
  onHold?: () => void;
  onHoldRelease?: () => void;
}

const Holdable = React.forwardRef<HTMLButtonElement, HoldableProps>(
  (
    {
      delay = 0,
      interval = undefined,
      sticky = false,
      onHold,
      onHoldRelease,
      children,
      ...rest
    },
    ref
  ) => {
    const holdStartTimeout = useRef<NodeJS.Timeout>();

    const [hold, setHold] = useState(false);

    function cleanup() {
      if (holdStartTimeout.current) clearTimeout(holdStartTimeout.current);

      setHold(false);
    }

    function startHold() {
      cleanup();

      holdStartTimeout.current = setTimeout(() => setHold(true), delay);
    }

    const clearHold = useCallback(() => {
      cleanup();

      if (onHoldRelease) onHoldRelease();
    }, [onHoldRelease]);

    useEffect(() => {
      document.addEventListener('mouseup', clearHold);

      return () => document.removeEventListener('mouseup', clearHold);
    }, [clearHold]);

    useEffect(() => {
      if (hold && onHold) {
        if (interval === undefined) return animate(onHold);
        else {
          const onHoldInterval = setInterval(onHold, interval);

          return () => clearInterval(onHoldInterval);
        }
      }
    }, [hold, interval, onHold]);

    return (
      <button
        {...rest}
        onMouseDown={(e) => {
          rest.onMouseDown?.(e);

          startHold();
        }}
        onMouseLeave={(e) => {
          rest.onMouseLeave?.(e);

          if (!sticky) clearHold();
        }}
        onTouchStart={(e) => {
          rest.onTouchStart?.(e);

          startHold();
        }}
        onTouchEnd={(e) => {
          rest.onTouchEnd?.(e);

          clearHold();
        }}
        ref={ref}
      >
        {children}
      </button>
    );
  }
);

export default Holdable;
