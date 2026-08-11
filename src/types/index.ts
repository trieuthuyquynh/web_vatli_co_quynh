export type UserRole = 'admin' | 'teacher' | 'student';

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  avatar_url?: string;
  school?: string;
  grade?: string;
  xp: number;
  streak: number;
  created_at?: string;
  updated_at?: string;
}

export interface Chapter {
  id: string;
  number: number;
  title: string;
  description: string;
  icon: string;
  color: string;
}

export interface Lesson {
  id: string;
  chapter_id: string;
  number: number;
  title: string;
  summary: string;
  key_formulas: string[];
}

export type MaterialType = 'pdf' | 'slide' | 'video' | 'doc';

export interface Material {
  id: string;
  lesson_id?: string;
  teacher_id: string;
  title: string;
  type: MaterialType;
  file_url: string;
  description?: string;
  is_public: boolean;
  created_at?: string;
  lessons?: Lesson;
  profiles?: Profile;
}

export type QuestionType = 'multiple_choice' | 'true_false' | 'matching';
export type DifficultyLevel = 'easy' | 'medium' | 'hard';

export interface TrueFalseStatement {
  id: string;
  text: string;
}

export interface MatchingItem {
  id: string;
  text: string;
}

export interface MatchingOptions {
  left: MatchingItem[];
  right: MatchingItem[];
}

export interface Question {
  id: string;
  lesson_id?: string;
  teacher_id?: string;
  type: QuestionType;
  content: string; // Hỗ trợ công thức LaTeX $...$
  options: string[] | TrueFalseStatement[] | MatchingOptions; // Tùy thuộc vào type
  correct_answer: string | boolean[] | Record<string, string>; // Multiple choice: "A"/"B"/"C"/"D"; True/False: [true, false, ...]; Matching: {"L1": "R1", ...}
  explanation?: string;
  difficulty: DifficultyLevel;
  created_at?: string;
  lessons?: Lesson;
}

export interface GameQuiz {
  id: string;
  title: string;
  description?: string;
  lesson_id?: string;
  teacher_id: string;
  class_id?: string;
  game_type?: QuestionType | null;
  time_limit: number; // Giây
  is_active: boolean;
  pin_code?: string;
  created_at?: string;
  lessons?: Lesson;
  questions?: Question[];
}

export interface AnswerDetail {
  question_id: string;
  type: QuestionType;
  user_answer: any;
  is_correct: boolean;
  score_obtained: number;
}

export interface GameAttempt {
  id: string;
  quiz_id?: string;
  lesson_id?: string;
  student_id: string;
  score: number;
  total_questions: number;
  correct_count: number;
  time_spent: number;
  answers_detail: AnswerDetail[];
  xp_earned: number;
  created_at?: string;
  profiles?: Profile;
  game_quizzes?: GameQuiz;
  lessons?: Lesson;
}

export interface Class {
  id: string;
  name: string;
  code: string;
  grade: string;
  school_year: string;
  teacher_id: string;
  description?: string;
  created_at?: string;
  member_count?: number;
  profiles?: Profile; // Teacher info
}

export interface ClassMember {
  id: string;
  class_id: string;
  student_id: string;
  joined_at: string;
  status: string;
  profiles?: Profile; // Student info
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  criteria_type: 'xp' | 'streak' | 'quizzes_completed' | 'score_10';
  criteria_value: number;
  unlocked?: boolean;
}
