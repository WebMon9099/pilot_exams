import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { flagQuestion, getFlaggedQuestions, unflagQuestion } from '../api';
import useLoadingScreen from './useLoadingScreen';

function useFlaggedQuestions() {
  const client = useQueryClient();

  const {
    isLoading,
    isError,
    data: flaggedQuestionsIds,
  } = useQuery(['flagged_questions'], () => getFlaggedQuestions());

  const {
    mutate: mutateFlaggedQuestions,
    isLoading: isMutationLoading,
    isError: isMutationError,
  } = useMutation(
    (data: { questionId: string; flag: boolean }) => {
      const { questionId, flag } = data;

      if (flag) return flagQuestion(questionId);
      else return unflagQuestion(questionId);
    },
    { onSuccess: () => client.invalidateQueries(['flagged_questions']) }
  );

  useLoadingScreen(
    (isLoading || isMutationLoading) && !isError && !isMutationError
  );

  if (isError || (!isLoading && !flaggedQuestionsIds)) throw new Error('Error');

  return { flaggedQuestionsIds, mutateFlaggedQuestions };
}

export default useFlaggedQuestions;
