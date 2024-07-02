import React, { useCallback, useState } from 'react';
import type { Question } from '../../types';
import CategoriesResultsList from './CategoriesResultsList';
import SelectedQuestionContainer from './SelectedQuestionContainer';

export type AnsweredQuestion = Question & {
  selectedAnswerId?: string;
};

const FeedbackTab: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  ...rest
}) => {
  const [selectedQuestion, _setSelectedQuestion] = useState<
    AnsweredQuestion | undefined
  >(undefined);

  const setSelectedQuestion = useCallback(
    (question: AnsweredQuestion | undefined) => {
      window.scrollTo({ top: 0 });

      _setSelectedQuestion(question);
    },
    []
  );

  return (
    <>
      {/* NOTE: Desktop */}

      <div {...rest} className="hidden min-h-0 w-full flex-1 basis-0 md:flex">
        <CategoriesResultsList
          className="w-1/3 md:border-r md:border-r-[#dfdfdf] lg:w-1/4"
          selectedQuestion={selectedQuestion}
          setSelectedQuestion={setSelectedQuestion}
        />
        <SelectedQuestionContainer
          className="flex-1"
          selectedQuestion={selectedQuestion}
          setSelectedQuestion={setSelectedQuestion}
        />
      </div>

      {/* NOTE: Mobile */}
      <div {...rest} className="md:hidden">
        {selectedQuestion ? (
          <SelectedQuestionContainer
            className="absolute bottom-0 left-0 right-0 top-0 z-10"
            selectedQuestion={selectedQuestion}
            setSelectedQuestion={setSelectedQuestion}
          />
        ) : (
          <CategoriesResultsList
            selectedQuestion={selectedQuestion}
            setSelectedQuestion={setSelectedQuestion}
          />
        )}
      </div>
    </>
  );
};

export default FeedbackTab;
