import { api } from '../clients';
import type {
  Answer,
  Category,
  DBAnswer,
  DBCategory,
  DBExam,
  DBQuestion,
  Exam,
  Question,
} from '../types';

async function getExam(examId: string, questions?: string[]): Promise<Exam> {
  try {
    const { data: exam } = await api.get<DBExam>(
      `/get-exam.php?id=${examId}&questions=${questions}`
    );

    return {
      ...exam,
      allow_copilot: parseBoolean(exam.allow_copilot),
      allow_user_navigation: parseBoolean(exam.allow_user_navigation),
      customization_mode: parseBoolean(exam.customization_mode),
      duration: parseInt(exam.duration),
      exam_builder: parseBoolean(exam.exam_builder),
      random_answer_order: parseBoolean(exam.random_answer_order),
      hide_question_body_preview: parseBoolean(exam.hide_question_body_preview),
      reduce_answer_option_size:parseBoolean(exam.reduce_answer_option_size),
      add_styling_to_images:parseBoolean(exam.add_styling_to_images),
      flag_questions: parseBoolean(exam.flag_questions),
      question_duration: parseInt(exam.question_duration),
      question_map: parseBoolean(exam.question_map),
      question_quantity: parseInt(exam.question_quantity),
      min_questions: exam.min_questions ? parseInt(exam.min_questions) : null,
      max_questions: exam.max_questions ? parseInt(exam.max_questions) : null,
      show_results: parseBoolean(exam.show_results),
      strong_pass: exam.strong_pass ? parseInt(exam.strong_pass) : undefined,
      training_mode: parseBoolean(exam.training_mode),
      weak_pass: exam.weak_pass ? parseInt(exam.weak_pass) : undefined,
      categories: parseDBCategories(exam.categories),
      custom_content: exam.custom_content
        ? {
            ...exam.custom_content,
            content: JSON.parse(exam.custom_content.content),
          }
        : undefined,
    };
  } catch (err) {
    return Promise.reject(err);
  }
}
export default getExam;

function parseDBCategories(categories: DBCategory[]) {
  return categories.map(parseDBCategory);

  function parseDBCategory(category: DBCategory): Category {
    return {
      ...category,
      parent_category_id: category.parent_category_id || undefined,
      sub_categories: category.sub_categories.map(parseDBCategory),
      questions: category.questions.map(parseDBQuestion),
    };
  }

  function parseDBQuestion(question: DBQuestion): Question {
    return {
      ...question,
      answers: question.answers.map(parseDBAnswer),
    };
  }

  function parseDBAnswer(answer: DBAnswer): Answer {
    return {
      ...answer,
      is_right: answer.is_right === '1',
    };
  }
}

function parseBoolean(value: string | boolean) {
  return value === '1' || value === true;
}
