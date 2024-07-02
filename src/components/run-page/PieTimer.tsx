import { useEffect, useState } from 'react';
import { useClock } from '../../hooks';
import { c } from '../../lib';

interface PieTimerProps extends React.HTMLAttributes<HTMLDivElement> {
  height?: number;
  width?: number;
  time: number;
}

const PieTimer: React.FC<PieTimerProps> = ({
  height = 48,
  width = 48,
  time,
  ...rest
}) => {
  const clock = useClock();

  const [progress, setProgress] = useState(0);

  useEffect(() => {
    var lastUpdate = Date.now();
    const interval = clock.addInterval(() => {
      const thisUpdate = Date.now();

      setProgress((progress) => {
        if (progress > time) return progress;

        return progress + (thisUpdate - lastUpdate) * 2;
      });

      lastUpdate = thisUpdate;
    }, 0);

    return () => interval.cancel();
  }, [clock, time]);

  useEffect(() => {
    setProgress(0);
  }, [time, setProgress]);

  return (
    <div {...rest} className={c('pie-timer', rest.className)}>
      <svg width={width} height={height} viewBox="0 0 20 20">
        <circle
          r="10"
          cx="10"
          cy="10"
          fill="#727272"
          shapeRendering="geometricPrecision"
        />
        <circle
          r="5"
          cx="10"
          cy="10"
          fill="transparent"
          stroke="#d3d3d3"
          strokeWidth="10"
          strokeDasharray={`${(1 - progress / time) * 31.4} 31.4`}
          transform="rotate(-90) translate(-20)"
          shapeRendering="geometricPrecision"
        />
      </svg>
    </div>
  );
};

export default PieTimer;
