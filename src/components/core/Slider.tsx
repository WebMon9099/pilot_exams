import { useRef, useState } from 'react';
import { c } from '../../lib';
import Holdable from './Holdable';

interface SliderProps extends React.HTMLAttributes<HTMLDivElement> {
  min: number;
  max: number;
  value: number;
  onValueChange: (value: number) => void;
  noun: string;
}

const Slider: React.FC<SliderProps> = ({
  min,
  max,
  value,
  onValueChange,
  noun,
  ...rest
}) => {
  const sliderBackgroundRef = useRef<HTMLButtonElement>(null);

  const [hold, setHold] = useState(false);

  return (
    <div
      {...rest}
      className={c(
        'flex gap-4 p-[50px_20px_0px_20px] text-[#dfdfdf]',
        rest.className
      )}
    >
      <span className="font-inter text-sm font-medium text-[#bbb]">{min}</span>
      <Holdable
        className="relative my-[5px] flex-1"
        onHold={() => setHold(true)}
        onHoldRelease={() => setHold(false)}
        onMouseMove={(e) => {
          if (!hold) return;

          updateSlider(e.clientX);
        }}
        onTouchMove={(e) => {
          if (!hold) return;

          updateSlider(e.touches[0].clientX);
        }}
        onMouseDown={(e) => {
          updateSlider(e.clientX);
        }}
        sticky
        ref={sliderBackgroundRef}
      >
        <div
          className="absolute bottom-0 left-0 top-0 rounded-full bg-theme-dark-blue"
          style={{ width: `${((value - min) / (max - min)) * 100}%` }}
        ></div>
        <div
          className="absolute bottom-0 right-0 top-0 rounded-full border border-[#dfdfdf] bg-[#f2f2f2]"
          style={{ width: `${100 - ((value - min) / (max - min)) * 100}%` }}
        ></div>
        <div
          className="absolute left-0 top-1/2 h-[18px] w-[18px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#e2e2e2] bg-white shadow-sm"
          style={{ left: `${((value - min) / (max - min)) * 100}%` }}
        />
        <div
          className="absolute bottom-full mb-4 -translate-x-1/2 whitespace-nowrap rounded-full border border-[#e9e9e9] bg-white p-[10px_17px]"
          style={{
            boxShadow: 'rgb(235, 235, 235) 0px 0px 2px 0px',
            left: `${((value - min) / (max - min)) * 100}%`,
          }}
        >
          <span className="font-inter text-base font-semibold text-[#6b6b6b]">
            {value}
          </span>{' '}
          <span className="text-[13px] text-[#b2b2b2]">{noun}</span>
        </div>
      </Holdable>
      <span className="font-inter text-sm font-medium text-[#bbb]">{max}</span>
    </div>
  );

  function updateSlider(x: number) {
    if (!sliderBackgroundRef.current) return;

    const left = sliderBackgroundRef.current.getBoundingClientRect().left;
    const right = sliderBackgroundRef.current.getBoundingClientRect().right;

    const leftDis = x - left;
    const sliderWidth = right - left;

    const newValue =
      min + ((max - min) * ((leftDis / sliderWidth) * 100)) / 100;

    if (newValue > min && newValue < max) onValueChange(Math.round(newValue));
  }
};

export default Slider;
