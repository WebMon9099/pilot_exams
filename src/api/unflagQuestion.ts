import { api } from '../clients';

async function unflagQuestion(questionId: string) {
  try {
    return api.post(`/unflag-question.php?id=${questionId}`);
  } catch (err) {
    return Promise.reject(err);
  }
}

export default unflagQuestion;
