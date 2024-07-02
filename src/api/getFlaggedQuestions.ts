import { api } from '../clients';

async function getFlaggedQuestions() {
  try {
    const { data: flaggedQuestionsIds } = await api.get<string[]>(
      '/get-user-flagged-questions.php'
    );

    return flaggedQuestionsIds;
  } catch (err) {
    return Promise.reject(err);
  }
}

export default getFlaggedQuestions;
