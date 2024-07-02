import { c } from '../../lib';

const NumberInput: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = ({
  ...rest
}) => {
  return (
    <input
      {...rest}
      type="number"
      className={c(
        'w-16 border border-theme-light-gray bg-[#f9f9f9] py-2 text-center text-theme-extra-dark-gray outline-none',
        rest.className
      )}
    />
  );
};

export default NumberInput;
