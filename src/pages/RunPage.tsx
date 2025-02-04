import _ from "lodash";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ExitModal,
  ExplanationTab,
  Navbar,
  PauseIndicator,
  PieTimer,
  PreSumbitModal,
  QuestionMap,
  TabsContent,
  TrainingModeModal,
  ProgressCircle,
} from "../components";
import {
  ClockEvent,
  useClock,
  useDispatch,
  useExam,
  useFlaggedQuestions,
  useRefState,
  useSelector,
} from "../hooks";
import { c, p } from "../lib";
import {
  CategoryResults,
  resetExam as _resetExam,
  calculateScore,
  editCategoriesResults,
  increaseTime,
  resetCategoriesResults,
  setTrainingMode,
} from "../redux";
import { Category, Question, TemplateType } from "../types";

interface CategoryWeakMap {
  parentCategoryId?: string;
  points: number;
}

const RunPage: React.FC<{ helpHyperlink: string }> = ({ helpHyperlink }) => {
  const navigate = useNavigate();

  const { exam } = useExam();
  const { flaggedQuestionsIds, mutateFlaggedQuestions } = useFlaggedQuestions();

  const dispatch = useDispatch();
  const examState = useSelector((state) => state.exam);

  const clock = useClock();
  const timer = useRef<ClockEvent | undefined>();

  const [exitModalOpen, setExitModalOpen] = useState(false);
  const [trainingModeModalOpen, setTrainingModeModalOpen] = useState(false);
  const [preSubmitModalOpen, setPreSubmitModalOpen] = useState(false);
  const [questionMapOpen, setQuestionMapOpen] = useState(false);
  const [explanationTabOpen, setExplanationTabOpen] = useState(false);

  const [questions, setQuestions, questionsRef] = useRefState<
    (Question & { selectedAnswerId?: string })[]
  >([]);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [audioProgress, setAudioProgress] = useState(0);

  const [, setCategory, categoryRef] = useRefState<Category | undefined>(
    undefined
  );

  const [currentQuestion, setCurrentQuestion, currentQuestionRef] = useRefState<
    (Question & { index: number }) | undefined
  >(undefined);

  const showControls = exam
    ? exam.allow_user_navigation ||
      exam.flag_questions ||
      exam.question_map ||
      examState.trainingMode
    : false;

  const questionsQuantity = exam
    ? examState.mode === "customization"
      ? examState.customization!.question_quantity
      : exam.question_quantity
    : 0;

  const onCoPilot =
    examState.mode === "copilot" ||
    (examState.mode === "customization" &&
      examState.customization?.copilot_activated);

  const allCategories = useMemo(() => {
    if (!exam) return [];

    return exam.categories
      .filter((category) => {
        if (
          examState.mode === "customization" &&
          examState.customization?.disabled_categories.includes(category.id)
        )
          return false;

        return true;
      })
      .reduce(
        (arr, category) => [...arr, ...flatCategory(category)],
        [] as Category[]
      );

    function flatCategory(category: Category): Category[] {
      return [
        category,
        ...category.sub_categories
          .filter((category) => {
            if (
              examState.mode === "customization" &&
              examState.customization?.disabled_categories.includes(category.id)
            )
              return false;

            return true;
          })
          .reduce(
            (arr, category) => [...arr, ...flatCategory(category)],
            [] as Category[]
          ),
      ];
    }
  }, [exam, examState.mode, examState.customization]);

  const allQuestions = useMemo(() => {
    return allCategories.reduce(
      (arr, category) => [
        ...arr,
        ...category.questions.map(shuffleQuestionAnswers),
      ],
      [] as Question[]
    );

    function shuffleQuestionAnswers(question: Question): Question {
      return {
        ...question,
        answers: exam?.random_answer_order
          ? _.shuffle(question.answers)
          : question.answers,
      };
    }
  }, [exam?.random_answer_order, allCategories]);

  const customContent = useMemo(() => {
    if (!exam) return undefined;

    if (exam.custom_content) {
      switch (exam.custom_content.type) {
        case "image":
          return (
            <img
              alt=""
              // className="max-h-96"
              src={exam.custom_content.content}
            />
          );
        case "text":
          return <p className="text-sm">{exam.custom_content.content}</p>;
        case "tabs":
          return (
            <TabsContent className="" tabs={exam.custom_content.content} />
          );
      }
    }
  }, [exam]);

  const changeQuestion = useCallback(
    (question: Question & { index: number }) => {
      const newQuestions = [...questionsRef.current];
      newQuestions[question.index] = {
        ...newQuestions[question.index],
        ...question,
      };

      const newCategory = allCategories.find(
        (category) => category.id === question.category_id
      );
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        setTimeout(() => {
          setIsPlaying(true);
        }, 200);
      }

      setQuestions(newQuestions);
      setCategory(newCategory);
      setCurrentQuestion(question);

      dispatch(calculateScore());
    },
    [
      dispatch,
      questionsRef,
      setCurrentQuestion,
      setQuestions,
      setCategory,
      allCategories,
    ]
  );

  const submitAnswer = useCallback(
    (selectedAnswerId?: string) => {
      const newQuestions = [...questionsRef.current];

      var newSelectedAnswerId: string | undefined =
        newQuestions[currentQuestionRef.current!.index].selectedAnswerId;

      if (selectedAnswerId !== undefined)
        newSelectedAnswerId = selectedAnswerId;

      newQuestions[currentQuestionRef.current!.index].selectedAnswerId =
        newSelectedAnswerId;

      dispatch(
        editCategoriesResults({
          category: categoryRef.current!,
          question: currentQuestionRef.current!,
          selectedAnswerId: newSelectedAnswerId,
        })
      );

      setQuestions(newQuestions);
    },
    [categoryRef, currentQuestionRef, dispatch, questionsRef, setQuestions]
  );

  const submitExam = useCallback(() => {
    if (!exam) return;

    dispatch(calculateScore());

    if (exam.show_results) navigate(`/${exam.id}/complete/overview`);
    else navigate(`/${exam.id}`);
  }, [dispatch, navigate, exam]);

  useEffect(function setupBackgroundClickHandler() {
    document.addEventListener("click", onBackgroundClick);

    return () => document.removeEventListener("click", onBackgroundClick);

    function onBackgroundClick() {
      setQuestionMapOpen(false);
      setExplanationTabOpen(false);
    }
  }, []);

  useEffect(
    function trackTime() {
      timer.current = clock.addInterval(() => {
        dispatch(increaseTime());
      }, 1000);

      return () => timer.current!.cancel();
    },
    [dispatch, clock]
  );

  useEffect(
    function handlePauseResume() {
      if (!timer.current) return;

      if (examState.paused) timer.current.pause();
      else timer.current.resume();
    },
    [examState.paused]
  );

  useEffect(() => {
    if (
      examState.mode === "copilot" ||
      (examState.mode === "customization" && exam?.allow_copilot) ||
      Object.keys(examState.categoriesResults).length > 0
    )
      return;

    const questionsWithCategories = questions.map((question) => {
      const category = allCategories.find(
        (category) => category.id === question.category_id
      )!;

      return {
        question,
        category,
      };
    });

    dispatch(resetCategoriesResults(questionsWithCategories));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, allCategories, questions, examState.mode, exam?.allow_copilot]);

  useEffect(() => {
    if (!exam || !currentQuestionRef.current) return;

    if (
      !exam.allow_user_navigation &&
      examState.time > 0 &&
      examState.time % exam.question_duration === 0
    ) {
      submitAnswer(undefined);

      if (currentQuestionRef.current.index + 1 < questionsQuantity) {
        changeQuestion({
          ...questionsRef.current[currentQuestionRef.current.index + 1],
          index: currentQuestionRef.current.index + 1,
        });
      } else submitExam();
    }
  }, [
    navigate,
    submitExam,
    changeQuestion,
    submitAnswer,
    currentQuestionRef,
    exam,
    examState.time,
    questionsRef,
    questionsQuantity,
  ]);

  useEffect(
    function finishAfterTime() {
      if (!exam) return;

      var exam_duration = exam.duration;
      if (examState.mode === "customization" && examState.customization) {
        exam_duration = examState.customization.duration * 60;
      }
      const timeRemaining = exam_duration - examState.time;

      if (timeRemaining <= 0) submitExam();
    },
    [
      navigate,
      submitExam,
      exam,
      examState.time,
      examState.mode,
      examState.customization,
    ]
  );

  //  Generate questions:
  useEffect(
    function pickQuestions() {
      if (!exam) return;
      const selectedQuestions = _.sampleSize(
        allQuestions,
        examState.mode === "customization" && examState.customization
          ? examState.customization.question_quantity
          : exam.question_quantity
      );

      if (
        examState.mode === "copilot" ||
        (examState.mode === "customization" &&
          examState.customization?.copilot_activated)
      )
        setQuestions([selectedQuestions[0]]);
      else setQuestions(selectedQuestions);

      setCurrentQuestion({ ...selectedQuestions[0], index: 0 });
      setCategory(
        allCategories.find(
          (category) => category.id === selectedQuestions[0].category_id
        )
      );
    },
    [
      setCurrentQuestion,
      setQuestions,
      setCategory,
      exam,
      examState.mode,
      examState.customization,
      allCategories,
      allQuestions,
    ]
  );

  useEffect(
    function generateCategoriesWeakMap() {
      if (!exam || !currentQuestionRef.current) return;

      const categoriesWeakMap: { [id: string]: CategoryWeakMap } = {};

      Object.entries(examState.categoriesResults).forEach((categoryResult) =>
        setCategoryWeakPoints(categoryResult)
      );

      if (
        examState.mode === "copilot" ||
        (examState.mode === "customization" &&
          examState.customization?.copilot_activated)
      ) {
        const sortedCategoriesByWeakness = Object.entries(categoriesWeakMap)
          .filter(([, c]) => c.points > 0)
          .sort(([, c1], [, c2]) => c2.points - c1.points)
          .map(([id]) => id);

        var pickedQuestion: Question | undefined;
        var weakestCategoryIndex = 0;

        // do {

        const weakestCategoryId =
          sortedCategoriesByWeakness[weakestCategoryIndex];

        pickedQuestion = _.sample(
          allQuestions.filter(
            (question) =>
              question.category_id === weakestCategoryId &&
              !questionsRef.current
                .map((question) => question.id)
                .includes(question.id)
          )
        );

        if (!pickedQuestion) {
          const parentCategory = allCategories.find((category) =>
            category.sub_categories
              .map((category) => category.id)
              .includes(weakestCategoryId)
          );

          if (parentCategory) {
            const siblingCategories = parentCategory.sub_categories;

            const relatedCategoriesIds = [
              parentCategory.id,
              ...siblingCategories.map((category) => category.id),
            ];

            pickedQuestion = _.sample(
              allQuestions.filter(
                (question) =>
                  relatedCategoriesIds.includes(question.category_id) &&
                  !questionsRef.current
                    .map((question) => question.id)
                    .includes(question.id)
              )
            );
          }
        }

        weakestCategoryIndex += 1;

        if (
          !pickedQuestion &&
          weakestCategoryIndex > sortedCategoriesByWeakness.length - 1
        )
          pickedQuestion = _.sample(
            allQuestions.filter(
              (question) =>
                !questionsRef.current
                  .map((question) => question.id)
                  .includes(question.id)
            )
          )!;
        // } while (!pickedQuestion);

        const newQuestion = {
          ...pickedQuestion,
          index: currentQuestionRef.current!.index + 1,
        };

        setQuestions((questions) => {
          if (!questions[newQuestion.index]) {
            const newQuestions = [...questions];

            newQuestions[newQuestion.index] = {
              ...newQuestions[newQuestion.index],
              ...newQuestion,
            };

            return newQuestions;
          }

          return questions;
        });
      }

      function setCategoryWeakPoints(
        categoryResult: [string, CategoryResults],
        parentCategoryId?: string
      ) {
        const [id, category] = categoryResult;

        if (categoriesWeakMap[id] === undefined)
          categoriesWeakMap[id] = {
            parentCategoryId,
            points: 0,
          };

        categoriesWeakMap[id].points = getCategoryWeakPoints(category);

        Object.entries(category.subCategories).forEach((subCategoryResult) =>
          setCategoryWeakPoints(subCategoryResult, id)
        );
      }

      function getCategoryWeakPoints(category: CategoryResults): number {
        return Object.values(category.questions).reduce((sum, question) => {
          const rightAnswerId = question.answers.find(
            (answer) => answer.is_right
          )!.id;

          return sum + (question.selectedAnswerId === rightAnswerId ? -1 : 1);
        }, 0);
      }
    },
    [
      setQuestions,
      changeQuestion,
      currentQuestionRef,
      questionsRef,
      allCategories,
      allQuestions,
      exam,
      examState.mode,
      examState.customization,
      examState.categoriesResults,
    ]
  );

  const togglePlayPause = () => {
    if (!examState.trainingMode) return;
    if (examState.paused) return;
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      if (examState.paused) {
        audio.pause();
        setIsPlaying(false);
      } else {
        if (isPlaying) {
          audio.play();
        }
      }

      audio.addEventListener("timeupdate", updateProgress);
      return () => {
        audio.removeEventListener("timeupdate", updateProgress);
      };
    }
  }, [isPlaying, currentQuestion, examState.paused]);

  const updateProgress = () => {
    if (audioRef.current) {
      const currentTime = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      const progress = (currentTime / duration) * 100;
      setAudioProgress(progress);
      if (progress === 100) {
        setIsPlaying(false);
        setTimeout(() => {
          setAudioProgress(0);
        }, 200);
      }
    }
  };

  if (!exam) return null;
  var audio_file_path = null;
  if (currentQuestion && currentQuestion.body) {
    if (currentQuestion.body.includes("audio-type-question-url=")) {
      audio_file_path = currentQuestion.body.replace(
        "audio-type-question-url=",
        ""
      );
    }
  }

  return (
    <main className="relative flex flex-1 flex-col bg-white">
      <Navbar
        className="h-14"
        showExitModal={() => setExitModalOpen(true)}
        showTrainingModeModal={() => setTrainingModeModalOpen(true)}
        helpHyperlink={helpHyperlink}
        performanceUrl=""
      />
      <div className="fixed top-14 z-10 h-1 w-full">
        <div
          className="h-full bg-theme-extra-dark-gray transition-all"
          style={{
            width: `calc(${
              ((currentQuestion?.index || 0) + 1) / questionsQuantity
            } * 100%)`,
          }}
        ></div>
      </div>
      {!exam.allow_user_navigation && (
        <>
          <PieTimer
            time={exam.question_duration * 1000}
            className="fixed right-8 top-20 z-10 hidden md:block"
            key={currentQuestion?.index}
          />
          <PieTimer
            time={exam.question_duration * 1000}
            width={32}
            height={32}
            className="fixed right-8 top-20 z-10 md:hidden"
            key={currentQuestion?.index}
          />
        </>
      )}
      <div className="relative flex flex-1 flex-col items-center justify-evenly gap-6 px-4 py-6">
        {examState.trainingMode && examState.paused && (
          <PauseIndicator className="absolute right-12 top-12" />
        )}
        <div className="mt-6 flex w-[90%] flex-col items-center justify-center whitespace-pre-wrap md:mt-0 md:w-4/5">
          {customContent}
        </div>
        {audio_file_path !== null && audio_file_path !== "" ? (
          <div
            className={
              "examination-content text-center text-lg text-theme-dark-gray md:text-small-title [&>img]:mb-16 [&>img]:max-h-[50vh]"
            }
          >
            <audio ref={audioRef} src={audio_file_path} />
            <ProgressCircle
              isPlaying={isPlaying}
              clickable={examState.trainingMode && !examState.paused}
              percentage={audioProgress}
              toggleClick={() => togglePlayPause()}
            />
          </div>
        ) : (
          <div
            className={
              "examination-content text-center text-lg text-theme-dark-gray md:text-small-title [&>img]:mb-16 [&>img]:max-h-[50vh]" +
              (exam?.add_styling_to_images ||
              (exam.template_type === "side-by-side-medium" &&
                currentQuestion?.add_styling_to_images)
                ? " image-exam-content"
                : "")
            }
            dangerouslySetInnerHTML={{ __html: currentQuestion?.body || "" }}
          ></div>
        )}
        <div
          className={c(
            "flex gap-[2vh] px-4",
            exam.reduce_answer_option_size ||
              (exam.template_type === "side-by-side-medium" &&
                currentQuestion?.reduce_answer_option_size)
              ? "font-small-answer"
              : "",
            exam.template_type === "vertical-text" ||
              (exam.template_type === "side-by-side-medium" &&
                currentQuestion?.template_type === "vertical-text")
              ? "multi-choice-vertical w-full max-w-xl flex-col"
              : "horizontal-answer flex-row justify-between",
            (exam.template_type === "horizontal-text" ||
              (exam.template_type === "side-by-side-medium" &&
                currentQuestion?.template_type === "horizontal-text")) &&
              "w-full max-w-6xl",
            (exam.template_type === "horizontal-images" ||
              exam.template_type === "horizontal-letters" ||
              (exam.template_type === "side-by-side-medium" &&
                (currentQuestion?.template_type === "horizontal-images" ||
                  currentQuestion?.template_type === "horizontal-letters"))) &&
              "grid grid-cols-2 grid-rows-2 md:grid-cols-4 md:grid-rows-1"
          )}
        >
          {currentQuestion?.answers.map((answer, i) => (
            <AnswerButton
              className={c(
                examState.trainingMode &&
                  questions[currentQuestion.index].selectedAnswerId !==
                    undefined &&
                  (i ===
                  currentQuestion.answers.findIndex((answer) => answer.is_right)
                    ? "!bg-theme-green !text-white"
                    : questions[currentQuestion.index].selectedAnswerId ===
                        answer.id && "!bg-theme-red !text-white")
              )}
              index={i}
              templateType={
                exam.template_type === "side-by-side-medium" && currentQuestion
                  ? currentQuestion?.template_type
                  : exam.template_type
              }
              selected={
                answer.id === questions[currentQuestion.index].selectedAnswerId
              }
              disabled={examState.paused}
              onClick={() => {
                if (
                  questions[currentQuestion.index].selectedAnswerId ===
                    undefined ||
                  examState.trainingMode
                )
                  submitAnswer(answer.id);
              }}
              key={i}
            >
              {answer.body}
            </AnswerButton>
          ))}
        </div>
        {showControls && currentQuestion && (
          <div className="mt-20 flex items-center rounded-[2rem] bg-[#f2f2f2] p-3 lg:mt-0">
            {exam.allow_user_navigation && (
              <QuestionNavigationButton
                className="mr-3"
                dir="left"
                onClick={() => {
                  if (currentQuestion.index > 0)
                    changeQuestion({
                      ...questions[currentQuestion.index - 1],
                      index: currentQuestion.index - 1,
                    });
                }}
                disabled={examState.paused || currentQuestion.index === 0}
              />
            )}
            <button
              className={c(
                "overflow-hidden transition-all hover:scale-105 active:scale-95 active:brightness-95",
                examState.trainingMode ? "mx-3 max-w-[2rem]" : "mx-0 max-w-0"
              )}
              onClick={(e) => {
                e.stopPropagation();

                setExplanationTabOpen(true);
              }}
            >
              <img
                alt="explanation icon"
                src={p("images/icon_explanation.svg")}
                className="w-8"
              />
            </button>
            {exam.question_map && (
              <button
                className="mx-3 transition hover:scale-105 active:scale-95 active:brightness-95"
                onClick={(e) => {
                  e.stopPropagation();

                  setQuestionMapOpen(true);
                }}
              >
                <img
                  alt="question map icon"
                  src={p("images/icon_question_map.svg")}
                  className="w-8"
                />
              </button>
            )}
            {exam.flag_questions && (
              <button
                className="mx-3 transition hover:scale-105 active:scale-95 active:brightness-95"
                onClick={() => {
                  mutateFlaggedQuestions({
                    questionId: currentQuestion.id,
                    flag: !flaggedQuestionsIds?.includes(currentQuestion.id),
                  });
                }}
              >
                <img
                  alt="flag question icon"
                  src={p(
                    `images/icon_flag_question${
                      flaggedQuestionsIds?.includes(currentQuestion.id)
                        ? "_red"
                        : ""
                    }.svg`
                  )}
                  className="w-8"
                />
              </button>
            )}
            {exam.allow_user_navigation && (
              <QuestionNavigationButton
                className="ml-3"
                dir="right"
                disabled={
                  examState.paused ||
                  (onCoPilot
                    ? currentQuestion.index >= questions.length - 1
                    : currentQuestion.index > questions.length - 1)
                }
                onClick={() => {
                  if (currentQuestion.index < questionsQuantity - 1)
                    changeQuestion({
                      ...questions[currentQuestion.index + 1],
                      index: currentQuestion.index + 1,
                    });
                  else setPreSubmitModalOpen(true);
                }}
                done={currentQuestion.index === questionsQuantity - 1}
              />
            )}
          </div>
        )}
      </div>
      {currentQuestion && (
        <div
          className={c(
            "fixed left-0 right-0 top-14 z-10 h-[calc(100%-3rem)] bg-black/40 transition-all",
            questionMapOpen ? "visible opacity-100" : "invisible opacity-0"
          )}
        >
          <QuestionMap
            className={c(
              "absolute left-full h-full w-full lg:max-w-lg",
              questionMapOpen && "-translate-x-full"
            )}
            onClick={(e) => e.stopPropagation()}
            allowNavigation={exam.allow_user_navigation}
            closeQuestionMap={() => {
              setQuestionMapOpen(false);
            }}
            jumpToQuestion={(questionNumber) => {
              changeQuestion({
                ...questions[questionNumber - 1],
                index: questionNumber - 1,
              });

              setQuestionMapOpen(false);
            }}
            currentQuestion={currentQuestion.index + 1}
            questions={questions}
          />
        </div>
      )}
      {examState.trainingMode && currentQuestion && (
        <div
          className={c(
            "fixed left-0 right-0 top-14 z-10 h-[calc(100%-3rem)] bg-black/40 transition-all",
            explanationTabOpen ? "visible opacity-100" : "invisible opacity-0"
          )}
        >
          <ExplanationTab
            className={c(
              "absolute right-full h-full w-full overflow-y-auto transition scrollbar-thin scrollbar-track-transparent scrollbar-thumb-[#eeeeee] lg:max-w-2xl",
              explanationTabOpen && "translate-x-full"
            )}
            templateType={
              exam.template_type === "side-by-side-medium" && currentQuestion
                ? currentQuestion?.template_type
                : exam.template_type
            }
            add_styling_to_images={
              exam.template_type === "side-by-side-medium" && currentQuestion
                ? currentQuestion?.add_styling_to_images
                : exam.add_styling_to_images
            }
            onClick={(e) => e.stopPropagation()}
            question={currentQuestion}
            closeExplanationTab={() => setExplanationTabOpen(false)}
            isOpen={explanationTabOpen}
          />
        </div>
      )}
      <ExitModal
        visible={exitModalOpen}
        hideModal={() => setExitModalOpen(false)}
        exitToMenu={() => navigate(`/${exam.id}`)}
      />
      <TrainingModeModal
        visible={trainingModeModalOpen}
        hideModal={() => setTrainingModeModalOpen(false)}
        onSubmit={() => {
          resetExam();

          setTrainingModeModalOpen(false);
        }}
      />
      <PreSumbitModal
        visible={preSubmitModalOpen}
        hideModal={() => setPreSubmitModalOpen(false)}
        onSubmit={submitExam}
      />
    </main>
  );

  function resetExam() {
    dispatch(_resetExam());
    dispatch(setTrainingMode(!examState.trainingMode));

    setQuestions(
      questions.map((question) => ({
        ...question,
        selectedAnswerId: undefined,
      }))
    );
    changeQuestion({ ...questions[0], index: 0 });
  }
};

