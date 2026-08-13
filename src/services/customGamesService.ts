import { supabase, isSupabaseConfigured } from './supabase';
import { 
  CustomGame, 
  CustomGameAttempt, 
  GameFeedback, 
  CustomGameType,
  MemoryCardPair,
  CrosswordWord,
  LuckyWheelItem 
} from '../types';

// Dữ liệu mẫu ban đầu phong phú cho các trò chơi
export const INITIAL_CUSTOM_GAMES: CustomGame[] = [
  {
    id: 'game-wordwall-heat',
    title: 'Wordwall: Ghép Nối Khái Niệm Nhiệt Học 12',
    description: 'Trò chơi kéo thả nối khái niệm Nội năng, Nhiệt dung riêng, Nhiệt nóng chảy riêng trên nền tảng Wordwall sinh động.',
    game_type: 'iframe',
    embed_url: 'https://wordwall.net/embed/4f63c8a946d44ef782b1c448bb95b211?themeId=1&templateId=3&issueId=0',
    teacher_id: 'teacher-quynh',
    lesson_id: 'l1111111-1111-1111-1111-111111111101',
    max_attempts: 3,
    time_limit: 180,
    thumbnail_url: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=600&auto=format&fit=crop&q=80',
    game_config: {
      provider: 'wordwall',
      allowFullScreen: true
    },
    likes_count: 42,
    avg_rating: 4.9,
    rating_count: 18,
    play_count: 156,
    is_active: true,
    created_at: new Date(Date.now() - 86400000 * 3).toISOString()
  },
  {
    id: 'game-phet-gas',
    title: 'PhET Simulation: Mô Phỏng Chất Khí & Định Luật Khí Lí Tưởng',
    description: 'Thí nghiệm ảo tương tác: Thay đổi áp suất, thể tích, nhiệt độ bình chứa khí để kiểm chứng định luật Boyle và Charles.',
    game_type: 'iframe',
    embed_url: 'https://phet.colorado.edu/sims/html/gas-properties/latest/gas-properties_all.html',
    teacher_id: 'teacher-quynh',
    lesson_id: 'l2222222-2222-2222-2222-222222222202',
    max_attempts: -1,
    time_limit: 300,
    thumbnail_url: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&auto=format&fit=crop&q=80',
    game_config: {
      provider: 'phet',
      allowFullScreen: true
    },
    likes_count: 88,
    avg_rating: 5.0,
    rating_count: 35,
    play_count: 320,
    is_active: true,
    created_at: new Date(Date.now() - 86400000 * 5).toISOString()
  },
  {
    id: 'game-memory-physics12',
    title: 'Lật Thẻ Trí Nhớ: Ghép Đôi Công Thức Vật Lí 12',
    description: 'Mini Game tích hợp: Lật tìm các cặp thẻ tương ứng giữa Tên đại lượng/hiện tượng và Công thức toán học Vật Lí 12.',
    game_type: 'memory_card',
    teacher_id: 'teacher-quynh',
    lesson_id: 'l1111111-1111-1111-1111-111111111102',
    max_attempts: 5,
    time_limit: 120,
    thumbnail_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
    game_config: {
      pairs: [
        { id: 'p1', term: 'Nhiệt lượng tỏa/thu', formulaOrDef: 'Q = mc\\Delta T' },
        { id: 'p2', term: 'Nhiệt nóng chảy', formulaOrDef: 'Q = \\lambda m' },
        { id: 'p3', term: 'Nhiệt hóa hơi', formulaOrDef: 'Q = L m' },
        { id: 'p4', term: 'Phương trình Clapeyron - Mendeleev', formulaOrDef: 'pV = nRT' },
        { id: 'p5', term: 'Định luật Boyle (Đẳng nhiệt)', formulaOrDef: 'p_1 V_1 = p_2 V_2' },
        { id: 'p6', term: 'Định luật Charles (Đẳng áp)', formulaOrDef: '\\frac{V_1}{T_1} = \\frac{V_2}{T_2}' },
      ]
    },
    likes_count: 65,
    avg_rating: 4.8,
    rating_count: 24,
    play_count: 210,
    is_active: true,
    created_at: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    id: 'game-crossword-heat',
    title: 'Ô Chữ Vật Lí: Khám Phá Bí Mật Vật Lí Nhiệt',
    description: 'Mini Game tích hợp: Giải các ô chữ hàng ngang dựa vào gợi ý lý thuyết Vật Lí 12 để tìm ra từ khóa hàng dọc.',
    game_type: 'crossword',
    teacher_id: 'teacher-quynh',
    lesson_id: 'l1111111-1111-1111-1111-111111111101',
    max_attempts: 2,
    time_limit: 180,
    thumbnail_url: 'https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?w=600&auto=format&fit=crop&q=80',
    game_config: {
      words: [
        { id: 'w1', clue: 'Năng lượng chuyển động hỗn loạn không ngừng của các phân tử tạo nên vật', answer: 'NOINANG', displayTerm: 'NỘI NĂNG' },
        { id: 'w2', clue: 'Đơn vị đo nhiệt độ trong hệ SI mang tên nhà vật lí người Anh', answer: 'KELVIN', displayTerm: 'KELVIN' },
        { id: 'w3', clue: 'Quá trình chuyển thể từ thể lỏng sang thể khí', answer: 'HOAHOI', displayTerm: 'HÓA HƠI' },
        { id: 'w4', clue: 'Đại lượng cho biết nhiệt lượng cần truyền để 1 kg chất tăng thêm 1 K', answer: 'NHIETDUNGRIENG', displayTerm: 'NHIỆT DUNG RIÊNG' },
      ]
    },
    likes_count: 51,
    avg_rating: 4.7,
    rating_count: 19,
    play_count: 180,
    is_active: true,
    created_at: new Date(Date.now() - 86400000 * 1).toISOString()
  },
  {
    id: 'game-lucky-wheel-physics',
    title: 'Vòng Quay May Mắn: Thử Thách Điểm Thưởng XP',
    description: 'Mini Game tích hợp: Quay bánh xe may mắn nhận các câu hỏi trắc nghiệm nhanh để nhân đôi số điểm XP tích lũy.',
    game_type: 'lucky_wheel',
    teacher_id: 'teacher-quynh',
    lesson_id: 'l2222222-2222-2222-2222-222222222201',
    max_attempts: -1,
    time_limit: 60,
    thumbnail_url: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=600&auto=format&fit=crop&q=80',
    game_config: {
      wheelItems: [
        { id: 'wh1', label: '+50 XP', color: '#0284c7', type: 'xp', value: 50 },
        { id: 'wh2', label: 'Câu hỏi Nhiệt', color: '#0369a1', type: 'question', value: 'Q1' },
        { id: 'wh3', label: '+100 XP', color: '#0ea5e9', type: 'xp', value: 100 },
        { id: 'wh4', label: 'Nhân Đôi XP', color: '#f59e0b', type: 'bonus', value: 'x2' },
        { id: 'wh5', label: 'Câu hỏi Khí', color: '#38bdf8', type: 'question', value: 'Q2' },
        { id: 'wh6', label: '+200 XP', color: '#10b981', type: 'xp', value: 200 },
      ]
    },
    likes_count: 94,
    avg_rating: 4.9,
    rating_count: 40,
    play_count: 450,
    is_active: true,
    created_at: new Date().toISOString()
  }
];

