import { useEffect, useRef, useState } from 'react';
import { c } from '../../lib';

interface TabbarProps extends React.HTMLAttributes<HTMLDivElement> {
  tab: 'feedback' | 'overview';
  setTab: (tab: 'feedback' | 'overview') => void;
}

const Tabbar: React.FC<TabbarProps> = ({ tab, setTab, ...rest }) => {
  const overviewButtonRef = useRef<HTMLButtonElement>(null);
  const feedbackButtonRef = useRef<HTMLButtonElement>(null);

  const [activatedButton, setActivatedButton] = useState<
    HTMLButtonElement | undefined
  >();

  useEffect(() => {
    switch (tab) {
      case 'overview':
        setActivatedButton(overviewButtonRef.current || undefined);
        break;
      case 'feedback':
        setActivatedButton(feedbackButtonRef.current || undefined);
        break;
    }
  }, [tab]);

  return (
    <div
      {...rest}
      className={c(
        'relative flex gap-6 border-b border-[#e0e0e0] bg-white px-12 font-semibold',
        rest.className
      )}
    >
      <button
        onClick={() => setTab('overview')}
        className={c(
          'h-full',
          tab === 'overview' ? 'text-[#646464]' : 'text-theme-light-gray'
        )}
        ref={overviewButtonRef}
      >
        Overview
      </button>
      <button
        onClick={() => setTab('feedback')}
        className={c(
          'h-full',
          tab === 'feedback' ? 'text-[#646464]' : 'text-theme-light-gray'
        )}
        ref={feedbackButtonRef}
      >
        Feedback
      </button>
      <div
        className="left:0 absolute top-full h-[3px] w-8 -translate-y-full rounded-t-md bg-[#3793d1] transition-all"
        style={{
          width: activatedButton?.clientWidth,
          left: activatedButton?.offsetLeft,
        }}
      ></div>
    </div>
  );
};

export default Tabbar;
