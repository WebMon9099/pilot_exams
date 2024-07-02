import { useEffect, useRef, useState } from 'react';
import { Area, AreaChart, ResponsiveContainer } from 'recharts';
import { c } from '../../lib';

interface StanineGraphProps extends React.HTMLAttributes<HTMLDivElement> {
  score: number;
}

const StanineGraph: React.FC<StanineGraphProps> = ({ score, ...rest }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [point, setPoint] = useState<{ x: number; y: number } | undefined>(
    undefined
  );

  score = 50;

  useEffect(() => {
    if (!containerRef.current) return;

    movePoint();

    const observer = new MutationObserver(movePoint);

    observer.observe(containerRef.current, {
      attributes: true,
      childList: true,
      subtree: true,
    });

    return () => {
      observer.disconnect();
    };

    function movePoint() {
      if (!containerRef.current) return;

      const curve = containerRef.current.querySelector(
        '.recharts-area-curve'
      ) as SVGGeometryElement;

      if (!curve) return;

      const length = curve.getTotalLength();
      const newPoint = curve.getPointAtLength((score / 100) * length);

      setPoint(newPoint);
    }
  }, [score]);

  return (
    <div
      {...rest}
      className={c('relative mt-10 w-full px-2', rest.className)}
      ref={containerRef}
    >
      <ResponsiveContainer
        className="border-l border-b"
        width="100%"
        height={175}
      >
        <AreaChart data={STANINE_DATA}>
          <Area
            isAnimationActive={false}
            type="monotone"
            dataKey="uv"
            stroke="#81d2f5"
            fill="#c5eafb"
          />
        </AreaChart>
      </ResponsiveContainer>
      {point && (
        <div className="absolute" style={{ left: point.x, top: point.y - 10 }}>
          <div className="absolute left-1/2 bottom-full flex -translate-x-1/2 flex-col items-center">
            <p className="text-xl font-semibold text-[#3793d1]">
              {score}
              <span className="ml-1 text-xs font-light text-theme-light-gray">
                %
              </span>
            </p>
            <div className="h-10 w-[1px] bg-[#e8e8e8]" />
          </div>
          <div className="relative h-5 w-5 rounded-full border-[3px] border-white bg-[#3793d1] shadow-md shadow-black/40" />
        </div>
      )}
      <div className="mt-1 flex justify-between text-theme-dark-gray">
        <span>0</span>
        <span>100</span>
      </div>
    </div>
  );
};

export default StanineGraph;

const STANINE_DATA = [
  {
    name: '0',
    uv: 600,
  },
  {
    uv: 1000,
  },
  {
    uv: 2000,
  },
  {
    uv: 1000,
  },
  {
    name: '100',
    uv: 600,
  },
];
