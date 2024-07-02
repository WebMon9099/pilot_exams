import { c, p } from '../../lib';

interface LabeledBoxProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  icon?: string;
  noPadding?: boolean;
  backgroundColor?: string;
}

const LabeledBox: React.FC<LabeledBoxProps> = ({
  label,
  icon,
  backgroundColor,
  noPadding = false,
  children,
  ...rest
}) => {
  return (
    <div
      {...rest}
      className={c(
        'flex flex-col overflow-hidden rounded-[5px] border border-[#dddddd] text-small text-[#898989]',
        rest.className
      )}
    >
      <div
        className="flex items-center justify-between border-b border-b-[#dddddd] px-[20px] py-[13px] text-[15px] font-semibold text-theme-dark-gray lg:text-base"
        style={{ boxShadow: 'inset 0 -5px 6px rgba(0, 0, 0, 0.025)' }}
      >
        <p>{label}</p>
        {icon && <img alt="icon" className="h-4" src={p(`images/${icon}`)} />}
      </div>
      <div
        className={c('flex-1', !noPadding && 'p-[2vh]')}
        style={{ backgroundColor }}
      >
        {children}
      </div>
    </div>
  );
};

export default LabeledBox;
