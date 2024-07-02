import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { useExam } from '../../hooks';
import { c } from '../../lib';

interface BarGraphProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  label: string;
}

const BarGraph: React.FC<BarGraphProps> = ({ value, label, ...rest }) => {
  const { exam } = useExam();

  const color = getColor();

  return (
    <div
      {...rest}
      className={c(
        'relative mt-8 flex h-9 items-center border-l',
        rest.className
      )}
    >
      <div className="absolute -top-9 left-0 right-0 flex items-center justify-between gap-8 whitespace-nowrap">
        <p className="text-sm text-theme-dark-gray">{label}</p>
        <p className="text-xl font-semibold" style={{ color }}>
          {value}
          <span className="ml-1 text-xs font-light text-theme-light-gray">
            %
          </span>
        </p>
      </div>
      <div className="h-1/2 flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            barCategoryGap="0%"
            data={[
              {
                uv: 100,
              },
            ]}
            margin={{ top: 0, left: 0, right: 0, bottom: 0 }}
            layout="vertical"
          >
            <YAxis type="category" hide />
            <XAxis type="number" hide />
            <Bar dataKey="uv" fill={color} isAnimationActive={false} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div
        className="absolute -right-3 top-0 h-8 w-8 rounded-full border-[3px] border-white shadow-md shadow-black/40"
        style={{ backgroundColor: color }}
      />
    </div>
  );

  function getColor() {
    if (!exam) return '';

    if (!exam.weak_pass || !exam.strong_pass) return '#3793d1';
    else {
      if (value >= 0 && value < exam.weak_pass) return '#fc5656';
      else if (value >= exam.weak_pass && value < exam.strong_pass)
        return '#f4da21';
      else if (value >= exam.strong_pass && value <= 100) return '#7ce027';
    }
  }
};

export default BarGraph;
