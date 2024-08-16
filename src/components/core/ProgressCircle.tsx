import React, { useEffect, useState } from 'react';
import { p } from "../../lib";
interface ProgressCircleProps {
  isPlaying: boolean;
  clickable: boolean;
  percentage: number;
  toggleClick: Function;
}

const ProgressCircle: React.FC<ProgressCircleProps> = ({isPlaying, clickable, percentage, toggleClick }) => {

  // useEffect(() => {
  //   let start: number | null = null;

  //   const step = (timestamp: number) => {
  //     if (!start) start = timestamp;
  //     const progress = timestamp - start;
  //     const percentage = Math.min((progress / duration) * endPercentage, endPercentage);
  //     setPercentage(Math.round(percentage));

  //     if (progress < duration) {
  //       window.requestAnimationFrame(step);
  //     }
  //   };

  //   window.requestAnimationFrame(step);
  // }, [duration, endPercentage]);

  const degree = (percentage / 100) * 360;

  return (
    <div className="progress-circle">
      <div className="circle">
        <div className="mask left-hidden">
          <div className="fill left-area-color" style={{ transform: `rotate(${degree > 180?180:degree}deg)` }}></div>
        </div>
        <div className="mask right-hidden">
          <div className="fill right-area-color" style={{transform: `rotate(${degree > 180?(degree-180):0}deg)` }}></div>
        </div>
      </div>
      <div className="inset">
        <img
          alt="speaker icon"
          src={p(isPlaying? "images/speaker-playing.svg" : "images/speaker-not-playing.svg")}
          className={"w-16 " + (clickable?"cursor-pointer":"")}
          onClick={() => toggleClick()}
        />
      </div>
    </div>
  );
};

export default ProgressCircle;
