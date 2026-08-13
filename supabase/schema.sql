-- ====================================================================
-- DATABASE SCHEMA: WEBSITE TRÒ CHƠI HỌC TẬP VẬT LÍ 12 (KẾT NỐI TRI THỨC)
-- Tác giả: Web Vật Lí Cô Quỳnh
-- Hướng dẫn: Chạy toàn bộ script này trong tab SQL Editor trên Supabase
-- ====================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. CUSTOM TYPES (ENUMS)
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('admin', 'teacher', 'student');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE question_type AS ENUM ('multiple_choice', 'true_false', 'matching');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE difficulty_level AS ENUM ('easy', 'medium', 'hard');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE material_type AS ENUM ('pdf', 'slide', 'video', 'doc');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. PROFILES TABLE (Gắn kết với Supabase Auth)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT NOT NULL DEFAULT 'Người học Vật Lí',
    role user_role NOT NULL DEFAULT 'student',
    avatar_url TEXT,
    school TEXT DEFAULT 'THPT',
    grade TEXT DEFAULT '12',
    xp INTEGER NOT NULL DEFAULT 0,
    streak INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. CLASSES TABLE (Quản lý lớp học)
CREATE TABLE IF NOT EXISTS public.classes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    code TEXT NOT NULL UNIQUE,
    grade TEXT NOT NULL DEFAULT '12',
    school_year TEXT NOT NULL DEFAULT '2025-2026',
    teacher_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. CLASS MEMBERS TABLE (Học sinh trong lớp)
CREATE TABLE IF NOT EXISTS public.class_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    status TEXT NOT NULL DEFAULT 'active',
    UNIQUE(class_id, student_id)
);

-- 6. CHAPTERS TABLE (Chương SGK Vật Lí 12 KNTT)
CREATE TABLE IF NOT EXISTS public.chapters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    number INTEGER NOT NULL UNIQUE,
    title TEXT NOT NULL,
    description TEXT,
    icon TEXT DEFAULT 'Atom',
    color TEXT DEFAULT 'from-blue-500 to-cyan-500',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. LESSONS TABLE (Bài học trong từng Chương)
CREATE TABLE IF NOT EXISTS public.lessons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    chapter_id UUID NOT NULL REFERENCES public.chapters(id) ON DELETE CASCADE,
    number INTEGER NOT NULL,
    title TEXT NOT NULL,
    summary TEXT,
    key_formulas JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(chapter_id, number)
);

-- 8. MATERIALS TABLE (Kho học liệu: PDF, Slide, Video...)
CREATE TABLE IF NOT EXISTS public.materials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lesson_id UUID REFERENCES public.lessons(id) ON DELETE SET NULL,
    teacher_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    type material_type NOT NULL DEFAULT 'pdf',
    file_url TEXT NOT NULL,
    description TEXT,
    is_public BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. QUESTIONS TABLE (Ngân hàng câu hỏi 3 dạng)
CREATE TABLE IF NOT EXISTS public.questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lesson_id UUID REFERENCES public.lessons(id) ON DELETE SET NULL,
    teacher_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    type question_type NOT NULL DEFAULT 'multiple_choice',
    content TEXT NOT NULL, -- Nội dung đề bài (hỗ trợ LaTeX)
    options JSONB NOT NULL DEFAULT '[]'::jsonb, -- 4 lựa chọn A, B, C, D (cho multiple_choice) hoặc 4 ý nhận định (cho true_false) hoặc các cặp ghép (cho matching)
    correct_answer JSONB NOT NULL, -- Đáp án đúng (A/B/C/D hoặc array boolean [true, false, true, false] hoặc mapping object)
    explanation TEXT, -- Giải thích chi tiết hiện tượng / công thức
    difficulty difficulty_level NOT NULL DEFAULT 'medium',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. GAME QUIZZES / SESSIONS (Bộ đề / Phòng trò chơi)
