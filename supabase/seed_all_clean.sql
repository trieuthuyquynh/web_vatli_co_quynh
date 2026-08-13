-- ====================================================================
-- SCRIPT NẠP TOÀN BỘ CƠ SỞ DỮ LIỆU & CÂU HỎI VẬT LÍ 12 (KẾT NỐI TRI THỨC)
-- Chạy toàn bộ script này trong Supabase SQL Editor (Tab mới)
-- ====================================================================

-- 1. BẬT TIỆN ÍCH UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TẠO CÁC KIỂU DỮ LIỆU ENUM (Nếu chưa có)
DO $$ BEGIN CREATE TYPE user_role AS ENUM ('admin', 'teacher', 'student'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE question_type AS ENUM ('multiple_choice', 'true_false', 'matching'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE difficulty_level AS ENUM ('easy', 'medium', 'hard'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE material_type AS ENUM ('pdf', 'slide', 'video', 'doc'); EXCEPTION WHEN duplicate_object THEN null; END $$;

-- 3. TẠO CÁC BẢNG NỀN TẢNG
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

CREATE TABLE IF NOT EXISTS public.class_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    status TEXT NOT NULL DEFAULT 'active',
    UNIQUE(class_id, student_id)
);

CREATE TABLE IF NOT EXISTS public.chapters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    number INTEGER NOT NULL UNIQUE,
    title TEXT NOT NULL,
    description TEXT,
    icon TEXT DEFAULT 'Atom',
    color TEXT DEFAULT 'from-blue-500 to-cyan-500',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

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

CREATE TABLE IF NOT EXISTS public.questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lesson_id UUID REFERENCES public.lessons(id) ON DELETE SET NULL,
    teacher_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    type question_type NOT NULL DEFAULT 'multiple_choice',
    content TEXT NOT NULL,
    options JSONB NOT NULL DEFAULT '[]'::jsonb,
    correct_answer JSONB NOT NULL,
    explanation TEXT,
    difficulty difficulty_level NOT NULL DEFAULT 'medium',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.game_quizzes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    lesson_id UUID REFERENCES public.lessons(id) ON DELETE SET NULL,
    teacher_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    class_id UUID REFERENCES public.classes(id) ON DELETE SET NULL,
    game_type question_type,
    time_limit INTEGER NOT NULL DEFAULT 30,
    is_active BOOLEAN NOT NULL DEFAULT true,
    pin_code TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.game_quiz_questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    quiz_id UUID NOT NULL REFERENCES public.game_quizzes(id) ON DELETE CASCADE,
    question_id UUID NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
    sort_order INTEGER NOT NULL DEFAULT 1,
    UNIQUE(quiz_id, question_id)
);

CREATE TABLE IF NOT EXISTS public.game_attempts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    quiz_id UUID REFERENCES public.game_quizzes(id) ON DELETE CASCADE,
    lesson_id UUID REFERENCES public.lessons(id) ON DELETE SET NULL,
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    score NUMERIC(5, 2) NOT NULL DEFAULT 0,
    total_questions INTEGER NOT NULL DEFAULT 0,
    correct_count INTEGER NOT NULL DEFAULT 0,
    time_spent INTEGER NOT NULL DEFAULT 0,
    answers_detail JSONB DEFAULT '[]'::jsonb,
    xp_earned INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.badges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    icon TEXT NOT NULL,
    criteria_type TEXT NOT NULL,
    criteria_value INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS public.user_badges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    badge_id UUID NOT NULL REFERENCES public.badges(id) ON DELETE CASCADE,
    unlocked_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, badge_id)
);

