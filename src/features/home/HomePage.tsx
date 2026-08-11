import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { curriculumService } from '../../services/curriculumService';
import { Chapter } from '../../types';
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
  Zap
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const { user } = useAuth();
  const [chapters, setChapters] = useState<Chapter[]>([]);

  useEffect(() => {
    curriculumService.getChapters().then(setChapters);
  }, []);

  return (
    <div className="space-y-16 pb-12">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-slate-900 via-[#0E1726] to-[#0B0F19] border border-slate-800 p-8 sm:p-12 lg:p-16 shadow-2xl">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 rounded-full bg-blue-600/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-bold tracking-wide animate-pulse">
            <Sparkles className="w-3.5 h-3.5" />
            <span>CHUẨN CHƯƠNG TRÌNH SGK KẾT NỐI TRI THỨC VỚI CUỘC SỐNG 2025-2026</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.15]">
            Nền Tảng Trò Chơi Học Tập <br />
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
              VẬT LÍ 12 THPT
            </span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl">
            Ôn luyện kiến thức Vật Lí 12 dễ dàng và hào hứng qua 3 dạng trò chơi tương tác: Trắc nghiệm 4 đáp án tốc độ cao, Câu hỏi Đúng/Sai chuẩn cấu trúc kỳ thi tốt nghiệp THPT mới, và Đấu ghép nối công thức.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              to="/games"
              className="flex items-center gap-2 px-6 py-3.5 rounded-xl font-extrabold text-sm bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-xl shadow-cyan-500/25 transition active:scale-95"
            >
              <Gamepad2 className="w-5 h-5" />
              <span>Vào Đấu Trường Game Ngay</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/curriculum"
              className="flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 border border-slate-700 transition"
            >
              <BookOpen className="w-4 h-4 text-cyan-400" />
              <span>Khám Phá Chương Trình SGK</span>
            </Link>
          </div>

          {/* Quick Features Checklist */}
          <div className="pt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-400 font-medium">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>3 Dạng trò chơi chuyên sâu</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>Quản lý lớp & kho học liệu</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Công thức KaTeX trực quan</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3 Game Formats Spotlight */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            3 Dạng Trò Chơi Vật Lí Độc Đáo
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Thiết kế tối ưu theo cấu trúc định dạng thi tốt nghiệp THPT và phương pháp dạy học tích cực
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: Multiple Choice */}
          <div className="group relative rounded-2xl p-6 bg-gradient-to-b from-slate-900 to-slate-900/60 border border-slate-800 hover:border-cyan-500/50 transition-all duration-300 shadow-lg hover:-translate-y-1">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center mb-4 group-hover:scale-110 transition">
              <Zap className="w-6 h-6" />
            </div>
            <div className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 mb-2">
              Dạng 1: Tốc độ & Phản xạ
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Trắc Nghiệm 4 Đáp Án</h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Vượt chướng ngại vật với đồng hồ đếm ngược, nhân hệ số combo điểm XP, tính toán nhanh công thức với hỗ trợ KaTeX.
            </p>
            <Link
              to="/games?type=multiple_choice"
              className="inline-flex items-center gap-1 text-xs font-bold text-cyan-400 hover:text-cyan-300 transition"
            >
              <span>Chơi thử dạng này</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Card 2: True/False Matrix */}
          <div className="group relative rounded-2xl p-6 bg-gradient-to-b from-slate-900 to-slate-900/60 border border-slate-800 hover:border-amber-500/50 transition-all duration-300 shadow-lg hover:-translate-y-1">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-4 group-hover:scale-110 transition">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 mb-2">
              Dạng 2: Cấu trúc Bộ GD&ĐT
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Câu Hỏi Đúng / Sai 4 Ý</h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Đánh giá toàn diện 4 mệnh đề trong 1 hiện tượng vật lí. Tính điểm chuẩn theo quy định thi tốt nghiệp THPT 2025.
            </p>
            <Link
              to="/games?type=true_false"
              className="inline-flex items-center gap-1 text-xs font-bold text-amber-400 hover:text-amber-300 transition"
            >
              <span>Chơi thử dạng này</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Card 3: Matching Pairs */}
          <div className="group relative rounded-2xl p-6 bg-gradient-to-b from-slate-900 to-slate-900/60 border border-slate-800 hover:border-indigo-500/50 transition-all duration-300 shadow-lg hover:-translate-y-1">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center mb-4 group-hover:scale-110 transition">
              <Layers className="w-6 h-6" />
            </div>
            <div className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 mb-2">
              Dạng 3: Ghép Cặp Tương Tác
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Đấu Ghép Nối Vật Lí</h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Khớp nối khái niệm với công thức, hiện tượng với bản chất vật lí, đơn vị đo. Trực quan và ghi nhớ sâu kiến thức.
            </p>
            <Link
              to="/games?type=matching"
              className="inline-flex items-center gap-1 text-xs font-bold text-indigo-400 hover:text-indigo-300 transition"
            >
              <span>Chơi thử dạng này</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

        </div>
      </section>

      {/* SGK Vật Lí 12 Chapters Overview */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <h2 className="text-2xl font-extrabold text-white">
              Chương Trình Sách Giáo Khoa Vật Lí 12 (KNTT)
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Lựa chọn từng chương để học lý thuyết, xem học liệu hoặc chơi trò chơi chuyên đề
            </p>
          </div>

          <Link
            to="/curriculum"
            className="inline-flex items-center gap-1 text-xs font-bold text-cyan-400 hover:text-cyan-300 transition"
          >
            <span>Xem toàn bộ bài học</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {chapters.map((ch) => (
            <Link
              key={ch.id}
              to={`/curriculum?chapter=${ch.id}`}
              className="group p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-800/80 transition-all duration-200 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 flex items-center justify-center font-extrabold text-xs">
                    0{ch.number}
                  </span>
                  <Atom className="w-5 h-5 text-slate-600 group-hover:text-cyan-400 group-hover:animate-spin-slow transition" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition">
                    {ch.title}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-2 mt-1">
                    {ch.description}
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400 group-hover:text-slate-200">
                <span className="flex items-center gap-1">
                  <Play className="w-3 h-3 text-cyan-400" /> Vào học ngay
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-cyan-400 transform group-hover:translate-x-1 transition" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Teacher / Student Role Quick Hub */}
      <section className="p-8 rounded-3xl bg-gradient-to-r from-blue-950/40 via-slate-900 to-indigo-950/40 border border-slate-800">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
              <Users className="w-3.5 h-3.5" /> Dành Cho Giáo Viên & Học Sinh
            </div>
            <h3 className="text-2xl font-black text-white">
              Đồng Bộ Học Liệu - Quản Lý Lớp & Theo Dõi Tiến Độ
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Cô Quỳnh và các thầy cô có thể dễ dàng tải lên học liệu bài giảng (PDF, video thí nghiệm PhET), tạo lớp học phát mã mời, và tạo ngân hàng đề game để cả lớp cùng thi đấu.
            </p>
            <div className="flex flex-wrap gap-3 pt-1">
              <Link
                to="/classes"
                className="px-4 py-2.5 rounded-xl font-bold text-xs bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition"
              >
                Quản lý lớp học
              </Link>
              <Link
                to="/materials"
                className="px-4 py-2.5 rounded-xl font-bold text-xs bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 transition"
              >
                Kho tài liệu học liệu
              </Link>
            </div>
          </div>

          <div className="space-y-3">
            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold">
                  <Flame className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-white">Bảng Xếp Hạng & Huy Hiệu XP</div>
                  <div className="text-xs text-slate-400">Thi đua tích điểm và duy trì chuỗi học tập hàng ngày</div>
                </div>
              </div>
              <Link to="/leaderboard" className="text-xs font-bold text-cyan-400 hover:underline">
                Xem BXH
              </Link>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-white">Studio Soạn Câu Hỏi Tương Tác</div>
                  <div className="text-xs text-slate-400">Tạo đề thi 3 dạng và phát mã PIN thi đấu</div>
                </div>
              </div>
              <Link to="/studio" className="text-xs font-bold text-emerald-400 hover:underline">
                Mở Studio
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