CREATE TABLE IF NOT EXISTS public.game_quizzes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    lesson_id UUID REFERENCES public.lessons(id) ON DELETE SET NULL,
    teacher_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    class_id UUID REFERENCES public.classes(id) ON DELETE SET NULL,
    game_type question_type, -- NULL nghĩa là tổng hợp cả 3 dạng
    time_limit INTEGER NOT NULL DEFAULT 30, -- Giây cho mỗi câu hỏi hoặc tổng thời gian
    is_active BOOLEAN NOT NULL DEFAULT true,
    pin_code TEXT, -- Mã phòng thi đấu trực tiếp (Live Game PIN)
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 11. GAME QUIZ QUESTIONS (Liên kết câu hỏi vào Game)
CREATE TABLE IF NOT EXISTS public.game_quiz_questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    quiz_id UUID NOT NULL REFERENCES public.game_quizzes(id) ON DELETE CASCADE,
    question_id UUID NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
    sort_order INTEGER NOT NULL DEFAULT 1,
    UNIQUE(quiz_id, question_id)
);

-- 12. GAME ATTEMPTS (Lịch sử & Kết quả chơi của học sinh)
CREATE TABLE IF NOT EXISTS public.game_attempts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    quiz_id UUID REFERENCES public.game_quizzes(id) ON DELETE CASCADE,
    lesson_id UUID REFERENCES public.lessons(id) ON DELETE SET NULL,
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    score NUMERIC(5, 2) NOT NULL DEFAULT 0, -- Điểm số (thang 10 hoặc XP)
    total_questions INTEGER NOT NULL DEFAULT 0,
    correct_count INTEGER NOT NULL DEFAULT 0,
    time_spent INTEGER NOT NULL DEFAULT 0, -- Số giây hoàn thành
    answers_detail JSONB DEFAULT '[]'::jsonb, -- Chi tiết từng câu trả lời
    xp_earned INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 13. BADGES TABLE (Huy hiệu vinh danh)
CREATE TABLE IF NOT EXISTS public.badges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    icon TEXT NOT NULL,
    criteria_type TEXT NOT NULL, -- 'xp', 'streak', 'quizzes_completed', 'score_10'
    criteria_value INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS public.user_badges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    badge_id UUID NOT NULL REFERENCES public.badges(id) ON DELETE CASCADE,
    unlocked_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, badge_id)
);

-- ====================================================================
-- TRIGGERS & FUNCTIONS
-- ====================================================================

-- Trigger: Tự động thêm Profile khi người dùng đăng ký qua Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, role, avatar_url)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
        COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'student'),
        COALESCE(NEW.raw_user_meta_data->>'avatar_url', '')
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Trigger: Cập nhật updated_at
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE OR REPLACE TRIGGER update_profiles_modtime BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE OR REPLACE TRIGGER update_classes_modtime BEFORE UPDATE ON public.classes FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.class_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Chapters & Lessons Policies (Ai cũng xem được)
CREATE POLICY "Chapters are viewable by everyone" ON public.chapters FOR SELECT USING (true);
CREATE POLICY "Lessons are viewable by everyone" ON public.lessons FOR SELECT USING (true);
CREATE POLICY "Teachers/Admins can manage chapters" ON public.chapters FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'teacher'))
);
CREATE POLICY "Teachers/Admins can manage lessons" ON public.lessons FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'teacher'))
);

-- Classes Policies
CREATE POLICY "Classes viewable by everyone logged in" ON public.classes FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Teachers can manage their own classes" ON public.classes FOR ALL USING (auth.uid() = teacher_id);

-- Class Members Policies
CREATE POLICY "Class members viewable by authenticated" ON public.class_members FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Students can join class" ON public.class_members FOR INSERT WITH CHECK (auth.uid() = student_id);
CREATE POLICY "Teachers can manage class members" ON public.class_members FOR ALL USING (
    EXISTS (SELECT 1 FROM public.classes WHERE classes.id = class_members.class_id AND classes.teacher_id = auth.uid())
);

