import { useEffect, useRef, useState } from 'react';
import { c } from '../../lib';

interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  tabs: { tab: string; content: string }[];
}

const TabsContent: React.FC<TabsContentProps> = ({ tabs, ...rest }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const [hasScroll, setHasScroll] = useState(false);
  const [scrollLeft, setScrollLeft] = useState(false);
  const [scrollRight, setScrollRight] = useState(false);

  const [selectedTabIndex, setSelectedTabIndex] = useState(0);

  useEffect(() => {
    const scroller = scrollRef.current;

    if (!scroller) return;

    window.addEventListener('resize', calculate);

    scroller.addEventListener('scroll', onScroll);

    return () => {
      window.removeEventListener('resize', calculate);
      scroller.removeEventListener('scroll', onScroll);
    };

    function calculate() {
      if (!scroller) return;

      if (scroller.scrollWidth > scroller.clientWidth) setHasScroll(true);
      else setHasScroll(false);

      onScroll();
    }

    function onScroll() {
      if (!scroller) return;

      if (scroller.scrollLeft > 0) setScrollLeft(true);
      else setScrollLeft(false);

      if (
        scroller.scrollLeft + 1 >=
        scroller.scrollWidth - scroller.clientWidth
      )
        setScrollRight(false);
      else setScrollRight(true);
    }
  }, []);

  return (
    <div
      {...rest}
      className={c(
        'flex max-w-full flex-col items-start text-sm',
        rest.className
      )}
    >
      <div
        className={c(
          'relative top-[1px] max-w-full shrink-0 overflow-hidden rounded-t-[4px]',
          scrollLeft && '!rounded-tl-none',
          scrollRight && '!rounded-tr-none'
        )}
      >
        <div
          className="flex w-full overflow-x-auto overflow-y-visible scrollbar-none"
          ref={scrollRef}
        >
          {tabs.map((tab, i) => (
            <button
              className={c(
                'relative whitespace-nowrap border border-b-0 border-r-0 border-[#e5e7eb] bg-white px-4 py-2',
                selectedTabIndex === i
                  ? 'z-[1] border-b-[3px] border-b-[#00acdd] bg-white text-[15px] font-semibold text-[#345466] md:text-[17px]'
                  : ' text-[#777]',
                i === 0 && 'rounded-tl-[4px]',
                i === tabs.length - 1 && 'rounded-tr-[4px] !border-r'
              )}
              onClick={() => setSelectedTabIndex(i)}
              key={i}
            >
              {tab.tab}
            </button>
          ))}
        </div>
        <div
          className={c(
            'absolute bottom-0 left-0 top-0 z-[2] w-2 rounded-tl-[4px] bg-gradient-to-r from-black/10 to-black/0 transition',
            scrollLeft ? 'opacity-100' : 'opacity-0'
          )}
        />
        <div
          className={c(
            'absolute bottom-0 right-0 top-0 z-[2] w-2 rounded-tr-[4px] bg-gradient-to-l from-black/10 to-black/0 transition',
            scrollRight ? 'opacity-100' : 'opacity-0'
          )}
        />
      </div>
      <div
        className={c(
          'max-w-[750px] relative flex flex-1 flex-col gap-4 overflow-y-auto rounded-md rounded-tl-none border border-[#e5e7eb] bg-white p-[20px] text-[13px] leading-[2em] text-[#666] shadow-[0px_1px_3px_#eee] scrollbar-thin scrollbar-thumb-[#e0e0e0] scrollbar-thumb-rounded-none md:text-base',
          hasScroll && '!rounded-tl-none !rounded-tr-none'
        )}
      >
        <p dangerouslySetInnerHTML={{__html: tabs[selectedTabIndex].content}} />
      </div>
    </div>
  );
};

export default TabsContent;
