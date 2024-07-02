import { useEffect, useState } from 'react';
import { useClock } from '../../hooks';
import { c, p } from '../../lib';

const PauseIndicator: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  ...rest
}) => {
  const clock = useClock();

  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const interval = clock.addInterval(
      () => setHidden((hidden) => !hidden),
      750
    );

    return () => interval.cancel();
  }, [clock]);

  return (
    <div
      {...rest}
      className={c(
        'flex h-12 w-12  items-center justify-center rounded-full bg-theme-blue',
        hidden ? 'opacity-0' : 'opacity-100',
        rest.className
      )}
    >
      <img
        alt="pause icon"
        src={p('images/icon_paused.svg')}
        className="h-6 w-6"
      />
    </div>
  );
};

export default PauseIndicator;