-- Materials Policies
CREATE POLICY "Materials are viewable by everyone" ON public.materials FOR SELECT USING (true);
CREATE POLICY "Teachers can manage materials" ON public.materials FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'teacher'))
);

-- Questions Policies
CREATE POLICY "Questions are viewable by authenticated users" ON public.questions FOR SELECT USING (true);
CREATE POLICY "Teachers/Admins can manage questions" ON public.questions FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'teacher'))
);

-- Game Quizzes Policies
CREATE POLICY "Quizzes are viewable by everyone" ON public.game_quizzes FOR SELECT USING (true);
CREATE POLICY "Teachers can manage game quizzes" ON public.game_quizzes FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'teacher'))
);
CREATE POLICY "Quiz questions viewable by everyone" ON public.game_quiz_questions FOR SELECT USING (true);
CREATE POLICY "Teachers can manage quiz questions" ON public.game_quiz_questions FOR ALL USING (true);

-- Game Attempts Policies
CREATE POLICY "Attempts viewable by students and their teachers" ON public.game_attempts FOR SELECT USING (true);
CREATE POLICY "Students can insert their attempts" ON public.game_attempts FOR INSERT WITH CHECK (auth.uid() = student_id);

-- Badges Policies
CREATE POLICY "Badges are viewable by everyone" ON public.badges FOR SELECT USING (true);
CREATE POLICY "User badges are viewable by everyone" ON public.user_badges FOR SELECT USING (true);
CREATE POLICY "System can award badges" ON public.user_badges FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ====================================================================
-- SEED DATA: CHƯƠNG TRÌNH VẬT LÍ 12 KẾT NỐI TRI THỨC VỚI CUỘC SỐNG
-- ====================================================================

-- Seed Chapters
INSERT INTO public.chapters (id, number, title, description, icon, color) VALUES
('c1111111-1111-1111-1111-111111111111', 1, 'Chương 1: Vật Lí Nhiệt', 'Mô hình cấu trúc chất, nội năng, định luật 1 NĐLH, nhiệt dung riêng, nhiệt nóng chảy và nhiệt hoá hơi.', 'Flame', 'from-amber-500 to-red-500'),
('c2222222-2222-2222-2222-222222222222', 2, 'Chương 2: Khí Lí Tưởng', 'Mô hình động học phân tử chất khí, định luật Boyle, định luật Charles, phương trình trạng thái khí lí tưởng.', 'Wind', 'from-cyan-500 to-blue-500'),
('c3333333-3333-3333-3333-333333333333', 3, 'Chương 3: Từ Trường', 'Từ trường, lực từ, cảm ứng từ, hiện tượng cảm ứng điện từ, dòng điện xoay chiều, máy biến áp.', 'Zap', 'from-yellow-400 to-amber-600'),
('c4444444-4444-4444-4444-444444444444', 4, 'Chương 4: Vật Lí Hạt Nhân', 'Cấu tạo hạt nhân, năng lượng liên kết, phóng xạ hạt nhân, phản ứng phân hạch, nhiệt hạch và an toàn phóng xạ.', 'Radioactive', 'from-emerald-500 to-teal-600')
ON CONFLICT (number) DO NOTHING;

