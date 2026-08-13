import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { curriculumService } from '../../services/curriculumService';
import { Chapter, Lesson } from '../../types';
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
  Award
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

  return (
    <div className="space-y-16 pb-16">
      
      {/* Hero Section - Clean Academic White */}
      <section className="relative overflow-hidden rounded-3xl bg-white border border-slate-200/90 p-8 sm:p-12 lg:p-16 shadow-soft">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-sky-100/60 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 rounded-full bg-blue-100/60 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-50 border border-sky-200 text-sky-700 text-xs font-bold tracking-wide shadow-xs">
            <Sparkles className="w-4 h-4 text-sky-600" />
            <span>CHUẨN CHƯƠNG TRÌNH SGK KẾT NỐI TRI THỨC VỚI CUỘC SỐNG 2025-2026</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.15]">
            Học & Ôn Luyện Trò Chơi <br />
            <span className="bg-gradient-to-r from-sky-600 via-blue-700 to-indigo-800 bg-clip-text text-transparent">
              VẬT LÍ 12 CHUYÊN SÂU
            </span>
          </h1>

          <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-2xl">
            Hệ thống hóa toàn bộ kiến thức theo chuẩn phân cấp <strong className="text-slate-900 font-bold">CHƯƠNG → BÀI</strong>. Ôn tập hiệu quả qua 3 định dạng trò chơi tương tác: Trắc nghiệm tốc độ, Câu hỏi Đúng/Sai chuẩn cấu trúc Bộ GD&ĐT 2025 và Đấu ghép nối công thức.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              to="/curriculum"
              className="flex items-center gap-2 px-6 py-3.5 rounded-2xl font-extrabold text-sm bg-sky-600 hover:bg-sky-500 text-white shadow-md shadow-sky-600/25 transition active:scale-95"
            >
              <BookOpen className="w-5 h-5" />
              <span>Khám Phá Chương - Bài SGK</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/games"
              className="flex items-center gap-2 px-6 py-3.5 rounded-2xl font-bold text-sm bg-slate-100 hover:bg-slate-200/80 text-slate-800 border border-slate-200 transition"
            >
              <Gamepad2 className="w-5 h-5 text-sky-600" />
              <span>Vào Đấu Trường Game</span>
            </Link>
          </div>

          {/* Quick Metrics */}
          <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-slate-600 font-semibold border-t border-slate-100">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0" />
              <span>4 Chương SGK KNTT</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0" />
              <span>16+ Bài học chi tiết</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>3 Dạng game chuẩn thi</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Kho học liệu số</span>
            </div>
          </div>
        </div>
      </section>

      {/* LỘ TRÌNH CHƯƠNG - BÀI TRỰC QUAN NGAY TRÊN TRANG CHỦ */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-sky-50 text-sky-700 border border-sky-200 mb-2">
              <Compass className="w-3.5 h-3.5 text-sky-600" />
              <span>CẤU TRÚC PHÂN CẤP CHƯƠNG TRÌNH</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Trình Tự Học Tập: CHƯƠNG → BÀI
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Nhấp chọn từng Chương bên dưới để xem danh sách các Bài học thành phần tương ứng
            </p>
          </div>

          <Link
            to="/curriculum"
            className="inline-flex items-center gap-1 text-xs font-bold text-sky-700 hover:text-sky-800 transition"
          >
            <span>Mở trang danh mục đầy đủ</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* 4 Chapter Selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {chapters.map((ch) => {
            const isSelected = ch.id === activeChapter?.id;
            const lessonCount = allLessons.filter(l => l.chapter_id === ch.id).length;
            return (
              <button
                key={ch.id}
                onClick={() => setActiveChapterId(ch.id)}
                className={`p-4 rounded-2xl border text-left flex items-start gap-3 transition-all ${
                  isSelected
                    ? 'bg-sky-50/90 border-sky-400 shadow-md ring-2 ring-sky-400/20'
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 shadow-xs'
                }`}
              >
                <span className={`w-8 h-8 rounded-xl font-mono text-xs flex items-center justify-center font-extrabold shrink-0 border ${
                  isSelected ? 'bg-sky-600 text-white border-sky-600' : 'bg-slate-100 text-slate-700 border-slate-200'
                }`}>
                  0{ch.number}
                </span>
                <div className="overflow-hidden">
                  <div className="text-[10px] font-bold uppercase text-slate-400">
                    Chương {ch.number} • {lessonCount} bài
                  </div>
                  <div className={`text-sm font-bold truncate ${isSelected ? 'text-slate-900' : 'text-slate-700'}`}>
                    {ch.title.replace(`Chương ${ch.number}: `, '')}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Chapter Lessons Showcase */}
        {activeChapter && (
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-soft space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
              <div>
                <span className="text-xs font-black text-sky-700 uppercase tracking-wider">
                  NỘI DUNG CHI TIẾT CHƯƠNG 0{activeChapter.number}
                </span>
                <h3 className="text-xl font-extrabold text-slate-900 mt-1">
                  {activeChapter.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
                  {activeChapter.description}
                </p>
              </div>

              <Link
                to={`/games?chapter=${activeChapter.id}`}
                className="self-start sm:self-auto flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-sky-600 text-white hover:bg-sky-500 shadow-sm transition"
              >
                <Gamepad2 className="w-4 h-4" />
                <span>Chơi Game Toàn Chương</span>
              </Link>
            </div>

            {/* List of lessons in this chapter */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeLessons.map((ls) => (
                <div
                  key={ls.id}
                  className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200 hover:border-sky-300 hover:bg-white transition-all duration-200 flex flex-col justify-between space-y-3 group"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-lg text-xs font-black bg-sky-100 text-sky-800 border border-sky-200">
                        Bài 0{ls.number}
                      </span>
                      <Link
                        to={`/materials?lesson=${ls.id}`}
                        className="text-[11px] font-bold text-slate-500 hover:text-sky-700 flex items-center gap-1"
                      >
                        <FolderDown className="w-3 h-3 text-sky-600" /> Học liệu
                      </Link>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 group-hover:text-sky-700 transition">
                      {ls.title}
                    </h4>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {ls.summary}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs">
                    <Link
                      to={`/curriculum/${ls.id}`}
                      className="font-bold text-slate-600 hover:text-sky-700 flex items-center gap-1"
                    >
                      <FileText className="w-3.5 h-3.5 text-sky-600" />
                      <span>Xem lý thuyết</span>
                    </Link>
                    <Link
                      to={`/games?lesson=${ls.id}`}
                      className="font-bold text-sky-700 hover:text-sky-800 flex items-center gap-1 bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-xs"
                    >
                      <Gamepad2 className="w-3.5 h-3.5 text-sky-600" />
                      <span>Luyện game</span>
                      <ChevronRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* 3 Game Formats Spotlight */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            3 Định Dạng Trò Chơi Vật Lí Độc Đáo
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Tối ưu hóa theo cấu trúc định dạng thi tốt nghiệp THPT mới và phương pháp dạy học tích cực
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: Multiple Choice */}
          <div className="group rounded-3xl p-6 bg-white border border-slate-200/90 shadow-soft hover:shadow-card-hover hover:border-sky-300 transition-all duration-300 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-600 flex items-center justify-center group-hover:scale-110 transition shadow-xs">
                <Zap className="w-6 h-6" />
              </div>
              <div className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-sky-50 text-sky-700 border border-sky-200">
                Dạng 1: Tốc độ & Phản xạ
              </div>
              <h3 className="text-lg font-bold text-slate-900">Trắc Nghiệm 4 Đáp Án</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Vượt chướng ngại vật với đồng hồ đếm ngược, nhân hệ số combo điểm XP, tính toán nhanh công thức với hỗ trợ KaTeX.
              </p>
            </div>
            <Link
              to="/games?type=multiple_choice"
              className="inline-flex items-center gap-1 text-xs font-bold text-sky-700 hover:text-sky-800 pt-2 border-t border-slate-100 transition"
            >
              <span>Chơi thử dạng này</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Card 2: True/False Matrix */}
          <div className="group rounded-3xl p-6 bg-white border border-slate-200/90 shadow-soft hover:shadow-card-hover hover:border-amber-300 transition-all duration-300 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center group-hover:scale-110 transition shadow-xs">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                Dạng 2: Chuẩn Cấu Trúc Bộ GD&ĐT
              </div>
              <h3 className="text-lg font-bold text-slate-900">Câu Hỏi Đúng / Sai 4 Ý</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Đánh giá toàn diện 4 mệnh đề trong 1 hiện tượng vật lí. Tính điểm chuẩn theo quy định thi tốt nghiệp THPT 2025.
              </p>
            </div>
            <Link
              to="/games?type=true_false"
              className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 hover:text-amber-800 pt-2 border-t border-slate-100 transition"
            >
              <span>Chơi thử dạng này</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Card 3: Matching Pairs */}
          <div className="group rounded-3xl p-6 bg-white border border-slate-200/90 shadow-soft hover:shadow-card-hover hover:border-indigo-300 transition-all duration-300 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition shadow-xs">
                <Layers className="w-6 h-6" />
              </div>
              <div className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                Dạng 3: Ghép Cặp Tương Tác
              </div>
              <h3 className="text-lg font-bold text-slate-900">Đấu Ghép Nối Vật Lí</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Khớp nối khái niệm với công thức, hiện tượng với bản chất vật lí, đơn vị đo. Trực quan và ghi nhớ sâu kiến thức.
              </p>
            </div>
            <Link
              to="/games?type=matching"
              className="inline-flex items-center gap-1 text-xs font-bold text-indigo-700 hover:text-indigo-800 pt-2 border-t border-slate-100 transition"
            >
              <span>Chơi thử dạng này</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

        </div>
      </section>

      {/* Teacher / Student Role Hub */}
      <section className="p-8 sm:p-10 rounded-3xl bg-white border border-slate-200/90 shadow-soft">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-sky-50 text-sky-700 border border-sky-200">
              <Users className="w-3.5 h-3.5 text-sky-600" />
              <span>DÀNH CHO GIÁO VIÊN & HỌC SINH</span>
            </div>
            <h3 className="text-2xl font-black text-slate-900">
              Đồng Bộ Học Liệu - Quản Lý Lớp & Theo Dõi Tiến Độ
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Cô Quỳnh và các thầy cô có thể dễ dàng tải lên học liệu bài giảng (PDF, video thí nghiệm PhET), tạo lớp học phát mã mời, và tạo ngân hàng đề game để cả lớp cùng thi đấu.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                to="/classes"
                className="px-4 py-2.5 rounded-xl font-bold text-xs bg-sky-600 hover:bg-sky-500 text-white shadow-sm transition"
              >
                Quản lý lớp học
              </Link>
              <Link
                to="/materials"
                className="px-4 py-2.5 rounded-xl font-bold text-xs bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 transition"
              >
                Kho tài liệu học liệu
              </Link>
            </div>
          </div>

          <div className="space-y-3">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between hover:border-amber-300 transition">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center font-bold">
                  <Flame className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900">Bảng Xếp Hạng & Huy Hiệu XP</div>
                  <div className="text-xs text-slate-500">Thi đua tích điểm và duy trì chuỗi học tập hàng ngày</div>
                </div>
              </div>
              <Link to="/leaderboard" className="text-xs font-bold text-sky-700 hover:underline">
                Xem BXH
              </Link>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between hover:border-emerald-300 transition">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900">Studio Soạn Đề & Câu Hỏi Tương Tác</div>
                  <div className="text-xs text-slate-500">Tạo đề thi 3 dạng và phát mã PIN thi đấu</div>
                </div>
              </div>
              <Link to="/studio" className="text-xs font-bold text-emerald-700 hover:underline">
                Mở Studio
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

