import { useMemo, useState } from 'react';
import { useExam, useFlaggedQuestions } from '../../hooks';
import { c, getInformationIcon, p } from '../../lib';
import { Category, Question } from '../../types';
import { ImageModal } from '../common';

type AnsweredQuestion = Question & {
  selectedAnswerId?: string;
};

interface SelectedQuestionContainerProps
  extends React.HTMLAttributes<HTMLDivElement> {
  selectedQuestion: AnsweredQuestion | undefined;
  setSelectedQuestion: (question: AnsweredQuestion | undefined) => void;
}

const SelectedQuestionContainer: React.FC<SelectedQuestionContainerProps> = ({
  selectedQuestion,
  setSelectedQuestion,
  ...rest
}) => {
  const { exam } = useExam();
  const { flaggedQuestionsIds, mutateFlaggedQuestions } = useFlaggedQuestions();

  const [showImageModal, setShowImageModal] = useState(false);

  const allCategories = useMemo(() => {
    if (!exam) return [];

    return exam.categories.reduce(
      (arr, category) => [...arr, ...flatCategory(category)],
      [] as Category[]
    );

    function flatCategory(category: Category): Category[] {
      return [
        category,
        ...category.sub_categories.reduce(
          (arr, category) => [...arr, ...flatCategory(category)],
          [] as Category[]
        ),
      ];
    }
  }, [exam]);

  return (
    <>
      <div
        {...rest}
        className={c(
          'flex flex-col scrollbar-thin scrollbar-track-transparent scrollbar-thumb-theme-light-gray/20 overflow-y-auto xl:flex-row',
          rest.className
        )}
      >
        <div className="scrollbar-thin scrollbar-track-transparent scrollbar-thumb-theme-light-gray/20 relative flex justify-center border-b border-[#e0e0e0] bg-white py-4 md:flex-1 md:border-0 md:px-8 md:py-4 xl:px-12 xl:py-8 xl:overflow-y-auto xl:min-h-full">
          {selectedQuestion &&
            (() => {
              const correctAnswer = selectedQuestion.answers.find(
                (answer) => answer.is_right
              )!;

              const parentCategory = allCategories.find(
                (category) => category.id === selectedQuestion.category_id
              )!;

              const rootCategory = allCategories.find(
                (category) => category.id === parentCategory.parent_category_id
              );

              const flagged = flaggedQuestionsIds?.includes(
                selectedQuestion.id
              );

              return (
                <div className="h-max flex w-full flex-col">
                  <div className="flex items-center justify-between border-b border-[#dfdfdf] px-4 pb-4 text-theme-medium-gray md:px-0 xl:pb-8">
                    <p className="hidden text-lg text-[#828282] md:block">
                      <span className="font-semibold">Question</span> in{' '}
                      {rootCategory ? rootCategory.name : parentCategory.name}
                      {rootCategory && `, ${parentCategory.name}`}
                    </p>
                    <button
                      className="md:hidden"
                      onClick={() => setSelectedQuestion(undefined)}
                    >
                      <img
                        alt="arrow icon"
                        src={p('images/icon_arrow.svg')}
                        className="h-4 w-4 opacity-50"
                      />
                    </button>
                    {exam?.flag_questions && (
                      <button
                        className="flex flex-row-reverse items-center gap-1 rounded-full px-3 py-1 text-sm transition hover:scale-105 active:scale-95 active:brightness-95 md:flex-row md:border md:border-theme-border md:shadow-sm"
                        onClick={() =>
                          mutateFlaggedQuestions({
                            questionId: selectedQuestion.id,
                            flag: !flagged,
                          })
                        }
                      >
                        <img
                          alt="flag icon"
                          src={p(
                            `images/icon_flag_question${
                              flagged ? '_red' : ''
                            }.svg`
                          )}
                          className="h-6 w-6"
                        />
                        <span
                          className={c(
                            'font-semibold',
                            flagged && 'text-[#db214e]'
                          )}
                        >
                          {flagged ? 'Flagged' : 'Not Flagged'}
                        </span>
                      </button>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col px-4 md:px-0">
                    <div
                      className={"question-text mt-6 text-2xl font-semibold text-theme-extra-dark-gray md:mt-4 xl:mt-8 xl:text-4xl [&>img]:max-h-[25vh]" + (exam?.add_styling_to_images? " image-exam-content": "")}
                      dangerouslySetInnerHTML={{
                        __html: selectedQuestion.body || '',
                      }}
                    ></div>
                    <div className="mt-10 text-xl font-semibold text-theme-green xl:text-2xl">
                      {exam?.template_type === 'horizontal-images' ? (
                        // eslint-disable-next-line jsx-a11y/alt-text
                        <img
                          className="h-32 w-32 object-contain"
                          src={correctAnswer.body}
                        />
                      ) : (
                        correctAnswer.body
                      )}
                    </div>
                    <div className="mt-16 flex flex-col text-sm">
                      <p className="mb-4 font-semibold text-theme-medium-gray">
                        You selected:
                      </p>
                      {exam?.template_type === 'horizontal-images' ? (
                        <ul className="grid grid-cols-2 grid-rows-2 gap-1 self-start lg:grid-cols-4 lg:grid-rows-1 lg:justify-items-center lg:self-stretch">
                          {selectedQuestion.answers.map((answer) => (
                            <li
                              className={c(
                                'h-32 w-32 rounded-md bg-[#f0f0f0] p-2'
                              )}
                              style={{
                                backgroundColor:
                                  selectedQuestion.selectedAnswerId ===
                                  answer.id
                                    ? answer.id === correctAnswer.id
                                      ? '#94e262'
                                      : '#fd8989'
                                    : undefined,
                                color:
                                  selectedQuestion.selectedAnswerId ===
                                  answer.id
                                    ? 'white'
                                    : undefined,
                              }}
                              key={answer.id}
                            >
                              {/* eslint-disable-next-line jsx-a11y/alt-text */}
                              <img
                                className="h-full w-full object-contain"
                                src={answer.body}
                              />
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <ul className="flex flex-col gap-1">
                          {selectedQuestion.answers.map((answer) => (
                            <li
                              className={c(
                                'flex items-center gap-2 rounded-md bg-[#f0f0f0] px-6 py-4 text-theme-dark-gray'
                              )}
                              style={{
                                backgroundColor:
                                  selectedQuestion.selectedAnswerId ===
                                  answer.id
                                    ? answer.id === correctAnswer.id
                                      ? '#94e262'
                                      : '#fd8989'
                                    : undefined,
                                color:
                                  selectedQuestion.selectedAnswerId ===
                                  answer.id
                                    ? 'white'
                                    : undefined,
                              }}
                              key={answer.id}
                            >
                              {selectedQuestion.selectedAnswerId ===
                                answer.id && (
                                <img
                                  alt="right/wrong icon"
                                  className="h-5 w-5"
                                  src={p(
                                    `images/icon_${
                                      answer.id === correctAnswer.id
                                        ? 'correct'
                                        : 'incorrect'
                                    }_white.svg`
                                  )}
                                />
                              )}
                              <span>{answer.body}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>
              );
            })()}
        </div>
        <div className="scrollbar-thin scrollbar-track-transparent scrollbar-thumb-theme-light-gray/20 shrink-0 bg-[#f4f4f4] shadow-[rgba(0,0,0,0.02)_0px_4px_10px_0px_inset] md:bg-white md:shadow-none xl:w-1/3 xl:border-l xl:border-l-[#dfdfdf] xl:bg-[#f7f7f7] xl:overflow-y-auto xl:min-h-full">
          {selectedQuestion &&
            (() => (
              <div className="flex h-max min-h-0 flex-col p-4 md:p-8">
                <p className="w-full border-b border-[#e5e3e5]  pb-4 text-lg font-medium leading-[34px] text-[#828282] xl:pb-8">
                  Explanation
                </p>
                <div className="mt-4 flex flex-1 flex-col items-start">
                  {selectedQuestion.featured_image && (
                    <button
                      className="mb-4 h-36 border border-[#e1e1e1] bg-white shadow-[0px_1px_3px_#e1e1e1] transition hover:scale-105 hover:brightness-90"
                      onClick={() => setShowImageModal(true)}
                    >
                      <img
                        alt="featured"
                        className="h-full"
                        src={selectedQuestion.featured_image}
                      />
                    </button>
                  )}
                  <div
                    className="leading-[1.7em] text-[#5a5a5a] md:text-[13px]"
                    dangerouslySetInnerHTML={{
                      __html: selectedQuestion.explanation || '',
                    }}
                  ></div>
                  {selectedQuestion.informations.length > 0 && (
                    <div className="mt-auto flex flex-col pt-12 text-theme-medium-gray">
                      <p className="mb-5 text-sm font-semibold text-[#898989]">
                        Additional Information:
                      </p>
                      <div className="flex flex-1 flex-col justify-between gap-4 text-[13px]">
                        {selectedQuestion.informations.map((information) => (
                          <a
                            className="flex items-center gap-2 text-[#919191] hover:underline"
                            href={information.hyperlink}
                            key={information.id}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <img
                              alt="information icon"
                              src={p(getInformationIcon(information.type))}
                              className="h-4 w-4"
                            />
                            <span>{information.name}</span>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))()}
        </div>
      </div>

      {selectedQuestion && selectedQuestion.featured_image && (
        <ImageModal
          image={selectedQuestion.featured_image}
          visible={showImageModal}
          hideModal={() => setShowImageModal(false)}
          onClick={(e) => e.stopPropagation()}
        />
      )}
    </>
  );
};

export default SelectedQuestionContainer;