-- Seed Lessons (Chương 1)
INSERT INTO public.lessons (id, chapter_id, number, title, summary, key_formulas) VALUES
('l1111111-1111-1111-1111-111111111101', 'c1111111-1111-1111-1111-111111111111', 1, 'Bài 1: Cấu trúc của chất. Sự chuyển thể', 'Các thể của chất (rắn, lỏng, khí), mô hình động học phân tử, các quá trình chuyển thể.', '["Thể rắn: Phân tử dao động quanh VTCB", "Thể lỏng: Dao động quanh VTCB dịch chuyển", "Thể khí: Chuyển động hỗn loạn không ngừng"]'::jsonb),
('l1111111-1111-1111-1111-111111111102', 'c1111111-1111-1111-1111-111111111111', 2, 'Bài 2: Nội năng. Định luật I của nhiệt động lực học', 'Khái niệm nội năng, các cách làm biến đổi nội năng (thực hiện công, truyền nhiệt), định luật I NĐLH.', '["\\Delta U = A + Q", "Q > 0: Nhận nhiệt lượng", "A > 0: Nhận công"]'::jsonb),
('l1111111-1111-1111-1111-111111111103', 'c1111111-1111-1111-1111-111111111111', 3, 'Bài 3: Nhiệt độ. Thang nhiệt độ - nhiệt kế', 'Trạng thái cân bằng nhiệt, thang nhiệt độ Celsius và Kelvin.', '["T(K) = t(^\\circ C) + 273.15", "\\Delta T(K) = \\Delta t(^\\circ C)"]'::jsonb),
('l1111111-1111-1111-1111-111111111104', 'c1111111-1111-1111-1111-111111111111', 4, 'Bài 4: Nhiệt dung riêng, nhiệt nóng chảy riêng, nhiệt hoá hơi riêng', 'Định nghĩa và công thức tính nhiệt lượng trong các quá trình truyền nhiệt và chuyển thể.', '["Q = m c \\Delta t", "Q = \\lambda m", "Q = L m"]'::jsonb)
ON CONFLICT (chapter_id, number) DO NOTHING;

-- Seed Lessons (Chương 2)
INSERT INTO public.lessons (id, chapter_id, number, title, summary, key_formulas) VALUES
('l2222222-2222-2222-2222-222222222201', 'c2222222-2222-2222-2222-222222222222', 8, 'Bài 8: Mô hình động học phân tử chất khí', 'Khí lí tưởng, chuyển động Brown, va chạm đàn hồi của phân tử khí với thành bình.', '["Phân tử khí coi là chất điểm", "Tương tác chỉ khi va chạm"]'::jsonb),
('l2222222-2222-2222-2222-222222222202', 'c2222222-2222-2222-2222-222222222222', 9, 'Bài 9: Định luật Boyle (Đẳng nhiệt)', 'Quá trình đẳng nhiệt của một lượng khí lí tưởng xác định.', '["p_1 V_1 = p_2 V_2 = \\text{hằng số}", "p \\sim \\frac{1}{V}"]'::jsonb),
('l2222222-2222-2222-2222-222222222203', 'c2222222-2222-2222-2222-222222222222', 10, 'Bài 10: Định luật Charles (Đẳng áp)', 'Quá trình đẳng áp của một lượng khí lí tưởng xác định.', '["\\frac{V_1}{T_1} = \\frac{V_2}{T_2} = \\text{hằng số}", "V \\sim T"]'::jsonb),
('l2222222-2222-2222-2222-222222222204', 'c2222222-2222-2222-2222-222222222222', 11, 'Bài 11: Phương trình trạng thái khí lí tưởng', 'Phương trình Clapeyron - Mendeleev và phương trình trạng thái khí lí tưởng.', '["\\frac{p V}{T} = \\text{const}", "p V = n R T = \\frac{m}{M} R T"]'::jsonb)
ON CONFLICT (chapter_id, number) DO NOTHING;

