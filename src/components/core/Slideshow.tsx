import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { c } from '../../lib';

interface SlideshowProps extends React.HTMLAttributes<HTMLDivElement> {
  disableScroll?: boolean;
  frameDots?: boolean;
}

const Slideshow: React.FC<SlideshowProps> = ({
  disableScroll = false,
  frameDots = false,
  children: slides,
  ...rest
}) => {
  const scrollerRef = useRef<HTMLDivElement>(null);

  const [activeSlideIndex, setActiveSlideIndex] = useState(0);

  useLayoutEffect(() => {
    if (disableScroll) return;

    const scroller = scrollerRef.current;

    if (!scroller) return;

    var mouseDown = false;
    var startX = 0;

    var scrollX = activeSlideIndex * scroller.clientWidth;

    scroller.addEventListener('mousedown', onMouseDown);
    scroller.addEventListener('touchstart', onMouseDown);
    scroller.addEventListener('mousemove', onMouseMove);
    scroller.addEventListener('touchmove', onMouseMove);
    scroller.addEventListener('mouseleave', onMouseUp);
    document.addEventListener('mouseup', onMouseUp);
    document.addEventListener('touchend', onMouseUp);

    return () => {
      scroller.removeEventListener('mousedown', onMouseDown);
      scroller.removeEventListener('touchstart', onMouseDown);
      scroller.removeEventListener('mousemove', onMouseMove);
      scroller.removeEventListener('touchmove', onMouseMove);
      scroller.removeEventListener('mouseleave', onMouseUp);
      document.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('touchend', onMouseUp);
    };

    function onMouseMove(e: MouseEvent | TouchEvent) {
      const screenX =
        e instanceof MouseEvent ? e.screenX : e.touches[0].screenX;

      if (mouseDown) {
        if (!scroller) return;

        const xDistance = screenX - startX;

        scrollX -= xDistance;

        scrollX = Math.min(Math.max(0, scrollX), scroller.clientWidth);

        scroller.scrollTo(scrollX, 0);
      }
    }

    function onMouseDown(e: MouseEvent | TouchEvent) {
      mouseDown = true;

      const screenX =
        e instanceof MouseEvent ? e.screenX : e.touches[0].screenX;

      startX = screenX;
    }

    function onMouseUp() {
      if (!scroller) return;

      mouseDown = false;

      startX = 0;

      if (scrollX <= scroller.clientWidth / 2)
        setActiveSlideIndex(Math.max(0, activeSlideIndex - 1));
      else
        setActiveSlideIndex(
          Math.min(React.Children.count(slides) - 1, activeSlideIndex + 1)
        );
    }
  }, [slides, activeSlideIndex, disableScroll]);

  useEffect(() => {
    if (!scrollerRef.current) return;

    scrollToSlide(activeSlideIndex);
  }, [activeSlideIndex]);

  return (
    <div {...rest} className={c('relative select-none', rest.className)}>
      <div
        className="relative flex h-full w-full overflow-hidden scroll-smooth"
        ref={scrollerRef}
      >
        {slides}
      </div>
      <div
        className={c(
          'absolute bottom-4 right-1/2 flex translate-x-1/2 gap-2',
          frameDots && 'rounded-full bg-[#6b6b6b] px-2 py-[6px] shadow-md'
        )}
      >
        {new Array(React.Children.count(slides)).fill(null).map((_, i) => (
          <button
            className={c(
              'h-3 w-3 rounded-full hover:brightness-110',
              activeSlideIndex === i
                ? 'bg-[#999999]'
                : 'bg-[#969696] opacity-40'
            )}
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();

              setActiveSlideIndex(i);
            }}
            key={i}
          />
        ))}
      </div>
    </div>
  );

  function scrollToSlide(index: number) {
    if (!scrollerRef.current) return;

    scrollerRef.current.scroll(index * scrollerRef.current.clientWidth, 0);
  }
};

export default Slideshow;

interface SlideProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Slide: React.FC<SlideProps> = ({ children, ...rest }) => {
  return (
    <div
      {...rest}
      className={c(
        'slide h-full w-full shrink-0 overflow-hidden',
        rest.className
      )}
    >
      {children}
    </div>
  );
};
