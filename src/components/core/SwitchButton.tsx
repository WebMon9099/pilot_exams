import { c } from '../../lib';

interface SwitchButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  checked: boolean;
}

const SwitchButton: React.FC<SwitchButtonProps> = ({ checked, ...rest }) => {
  return (
    <button
      {...rest}
      className={c('relative inline-flex cursor-pointer', rest.className)}
    >
      <div
        className={c(
          "relative h-7 w-[74px] rounded-full border border-theme-light-gray bg-[#f9f9f9] after:absolute after:top-1/2 after:h-5 after:w-8 after:-translate-y-1/2 after:rounded-full after:bg-theme-blue after:transition after:content-['']",
          checked ? 'after:translate-x-0' : 'after:-translate-x-[32px]'
        )}
      >
        <span className="absolute right-2 top-1/2 -translate-y-1/2 select-none text-xs text-theme-light-gray">
          Off
        </span>
        <span className="absolute left-2 top-1/2 -translate-y-1/2 select-none text-xs text-theme-light-gray">
          On
        </span>
      </div>
    </button>
  );
};

export default SwitchButton;