-- Seed Lessons (Chương 3)
INSERT INTO public.lessons (id, chapter_id, number, title, summary, key_formulas) VALUES
('l3333333-3333-3333-3333-333333333301', 'c3333333-3333-3333-3333-333333333333', 14, 'Bài 14: Từ trường', 'Từ trường của các dòng điện có dạng đặc biệt, đường sức từ, từ phổ.', '["Đường sức từ kín", "Vào Nam ra Bắc"]'::jsonb),
('l3333333-3333-3333-3333-333333333302', 'c3333333-3333-3333-3333-333333333333', 15, 'Bài 15: Lực từ. Cảm ứng từ', 'Lực từ tác dụng lên đoạn dây dẫn mang dòng điện, quy tắc bàn tay trái.', '["F = B I L \\sin\\alpha", "1\\text{ Tesla (T)} = 1\\text{ N}/(\\text{A}\\cdot\\text{m})"]'::jsonb),
('l3333333-3333-3333-3333-333333333303', 'c3333333-3333-3333-3333-333333333333', 16, 'Bài 16: Hiện tượng cảm ứng điện từ', 'Từ thông, định luật Faraday về cảm ứng điện từ, định luật Lenz.', '["\\Phi = B S \\cos\\alpha", "e_c = -\\frac{\\Delta\\Phi}{\\Delta t}"]'::jsonb)
ON CONFLICT (chapter_id, number) DO NOTHING;

-- Seed Lessons (Chương 4)
INSERT INTO public.lessons (id, chapter_id, number, title, summary, key_formulas) VALUES
('l4444444-4444-4444-4444-444444444401', 'c4444444-4444-4444-4444-444444444444', 19, 'Bài 19: Cấu tạo hạt nhân. Năng lượng liên kết', 'Proton, neutron, độ hụt khối, năng lượng liên kết riêng quyết định độ bền vững.', '["E = m c^2", "\\Delta m = [Z m_p + (A - Z) m_n] - m_X", "W_{lk} = \\Delta m c^2", "W_{lkr} = \\frac{W_{lk}}{A}"]'::jsonb),
('l4444444-4444-4444-4444-444444444402', 'c4444444-4444-4444-4444-444444444444', 20, 'Bài 20: Phóng xạ', 'Định luật phóng xạ, tia phóng xạ alpha, beta, gamma, chu kì bán rã.', '["N(t) = N_0 2^{-\\frac{t}{T}} = N_0 e^{-\\lambda t}", "\\lambda = \\frac{\\ln 2}{T}"]'::jsonb)
ON CONFLICT (chapter_id, number) DO NOTHING;

-- Seed Real Question Bank (3 Dạng câu hỏi thực tế)

-- 1. Dạng Trắc nghiệm 4 đáp án
INSERT INTO public.questions (lesson_id, type, content, options, correct_answer, explanation, difficulty) VALUES
('l1111111-1111-1111-1111-111111111102', 'multiple_choice', 
'Một lượng khí nhận nhiệt lượng $Q = 250\\text{ J}$ và dãn nở sinh công $A'' = 150\\text{ J}$ đẩy pit-tông lên. Theo định luật I nhiệt động lực học, độ biến thiên nội năng $\\Delta U$ của khối khí là bao nhiêu?',
'["+400 J", "+100 J", "-100 J", "-400 J"]'::jsonb,
'"B"'::jsonb,
'Theo quy ước dấu: Khí nhận nhiệt lượng nên $Q = +250\\text{ J}$. Khí sinh công $A'' = 150\\text{ J} \\Rightarrow$ công khí nhận là $A = -150\\text{ J}$. Áp dụng định luật 1: $\\Delta U = A + Q = -150 + 250 = +100\\text{ J}$.',
'easy'),

('l2222222-2222-2222-2222-222222222202', 'multiple_choice',
'Một khối khí lí tưởng xác định có thể tích $V_1 = 4\\text{ lít}$ ở áp suất $p_1 = 1\\text{ bar}$. Nếu nén đẳng nhiệt khối khí đến thể tích $V_2 = 2\\text{ lít}$ thì áp suất $p_2$ của khối khí là:',
'["0.5 bar", "1.5 bar", "2.0 bar", "4.0 bar"]'::jsonb,
'"C"'::jsonb,
'Vì quá trình là đẳng nhiệt ($T = \\text{const}$), theo định luật Boyle ta có: $p_1 V_1 = p_2 V_2 \\Rightarrow p_2 = \\frac{p_1 V_1}{V_2} = \\frac{1 \\times 4}{2} = 2.0\\text{ bar}$.',
'easy'),

