import { forwardRef } from 'react';
import { c } from '../../lib';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  color?: 'blue' | 'green' | 'red' | 'yellow' | 'gray';
  look?: 'rounded' | 'rect';
  overrideClick?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      color = 'blue',
      look = 'rounded',
      type,
      overrideClick = false,
      ...rest
    },
    ref
  ) => {
    return (
      <button
        {...rest}
        className={c(
          'px-6 py-2 text-sm font-semibold transition duration-75',
          overrideClick && 'scale-95 brightness-95',
          color === 'blue' && 'bg-[#00acdd] text-white',
          color === 'green' && 'bg-theme-green text-white',
          color === 'red' && 'bg-theme-red text-white',
          color === 'yellow' && 'bg-theme-yellow text-theme-extra-dark-gray',
          color === 'gray' && 'text-theme-light-gray',
          look === 'rounded' && 'rounded-full',
          look === 'rect' && 'rounded-md',
          rest.disabled
            ? 'bg-theme-light-gray text-white'
            : 'hover:scale-105 active:scale-95 active:brightness-95',
          !rest.disabled && color !== 'gray' && 'hover:shadow-md',
          rest.className
        )}
        ref={ref}
        style={{
          color: rest.disabled ? '#adadad' : undefined,
          backgroundColor: rest.disabled ? '#eaeaea' : undefined,
        }}
      >
        {children}
      </button>
    );
  }
);

export default Button;
