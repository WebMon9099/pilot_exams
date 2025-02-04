export type TemplateType =
  | "horizontal-images"
  | "horizontal-letters"
  | "horizontal-text"
  | "vertical-text"
  | "side-by-side-medium";

export interface DBExam {
  id: string;
  name: string;
  question_quantity: string;
  show_results: string;
  template_type: TemplateType;
  allow_copilot: string;
  customization_mode: string;
  training_mode: string;
  flag_questions: string;
  exam_builder: string;
  random_answer_order: boolean;
  hide_question_body_preview: boolean;
  reduce_answer_option_size: boolean;
  add_styling_to_images: boolean;
  duration: string;
  question_duration: string;
  allow_user_navigation: string;
  strong_pass: string;
  weak_pass: string;
  question_map: string;
  // skill_categories: SkillCategory[];
  categories: DBCategory[];
  custom_content?: {
    id: string;
    type: ExamCustomContentType;
    content: any;
  };
  max_questions: string | null;
  min_questions: string | null;
}

export interface Exam {
  id: string;
  name: string;
  question_quantity: number;
  show_results: boolean;
  template_type: TemplateType;
  allow_copilot: boolean;
  customization_mode: boolean;
  training_mode: boolean;
  flag_questions: boolean;
  exam_builder: boolean;
  hide_question_body_preview: boolean;
  reduce_answer_option_size: boolean;
  add_styling_to_images: boolean;
  random_answer_order: boolean;
  duration: number;
  question_duration: number;
  allow_user_navigation: boolean;
  strong_pass?: number;
  weak_pass?: number;
  question_map: boolean;
  // skill_categories: SkillCategory[];
  categories: Category[];
  custom_content?: {
    id: string;
    type: ExamCustomContentType;
    content: any;
  };
  max_questions: number | null;
  min_questions: number | null;
}

export type ExamCustomContentType = "text" | "image" | "tabs";

export interface DBCategory {
  id: string;
  name: string;
  parent_category_id: string | null;
  sub_categories: DBCategory[];
  questions: DBQuestion[];
}

export interface Category {
  id: string;
  name: string;
  parent_category_id?: string;
  sub_categories: Category[];
  questions: Question[];
}

export interface DBQuestion {
  id: string;
  body: string;
  category_id: string;
  explanation: string;
  featured_image: string;
  answers: DBAnswer[];
  informations: Information[];
  template_type: TemplateType;
  random_answer_order: boolean;
  hide_question_body_preview: boolean;
  reduce_answer_option_size: boolean;
  add_styling_to_images: boolean;
}

export interface Question {
  id: string;
  body: string;
  category_id: string;
  explanation: string;
  featured_image?: string;
  answers: Answer[];
  informations: Information[];
  template_type: TemplateType;
  random_answer_order: boolean;
  hide_question_body_preview: boolean;
  reduce_answer_option_size: boolean;
  add_styling_to_images: boolean;
}

export interface DBAnswer {
  id: string;
  body: string;
  is_right: boolean;
}

export interface Answer {
  id: string;
  body: string;
  is_right: boolean;
}

export interface Information {
  id: string;
  name: string;
  type: "hyperlink" | "image" | "pdf";
  hyperlink: string;
}

export interface DBCustomization {
  id: string;
  exam_id: string;
  name: string;
  time_added: string;
  duration: string;
  question_quantity: string;
  copilot_activated: string;
  disabled_categories: string[];
}

export interface Customization {
  id: string;
  exam_id: string;
  name: string;
  time_added: Date;
  duration: number;
  question_quantity: number;
  copilot_activated: boolean;
  disabled_categories: string[];
}

export interface Result {
  id: string;
  score: number;
  start_time: number;
  end_time: number;
  mode: "normal" | "training";
}

export type Median = "below" | "average" | "above";