('l4444444-4444-4444-4444-444444444401', 'multiple_choice',
'Đại lượng đặc trưng cho mức độ bền vững của một hạt nhân nguyên tử là:',
'["Năng lượng liên kết", "Năng lượng liên kết riêng", "Độ hụt khối", "Số khối A"]'::jsonb,
'"B"'::jsonb,
'Năng lượng liên kết riêng $\\epsilon = \\frac{W_{lk}}{A}$ (năng lượng liên kết tính trên một nucleon) là đại lượng đặc trưng cho độ bền vững của hạt nhân. Hạt nhân có $\\epsilon$ càng lớn thì càng bền vững (bền nhất ở khoảng $A \\in [50, 70]$).',
'medium');

-- 2. Dạng Đúng / Sai 4 ý chuẩn THPT
INSERT INTO public.questions (lesson_id, type, content, options, correct_answer, explanation, difficulty) VALUES
('l1111111-1111-1111-1111-111111111101', 'true_false',
'Khi nói về mô hình cấu trúc của chất và sự chuyển thể theo SGK Vật Lí 12 KNTT, xét tính Đúng / Sai của các nhận định sau:',
'[
  {"id": "a", "text": "Ở thể rắn, các phân tử dao động quanh các vị trí cân bằng cố định xác định."},
  {"id": "b", "text": "Khoảng cách trung bình giữa các phân tử ở thể khí lớn hơn rất nhiều so với thể lỏng và thể rắn."},
  {"id": "c", "text": "Trong suốt quá trình nóng chảy của chất rắn kết tinh, nhiệt độ của vật liên tục tăng lên theo thời gian."},
  {"id": "d", "text": "Nhiệt nóng chảy riêng $\\lambda$ có đơn vị là $\\text{J}/\\text{kg}$."}
]'::jsonb,
'[true, true, false, true]'::jsonb,
'Giải thích từng ý:
- Ý a (Đúng): Đặc điểm thể rắn có trật tự cao, dao động quanh VTCB cố định.
- Ý b (Đúng): Thể khí loãng, khoảng cách phân tử gấp hàng chục lần kích thước phân tử.
- Ý c (Sai): Trong suốt quá trình nóng chảy của chất rắn kết tinh, nhiệt độ giữ không đổi cho đến khi nóng chảy hoàn toàn.
- Ý d (Đúng): $Q = \\lambda m \\Rightarrow \\lambda = \\frac{Q}{m}$ có đơn vị $\\text{J}/\\text{kg}$.',
'medium'),

('l2222222-2222-2222-2222-222222222204', 'true_false',
'Xét một lượng khí lí tưởng xác định biến đổi trạng thái trong xilanh kín. Đánh giá tính Đúng / Sai của các mệnh đề sau:',
'[
  {"id": "a", "text": "Trong hệ tọa độ $(p, V)$, đường đẳng nhiệt là một nhánh của đường hyperbol."},
  {"id": "b", "text": "Độ biến thiên nhiệt độ $\\Delta T$ theo thang Kelvin luôn bằng độ biến thiên $\\Delta t$ theo thang Celsius."},
  {"id": "c", "text": "Hằng số chất khí $R$ trong phương trình Clapeyron - Mendeleev có giá trị xấp xỉ $8.31\\text{ J}/(\\text{mol}\\cdot\\text{K})$."},
  {"id": "d", "text": "Khi tăng nhiệt độ tuyệt đối của một khối khí lên 2 lần thì động năng tịnh tiến trung bình của phân tử giảm 2 lần."}
]'::jsonb,
'[true, true, true, false]'::jsonb,
'Giải thích từng ý:
- Ý a (Đúng): Vì $p \\sim 1/V$ nên đồ thị là nhánh hyperbol.
- Ý b (Đúng): Do 1 độ K tương ứng với độ biến thiên 1 độ C ($\\Delta T = \\Delta t$).
- Ý c (Đúng): Hằng số khí lí tưởng $R \\approx 8.314\\text{ J}/(\\text{mol}\\cdot\\text{K})$.
- Ý d (Sai): Động năng trung bình $\\bar{E_d} = \\frac{3}{2} k T$ tỉ lệ thuận với nhiệt độ tuyệt đối $T$, khi $T$ tăng 2 lần thì động năng tăng 2 lần.',
'medium');

