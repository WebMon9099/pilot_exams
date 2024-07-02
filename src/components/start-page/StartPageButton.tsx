import { c, p } from '../../lib';

interface StartPageButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  color?: 'blue' | 'green' | 'white';
  icon: string;
  shadow?: boolean;
}

const StartPageButton: React.FC<StartPageButtonProps> = ({
  children,
  color = 'white',
  icon,
  shadow = false,
  ...rest
}) => {
  return (
    <button
      {...rest}
      className={c(
        'flex flex-col items-center gap-4 rounded-md py-8 font-semibold transition md:text-sm lg:text-base',
        rest.disabled
          ? '!text-[#dddddd]'
          : 'hover:shadow-[0_1px_3px_#e2e2e2] active:scale-95 active:brightness-95',
        color === 'blue' &&
          'bg-theme-blue text-white shadow-[0_1px_2px_#ddd] hover:bg-[#01a2d0]',
        color === 'green' &&
          'bg-theme-green text-white shadow-[0_1px_2px_#ddd] hover:bg-[#7ad340]',
        color === 'white' &&
          'border border-[#dfdfdf] bg-white text-theme-extra-dark-gray shadow-[0_1px_2px_#eaeaea] hover:border-[#00acdd]',
        rest.className
      )}
    >
      <img
        alt="button icon"
        src={p(`images/${icon}${rest.disabled ? '_disabled' : ''}.svg`)}
        className={c('h-6 md:h-5 lg:h-6 xl:h-10', shadow && 'drop-shadow-md')}
      />
      {children}
    </button>
  );
};

export default StartPageButton;
