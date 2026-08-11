import { supabase, isSupabaseConfigured } from './supabase';
import { Question, GameQuiz, GameAttempt, QuestionType, DifficultyLevel } from '../types';
import { INITIAL_QUESTIONS } from '../data/initialCurriculum';

export const gamesService = {
  // Lấy ngân hàng câu hỏi (lọc theo bài học hoặc dạng câu hỏi)
  async getQuestions(filter?: { lessonId?: string; type?: QuestionType; difficulty?: DifficultyLevel }): Promise<Question[]> {
    if (!isSupabaseConfigured) {
      const stored = localStorage.getItem('local_physics_questions');
      const all: Question[] = stored ? JSON.parse(stored) : INITIAL_QUESTIONS;
      return all.filter(q => {
        if (filter?.lessonId && q.lesson_id !== filter.lessonId) return false;
        if (filter?.type && q.type !== filter.type) return false;
        if (filter?.difficulty && q.difficulty !== filter.difficulty) return false;
        return true;
      });
    }

    try {
      let query = supabase
        .from('questions')
        .select(`
          *,
          lessons:lesson_id (id, number, title)
        `)
        .order('created_at', { ascending: false });

      if (filter?.lessonId) query = query.eq('lesson_id', filter.lessonId);
      if (filter?.type) query = query.eq('type', filter.type);
      if (filter?.difficulty) query = query.eq('difficulty', filter.difficulty);

      const { data, error } = await query;
      if (error || !data || data.length === 0) {
        return INITIAL_QUESTIONS.filter(q => {
          if (filter?.lessonId && q.lesson_id !== filter.lessonId) return false;
          if (filter?.type && q.type !== filter.type) return false;
          if (filter?.difficulty && q.difficulty !== filter.difficulty) return false;
          return true;
        });
      }
      return data;
    } catch (err) {
      console.warn('Lỗi lấy câu hỏi từ Supabase, chuyển sang fallback:', err);
      return INITIAL_QUESTIONS;
    }
  },

  // Tạo câu hỏi mới vào ngân hàng câu hỏi
  async createQuestion(question: Omit<Question, 'id' | 'created_at'>): Promise<Question> {
    if (!isSupabaseConfigured) {
      const stored = localStorage.getItem('local_physics_questions');
      const list: Question[] = stored ? JSON.parse(stored) : [...INITIAL_QUESTIONS];
      const newQ: Question = {
        ...question,
        id: `q-${Date.now()}`,
        created_at: new Date().toISOString()
      };
      list.unshift(newQ);
      localStorage.setItem('local_physics_questions', JSON.stringify(list));
      return newQ;
    }

    const { data, error } = await supabase
      .from('questions')
      .insert([question])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Lấy danh sách bộ đề trò chơi (Game Quizzes)
  async getQuizzes(lessonId?: string): Promise<GameQuiz[]> {
    if (!isSupabaseConfigured) {
      const stored = localStorage.getItem('local_physics_quizzes');
      const list: GameQuiz[] = stored ? JSON.parse(stored) : [
        {
          id: 'quiz-all-1',
          title: 'Đấu Trường Vật Lí Nhiệt (Đầy Đủ 3 Dạng)',
          description: 'Thử thách tổng hợp kiến thức Chương 1 với Trắc nghiệm, Đúng/Sai và Ghép cặp công thức.',
          lesson_id: 'l1111111-1111-1111-1111-111111111101',
          teacher_id: 'teacher-quynh',
          game_type: null,
          time_limit: 45,
          is_active: true,
          pin_code: '889922',
          created_at: new Date().toISOString()
        },
        {
          id: 'quiz-mc-1',
          title: 'Vượt Chướng Ngại Vật: Khí Lí Tưởng',
          description: 'Luyện tập tốc độ cao với các câu hỏi trắc nghiệm định luật chất khí.',
          lesson_id: 'l2222222-2222-2222-2222-222222222202',
          teacher_id: 'teacher-quynh',
          game_type: 'multiple_choice',
          time_limit: 30,
          is_active: true,
          pin_code: '123456',
          created_at: new Date().toISOString()
        }
      ];
      return lessonId ? list.filter(q => q.lesson_id === lessonId) : list;
    }

    try {
      let query = supabase
        .from('game_quizzes')
        .select(`
          *,
          lessons:lesson_id (id, number, title)
        `)
        .order('created_at', { ascending: false });

      if (lessonId) query = query.eq('lesson_id', lessonId);

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    } catch (err) {
      console.error('Lỗi lấy game quizzes:', err);
      return [];
    }
  },

  // Tạo Game Quiz mới
  async createQuiz(quizData: {
    title: string;
    description?: string;
    lesson_id?: string;
    teacher_id: string;
    class_id?: string;
    game_type?: QuestionType | null;
    time_limit: number;
    question_ids?: string[];
  }): Promise<GameQuiz> {
    const pin = Math.floor(100000 + Math.random() * 900000).toString();

    if (!isSupabaseConfigured) {
      const stored = localStorage.getItem('local_physics_quizzes');
      const list: GameQuiz[] = stored ? JSON.parse(stored) : [];
      const newQuiz: GameQuiz = {
        ...quizData,
        id: `quiz-${Date.now()}`,
        is_active: true,
        pin_code: pin,
        created_at: new Date().toISOString()
      };
      list.unshift(newQuiz);
      localStorage.setItem('local_physics_quizzes', JSON.stringify(list));
      return newQuiz;
    }

    const { data, error } = await supabase
      .from('game_quizzes')
      .insert([{
        title: quizData.title,
        description: quizData.description,
        lesson_id: quizData.lesson_id,
        teacher_id: quizData.teacher_id,
        class_id: quizData.class_id,
        game_type: quizData.game_type,
        time_limit: quizData.time_limit,
        is_active: true,
        pin_code: pin
      }])
      .select()
      .single();

    if (error) throw error;

    // Nếu có chọn danh sách câu hỏi
    if (quizData.question_ids && quizData.question_ids.length > 0) {
      const links = quizData.question_ids.map((qid, idx) => ({
        quiz_id: data.id,
        question_id: qid,
        sort_order: idx + 1
      }));
      await supabase.from('game_quiz_questions').insert(links);
    }

    return data;
  },

  // Lưu lịch sử chơi & cộng XP cho học sinh
  async saveAttempt(attempt: Omit<GameAttempt, 'id' | 'created_at'>): Promise<GameAttempt> {
    if (!isSupabaseConfigured) {
      const stored = localStorage.getItem('local_physics_attempts');
      const list: GameAttempt[] = stored ? JSON.parse(stored) : [];
      const newAttempt: GameAttempt = {
        ...attempt,
        id: `att-${Date.now()}`,
        created_at: new Date().toISOString()
      };
      list.unshift(newAttempt);
      localStorage.setItem('local_physics_attempts', JSON.stringify(list));

      // Cập nhật XP local user
      const userStr = localStorage.getItem('current_physics_user');
      if (userStr) {
        const u = JSON.parse(userStr);
        u.xp = (u.xp || 0) + attempt.xp_earned;
        localStorage.setItem('current_physics_user', JSON.stringify(u));
      }

      return newAttempt;
    }

    // 1. Lưu bản ghi lượt chơi
    const { data, error } = await supabase
      .from('game_attempts')
      .insert([attempt])
      .select()
      .single();

    if (error) throw error;

    // 2. Tăng XP cho học sinh trong bảng profiles
    try {
      await supabase.rpc('increment_user_xp', {
        user_id: attempt.student_id,
        amount: attempt.xp_earned
      });
    } catch {
      // Fallback nếu chưa tạo RPC
      const { data: userProfile } = await supabase
        .from('profiles')
        .select('xp')
        .eq('id', attempt.student_id)
        .single();

      if (userProfile) {
        await supabase
          .from('profiles')
          .update({ xp: (userProfile.xp || 0) + attempt.xp_earned })
          .eq('id', attempt.student_id);
      }
    }

    return data;
  },

  // Lấy bảng xếp hạng (Leaderboard) theo XP hoặc điểm
  async getLeaderboard(): Promise<any[]> {
    if (!isSupabaseConfigured) {
      return [
        { id: 'u1', full_name: 'Nguyễn Hoàng Minh', xp: 2450, streak: 12, school: 'THPT Chuyên', role: 'student' },
        { id: 'u2', full_name: 'Trần Thị Thu Thảo', xp: 2180, streak: 9, school: 'THPT Chu Văn An', role: 'student' },
        { id: 'u3', full_name: 'Phạm Đức Anh', xp: 1950, streak: 8, school: 'THPT Kim Liên', role: 'student' },
        { id: 'u4', full_name: 'Lê Gia Hưng', xp: 1720, streak: 6, school: 'THPT Chuyên KHTN', role: 'student' },
        { id: 'u5', full_name: 'Vũ Hải Yến', xp: 1540, streak: 5, school: 'THPT Yên Hòa', role: 'student' },
      ];
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url, school, grade, xp, streak, role')
        .eq('role', 'student')
        .order('xp', { ascending: false })
        .limit(20);

      if (error) throw error;
      return data || [];
    } catch (err) {
      console.error('Lỗi lấy bảng xếp hạng:', err);
      return [];
    }
  },

  // Lấy lịch sử kết quả của học sinh
  async getStudentAttempts(studentId: string): Promise<GameAttempt[]> {
    if (!isSupabaseConfigured) {
      const stored = localStorage.getItem('local_physics_attempts');
      return stored ? JSON.parse(stored) : [];
    }

    try {
      const { data, error } = await supabase
        .from('game_attempts')
        .select(`
          *,
          game_quizzes (title),
          lessons (title, number)
        `)
        .eq('student_id', studentId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (err) {
      console.error('Lỗi lấy lịch sử học sinh:', err);
      return [];
    }
  }
};