-- 3. Dạng Nối từ / Ghép cặp (Matching)
INSERT INTO public.questions (lesson_id, type, content, options, correct_answer, explanation, difficulty) VALUES
('l4444444-4444-4444-4444-444444444402', 'matching',
'Hãy ghép đúng loại tia phóng xạ ở Cột A với bản chất và đặc tính tương ứng ở Cột B:',
'{
  "left": [
    {"id": "L1", "text": "Tia Alpha ($\\alpha$)"},
    {"id": "L2", "text": "Tia Beta trừ ($\\beta^-$)"},
    {"id": "L3", "text": "Tia Beta cộng ($\\beta^+$)"},
    {"id": "L4", "text": "Tia Gamma ($\\gamma$)"}
  ],
  "right": [
    {"id": "R1", "text": "Dòng hạt nhân Heli ($^4_2\\text{He}$), ion hóa mạnh, bị chặn bởi tờ giấy"},
    {"id": "R2", "text": "Dòng các electron ($^0_{-1}e$), bị lệch về bản dương trong điện trường"},
    {"id": "R3", "text": "Dòng các positron ($^0_{+1}e$), phản hạt của electron"},
    {"id": "R4", "text": "Sóng điện từ bước sóng cực ngắn, đâm xuyên mạnh nhất, không mang điện"}
  ]
}'::jsonb,
'{"L1": "R1", "L2": "R2", "L3": "R3", "L4": "R4"}'::jsonb,
'Khớp nối chính xác:
- Tia Alpha $\\alpha$: Dòng hạt $^4_2\\text{He}$, ion hóa môi trường rất mạnh, khả năng đâm xuyên yếu.
- Tia Beta trừ $\\beta^-$: Dòng electron mang điện tích âm, lệch về bản dương.
- Tia Beta cộng $\\beta^+$: Dòng positron mang điện tích dương.
- Tia Gamma $\\gamma$: Phôtôn năng lượng cao, không mang điện, đâm xuyên qua bê tông dày.',
'hard'),

('l1111111-1111-1111-1111-111111111104', 'matching',
'Hãy ghép các đại lượng nhiệt học ở Cột A với công thức tương ứng ở Cột B:',
'{
  "left": [
    {"id": "L1", "text": "Nhiệt lượng tăng giảm nhiệt độ"},
    {"id": "L2", "text": "Nhiệt lượng nóng chảy hoàn toàn"},
    {"id": "L3", "text": "Nhiệt lượng hoá hơi hoàn toàn"},
    {"id": "L4", "text": "Định luật I Nhiệt động lực học"}
  ],
  "right": [
    {"id": "R1", "text": "$Q = m c \\Delta t$"},
    {"id": "R2", "text": "$Q = \\lambda m$"},
    {"id": "R3", "text": "$Q = L m$"},
    {"id": "R4", "text": "$\\Delta U = A + Q$"}
  ]
}'::jsonb,
'{"L1": "R1", "L2": "R2", "L3": "R3", "L4": "R4"}'::jsonb,
'Khớp nối chính xác các công thức căn bản SGK Vật Lí 12 KNTT Chương 1.',
'easy');

