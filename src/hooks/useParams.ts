import { useMatch, useSearchParams } from 'react-router-dom';

function useParams() {
  const baseMatch = useMatch('/:examId');
  const match = useMatch('/:examId/:page');
  const completeMatch = useMatch('/:examId/:page/:tab');

  const [searchParams] = useSearchParams();

  const questions = searchParams.get('questions')?.split(',');

  if (!baseMatch?.params && !match?.params && !completeMatch?.params)
    throw new Error('Invalid URL.');

  return { ...(completeMatch || match || baseMatch)?.params, questions } as {
    examId: string;
    page: string;
    tab: 'overview' | 'feedback';
    questions?: string[];
  };
}

export default useParams;
