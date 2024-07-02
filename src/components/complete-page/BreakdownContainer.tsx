import { useMemo } from 'react';
import { useExam, useSelector } from '../../hooks';
import { c } from '../../lib';
import { CategoryResults } from '../../redux';
import { Question } from '../../types';

const BreakdownContainer: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  ...rest
}) => {
  const { exam } = useExam();

  const examState = useSelector((state) => state.exam);

  const { time, score, categoriesResults } = useSelector((state) => state.exam);

  const wrongCount = useMemo(() => {
    return Object.values(categoriesResults).reduce(
      (sum, category) => sum + getWrongCount(category),
      0
    );

    function getWrongCount(category: CategoryResults): number {
      return (
        Object.values(category.questions).reduce(
          (sum, question) => sum + (isQuestionWrong(question) ? 1 : 0),
          0
        ) +
        Object.values(category.subCategories).reduce(
          (sum, category) => sum + getWrongCount(category),
          0
        )
      );
    }

    function isQuestionWrong(
      question: Question & { selectedAnswerId?: string }
    ) {
      const rightAnswer = question.answers.find((answer) => answer.is_right)!;

      return (
        question.selectedAnswerId !== rightAnswer.id &&
        question.selectedAnswerId !== undefined
      );
    }
  }, [categoriesResults]);

  const omittedCount = useMemo(() => {
    return Object.values(categoriesResults).reduce(
      (sum, category) => sum + getOmittedCount(category),
      0
    );

    function getOmittedCount(category: CategoryResults): number {
      return (
        Object.values(category.questions).reduce(
          (sum, question) =>
            sum + (question.selectedAnswerId === undefined ? 1 : 0),
          0
        ) +
        Object.values(category.subCategories).reduce(
          (sum, category) => sum + getOmittedCount(category),
          0
        )
      );
    }
  }, [categoriesResults]);

  if (!exam) return null;

  return (
    <div {...rest} className={c('flex flex-col bg-white', rest.className)}>
      <div className="flex flex-1 flex-col justify-center gap-2 border-b border-[#dddddd] px-5">
        <p className="text-sm">Duration</p>
        <p>
          <span className="text-xl font-semibold text-[#6b6b6b]">
            {Math.floor(time / 60)}
          </span>{' '}
          <span className="text-xs text-theme-light-gray">mins</span>{' '}
          <span className="text-xl font-semibold text-[#6b6b6b]">
            {time % 60}
          </span>{' '}
          <span className="text-xs text-theme-light-gray">secs</span>
        </p>
      </div>
      <div className="flex flex-1 flex-col justify-center gap-2 border-b border-[#dddddd] px-5">
        <p className="text-sm">Correct Answers</p>
        <p className="text-xl font-semibold text-[#6b6b6b]">{score}</p>
      </div>
      <div className="flex flex-1 flex-col justify-center gap-2 border-b border-[#dddddd] px-5">
        <p className="text-sm">Incorrect Answers</p>
        <p className="text-xl font-semibold text-[#6b6b6b]">{wrongCount}</p>
      </div>
      <div className="flex flex-1 flex-col justify-center gap-2 px-5">
        <p className="text-sm">Omitted</p>
        <p className="text-xl font-semibold text-[#6b6b6b]">
          {(examState.mode === 'customization' && examState.customization
            ? examState.customization.question_quantity
            : exam.question_quantity) -
            score -
            wrongCount}
        </p>
      </div>
      {/* <div className="flex gap-12 md:gap-2 xl:gap-12">
        <div className="flex flex-col gap-6">
          <div className="flex gap-4">
            <img
              alt="duration icon"
              src={p('images/icon_duration.svg')}
              className="!h-6 !w-6"
            />
            <span className="md:hidden xl:inline-block">Duration:</span>
          </div>
          <div className="flex gap-4">
            <img
              alt="correct icon"
              src={p('images/icon_correct.svg')}
              className="!h-6 !w-6"
            />
            <span className="md:hidden xl:inline-block">Total Correct:</span>
          </div>
          <div className="flex gap-4">
            <img
              alt="incorrect icon"
              src={p('images/icon_incorrect.svg')}
              className="!h-6 !w-6"
            />
            <span className="md:hidden xl:inline-block">Total Incorrect:</span>
          </div>
          <div className="flex gap-4">
            <img
              alt="omitted icon"
              src={p('images/icon_omitted.svg')}
              className="!h-6 !w-6"
            />
            <span className="md:hidden xl:inline-block">Total Omitted:</span>
          </div>
        </div>
        <div className="flex flex-col gap-6 text-right md:text-left xl:text-right">
          <b>
            {Math.floor(time / 60)}
            <span className="xl:hidden">m</span>{' '}
            <span className="hidden xl:inline-block">min</span> {time % 60}
            <span className="xl:hidden">s</span>{' '}
            <span className="hidden xl:inline-block">secs</span>
          </b>
          <b>{score}</b>
          <b>{wrongCount}</b>
          <b>{omittedCount}</b>
        </div>
      </div> */}
    </div>
  );
};

export default BreakdownContainer;
