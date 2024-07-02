import { api } from '../clients';

async function flagQuestion(questionId: string) {
  try {
    return api.post(`/flag-question.php?id=${questionId}`);
  } catch (err) {
    return Promise.reject(err);
  }
}

export default flagQuestion;
