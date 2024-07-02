import { useQuery } from '@tanstack/react-query';
import { getExam } from '../api';
import useLoadingScreen from './useLoadingScreen';
import useParams from './useParams';

function useExam() {
  const { examId, questions } = useParams();

  const {
    isLoading,
    isError,
    data: exam,
  } = useQuery(['exam', examId], () => getExam(examId, questions), {
    retry: 0,
    staleTime: Infinity,
  });

  useLoadingScreen(isLoading && !isError);

  // if (isError || (!isLoading && !exam)) throw new Error('Error');

  //{ TODO: DELETE! }
  // return {
  //   id: '',
  //   name: '',
  //   question_quantity: 0,
  //   show_results: false,
  //   template_type: 'side-by-side-small',
  //   allow_copilot: false,
  //   customization_mode: false,
  //   training_mode: false,
  //   flag_questions: false,
  //   exam_builder: false,
  //   duration: 0,
  //   question_duration: 0,
  //   allow_user_navigation: false,
  //   strong_pass: 0,
  //   weak_pass: 0,
  //   question_map: false,
  //   categories: [] as Category[],
  // };

  return { exam: exam, isLoading, isError };
}

export default useExam;
