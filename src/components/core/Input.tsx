import { c } from '../../lib';

const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = ({
  ...rest
}) => {
  return (
    <input
      {...rest}
      type="text"
      className={c(
        'border border-theme-light-gray bg-[#f9f9f9] py-2 px-3 outline-none',
        rest.className
      )}
    />
  );
};

export default Input;
