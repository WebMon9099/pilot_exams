import { useMemo } from 'react';
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';
import { useExam, useSelector } from '../../hooks';
import { c, p } from '../../lib';
import type { Median } from '../../types';
import ScorePie from '../core/ScorePie';

interface ScorePieContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  score: number;
}

const ScorePieContainer: React.FC<ScorePieContainerProps> = ({
  score,
  ...rest
}) => {
  const { exam } = useExam();

  const examState = useSelector((state) => state.exam);

  const median: Median = (() => {
    if (!exam) return 'average';

    if (!exam.weak_pass || !exam.strong_pass) return 'average';
    else if (score < exam.weak_pass) return 'below';
    else if (score >= exam.strong_pass) return 'above';
    return 'average';
  })();

  const questionsAmount = useMemo(() => {
    if (!exam) return 0;

    if (examState.mode === 'customization' && examState.customization)
      return examState.customization.question_quantity;
    else return exam?.question_quantity;
  }, [exam, examState.mode, examState.customization]);

  if (!exam) return null;

  return (
    <div
      {...rest}
      className={c('flex flex-col items-center gap-8', rest.className)}
    >
      {/* <p className="text-2xl text-theme-extra-dark-gray">
        <b>You scored:</b>
      </p> */}
      <ScorePie
        median={median}
        score={score}
        className="h-[220px] w-[220px] md:h-[200px] md:w-[200px] lg:h-[220px] lg:w-[220px]"
        fontSize={86}
      />
      {exam.weak_pass !== undefined && exam.strong_pass !== undefined && (
        <div className="relative text-xl font-light text-theme-medium-gray">
          <span className="font-semibold" style={{ color: getScoreColor() }}>
            {getScoreLabel()}
          </span>{' '}
          {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
          <a
            id="score-tooltip"
            className="absolute -right-6 -top-2 cursor-pointer hover:brightness-90"
          >
            <img
              alt="info icon"
              className="h-5 w-5"
              src={p('images/icon_info.svg')}
            />
          </a>
          <Tooltip
            id="my-tooltip"
            anchorId="score-tooltip"
            data-tooltip-id="score-tooltip"
          >
            <div className="px-3 py-2 text-sm font-normal">
              <p className="mb-2 leading-5">
                Your score is considered a{' '}
                <b className="font-bold" style={{ color: getScoreColor() }}>
                  {getScoreLabel()}
                </b>
                .
              </p>
              <p className="mb-2 leading-5">
                A <b className="font-bold text-[#7ce027]">Strong Pass</b> is
                achieved when{' '}
                {Math.round((exam.strong_pass / 100) * questionsAmount)} of the
                questions are answered correctly,
                <br />
                and indicates that the User exhibits strong understanding of
                <br />
                questions posed in the exam.
              </p>
              <p className="mb-2 leading-5">
                A <b className="font-bold text-[#f4da21]">Weak Pass</b> is
                achieved when{' '}
                {Math.round((exam.weak_pass / 100) * questionsAmount)} of the
                questions are answered
                <br />
                correctly. A user that achieves this score exhibits a weak
                <br />
                understanding of the questions posed.
              </p>
              <p className="leading-5">
                A user achieves a{' '}
                <b className="font-bold text-[#fc5656]">Fail</b> when less then{' '}
                {Math.round((exam.weak_pass / 100) * questionsAmount)} of the
                questions are anwered
                <br /> correctly. This score indicates lack of understanding of
                questions
                <br />
                posed.
              </p>
            </div>
          </Tooltip>
        </div>
      )}
    </div>
  );

  function getScoreLabel() {
    if (!exam) return;

    if (!exam.weak_pass || !exam.strong_pass) return;

    if (score >= 0 && score < exam.weak_pass) return 'Fail';
    else if (score >= exam.weak_pass && score < exam.strong_pass)
      return 'Weak Pass';
    else if (score >= exam.strong_pass && score <= 100) return 'Strong Pass';
  }

  function getScoreColor() {
    if (!exam) return;

    if (!exam.weak_pass || !exam.strong_pass) return '#f4da21';

    if (score >= 0 && score < exam.weak_pass) return '#fc5656';
    else if (score >= exam.weak_pass && score < exam.strong_pass)
      return '#f4da21';
    else if (score >= exam.strong_pass && score <= 100) return '#7ce027';
  }
};

export default ScorePieContainer;