-- Seed Badges
INSERT INTO public.badges (title, description, icon, criteria_type, criteria_value) VALUES
('Tân Binh Vật Lí', 'Hoàn thành bài luyện tập đầu tiên', 'Compass', 'quizzes_completed', 1),
('Bậc Thầy Nhiệt Học', 'Đạt điểm tuyệt đối chương Vật lí nhiệt', 'Flame', 'score_10', 1),
('Chiến Binh Khí Lí Tưởng', 'Đạt 500 XP từ các trò chơi', 'Zap', 'xp', 500),
('Nhà Bác Học Nguyên Tử', 'Đạt 1500 XP và chuỗi 3 ngày học', 'Atom', 'xp', 1500),
('Kỉ Lục Gia 10 Điểm', 'Đạt 5 lần điểm 10 trắc nghiệm', 'Trophy', 'score_10', 5)
ON CONFLICT DO NOTHING;

-- ====================================================================
-- 15. EXPANDED GAMES SUITE (GAME-01 -> GAME-10)
-- ====================================================================

-- 15.1 BẢNG TRÒ CHƠI MỞ RỘNG (iFrame, HTML5 ZIP, Mini Games)
CREATE TABLE IF NOT EXISTS public.custom_games (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    game_type TEXT NOT NULL, -- 'iframe', 'html5_zip', 'memory_card', 'crossword', 'lucky_wheel'
    embed_url TEXT,
    zip_blob_url TEXT,
    zip_file_name TEXT,
    teacher_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    lesson_id UUID REFERENCES public.lessons(id) ON DELETE SET NULL,
    chapter_id UUID REFERENCES public.chapters(id) ON DELETE SET NULL,
    class_id UUID REFERENCES public.classes(id) ON DELETE SET NULL,
    max_attempts INTEGER NOT NULL DEFAULT -1, -- -1: Không giới hạn
    time_limit INTEGER DEFAULT 180,
    thumbnail_url TEXT,
    game_config JSONB DEFAULT '{}'::jsonb,
    likes_count INTEGER NOT NULL DEFAULT 0,
    avg_rating NUMERIC(3,2) NOT NULL DEFAULT 5.0,
    rating_count INTEGER NOT NULL DEFAULT 0,
    play_count INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 15.2 BẢNG LƯỢT CHƠI & ĐIỂM SỐ GAME (GAME-04, GAME-05, GAME-06, GAME-08)
CREATE TABLE IF NOT EXISTS public.custom_game_attempts (
    id TEXT PRIMARY KEY,
    game_id TEXT NOT NULL REFERENCES public.custom_games(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    score NUMERIC(4,2) NOT NULL DEFAULT 0,
    max_score NUMERIC(4,2) NOT NULL DEFAULT 10,
    time_spent INTEGER NOT NULL DEFAULT 0,
    is_practice BOOLEAN NOT NULL DEFAULT FALSE,
    started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 15.3 BẢNG ĐÁNH GIÁ & PHẢN HỒI GAME (GAME-10)
CREATE TABLE IF NOT EXISTS public.game_ratings_feedback (
    id TEXT PRIMARY KEY,
    game_id TEXT NOT NULL REFERENCES public.custom_games(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    is_liked BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- KÍCH HOẠT RLS CHO CÁC BẢNG GAME MỚI
ALTER TABLE public.custom_games ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_game_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_ratings_feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Mọi người đều có thể xem game hoạt động" ON public.custom_games FOR SELECT USING (is_active = true);
CREATE POLICY "Giáo viên và Admin có thể quản lý game" ON public.custom_games FOR ALL USING (auth.uid() = teacher_id OR auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'admin'));

CREATE POLICY "Mọi người xem được lịch sử và BXH" ON public.custom_game_attempts FOR SELECT USING (true);
CREATE POLICY "Học sinh có thể nộp lượt chơi" ON public.custom_game_attempts FOR INSERT WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Mọi người xem feedback game" ON public.game_ratings_feedback FOR SELECT USING (true);
CREATE POLICY "Học sinh gửi feedback game" ON public.game_ratings_feedback FOR INSERT WITH CHECK (auth.uid() = student_id);

