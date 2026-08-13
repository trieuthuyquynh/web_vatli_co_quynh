import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { curriculumService } from '../../services/curriculumService';
import { Chapter, Lesson, Badge } from '../../types';
import { INITIAL_BADGES } from '../../data/initialCurriculum';
import { 
  Atom, 
  Gamepad2, 
  BookOpen, 
  Flame, 
  Sparkles, 
  Trophy, 
  Users, 
  ArrowRight, 
  CheckCircle2, 
  FileText, 
  Layers, 
  Play,
  Zap,
  GraduationCap,
  ChevronRight,
  FolderDown,
  Compass,
  Award,
  Heart,
  Star,
  ShieldCheck,
  TrendingUp,
  Radio,
  Timer,
  Wind
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const { user } = useAuth();
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [allLessons, setAllLessons] = useState<Lesson[]>([]);
  const [activeChapterId, setActiveChapterId] = useState<string>('');

  useEffect(() => {
    async function loadHomeData() {
      const [chs, lss] = await Promise.all([
        curriculumService.getChapters(),
        curriculumService.getLessonsByChapter()
      ]);
      setChapters(chs);
      setAllLessons(lss);
      if (chs.length > 0) {
        setActiveChapterId(chs[0].id);
      }
    }
    loadHomeData();
  }, []);

  const activeChapter = chapters.find(c => c.id === activeChapterId) || chapters[0];
  const activeLessons = allLessons.filter(l => l.chapter_id === activeChapter?.id);

  // Tính toán level và tiến trình XP của người dùng
  const userXp = user?.xp || 350;
  const userLevel = Math.floor(userXp / 200) + 1;
  const currentLevelXp = userXp % 200;
  const levelProgress = Math.min(Math.round((currentLevelXp / 200) * 100), 100);

  const getRankTitle = (lvl: number) => {
    if (lvl <= 1) return 'Tân Binh Newton 🍏';
    if (lvl === 2) return 'Tập Sự Faraday 🧲';
    if (lvl === 3) return 'Hiệp Sĩ Maxwell ⚡';
    if (lvl === 4) return 'Bác Học Einstein ⚛️';
    return 'Huyền Thoại Vật Lí 🌌';
  };

  return (
    <div className="space-y-12 pb-16">
      
      {/* 1. GAMIFICATION HERO & USER PROGRESS HUB */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 text-white p-6 sm:p-10 lg:p-12 shadow-2xl border border-slate-700/60">
        {/* Glow Background Orbs */}
        <div className="absolute top-0 right-0 -mr-24 -mt-24 w-96 h-96 rounded-full bg-sky-500/20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-24 -mb-24 w-96 h-96 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Main Hero Info (7 cols) */}
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-500/20 border border-sky-400/40 text-sky-300 text-xs font-black tracking-wide shadow-inner">
              <Sparkles className="w-4 h-4 text-sky-400 animate-pulse" />
              <span>CHUẨN SGK VẬT LÍ 12 KẾT NỐI TRI THỨC VỚI CUỘC SỐNG</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-[1.15] text-white">
              Đấu Trường Trò Chơi <br />
              <span className="bg-gradient-to-r from-sky-400 via-cyan-300 to-emerald-400 bg-clip-text text-transparent">
                VẬT LÍ 12 GAMIFICATION
              </span>
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-xl">
              Chinh phục 4 Chủ đề Vật Lí 12 qua các màn đấu trí trắc nghiệm tốc độ, tính toán công thức thực tế, giải mã ô chữ và lật thẻ tương tác như Kahoot & Quizizz!
            </p>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                to="/games"
                className="flex items-center gap-2.5 px-6 py-3.5 rounded-2xl font-black text-sm bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white shadow-lg shadow-sky-500/30 transition transform active:scale-95"
              >
                <Gamepad2 className="w-5 h-5" />
                <span>Vào Đấu Trường Ngay</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to="/curriculum"
                className="flex items-center gap-2 px-5 py-3.5 rounded-2xl font-bold text-sm bg-slate-800/90 hover:bg-slate-700/90 text-slate-200 border border-slate-600 transition"
              >
                <BookOpen className="w-4 h-4 text-sky-400" />
                <span>Khám Phá 4 Chủ Đề</span>
              </Link>
            </div>
          </div>

          {/* Gamified User Card Widget (5 cols) */}
          <div className="lg:col-span-5">
            <div className="rounded-2xl bg-slate-800/80 backdrop-blur-md border border-slate-700 p-5 sm:p-6 shadow-xl space-y-4">
              
              {/* User Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center font-black text-lg text-white shadow-md">
                      {user?.full_name?.charAt(0) || 'P'}
                    </div>
                    <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-slate-800 flex items-center justify-center text-[10px] font-black">
                      {userLevel}
                    </span>
                  </div>
                  <div>
                    <div className="font-extrabold text-sm text-white flex items-center gap-1.5">
                      <span>{user?.full_name || 'Học Viên Vật Lí'}</span>
                      <ShieldCheck className="w-4 h-4 text-sky-400" />
                    </div>
                    <div className="text-xs font-bold text-amber-400">
                      {getRankTitle(userLevel)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-bold">
                    <Flame className="w-4 h-4 text-amber-400 fill-amber-400" />
                    <span>{user?.streak || 3} Ngày</span>
                  </div>
                </div>
              </div>

              {/* XP Progress Bar */}
              <div className="space-y-1.5 pt-1">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-300">Cấp độ {userLevel} → Cấp độ {userLevel + 1}</span>
                  <span className="text-sky-400">{userXp} XP ({levelProgress}%)</span>
                </div>
                <div className="h-3 w-full bg-slate-900/90 rounded-full overflow-hidden p-0.5 border border-slate-700">
                  <div 
                    className="h-full bg-gradient-to-r from-sky-400 to-emerald-400 rounded-full transition-all duration-500 shadow-sm"
                    style={{ width: `${levelProgress}%` }}
                  />
                </div>
              </div>

              {/* Mini Stats Matrix */}
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-700/60 text-center">
                <div className="p-2 rounded-xl bg-slate-900/50 border border-slate-700/40">
                  <div className="flex items-center justify-center gap-1 text-red-400 text-xs font-bold">
                    <Heart className="w-3.5 h-3.5 fill-red-400" /> 3 Tim
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Sinh lực đấu</div>
                </div>

                <div className="p-2 rounded-xl bg-slate-900/50 border border-slate-700/40">
                  <div className="flex items-center justify-center gap-1 text-amber-400 text-xs font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400" /> 16/16
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Câu hỏi chuẩn</div>
                </div>

                <div className="p-2 rounded-xl bg-slate-900/50 border border-slate-700/40">
                  <div className="flex items-center justify-center gap-1 text-sky-400 text-xs font-bold">
                    <Trophy className="w-3.5 h-3.5" /> Top 1
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Xếp hạng</div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* 2. 4 CHỦ ĐỀ SGK VẬT LÍ 12 - GAMIFIED TOPIC CARDS */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-sky-50 text-sky-700 border border-sky-200 mb-1.5">
              <Compass className="w-3.5 h-3.5 text-sky-600" />
              <span>HỆ THỐNG 4 CHỦ ĐỀ TRỌNG TÂM</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Chọn Chủ Đề Để Chinh Phục
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Mỗi chủ đề gồm 4 câu hỏi phân bổ đầy đủ 3 cấp độ: Nhận biết, Thông hiểu và Vận dụng
            </p>
          </div>

          <Link
            to="/curriculum"
            className="inline-flex items-center gap-1 text-xs font-bold text-sky-600 hover:text-sky-700 transition"
          >
            <span>Xem toàn bộ mục lục SGK</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* 4 Large Interactive Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {chapters.map((ch, idx) => {
            const isSelected = ch.id === activeChapter?.id;
            const lessonCount = allLessons.filter(l => l.chapter_id === ch.id).length;

            const gradients = [
              'from-amber-500 to-orange-600',
              'from-sky-500 to-blue-600',
              'from-indigo-500 to-purple-600',
              'from-emerald-500 to-teal-600'
            ];
            const borderColors = [
              'hover:border-amber-400',
              'hover:border-sky-400',
              'hover:border-indigo-400',
              'hover:border-emerald-400'
            ];
            const badgeBg = [
              'bg-amber-50 text-amber-800 border-amber-200',
              'bg-sky-50 text-sky-800 border-sky-200',
              'bg-indigo-50 text-indigo-800 border-indigo-200',
              'bg-emerald-50 text-emerald-800 border-emerald-200'
            ];

            return (
              <div
                key={ch.id}
                onClick={() => setActiveChapterId(ch.id)}
                className={`group cursor-pointer rounded-3xl p-5 bg-white border transition-all duration-300 flex flex-col justify-between space-y-4 shadow-sm hover:shadow-xl hover:-translate-y-1 ${
                  isSelected ? 'ring-2 ring-sky-500 border-sky-400 shadow-md' : 'border-slate-200 ' + borderColors[idx % 4]
                }`}
              >
                <div className="space-y-3">
                  {/* Top Badge & Number */}
                  <div className="flex items-center justify-between">
                    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-black border ${badgeBg[idx % 4]}`}>
                      Chủ đề 0{ch.number}
                    </span>
                    <span className="text-xs font-bold text-slate-400">
                      {lessonCount} bài học
                    </span>
                  </div>

                  {/* Icon Header */}
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${gradients[idx % 4]} text-white flex items-center justify-center shadow-md group-hover:scale-105 transition`}>
                    {idx === 0 && <Flame className="w-7 h-7" />}
                    {idx === 1 && <Wind className="w-7 h-7" />}
                    {idx === 2 && <Compass className="w-7 h-7" />}
                    {idx === 3 && <Atom className="w-7 h-7" />}
                  </div>

                  {/* Title & Description */}
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900 group-hover:text-sky-600 transition">
                      {ch.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                      {ch.description}
                    </p>
                  </div>

                  {/* 3 Difficulty Badges */}
                  <div className="flex items-center gap-1.5 pt-1 text-[10px] font-bold">
                    <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Nhận biết
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200">
                      Thông hiểu
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 border border-rose-200">
                      Vận dụng
                    </span>
                  </div>
                </div>

                {/* Bottom Action CTA */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <Link
                    to={`/curriculum`}
                    onClick={(e) => { e.stopPropagation(); }}
                    className="text-xs font-bold text-slate-600 hover:text-sky-600"
                  >
                    Xem bài
                  </Link>

                  <Link
                    to={`/games/play?chapter=${ch.id}&type=multiple_choice`}
                    onClick={(e) => { e.stopPropagation(); }}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-extrabold text-xs text-white bg-gradient-to-r ${gradients[idx % 4]} shadow-sm hover:opacity-90 transition`}
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>Đấu Trí</span>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Chapter Quick Lessons Drawer */}
        {activeChapter && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs font-black text-sky-600 uppercase tracking-wider">
                  NỘI DUNG CHI TIẾT: {activeChapter.title}
                </span>
                <p className="text-xs text-slate-500 mt-0.5">
                  Chọn một bài học cụ thể để xem tóm tắt lý thuyết, công thức LaTeX và làm bài luyện tập
                </p>
              </div>

              <Link
                to={`/games/play?chapter=${activeChapter.id}`}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-sky-600 hover:bg-sky-500 text-white shadow-sm transition"
              >
                <Gamepad2 className="w-4 h-4" />
                <span>Chơi Game Trọn Bộ Chủ Đề</span>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {activeLessons.map((ls) => (
                <div
                  key={ls.id}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:bg-white hover:border-sky-300 hover:shadow-sm transition flex flex-col justify-between space-y-2 group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="px-2 py-0.5 rounded-lg text-xs font-black bg-sky-100 text-sky-800 shrink-0">
                      Bài {ls.number}
                    </span>
                    <Link
                      to={`/materials?lesson=${ls.id}`}
                      className="text-[11px] font-bold text-slate-500 hover:text-sky-600 flex items-center gap-1"
                    >
                      <FolderDown className="w-3 h-3 text-sky-500" /> Học liệu
                    </Link>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900 group-hover:text-sky-600 transition">
                    {ls.title}
                  </h4>

                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {ls.summary}
                  </p>

                  <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs font-bold">
                    <Link
                      to={`/curriculum/${ls.id}`}
                      className="text-slate-600 hover:text-sky-600 flex items-center gap-1"
                    >
                      <FileText className="w-3.5 h-3.5 text-sky-500" />
                      <span>Lý thuyết</span>
                    </Link>

                    <Link
                      to={`/games/play?lesson=${ls.id}&type=multiple_choice`}
                      className="text-sky-600 hover:text-sky-700 flex items-center gap-1 bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-2xs"
                    >
                      <Play className="w-3 h-3 fill-sky-600" />
                      <span>Luyện game</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* 3. GAMIFIED 3 MODES OF LEARNING (Kahoot Style) */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
            3 Định Dạng Đấu Trí Chuẩn Đổi Mới GD
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Học Vật Lí tương tác cao với âm thanh sinh động, thanh máu, đếm ngược và lời giải KaTeX
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Mode 1: Multiple Choice */}
          <div className="group rounded-3xl p-6 bg-white border border-slate-200 shadow-sm hover:shadow-xl hover:border-sky-300 transition flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-600 flex items-center justify-center group-hover:scale-110 transition shadow-xs">
                <Zap className="w-6 h-6" />
              </div>
              <div className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black bg-sky-50 text-sky-700 border border-sky-200">
                DẠNG 1: TỐC ĐỘ & COMBO
              </div>
              <h3 className="text-lg font-bold text-slate-900">Trắc Nghiệm 4 Đáp Án</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Đồng hồ đếm ngược 30s, 3 tim sinh lực, hiệu ứng âm thanh tức thì và combo nhân XP liên tục.
              </p>
            </div>
            <Link
              to="/games/play?type=multiple_choice"
              className="inline-flex items-center gap-1.5 text-xs font-black text-sky-600 hover:text-sky-700 pt-2 border-t border-slate-100 transition"
            >
              <span>Vào Chơi Ngay</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Mode 2: True/False */}
          <div className="group rounded-3xl p-6 bg-white border border-slate-200 shadow-sm hover:shadow-xl hover:border-amber-300 transition flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center group-hover:scale-110 transition shadow-xs">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-50 text-amber-700 border border-amber-200">
                DẠNG 2: CHUẨN ĐỀ THI 2025
              </div>
              <h3 className="text-lg font-bold text-slate-900">Đúng / Sai 4 Ý Bộ GD&ĐT</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Đánh giá toàn diện 4 mệnh đề thực tế trong một hiện tượng vật lí với thang điểm 0.1 - 0.25 - 0.5 - 1.0.
              </p>
            </div>
            <Link
              to="/games/play?type=true_false"
              className="inline-flex items-center gap-1.5 text-xs font-black text-amber-600 hover:text-amber-700 pt-2 border-t border-slate-100 transition"
            >
              <span>Vào Chơi Ngay</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Mode 3: Matching */}
          <div className="group rounded-3xl p-6 bg-white border border-slate-200 shadow-sm hover:shadow-xl hover:border-indigo-300 transition flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition shadow-xs">
                <Layers className="w-6 h-6" />
              </div>
              <div className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black bg-indigo-50 text-indigo-700 border border-indigo-200">
                DẠNG 3: GHÉP CẶP CÔNG THỨC
              </div>
              <h3 className="text-lg font-bold text-slate-900">Đấu Ghép Nối Khái Niệm</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Kéo thả nối các đại lượng, công thức toán học và đơn vị SI chuẩn để ghi nhớ sâu bản chất vật lí.
              </p>
            </div>
            <Link
              to="/games/play?type=matching"
              className="inline-flex items-center gap-1.5 text-xs font-black text-indigo-600 hover:text-indigo-700 pt-2 border-t border-slate-100 transition"
            >
              <span>Vào Chơi Ngay</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

        </div>
      </section>

      {/* 4. LEADERBOARD & BADGES MINI SHOWCASE */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Badges Showcase */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              <h3 className="font-extrabold text-slate-900 text-base">Huy Hiệu Danh Dự Của Bạn</h3>
            </div>
            <Link to="/profile" className="text-xs font-bold text-sky-600 hover:underline">
              Xem tất cả
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {INITIAL_BADGES.slice(0, 3).map((badge) => (
              <div 
                key={badge.id}
                className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 text-center space-y-1 hover:border-amber-300 transition"
              >
                <div className="w-10 h-10 mx-auto rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center font-bold shadow-xs">
                  {badge.icon === 'Compass' && <Compass className="w-5 h-5" />}
                  {badge.icon === 'Flame' && <Flame className="w-5 h-5" />}
                  {badge.icon === 'Zap' && <Zap className="w-5 h-5" />}
                  {badge.icon === 'Atom' && <Atom className="w-5 h-5" />}
                  {badge.icon === 'Trophy' && <Trophy className="w-5 h-5" />}
                </div>
                <div className="text-xs font-bold text-slate-800 line-clamp-1">{badge.title}</div>
                <div className="text-[10px] text-slate-500 line-clamp-1">{badge.description}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Mini Leaderboard */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-sky-600" />
              <h3 className="font-extrabold text-slate-900 text-base">Bảng Vàng Thi Đua Tuần Này</h3>
            </div>
            <Link to="/leaderboard" className="text-xs font-bold text-sky-600 hover:underline">
              Toàn bộ BXH
            </Link>
          </div>

          <div className="space-y-2.5">
            {[
              { name: 'Nguyễn Minh Quân', class: '12A1 KNTT', xp: 1450, medal: '🥇' },
              { name: 'Trần Thu Hà', class: '12 Lý Chuyên', xp: 1280, medal: '🥈' },
              { name: 'Lê Hoàng Nam', class: '12A3', xp: 950, medal: '🥉' }
            ].map((st, i) => (
              <div key={i} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200/60 text-xs">
                <div className="flex items-center gap-2.5">
                  <span className="text-lg">{st.medal}</span>
                  <div>
                    <div className="font-bold text-slate-900">{st.name}</div>
                    <div className="text-[10px] text-slate-400">{st.class}</div>
                  </div>
                </div>
                <span className="font-black text-sky-600 bg-sky-50 px-2.5 py-1 rounded-lg border border-sky-200">
                  {st.xp} XP
                </span>
              </div>
            ))}
          </div>
        </div>

      </section>

    </div>
  );
};
