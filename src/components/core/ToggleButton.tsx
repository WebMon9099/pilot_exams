import { c } from '../../lib';

interface ToggleButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  color: 'blue' | 'green';
  isChecked: boolean;
  textColor?: string;
  upperCase?: boolean;
  onToggle?: (toggled: boolean) => void;
}

const ToggleButton: React.FC<ToggleButtonProps> = ({
  color,
  isChecked,
  textColor,
  upperCase = false,
  onToggle,
  ...rest
}) => {
  var label = isChecked ? 'On' : 'Off';
  if (upperCase) label = label.toUpperCase();

  return (
    <button
      {...rest}
      className={c(
        "relative h-7 w-[65px] rounded-full bg-white after:absolute after:top-1/2 after:h-[80%] after:w-7 after:-translate-y-1/2 after:rounded-full after:transition-all after:content-['']",
        isChecked
          ? 'after:left-[calc(100%-3px)] after:-translate-x-full'
          : 'after:left-[3px]',
        color === 'blue' && 'after:bg-theme-dark-blue',
        color === 'green' && 'after:bg-[#74d73c]',
        rest.className
      )}
      onClick={(e) => {
        if (rest.onClick) rest.onClick(e);

        if (onToggle) onToggle(!isChecked);
      }}
    >
      <span
        className={c(
          'absolute top-1/2 -translate-y-1/2 select-none text-xs transition-all',
          color === 'blue' && 'text-theme-dark-blue',
          color === 'green' && 'text-[#74d73c]',
          isChecked ? 'left-2' : 'left-[calc(100%-8px)] -translate-x-full'
        )}
        style={{
          color: textColor,
        }}
      >
        {label}
      </span>
    </button>
  );
};

export default ToggleButton;