export const customGamesService = {
  // Lấy danh sách trò chơi mở rộng
  async getCustomGames(filter?: { 
    type?: CustomGameType | 'all'; 
    lessonId?: string; 
    chapterId?: string;
  }): Promise<CustomGame[]> {
    if (!isSupabaseConfigured) {
      const stored = localStorage.getItem('local_custom_games');
      const list: CustomGame[] = stored ? JSON.parse(stored) : INITIAL_CUSTOM_GAMES;
      return list.filter(g => {
        if (!g.is_active) return false;
        if (filter?.type && filter.type !== 'all' && g.game_type !== filter.type) return false;
        if (filter?.lessonId && filter.lessonId !== 'all' && g.lesson_id !== filter.lessonId) return false;
        return true;
      });
    }

    try {
      let query = supabase
        .from('custom_games')
        .select(`
          *,
          lessons:lesson_id (id, number, title),
          profiles:teacher_id (full_name, avatar_url)
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (filter?.type && filter.type !== 'all') query = query.eq('game_type', filter.type);
      if (filter?.lessonId && filter.lessonId !== 'all') query = query.eq('lesson_id', filter.lessonId);

      const { data, error } = await query;
      if (error || !data || data.length === 0) {
        // Fallback local
        const stored = localStorage.getItem('local_custom_games');
        const list: CustomGame[] = stored ? JSON.parse(stored) : INITIAL_CUSTOM_GAMES;
        return list.filter(g => {
          if (!g.is_active) return false;
          if (filter?.type && filter.type !== 'all' && g.game_type !== filter.type) return false;
          if (filter?.lessonId && filter.lessonId !== 'all' && g.lesson_id !== filter.lessonId) return false;
          return true;
        });
      }
      return data;
    } catch (err) {
      console.warn('Lỗi lấy custom games từ Supabase, chuyển sang fallback:', err);
      return INITIAL_CUSTOM_GAMES;
    }
  },

  // Lấy chi tiết một game theo ID
  async getCustomGameById(id: string): Promise<CustomGame | null> {
    if (!isSupabaseConfigured) {
      const stored = localStorage.getItem('local_custom_games');
      const list: CustomGame[] = stored ? JSON.parse(stored) : INITIAL_CUSTOM_GAMES;
      return list.find(g => g.id === id) || null;
    }

    try {
      const { data, error } = await supabase
        .from('custom_games')
        .select(`
          *,
          lessons:lesson_id (id, number, title),
          profiles:teacher_id (full_name, avatar_url)
        `)
        .eq('id', id)
        .single();

      if (error || !data) {
        const stored = localStorage.getItem('local_custom_games');
        const list: CustomGame[] = stored ? JSON.parse(stored) : INITIAL_CUSTOM_GAMES;
        return list.find(g => g.id === id) || null;
      }
      return data;
    } catch {
      const stored = localStorage.getItem('local_custom_games');
      const list: CustomGame[] = stored ? JSON.parse(stored) : INITIAL_CUSTOM_GAMES;
      return list.find(g => g.id === id) || null;
    }
  },

  // Tạo trò chơi mới (Giáo viên)
  async createCustomGame(gameData: Omit<CustomGame, 'id' | 'likes_count' | 'avg_rating' | 'rating_count' | 'play_count' | 'created_at'>): Promise<CustomGame> {
    const newGame: CustomGame = {
      ...gameData,
      id: `game-${Date.now()}`,
      likes_count: 0,
      avg_rating: 5.0,
      rating_count: 0,
      play_count: 0,
      created_at: new Date().toISOString()
    };

    if (!isSupabaseConfigured) {
      const stored = localStorage.getItem('local_custom_games');
      const list: CustomGame[] = stored ? JSON.parse(stored) : [...INITIAL_CUSTOM_GAMES];
      list.unshift(newGame);
      localStorage.setItem('local_custom_games', JSON.stringify(list));
      return newGame;
    }

    try {
      const { data, error } = await supabase
        .from('custom_games')
        .insert([newGame])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch {
      // Lưu local dự phòng
      const stored = localStorage.getItem('local_custom_games');
      const list: CustomGame[] = stored ? JSON.parse(stored) : [...INITIAL_CUSTOM_GAMES];
      list.unshift(newGame);
      localStorage.setItem('local_custom_games', JSON.stringify(list));
      return newGame;
    }
  },

  // Lưu lịch sử lượt chơi (GAME-04, GAME-05, GAME-06, GAME-08)
  async saveAttempt(attempt: Omit<CustomGameAttempt, 'id'>): Promise<CustomGameAttempt> {
    const newAttempt: CustomGameAttempt = {
      ...attempt,
      id: `cg-att-${Date.now()}`
    };

    if (!isSupabaseConfigured) {
      const stored = localStorage.getItem('local_custom_game_attempts');
      const list: CustomGameAttempt[] = stored ? JSON.parse(stored) : [];
      list.unshift(newAttempt);
      localStorage.setItem('local_custom_game_attempts', JSON.stringify(list));

      // Tăng play_count cho game
      const gamesStored = localStorage.getItem('local_custom_games');
      const games: CustomGame[] = gamesStored ? JSON.parse(gamesStored) : [...INITIAL_CUSTOM_GAMES];
      const gIdx = games.findIndex(g => g.id === attempt.game_id);
      if (gIdx !== -1) {
        games[gIdx].play_count = (games[gIdx].play_count || 0) + 1;
        localStorage.setItem('local_custom_games', JSON.stringify(games));
      }

      return newAttempt;
    }

    try {
      const { data, error } = await supabase
        .from('custom_game_attempts')
        .insert([newAttempt])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      console.warn('Lưu attempt Supabase thất bại, lưu vào local:', err);
      const stored = localStorage.getItem('local_custom_game_attempts');
      const list: CustomGameAttempt[] = stored ? JSON.parse(stored) : [];
      list.unshift(newAttempt);
      localStorage.setItem('local_custom_game_attempts', JSON.stringify(list));
      return newAttempt;
    }
  },

  // Lấy lịch sử chơi của 1 học sinh đối với 1 game (để kiểm tra Giới hạn lượt - GAME-06)
  async getStudentGameAttempts(gameId: string, studentId: string): Promise<CustomGameAttempt[]> {
    if (!isSupabaseConfigured) {
      const stored = localStorage.getItem('local_custom_game_attempts');
      const list: CustomGameAttempt[] = stored ? JSON.parse(stored) : [];
      return list.filter(a => a.game_id === gameId && a.student_id === studentId);
    }

    try {
      const { data, error } = await supabase
        .from('custom_game_attempts')
        .select('*')
        .eq('game_id', gameId)
        .eq('student_id', studentId)
        .order('completed_at', { ascending: false });

      if (error || !data) {
        const stored = localStorage.getItem('local_custom_game_attempts');
        const list: CustomGameAttempt[] = stored ? JSON.parse(stored) : [];
        return list.filter(a => a.game_id === gameId && a.student_id === studentId);
      }
      return data;
    } catch {
      const stored = localStorage.getItem('local_custom_game_attempts');
      const list: CustomGameAttempt[] = stored ? JSON.parse(stored) : [];
      return list.filter(a => a.game_id === gameId && a.student_id === studentId);
    }
  },

  // Bảng xếp hạng Top học sinh theo từng Game (GAME-07)
  async getGameLeaderboard(gameId: string): Promise<any[]> {
    if (!isSupabaseConfigured) {
      const stored = localStorage.getItem('local_custom_game_attempts');
      const list: CustomGameAttempt[] = stored ? JSON.parse(stored) : [
        { id: '1', game_id: gameId, student_id: 'u1', score: 10, max_score: 10, time_spent: 42, is_practice: false, started_at: '', completed_at: new Date().toISOString() },
        { id: '2', game_id: gameId, student_id: 'u2', score: 10, max_score: 10, time_spent: 58, is_practice: false, started_at: '', completed_at: new Date().toISOString() },
        { id: '3', game_id: gameId, student_id: 'u3', score: 9.5, max_score: 10, time_spent: 45, is_practice: false, started_at: '', completed_at: new Date().toISOString() },
        { id: '4', game_id: gameId, student_id: 'u4', score: 9.0, max_score: 10, time_spent: 38, is_practice: false, started_at: '', completed_at: new Date().toISOString() },
        { id: '5', game_id: gameId, student_id: 'u5', score: 8.5, max_score: 10, time_spent: 62, is_practice: false, started_at: '', completed_at: new Date().toISOString() },
      ];

      const ranked = list
        .filter(a => a.game_id === gameId && !a.is_practice)
        .sort((a, b) => b.score - a.score || a.time_spent - b.time_spent);

      // Thêm tên giả lập
      const mockNames: Record<string, string> = {
        u1: 'Nguyễn Hoàng Minh',
        u2: 'Trần Thị Thu Thảo',
        u3: 'Phạm Đức Anh',
        u4: 'Lê Gia Hưng',
        u5: 'Vũ Hải Yến'
      };

      return ranked.slice(0, 10).map((r, idx) => ({
        rank: idx + 1,
        student_id: r.student_id,
        full_name: mockNames[r.student_id] || 'Học sinh Vật Lí',
        score: r.score,
        time_spent: r.time_spent,
        completed_at: r.completed_at
      }));
    }

    try {
      const { data, error } = await supabase
        .from('custom_game_attempts')
        .select(`
          id,
          score,
          time_spent,
          completed_at,
          student_id,
          profiles:student_id (id, full_name, avatar_url, school)
        `)
        .eq('game_id', gameId)
        .eq('is_practice', false)
        .order('score', { ascending: false })
        .order('time_spent', { ascending: true })
        .limit(10);

      if (error || !data) return [];
      return data.map((d: any, idx) => ({
        rank: idx + 1,
        student_id: d.student_id,
        full_name: d.profiles?.full_name || 'Học sinh Vật Lí',
        avatar_url: d.profiles?.avatar_url,
        school: d.profiles?.school,
        score: d.score,
        time_spent: d.time_spent,
        completed_at: d.completed_at
      }));
    } catch {
      return [];
    }
  },

  // Đánh giá và feedback (GAME-10)
  async submitFeedback(feedback: Omit<GameFeedback, 'id' | 'created_at'>): Promise<GameFeedback> {
    const newFb: GameFeedback = {
      ...feedback,
      id: `fb-${Date.now()}`,
      created_at: new Date().toISOString()
    };

    if (!isSupabaseConfigured) {
      const stored = localStorage.getItem('local_game_feedbacks');
      const list: GameFeedback[] = stored ? JSON.parse(stored) : [];
      list.unshift(newFb);
      localStorage.setItem('local_game_feedbacks', JSON.stringify(list));
      return newFb;
    }

    try {
      const { data, error } = await supabase
        .from('game_ratings_feedback')
        .insert([newFb])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch {
      const stored = localStorage.getItem('local_game_feedbacks');
      const list: GameFeedback[] = stored ? JSON.parse(stored) : [];
      list.unshift(newFb);
      localStorage.setItem('local_game_feedbacks', JSON.stringify(list));
      return newFb;
    }
  },

  // Lấy danh sách feedback của 1 game
  async getGameFeedbacks(gameId: string): Promise<GameFeedback[]> {
    if (!isSupabaseConfigured) {
      const stored = localStorage.getItem('local_game_feedbacks');
      const list: GameFeedback[] = stored ? JSON.parse(stored) : [
        {
          id: 'fb-1',
          game_id: gameId,
          student_id: 'u1',
          student_name: 'Nguyễn Hoàng Minh',
          rating: 5,
          comment: 'Trò chơi rất hay và trực quan! Em nhớ công thức nhiệt nóng chảy nhanh hơn hẳn.',
          is_liked: true,
          created_at: new Date(Date.now() - 3600000 * 2).toISOString()
        },
        {
          id: 'fb-2',
          game_id: gameId,
          student_id: 'u2',
          student_name: 'Trần Thị Thu Thảo',
          rating: 5,
          comment: 'Giao diện đẹp mắt, âm thanh và hiệu ứng sinh động cô Quỳnh ơi!',
          is_liked: true,
          created_at: new Date(Date.now() - 3600000 * 6).toISOString()
        }
      ];
      return list.filter(f => f.game_id === gameId);
    }

    try {
      const { data, error } = await supabase
        .from('game_ratings_feedback')
        .select(`
          *,
          profiles:student_id (full_name, avatar_url)
        `)
        .eq('game_id', gameId)
        .order('created_at', { ascending: false });

      if (error || !data) return [];
      return data.map((f: any) => ({
        ...f,
        student_name: f.profiles?.full_name || 'Học sinh',
        student_avatar: f.profiles?.avatar_url
      }));
    } catch {
      return [];
    }
  }
};
