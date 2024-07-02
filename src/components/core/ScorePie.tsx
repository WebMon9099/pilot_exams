import { useEffect, useRef, useState } from 'react';
import { Pie, PieChart, ResponsiveContainer } from 'recharts';
import { c, p } from '../../lib';
import type { Median } from '../../types';

interface ScorePieProps extends React.HTMLAttributes<HTMLDivElement> {
  score: number | null;
  median: Median | null;
  precentage?: boolean;
  showPlane?: boolean;
  fontSize?: number | string;
  innerRadius?: string;
  lineHeight?: number | string;
}

const ScorePie: React.FC<ScorePieProps> = ({
  score,
  median,
  precentage = true,
  showPlane = true,
  fontSize,
  innerRadius,
  lineHeight,
  ...rest
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setMounted(true), 0);

    return () => clearTimeout(timeout);
  }, []);

  if (score === null)
    return (
      <div
        {...rest}
        className={c('flex items-center justify-center', rest.className)}
      >
        <img
          alt="score no data"
          className="h-full"
          src={p('icons/no-data-score.svg')}
        />
      </div>
    );

  return (
    <div {...rest} className={c('relative', rest.className)} ref={containerRef}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={[
              {
                value: score,
                fill: getColor(),
              },
              {
                value: 100 - score,
                fill: '#e8e8e8',
              },
            ]}
            animationDuration={1000}
            animationBegin={0}
            animationEasing="ease"
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            startAngle={90}
            endAngle={720}
            innerRadius={innerRadius || '90%'}
            outerRadius="100%"
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute bottom-0 left-0 right-0 top-0 flex flex-col items-center justify-center">
        <span
          className="score-text block !font-normal text-[#515151]"
          style={{
            fontSize: fontSize !== undefined ? fontSize : '4.5rem',
            lineHeight,
          }}
        >
          {score}
        </span>
        {precentage && (
          <span className="prec-text !font-normal text-theme-light-gray">
            %
          </span>
        )}
      </div>
      {showPlane && (
        <div
          className="absolute -bottom-[10px] -left-[10px] -right-[10px] -top-[10px] flex justify-center"
          style={{
            rotate: mounted ? `-${(score / 100) * 360}deg` : '0deg',
            transition: 'ease',
            transitionDuration: '1000ms',
          }}
        >
          <img
            alt="aircraft icon"
            src={p(`images/${getAircraftIcon()}.svg`)}
            className="h-10 w-10 -rotate-90"
          />
        </div>
      )}
    </div>
  );

  function getAircraftIcon() {
    if (!median || median === 'average') return 'icon_aircraft_yellow';
    if (median === 'below') return 'icon_aircraft_red';
    if (median === 'above') return 'icon_aircraft_green';
  }

  function getColor() {
    if (!median || median === 'average') return '#f4da21';
    if (median === 'below') return '#fc5656';
    if (median === 'above') return '#7ce027';
  }
};

export default ScorePie;
