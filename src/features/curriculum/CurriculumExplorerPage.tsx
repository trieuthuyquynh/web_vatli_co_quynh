import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { curriculumService } from '../../services/curriculumService';
import { Chapter, Lesson } from '../../types';
import { MathRenderer } from '../../components/common/MathRenderer';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { 
  BookOpen, 
  Flame, 
  Wind, 
  Zap, 
  Atom, 
  Gamepad2, 
  FolderDown, 
  ArrowRight, 
  ChevronRight, 
  FileText
} from 'lucide-react';

export const CurriculumExplorerPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeChapterId = searchParams.get('chapter');

  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const chList = await curriculumService.getChapters();
        setChapters(chList);

        const targetChId = activeChapterId || (chList.length > 0 ? chList[0].id : undefined);
        const lList = await curriculumService.getLessonsByChapter(targetChId);
        setLessons(lList);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [activeChapterId]);

  const handleSelectChapter = (chId: string) => {
    setSearchParams({ chapter: chId });
  };

  const getChapterIcon = (iconName: string) => {
    switch (iconName) {
      case 'Flame': return <Flame className="w-5 h-5 text-amber-400" />;
      case 'Wind': return <Wind className="w-5 h-5 text-cyan-400" />;
      case 'Zap': return <Zap className="w-5 h-5 text-yellow-400" />;
      case 'Atom':
      case 'Radioactive': return <Atom className="w-5 h-5 text-emerald-400" />;
      default: return <BookOpen className="w-5 h-5 text-cyan-400" />;
    }
  };

  const selectedChapter = chapters.find(c => c.id === (activeChapterId || chapters[0]?.id));

  if (loading && chapters.length === 0) {
    return <LoadingSpinner text="Đang tải danh mục SGK Vật Lí 12 KNTT..." />;
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
          <BookOpen className="w-3.5 h-3.5" /> Sách Giáo Khoa Vật Lí 12 - Kết Nối Tri Thức Với Cuộc Sống
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-white">
          Chương Trình & Danh Mục Bài Học
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
          Tra cứu tóm tắt lý thuyết, công thức trọng tâm, tài liệu bài giảng và tham gia trò chơi ôn luyện trực tiếp cho từng bài học.
        </p>
      </div>

      {/* Chapter Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {chapters.map((ch) => {
          const isSelected = ch.id === selectedChapter?.id;
          return (
            <button
              key={ch.id}
              onClick={() => handleSelectChapter(ch.id)}
              className={`p-4 rounded-2xl border text-left flex items-start gap-3.5 transition-all duration-200 ${
                isSelected
                  ? 'bg-gradient-to-b from-cyan-500/20 to-slate-900 border-cyan-500/60 shadow-lg shadow-cyan-500/10 ring-1 ring-cyan-500/40'
                  : 'bg-slate-900/70 border-slate-800 hover:border-slate-700 text-slate-300 hover:bg-slate-800/60'
              }`}
            >
              <div className={`p-2.5 rounded-xl border shrink-0 ${
                isSelected ? 'bg-cyan-500/20 border-cyan-500/40' : 'bg-slate-800 border-slate-700'
              }`}>
                {getChapterIcon(ch.icon)}
              </div>
              <div className="space-y-1 overflow-hidden">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Chương {ch.number}
                </div>
                <div className={`text-sm font-bold truncate ${isSelected ? 'text-white' : 'text-slate-200'}`}>
                  {ch.title.replace(`Chương ${ch.number}: `, '')}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Chapter Details & Lessons List */}
      {selectedChapter && (
        <div className="space-y-6">
          
          {/* Chapter Banner */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
                {getChapterIcon(selectedChapter.icon)}
                <span>{selectedChapter.title}</span>
              </h2>
              <p className="text-xs text-slate-300 max-w-2xl">
                {selectedChapter.description}
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Link
                to={`/games?chapter=${selectedChapter.id}`}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-md shadow-cyan-500/20 transition"
              >
                <Gamepad2 className="w-4 h-4" />
                <span>Chơi Đề Tổng Hợp Chương</span>
              </Link>
            </div>
          </div>

          {/* Lessons List Grid */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
                Các Bài Học Trong Chương ({lessons.length} bài)
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {lessons.map((ls) => (
                <div
                  key={ls.id}
                  className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between space-y-4 group"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <span className="px-2.5 py-1 rounded-lg text-xs font-black bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                        Bài 0{ls.number}
                      </span>
                      <Link
                        to={`/materials?lesson=${ls.id}`}
                        className="text-[11px] font-semibold text-slate-400 hover:text-cyan-300 flex items-center gap-1 transition"
                      >
                        <FolderDown className="w-3.5 h-3.5 text-cyan-400" /> Học liệu
                      </Link>
                    </div>

                    <h4 className="text-base font-bold text-white group-hover:text-cyan-300 transition">
                      {ls.title}
                    </h4>

                    <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                      {ls.summary}
                    </p>
                  </div>

                  {/* Key Formulas Snippets */}
                  {ls.key_formulas && ls.key_formulas.length > 0 && (
                    <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 text-xs space-y-1">
                      <div className="text-[10px] font-bold text-cyan-400 uppercase">Công thức trọng tâm:</div>
                      <div className="font-mono text-slate-200">
                        <MathRenderer content={ls.key_formulas.join('  •  ')} />
                      </div>
                    </div>
                  )}

                  {/* Action Bar */}
                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2">
                    <Link
                      to={`/curriculum/${ls.id}`}
                      className="flex items-center gap-1.5 text-xs font-bold text-slate-300 hover:text-white transition"
                    >
                      <FileText className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Xem tóm tắt lý thuyết</span>
                    </Link>

                    <Link
                      to={`/games?lesson=${ls.id}`}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 transition"
                    >
                      <Gamepad2 className="w-3.5 h-3.5" />
                      <span>Chơi Game Bài Này</span>
                      <ChevronRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}
    </div>
  );
};
