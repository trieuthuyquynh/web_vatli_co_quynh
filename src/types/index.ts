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

// ==========================================
// MỞ RỘNG BỘ TÍNH NĂNG TRÒ CHƠI (GAME-01 -> GAME-10)
// ==========================================

export type CustomGameType = 
  | 'iframe'        // GAME-01: Nhúng Wordwall, Quizizz, Kahoot, Canva, Genially...
  | 'html5_zip'     // GAME-02: Game HTML5 upload bằng file ZIP
  | 'memory_card'   // GAME-09: Mini game Lật thẻ ghi nhớ ghép cặp
  | 'crossword'     // GAME-09: Mini game Khung chữ / Ô chữ Vật Lí
  | 'lucky_wheel';  // GAME-09: Mini game Vòng quay may mắn

export interface MemoryCardPair {
  id: string;
  term: string; // Tên hiện tượng / định luật
  formulaOrDef: string; // Công thức / Định nghĩa (hỗ trợ LaTeX)
}

export interface CrosswordWord {
  id: string;
  clue: string; // Gợi ý câu hỏi
  answer: string; // Từ khóa không dấu / viết hoa (VD: "NHIETDUNGRIENG")
  displayTerm: string; // Từ hiển thị chuẩn tiếng Việt (VD: "Nhiệt Dung Riêng")
}

export interface LuckyWheelItem {
  id: string;
  label: string; // Nhãn ô quay (VD: "+100 XP", "Câu hỏi 1", "Nhân đôi XP")
  color: string;
  type: 'xp' | 'question' | 'bonus';
  value: number | string;
  question?: Question;
}

export interface CustomGame {
  id: string;
  title: string;
  description?: string;
  game_type: CustomGameType;
  embed_url?: string; // Dùng cho GAME-01 (iFrame)
  zip_blob_url?: string; // Dùng cho GAME-02 (HTML5 runner URL)
  zip_file_name?: string;
  teacher_id: string;
  lesson_id?: string;
  chapter_id?: string;
  class_id?: string;
  max_attempts: number; // GAME-06: -1 là không giới hạn, 1 là 1 lần, v.v.
  time_limit?: number; // Giây
  thumbnail_url?: string;
  game_config?: {
    pairs?: MemoryCardPair[];
    words?: CrosswordWord[];
    wheelItems?: LuckyWheelItem[];
    allowFullScreen?: boolean;
    provider?: 'wordwall' | 'quizizz' | 'kahoot' | 'canva' | 'genially' | 'phet' | 'html5' | 'custom';
  };
  likes_count: number; // GAME-10
  avg_rating: number; // GAME-10 (1-5 sao)
  rating_count: number;
  play_count: number;
  is_active: boolean;
  created_at?: string;
  lessons?: Lesson;
  profiles?: Profile;
}

export interface GameFeedback {
  id: string;
  game_id: string;
  student_id: string;
  student_name?: string;
  student_avatar?: string;
  rating: number; // 1 -> 5 sao
  comment: string;
  is_liked: boolean;
  created_at: string;
}

export interface CustomGameAttempt {
  id: string;
  game_id: string;
  student_id: string;
  score: number; // Thang 10 hoặc raw score
  max_score: number;
  time_spent: number; // Số giây (GAME-05)
  is_practice: boolean; // GAME-08 (true: chơi luyện tập, false: tính điểm chính)
  started_at: string;
  completed_at: string;
  profiles?: Profile;
  custom_games?: CustomGame;
}
