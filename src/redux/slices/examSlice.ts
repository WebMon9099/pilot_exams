import { createSlice } from '@reduxjs/toolkit';
import { Category, Customization, Question } from '../../types';

export type ExamMode = 'normal' | 'copilot' | 'customization';

export interface CategoryResults {
  questions: { [id: string]: Question & { selectedAnswerId?: string } };
  subCategories: { [id: string]: CategoryResults };
}

interface ExamState {
  time: number;
  paused: boolean;
  score: number;
  trainingMode: boolean;
  mode: ExamMode;
  categoriesResults: { [id: string]: CategoryResults };
  customization: Omit<Customization, 'time_added'> | undefined;
}

const examInitialState: ExamState = {
  time: 0,
  paused: false,
  score: 0,
  categoriesResults: {},
  trainingMode: false,
  mode: 'normal',
  customization: undefined,
};

const examSlice = createSlice({
  name: 'exam',
  initialState: examInitialState,
  reducers: {
    increaseTime(state) {
      state.time += 1;
    },
    pause(state) {
      state.paused = true;
    },
    resume(state) {
      state.paused = false;
    },
    togglePaused(state) {
      state.paused = !state.paused;
    },
    increaseScore(state) {
      state.score += 1;
    },
    setScore(state, action: { payload: number }) {
      state.score = action.payload;
    },
    calculateScore(state) {
      state.score = getScoreFromResults(state.categoriesResults);
    },
    setTrainingMode(state, action: { payload: boolean }) {
      state.trainingMode = action.payload;
    },
    setMode(state, action: { payload: ExamMode }) {
      state.mode = action.payload;
    },
    resetCategoriesResults(
      state,
      action: {
        payload: { question: Question; category: Category }[];
      }
    ) {
      const newResults = { ...state.categoriesResults };

      action.payload.forEach(({ question, category }) => {
        if (category.parent_category_id) {
          if (newResults[category.parent_category_id] === undefined)
            newResults[category.parent_category_id] = {
              questions: {},
              subCategories: {},
            };

          if (
            newResults[category.parent_category_id].subCategories[
              category.id
            ] === undefined
          )
            newResults[category.parent_category_id].subCategories[category.id] =
              {
                questions: {},
                subCategories: {},
              };

          newResults[category.parent_category_id].subCategories[
            category.id
          ].questions[question.id] = {
            ...question,
            selectedAnswerId: undefined,
          };
        } else {
          if (newResults[category.id] === undefined)
            newResults[category.id] = {
              questions: {},
              subCategories: {},
            };

          newResults[category.id].questions[question.id] = {
            ...question,
            selectedAnswerId: undefined,
          };
        }
      });

      state.categoriesResults = newResults;
    },
    editCategoriesResults(
      state,
      action: {
        payload: {
          category: Category;
          question: Question;
          selectedAnswerId: string | undefined;
        };
      }
    ) {
      const newResults = { ...state.categoriesResults };

      const { category, question, selectedAnswerId } = action.payload;

      if (category.parent_category_id) {
        if (newResults[category.parent_category_id] === undefined)
          newResults[category.parent_category_id] = {
            questions: {},
            subCategories: {},
          };

        if (
          newResults[category.parent_category_id].subCategories[category.id] ===
          undefined
        )
          newResults[category.parent_category_id].subCategories[category.id] = {
            questions: {},
            subCategories: {},
          };

        newResults[category.parent_category_id].subCategories[
          category.id
        ].questions[question.id] = { ...question, selectedAnswerId };
      } else {
        if (newResults[category.id] === undefined)
          newResults[category.id] = {
            questions: {},
            subCategories: {},
          };

        newResults[category.id].questions[question.id] = {
          ...question,
          selectedAnswerId,
        };
      }

      state.categoriesResults = newResults;
    },
    setCustomization(
      state,
      action: { payload: Omit<Customization, 'time_added'> }
    ) {
      state.customization = action.payload;
    },
    resetExam(state) {
      state.time = examInitialState.time;
      state.paused = examInitialState.paused;
      state.score = examInitialState.score;
      state.categoriesResults = examInitialState.categoriesResults;
    },
  },
});

export const {
  increaseTime,
  pause,
  resume,
  increaseScore,
  setScore,
  calculateScore,
  togglePaused,
  setTrainingMode,
  setMode,
  setCustomization,
  resetCategoriesResults,
  editCategoriesResults,
  resetExam,
} = examSlice.actions;

export default examSlice.reducer;

function getScoreFromResults(results: {
  [id: string]: CategoryResults;
}): number {
  return Object.values(results).reduce(
    (sum, result) =>
      sum +
      Object.values(result.questions).reduce((sum, question) => {
        const rightAnswer = question.answers.find((answer) => answer.is_right)!;

        return sum + (question.selectedAnswerId === rightAnswer.id ? 1 : 0);
      }, 0) +
      getScoreFromResults(result.subCategories),
    0
  );
}