CREATE TABLE IF NOT EXISTS public.custom_games (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    game_type TEXT NOT NULL,
    embed_url TEXT,
    zip_blob_url TEXT,
    zip_file_name TEXT,
    teacher_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    lesson_id UUID REFERENCES public.lessons(id) ON DELETE SET NULL,
    chapter_id UUID REFERENCES public.chapters(id) ON DELETE SET NULL,
    class_id UUID REFERENCES public.classes(id) ON DELETE SET NULL,
    max_attempts INTEGER NOT NULL DEFAULT -1,
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

CREATE TABLE IF NOT EXISTS public.game_ratings_feedback (
    id TEXT PRIMARY KEY,
    game_id TEXT NOT NULL REFERENCES public.custom_games(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    is_liked BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. BẬT ROW LEVEL SECURITY (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_games ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_game_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_ratings_feedback ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN CREATE POLICY "Xem profiles công khai" ON public.profiles FOR SELECT USING (true); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE POLICY "Xem chương công khai" ON public.chapters FOR SELECT USING (true); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE POLICY "Xem bài học công khai" ON public.lessons FOR SELECT USING (true); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE POLICY "Xem tài liệu công khai" ON public.materials FOR SELECT USING (true); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE POLICY "Xem câu hỏi công khai" ON public.questions FOR SELECT USING (true); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE POLICY "Xem game quizzes công khai" ON public.game_quizzes FOR SELECT USING (true); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE POLICY "Xem game attempts công khai" ON public.game_attempts FOR SELECT USING (true); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE POLICY "Xem badges công khai" ON public.badges FOR SELECT USING (true); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE POLICY "Xem user badges công khai" ON public.user_badges FOR SELECT USING (true); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE POLICY "Xem custom games công khai" ON public.custom_games FOR SELECT USING (is_active = true); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE POLICY "Xem custom attempts công khai" ON public.custom_game_attempts FOR SELECT USING (true); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE POLICY "Xem game feedback công khai" ON public.game_ratings_feedback FOR SELECT USING (true); EXCEPTION WHEN duplicate_object THEN null; END $$;

-- 5. BƯỚC 1: NẠP 4 CHƯƠNG TRƯỚC
INSERT INTO public.chapters (id, number, title, description, icon, color) VALUES
('c1111111-1111-1111-1111-111111111111', 1, 'Chủ đề 1: Vật Lí Nhiệt', 'Mô hình cấu trúc chất, nội năng, định luật 1 NĐLH, nhiệt dung riêng, nhiệt nóng chảy và nhiệt hoá hơi.', 'Flame', 'from-amber-500 to-red-500'),
('c2222222-2222-2222-2222-222222222222', 2, 'Chủ đề 2: Khí Lí Tưởng', 'Mô hình động học phân tử chất khí, định luật Boyle, định luật Charles, phương trình trạng thái khí lí tưởng.', 'Wind', 'from-cyan-500 to-blue-500'),
('c3333333-3333-3333-3333-333333333333', 3, 'Chủ đề 3: Từ Trường', 'Từ trường, lực từ, cảm ứng từ, hiện tượng cảm ứng điện từ, dòng điện xoay chiều, máy biến áp.', 'Compass', 'from-yellow-400 to-amber-600'),
('c4444444-4444-4444-4444-444444444444', 4, 'Chủ đề 4: Vật Lí Hạt Nhân', 'Cấu tạo hạt nhân, năng lượng liên kết, phóng xạ hạt nhân, phản ứng phân hạch, nhiệt hạch và an toàn phóng xạ.', 'Atom', 'from-emerald-500 to-teal-600')
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description;

-- 6. BƯỚC 2: NẠP TOÀN BỘ CÁC BÀI HỌC (Để đảm bảo có đủ ID cho khóa ngoại)
-- Chương 1
INSERT INTO public.lessons (id, chapter_id, number, title, summary, key_formulas) VALUES
('b1111111-1111-1111-1111-111111111101', 'c1111111-1111-1111-1111-111111111111', 1, 'Bài 1: Cấu trúc của chất. Sự chuyển thể', 'Các thể của chất (rắn, lỏng, khí), mô hình động học phân tử, các quá trình chuyển thể.', '["Thể rắn: Phân tử dao động quanh VTCB"]'::jsonb),
('b1111111-1111-1111-1111-111111111102', 'c1111111-1111-1111-1111-111111111111', 2, 'Bài 2: Nội năng. Định luật I của nhiệt động lực học', 'Khái niệm nội năng, các cách làm biến đổi nội năng (thực hiện công, truyền nhiệt), định luật I NĐLH.', '["\\Delta U = A + Q"]'::jsonb),
('b1111111-1111-1111-1111-111111111103', 'c1111111-1111-1111-1111-111111111111', 3, 'Bài 3: Nhiệt độ. Thang nhiệt độ - nhiệt kế', 'Trạng thái cân bằng nhiệt, thang nhiệt độ Celsius và Kelvin.', '["T(K) = t(^\\circ C) + 273.15"]'::jsonb),
('b1111111-1111-1111-1111-111111111104', 'c1111111-1111-1111-1111-111111111111', 4, 'Bài 4: Nhiệt dung riêng, nhiệt nóng chảy riêng, nhiệt hoá hơi riêng', 'Định nghĩa và công thức tính nhiệt lượng trong các quá trình truyền nhiệt và chuyển thể.', '["Q = m c \\Delta t", "Q = \\lambda m", "Q = L m"]'::jsonb)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, summary = EXCLUDED.summary;

-- Chương 2
INSERT INTO public.lessons (id, chapter_id, number, title, summary, key_formulas) VALUES
('b2222222-2222-2222-2222-222222222201', 'c2222222-2222-2222-2222-222222222222', 8, 'Bài 8: Mô hình động học phân tử chất khí', 'Khí lí tưởng, chuyển động Brown, va chạm đàn hồi của phân tử khí với thành bình.', '["p = \\frac{1}{3}\\mu m \\bar{v^2}"]'::jsonb),
('b2222222-2222-2222-2222-222222222202', 'c2222222-2222-2222-2222-222222222222', 9, 'Bài 9: Định luật Boyle (Đẳng nhiệt)', 'Quá trình đẳng nhiệt của một lượng khí lí tưởng xác định.', '["p_1 V_1 = p_2 V_2"]'::jsonb),
('b2222222-2222-2222-2222-222222222203', 'c2222222-2222-2222-2222-222222222222', 10, 'Bài 10: Định luật Charles (Đẳng áp)', 'Quá trình đẳng áp của một lượng khí lí tưởng xác định.', '["\\frac{V_1}{T_1} = \\frac{V_2}{T_2}"]'::jsonb),
('b2222222-2222-2222-2222-222222222204', 'c2222222-2222-2222-2222-222222222222', 11, 'Bài 11: Phương trình trạng thái khí lí tưởng', 'Phương trình Clapeyron - Mendeleev và phương trình trạng thái khí lí tưởng.', '["p V = n R T"]'::jsonb)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, summary = EXCLUDED.summary;

-- Chương 3
INSERT INTO public.lessons (id, chapter_id, number, title, summary, key_formulas) VALUES
('b3333333-3333-3333-3333-333333333301', 'c3333333-3333-3333-3333-333333333333', 14, 'Bài 14: Từ trường', 'Từ trường của các dòng điện có dạng đặc biệt, đường sức từ, từ phổ.', '["Vào Nam ra Bắc"]'::jsonb),
('b3333333-3333-3333-3333-333333333302', 'c3333333-3333-3333-3333-333333333333', 15, 'Bài 15: Lực từ. Cảm ứng từ', 'Lực từ tác dụng lên đoạn dây dẫn mang dòng điện, quy tắc bàn tay trái.', '["F = B I L \\sin\\alpha"]'::jsonb),
('b3333333-3333-3333-3333-333333333303', 'c3333333-3333-3333-3333-333333333333', 16, 'Bài 16: Hiện tượng cảm ứng điện từ', 'Từ thông, định luật Faraday về cảm ứng điện từ, định luật Lenz.', '["e_c = -\\frac{\\Delta\\Phi}{\\Delta t}"]'::jsonb)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, summary = EXCLUDED.summary;

-- Chương 4
INSERT INTO public.lessons (id, chapter_id, number, title, summary, key_formulas) VALUES
('b4444444-4444-4444-4444-444444444401', 'c4444444-4444-4444-4444-444444444444', 19, 'Bài 19: Cấu tạo hạt nhân. Năng lượng liên kết', 'Proton, neutron, độ hụt khối, năng lượng liên kết riêng quyết định độ bền vững.', '["E = m c^2", "W_{lkr} = \\frac{W_{lk}}{A}"]'::jsonb),
('b4444444-4444-4444-4444-444444444402', 'c4444444-4444-4444-4444-444444444444', 20, 'Bài 20: Phóng xạ', 'Định luật phóng xạ, tia phóng xạ alpha, beta, gamma, chu kì bán rã.', '["N(t) = N_0 2^{-\\frac{t}{T}}"]'::jsonb)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, summary = EXCLUDED.summary;

-- 7. BƯỚC 3: NẠP 16 CÂU HỎI 4 CHỦ ĐỀ CHUẨN ĐỘ KHÓ
-- Xóa câu hỏi cũ nếu cần để nạp mới tinh:
DELETE FROM public.questions WHERE lesson_id LIKE 'b%';

-- Chủ đề 1: Vật Lí Nhiệt
INSERT INTO public.questions (lesson_id, type, content, options, correct_answer, explanation, difficulty) VALUES
('b1111111-1111-1111-1111-111111111101', 'multiple_choice', 'Theo thuyết động học phân tử, các phân tử cấu tạo nên chất rắn có đặc điểm chuyển động nào sau đây?', '["Chuyển động tự do hỗn loạn hoàn toàn không có phương hướng xác định", "Dao động xung quanh các vị trí cân bằng cố định xác định", "Dao động xung quanh các vị trí cân bằng luôn luôn dịch chuyển", "Hoàn toàn đứng yên bất động ở mọi nhiệt độ"]'::jsonb, '"B"'::jsonb, 'Theo mô hình động học phân tử: Ở thể rắn, các phân tử dao động quanh các vị trí cân bằng cố định xác định.', 'easy'),
('b1111111-1111-1111-1111-111111111104', 'multiple_choice', 'Nhiệt dung riêng $c$ của một chất là đại lượng có ý nghĩa vật lí nào sau đây?', '["Nhiệt lượng cần truyền để 1 kg chất đó tăng thêm $1\\text{ K}$ (hoặc $1^\\circ\\text{C}$)", "Nhiệt lượng cần cung cấp để 1 kg chất đó nóng chảy hoàn toàn ở nhiệt độ nóng chảy", "Nhiệt lượng cần cung cấp để 1 kg chất đó hoá hơi hoàn toàn ở nhiệt độ sôi", "Nội năng toàn phần chứa trong 1 kg khối lượng của chất đó"]'::jsonb, '"A"'::jsonb, 'Nhiệt dung riêng c là nhiệt lượng cần thiết để làm cho 1 kg chất tăng thêm 1 K (hoặc 1 độ C).', 'medium'),
('b1111111-1111-1111-1111-111111111102', 'multiple_choice', 'Một khối khí lí tưởng trong xilanh nhận nhiệt lượng $Q = 350\\text{ J}$, đồng thời dãn nở đẩy pit-tông sinh công $A'' = 200\\text{ J}$. Độ biến thiên nội năng $\\Delta U$ của khối khí là:', '["+550 J", "+150 J", "-150 J", "-550 J"]'::jsonb, '"B"'::jsonb, 'Khí nhận nhiệt lượng Q = +350 J. Khí sinh công A'' = 200 J => A = -200 J. Delta U = A + Q = -200 + 350 = +150 J.', 'hard'),
('b1111111-1111-1111-1111-111111111104', 'multiple_choice', 'Tính nhiệt lượng cần cung cấp để làm nóng chảy hoàn toàn $2\\text{ kg}$ nước đá ở $0^\\circ\\text{C}$, biết nhiệt nóng chảy riêng của nước đá là $\\lambda = 3.34 \\times 10^5\\text{ J/kg}$:', '["6.68 x 10^5 J", "3.34 x 10^5 J", "1.67 x 10^5 J", "6.68 x 10^4 J"]'::jsonb, '"A"'::jsonb, 'Áp dụng công thức Q = lambda * m = 3.34*10^5 * 2 = 6.68 * 10^5 J.', 'hard');

-- Chủ đề 2: Khí Lí Tưởng
INSERT INTO public.questions (lesson_id, type, content, options, correct_answer, explanation, difficulty) VALUES
('b2222222-2222-2222-2222-222222222201', 'multiple_choice', 'Trong mô hình động học phân tử chất khí lí tưởng, các phân tử khí được coi là:', '["Các chất điểm có thể tích riêng vô cùng lớn so với bình chứa", "Các chất điểm có khối lượng và chỉ tương tác với nhau khi va chạm", "Các hạt luôn luôn hút nhau với lực hấp dẫn rất mạnh ở khoảng cách xa", "Các vật rắn hình cầu đứng yên trong không gian bình chứa"]'::jsonb, '"B"'::jsonb, 'Các phân tử khí được coi là các chất điểm có khối lượng và chỉ tương tác khi va chạm đàn hồi.', 'easy'),
('b2222222-2222-2222-2222-222222222202', 'multiple_choice', 'Trong quá trình biến đổi đẳng nhiệt của một khối lượng khí lí tưởng xác định, đồ thị biểu diễn mối quan hệ giữa áp suất $p$ và thể tích $V$ trong hệ tọa độ $(p, V)$ có dạng là:', '["Một đường thẳng đi qua gốc tọa độ O", "Một nhánh của đường hyperbol", "Một đường thẳng song song với trục hoành OV", "Một đường elip khép kín"]'::jsonb, '"B"'::jsonb, 'Theo định luật Boyle: p*V = const nên đồ thị trong hệ (p,V) là một nhánh hyperbol.', 'medium'),
('b2222222-2222-2222-2222-222222222202', 'multiple_choice', 'Một khối khí lí tưởng có thể tích $V_1 = 6\\text{ lít}$ ở áp suất $p_1 = 1.5\\text{ bar}$. Nếu nén đẳng nhiệt khối khí đến thể tích $V_2 = 2\\text{ lít}$ thì áp suất $p_2$ của khí trong bình là:', '["4.5 bar", "3.0 bar", "0.5 bar", "2.25 bar"]'::jsonb, '"A"'::jsonb, 'Áp dụng định luật Boyle: p2 = (p1*V1)/V2 = (1.5*6)/2 = 4.5 bar.', 'hard'),
('b2222222-2222-2222-2222-222222222204', 'multiple_choice', 'Tính thể tích $V$ của $1\\text{ mol}$ khí lí tưởng ở điều kiện tiêu chuẩn nhiệt độ $T = 273.15\\text{ K}$ ($0^\\circ\\text{C}$) và áp suất $p = 10^5\\text{ Pa}$, lấy $R = 8.314\\text{ J/mol.K}$:', '["22.71 lít (0.02271 m³)", "24.79 lít (0.02479 m³)", "22.40 lít (0.02240 m³)", "18.50 lít (0.01850 m³)"]'::jsonb, '"A"'::jsonb, 'V = (nRT)/p = (1 * 8.314 * 273.15) / 10^5 = 0.02271 m3 = 22.71 lít.', 'hard');

-- Chủ đề 3: Từ Trường
INSERT INTO public.questions (lesson_id, type, content, options, correct_answer, explanation, difficulty) VALUES
('b3333333-3333-3333-3333-333333333301', 'multiple_choice', 'Đường sức từ của một nam châm thẳng bên ngoài thanh nam châm có quy ước chiều như thế nào?', '["Đi vào từ cực Bắc (N) và đi ra ở cực Nam (S)", "Đi vào từ cực Nam (S) và đi ra ở cực Bắc (N)", "Đi từ tâm nam châm tỏa đều ra vô cực", "Đều hướng vuông góc với trục của thanh nam châm"]'::jsonb, '"B"'::jsonb, 'Quy ước chiều của đường sức từ bên ngoài nam châm: Vào Nam (S) - Ra Bắc (N).', 'easy'),
('b3333333-3333-3333-3333-333333333302', 'multiple_choice', 'Để xác định chiều của lực từ $\\vec{F}$ tác dụng lên một đoạn dây dẫn mang dòng điện đặt trong từ trường đều, ta sử dụng quy tắc nào sau đây?', '["Quy tắc bàn tay phải", "Quy tắc bàn tay trái", "Quy tắc cái đinh ốc", "Quy tắc nắm tay phải"]'::jsonb, '"B"'::jsonb, 'Sử dụng quy tắc bàn tay trái để xác định chiều của lực từ tác dụng lên đoạn dây dẫn mang dòng điện.', 'medium'),
('b3333333-3333-3333-3333-333333333302', 'multiple_choice', 'Một đoạn dây dẫn thẳng dài $L = 0.5\\text{ m}$ mang dòng điện $I = 4\\text{ A}$ đặt vuông góc với vectơ cảm ứng từ của từ trường đều có độ lớn $B = 0.25\\text{ T}$. Độ lớn lực từ tác dụng lên đoạn dây là:', '["0.5 N", "0.25 N", "1.0 N", "0.1 N"]'::jsonb, '"A"'::jsonb, 'F = B*I*L*sin(90) = 0.25 * 4 * 0.5 = 0.5 N.', 'hard'),
('b3333333-3333-3333-3333-333333333303', 'multiple_choice', 'Một khung dây phẳng có diện tích $S = 20\\text{ cm}^2$ ($2 \\times 10^{-3}\\text{ m}^2$) đặt trong từ trường đều có $B = 0.05\\text{ T}$. Từ thông cực đại $\\Phi_0$ gửi qua khung dây khi mặt phẳng khung vuông góc với đường sức từ là:', '["1.0 x 10^-4 Wb", "2.0 x 10^-4 Wb", "4.0 x 10^-4 Wb", "1.0 x 10^-3 Wb"]'::jsonb, '"A"'::jsonb, 'Phi = B*S*cos(0) = 0.05 * 2*10^-3 = 1.0 * 10^-4 Wb.', 'hard');

-- Chủ đề 4: Vật Lí Hạt Nhân
INSERT INTO public.questions (lesson_id, type, content, options, correct_answer, explanation, difficulty) VALUES
('b4444444-4444-4444-4444-444444444401', 'multiple_choice', 'Hạt nhân nguyên tử $^{238}_{92}\\text{U}$ có cấu tạo gồm bao nhiêu hạt proton và bao nhiêu hạt neutron?', '["92 proton và 146 neutron", "92 proton và 238 neutron", "146 proton và 92 neutron", "238 proton và 92 neutron"]'::jsonb, '"A"'::jsonb, 'Z = 92 proton, N = A - Z = 238 - 92 = 146 neutron.', 'easy'),
('b4444444-4444-4444-4444-444444444401', 'multiple_choice', 'Đại lượng nào sau đây quyết định trực tiếp mức độ bền vững của một hạt nhân nguyên tử?', '["Năng lượng liên kết riêng $W_{lkr} = \\frac{W_{lk}}{A}$", "Năng lượng liên kết toàn phần $W_{lk}$", "Khối lượng toàn phần của hạt nhân $m_X$", "Độ hụt khối toàn phần $\\Delta m$"]'::jsonb, '"A"'::jsonb, 'Năng lượng liên kết riêng (tính trên 1 nucleon) là đại lượng đặc trưng cho độ bền vững của hạt nhân.', 'medium'),
('b4444444-4444-4444-4444-444444444402', 'multiple_choice', 'Chất phóng xạ Radon $^{222}_{86}\\text{Rn}$ có chu kì bán rã $T = 3.8\\text{ ngày}$. Sau thời gian $t = 11.4\\text{ ngày}$, tỉ lệ phần trăm số hạt nhân Radon còn lại chưa bị phân rã là:', '["12.5%", "25.0%", "50.0%", "6.25%"]'::jsonb, '"A"'::jsonb, 'k = 11.4 / 3.8 = 3 chu kì => N/N0 = 2^(-3) = 1/8 = 12.5%.', 'hard'),
('b4444444-4444-4444-4444-444444444401', 'multiple_choice', 'Biết độ hụt khối của hạt nhân Heli $^4_2\\text{He}$ là $\\Delta m = 0.0304\\text{ amu}$. Lấy $1\\text{ amu} \\cdot c^2 \\approx 931.5\\text{ MeV}$. Năng lượng liên kết riêng của hạt nhân Heli là:', '["7.08 MeV/nucleon", "28.32 MeV/nucleon", "14.16 MeV/nucleon", "3.54 MeV/nucleon"]'::jsonb, '"A"'::jsonb, 'W_lk = 0.0304 * 931.5 = 28.318 MeV => W_lkr = 28.318 / 4 = 7.08 MeV/nucleon.', 'hard');