export default RunPage;

const AnswerButton: React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    index: number;
    selected: boolean;
    templateType: TemplateType;
  }
> = ({ children, index, selected, templateType, ...rest }) => {
  const content = useMemo(() => {
    switch (templateType) {
      case "horizontal-images":
        return (
          // eslint-disable-next-line jsx-a11y/alt-text
          <img
            className="h-full w-full object-contain"
            src={children as string}
          />
        );
      case "horizontal-letters":
        return String.fromCharCode(65 + index);
      default:
        return children;
    }
  }, [children, index, templateType]);

  return (
    <button
      {...rest}
      className={c(
        "shrink-0 rounded-md transition",
        selected
          ? "bg-theme-blue text-white"
          : "border border-theme-light-gray bg-white",
        templateType === "horizontal-images" &&
          "h-[140px] w-[140px] p-4 lg:h-[185px] lg:w-[185px]",
        templateType === "horizontal-letters" &&
          "h-20 w-20 p-2 text-4xl font-medium text-theme-extra-dark-gray",
        templateType === "vertical-text" &&
          "px-[1vw] py-[2vh] text-lg font-medium text-theme-medium-gray md:text-2xl",
        templateType === "horizontal-text" &&
          "flex-1 px-[1vw] py-[2vh] text-lg font-medium text-theme-medium-gray md:text-2xl",
        rest.disabled
          ? "brightness-90"
          : "hover:scale-105 hover:shadow-md active:scale-95 active:brightness-95",
        rest.className
      )}
    >
      {content}
    </button>
  );
};

const QuestionNavigationButton: React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    dir: "left" | "right";
    done?: boolean;
  }
> = ({ children, dir, done = false, ...rest }) => (
  <button
    {...rest}
    className={c(
      "group relative rounded-3xl bg-white px-6 py-2 transition",
      rest.disabled
        ? "opacity-50"
        : "shadow-md hover:scale-105 active:scale-95 active:brightness-95",
      rest.className
    )}
  >
    <img
      alt="left arrow icon"
      src={p(`images/icon_arrow.svg`)}
      className={c(
        "w-7 transition ease-in",
        dir === "right" && "rotate-180",
        !rest.disabled &&
          (dir === "right"
            ? "group-active:translate-x-2"
            : "group-active:-translate-x-2"),
        done ? "scale-0 opacity-0" : "scale-100 opacity-100"
      )}
    />
    <img
      alt="end test icon"
      src={p(`images/icon_end_test.svg`)}
      className={c(
        "absolute top-1/2 w-7 -translate-y-1/2 transition ease-out",
        done ? "scale-100 opacity-100" : "scale-0 opacity-0"
      )}
    />
  </button>
);
