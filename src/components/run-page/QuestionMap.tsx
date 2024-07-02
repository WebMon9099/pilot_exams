import { useState } from 'react';
import { useSelector } from '../../hooks';
import { c, p } from '../../lib';
import { Question } from '../../types';
import { Button } from '../core';

interface QuestionMapProps extends React.HTMLAttributes<HTMLDivElement> {
  allowNavigation: boolean;
  closeQuestionMap: () => void;
  jumpToQuestion: (question: number) => void;
  currentQuestion: number;
  questions: (Question & { selectedAnswerId?: string })[];
}

const QuestionMap: React.FC<QuestionMapProps> = ({
  allowNavigation,
  closeQuestionMap,
  jumpToQuestion,
  currentQuestion,
  questions,
  ...rest
}) => {
  const { trainingMode } = useSelector((state) => state.exam);

  const [selectedQuestion, setSelectedQuestion] = useState<
    number | undefined
  >();

  return (
    <div
      {...rest}
      className={c(
        'relative flex flex-col bg-white px-6 py-4 transition',
        rest.className
      )}
    >
      <button onClick={closeQuestionMap}>
        <img alt="exit icon" src={p('images/icon_close.svg')} className="w-6" />
      </button>
      <div className="my-[3vh] flex flex-1 flex-col rounded-[0.2rem] border border-[#e0e0e0] text-theme-dark-gray">
        <p className="border-b border-[#e1e1e1] px-4 py-3 text-sm font-semibold text-[#6b6b6b]">
          Question Map
        </p>
        <div className="grid max-h-[40vh] grid-cols-5 gap-[1vw] overflow-y-auto overflow-x-hidden border-b border-[#e1e1e1] bg-[#f7f7f7] p-6 scrollbar-thin scrollbar-thumb-theme-light-gray scrollbar-thumb-rounded-full md:grid-cols-6">
          {questions.map((_, i) => (
            <QuestionCircle
              className={c(
                (i + 1 === currentQuestion ||
                  questions[i].selectedAnswerId !== undefined) &&
                  (trainingMode && questions[i].selectedAnswerId !== undefined
                    ? questions[i].selectedAnswerId ===
                      questions[i].answers.find((answer) => answer.is_right)!.id
                      ? '!bg-theme-green text-white'
                      : '!bg-theme-red text-white'
                    : trainingMode
                    ? '!bg-theme-extra-dark-gray text-white'
                    : '!bg-[#1b8ac0] text-white'),
                trainingMode &&
                  selectedQuestion === i + 1 &&
                  '!bg-[#1b8ac0] text-white',
                i + 1 !== currentQuestion &&
                  selectedQuestion !== i + 1 &&
                  questions[i].selectedAnswerId !== undefined &&
                  'opacity-50'
              )}
              label={i + 1}
              onClick={() => {
                if (
                  trainingMode &&
                  allowNavigation &&
                  currentQuestion !== i + 1
                )
                  setSelectedQuestion(i + 1);
              }}
              key={i}
            />
          ))}
        </div>
        <div className="flex flex-1 flex-col px-4 py-3 text-theme-medium-gray">
          <b className="text-[13.5px] font-semibold text-[#939393]">Preview:</b>
          <div
            className="mt-4 [&>img]:max-h-64"
            dangerouslySetInnerHTML={{
              __html: selectedQuestion
                ? questions[selectedQuestion - 1].body
                : questions[currentQuestion - 1].body,
            }}
          ></div>
          {allowNavigation && (
            <Button
              className="mb-3 mr-3 mt-auto self-end"
              onClick={() => {
                if (selectedQuestion) jumpToQuestion(selectedQuestion);

                setSelectedQuestion(undefined);
              }}
              disabled={!trainingMode}
            >
              Jump to Question
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestionMap;

const QuestionCircle: React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement> & { label: number }
> = ({ label, ...rest }) => {
  return (
    <button
      {...rest}
      className={c(
        'flex h-12 w-12 items-center justify-center rounded-full bg-[#eaeaea] transition hover:scale-105 hover:shadow-md hover:brightness-105 active:scale-95 active:brightness-95',
        rest.className
      )}
    >
      {label}
    </button>
  );
};
