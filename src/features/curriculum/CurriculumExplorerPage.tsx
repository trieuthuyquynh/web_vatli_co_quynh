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
  FileText,
  Search,
  ListTree,
  LayoutGrid,
  Layers,
  Sparkles,
  CheckCircle2
} from 'lucide-react';

export const CurriculumExplorerPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeChapterId = searchParams.get('chapter');

  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [allLessons, setAllLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'cards' | 'outline'>('cards');

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [chList, allLList] = await Promise.all([
          curriculumService.getChapters(),
          curriculumService.getLessonsByChapter() // load tất cả bài
        ]);
        setChapters(chList);
        setAllLessons(allLList);

        const targetChId = activeChapterId || (chList.length > 0 ? chList[0].id : undefined);
        const lList = allLList.filter(l => !targetChId || l.chapter_id === targetChId);
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

  const getChapterIcon = (iconName: string, className = "w-5 h-5") => {
    switch (iconName) {
      case 'Flame': return <Flame className={`${className} text-amber-500`} />;
      case 'Wind': return <Wind className={`${className} text-sky-500`} />;
      case 'Zap': return <Zap className={`${className} text-yellow-500`} />;
      case 'Atom':
      case 'Radioactive': return <Atom className={`${className} text-emerald-500`} />;
      default: return <BookOpen className={`${className} text-sky-500`} />;
    }
  };

  const selectedChapter = chapters.find(c => c.id === (activeChapterId || chapters[0]?.id));

  // Bộ lọc bài học khi người dùng gõ tìm kiếm
  const displayedLessons = searchQuery.trim()
    ? allLessons.filter(l => 
        l.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.summary.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : lessons;

  if (loading && chapters.length === 0) {
    return <LoadingSpinner text="Đang nạp hệ thống Chương - Bài SGK Vật Lí 12 KNTT..." />;
  }

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header & Breadcrumb */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-soft space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-sky-50 text-sky-700 border border-sky-200">
            <BookOpen className="w-3.5 h-3.5 text-sky-600" />
            <span>SGK VẬT LÍ 12 • KẾT NỐI TRI THỨC VỚI CUỘC SỐNG</span>
          </div>

          {/* Toggle View Mode */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs font-bold text-slate-600">
            <button
              onClick={() => setViewMode('cards')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
                viewMode === 'cards' ? 'bg-white text-sky-700 shadow-xs' : 'hover:text-slate-900'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Thẻ Chi Tiết</span>
            </button>
            <button
              onClick={() => setViewMode('outline')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
                viewMode === 'outline' ? 'bg-white text-sky-700 shadow-xs' : 'hover:text-slate-900'
              }`}
            >
              <ListTree className="w-3.5 h-3.5" />
              <span>Cây Mục Lục SGK</span>
            </button>
          </div>
        </div>

        <div className="space-y-1">
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Khung Chương Trình & Bài Học Vật Lí 12
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed">
            Hệ thống hóa toàn bộ kiến thức theo trình tự <strong className="text-sky-700">CHƯƠNG → BÀI</strong>. Tra cứu tóm tắt lý thuyết, công thức cốt lõi, kho bài giảng và trực tiếp làm bài tập trò chơi tương tác.
          </p>
        </div>

        {/* Search Bar */}
        <div className="pt-2">
          <div className="relative max-w-xl">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm nhanh bài học, khái niệm, định luật (VD: Nội năng, Boyle, Từ trường...)"
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-700"
              >
                Xóa lọc
              </button>
            )}
          </div>
        </div>
      </div>

      {/* VIEW MODE 1: THEO TRÌNH TỰ CHƯƠNG - BÀI DẠNG THẺ (CARDS VIEW) */}
      {viewMode === 'cards' && !searchQuery.trim() && (
        <div className="space-y-8">
          
          {/* Chapter Navigation Tabs */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-sky-600" />
                <span>Chọn Chương Để Xem Các Bài Học:</span>
              </h2>
              <span className="text-xs font-bold text-sky-700 bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-200">
                4 Chương Trọng Tâm
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
              {chapters.map((ch) => {
                const isSelected = ch.id === selectedChapter?.id;
                const chapterLessonsCount = allLessons.filter(l => l.chapter_id === ch.id).length;
                return (
                  <button
                    key={ch.id}
                    onClick={() => handleSelectChapter(ch.id)}
                    className={`p-4 rounded-2xl border text-left flex items-start gap-3.5 transition-all duration-200 ${
                      isSelected
                        ? 'bg-sky-50/80 border-sky-400 shadow-md ring-2 ring-sky-400/20'
                        : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 shadow-xs'
                    }`}
                  >
                    <div className={`p-2.5 rounded-xl border shrink-0 ${
                      isSelected ? 'bg-sky-100 border-sky-300' : 'bg-slate-100 border-slate-200'
                    }`}>
                      {getChapterIcon(ch.icon)}
                    </div>
                    <div className="space-y-1 overflow-hidden flex-1">
                      <div className="flex items-center justify-between">
                        <span className={`text-[11px] font-black uppercase tracking-wider ${
                          isSelected ? 'text-sky-700' : 'text-slate-500'
                        }`}>
                          Chương 0{ch.number}
                        </span>
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                          {chapterLessonsCount} bài
                        </span>
                      </div>
                      <div className={`text-sm font-bold truncate ${isSelected ? 'text-slate-900' : 'text-slate-800'}`}>
                        {ch.title.replace(`Chương ${ch.number}: `, '')}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected Chapter Details & Lessons List */}
          {selectedChapter && (
            <div className="space-y-6">
              
              {/* Chapter Banner */}
              <div className="p-6 rounded-3xl bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-700 text-white shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-white/20 text-white backdrop-blur-sm">
                      CHƯƠNG {selectedChapter.number}
                    </span>
                    <span className="text-xs text-sky-100">• SGK Vật Lí 12 KNTT</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-white flex items-center gap-2.5">
                    {selectedChapter.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-sky-100 max-w-2xl leading-relaxed">
                    {selectedChapter.description}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    to={`/games?chapter=${selectedChapter.id}`}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-extrabold bg-white text-slate-900 hover:bg-sky-50 shadow-md transition active:scale-95"
                  >
                    <Gamepad2 className="w-4 h-4 text-sky-600" />
                    <span>Luyện Đề Toàn Chương</span>
                  </Link>
                </div>
              </div>

              {/* Lessons Sequence in this Chapter */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                    <span>DANH SÁCH BÀI HỌC THEO THỨ TỰ TRONG CHƯƠNG {selectedChapter.number}</span>
                    <span className="text-sky-700 bg-sky-50 px-2 py-0.5 rounded-md font-extrabold border border-sky-200">
                      {lessons.length} bài
                    </span>
                  </h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {lessons.map((ls) => (
                    <div
                      key={ls.id}
                      className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-soft hover:shadow-card-hover hover:border-sky-300 transition-all duration-300 flex flex-col justify-between space-y-4 group"
                    >
                      <div className="space-y-3">
                        <div className="flex items-start justify-between gap-2">
                          <span className="px-3 py-1 rounded-xl text-xs font-black bg-sky-50 text-sky-700 border border-sky-200 shadow-xs">
                            Bài {ls.number < 10 ? `0${ls.number}` : ls.number}
                          </span>
                          <Link
                            to={`/materials?lesson=${ls.id}`}
                            className="text-xs font-bold text-slate-500 hover:text-sky-600 flex items-center gap-1.5 px-2.5 py-1 rounded-lg hover:bg-sky-50 transition"
                          >
                            <FolderDown className="w-3.5 h-3.5 text-sky-600" />
                            <span>Học liệu</span>
                          </Link>
                        </div>

                        <h4 className="text-base font-extrabold text-slate-900 group-hover:text-sky-600 transition">
                          {ls.title}
                        </h4>

                        <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                          {ls.summary}
                        </p>
                      </div>

                      {/* Key Formulas Snippets */}
                      {ls.key_formulas && ls.key_formulas.length > 0 && (
                        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs space-y-1.5">
                          <div className="text-[10px] font-extrabold text-sky-700 uppercase tracking-wider flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-sky-500" />
                            <span>Công thức trọng tâm:</span>
                          </div>
                          <div className="font-mono text-slate-800 overflow-x-auto py-0.5">
                            <MathRenderer content={ls.key_formulas.join('  •  ')} />
                          </div>
                        </div>
                      )}

                      {/* Action Bar */}
                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                        <Link
                          to={`/curriculum/${ls.id}`}
                          className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-sky-700 transition"
                        >
                          <FileText className="w-3.5 h-3.5 text-sky-600" />
                          <span>Xem tóm tắt lý thuyết</span>
                        </Link>

                        <Link
                          to={`/games?lesson=${ls.id}`}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 transition active:scale-95"
                        >
                          <Gamepad2 className="w-3.5 h-3.5 text-sky-600" />
                          <span>Luyện Game</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}
        </div>
      )}

      {/* VIEW MODE 2: CÂY MỤC LỤC TOÀN BỘ SGK (OUTLINE TREE VIEW) */}
      {viewMode === 'outline' && !searchQuery.trim() && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-soft">
            <h3 className="text-base font-extrabold text-slate-900 mb-4 flex items-center gap-2">
              <ListTree className="w-5 h-5 text-sky-600" />
              <span>Toàn Bộ Khung Trình Tự 4 Chương & Bài Học SGK Vật Lí 12 KNTT</span>
            </h3>

            <div className="space-y-6">
              {chapters.map((ch) => {
                const chapterLessons = allLessons.filter(l => l.chapter_id === ch.id);
                return (
                  <div key={ch.id} className="border border-slate-200 rounded-2xl p-5 bg-slate-50/60 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-white border border-slate-200 shadow-xs">
                          {getChapterIcon(ch.icon)}
                        </div>
                        <div>
                          <div className="text-xs font-black text-sky-700 uppercase">CHƯƠNG 0{ch.number}</div>
                          <h4 className="text-base font-bold text-slate-900">{ch.title}</h4>
                        </div>
                      </div>
                      <Link
                        to={`/games?chapter=${ch.id}`}
                        className="self-start sm:self-auto text-xs font-bold text-sky-700 hover:text-sky-800 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-xs flex items-center gap-1.5"
                      >
                        <Gamepad2 className="w-3.5 h-3.5" />
                        <span>Game Chương</span>
                      </Link>
                    </div>

                    {/* Lessons list in outline */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
                      {chapterLessons.map((ls) => (
                        <div
                          key={ls.id}
                          className="bg-white p-3.5 rounded-xl border border-slate-200 flex flex-col justify-between space-y-2 hover:border-sky-300 transition"
                        >
                          <div>
                            <span className="text-[10px] font-black text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-100">
                              Bài 0{ls.number}
                            </span>
                            <h5 className="text-xs font-bold text-slate-800 mt-1.5 line-clamp-2">
                              {ls.title}
                            </h5>
                          </div>

                          <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px]">
                            <Link to={`/curriculum/${ls.id}`} className="font-bold text-slate-500 hover:text-sky-600">
                              Lý thuyết
                            </Link>
                            <Link to={`/games?lesson=${ls.id}`} className="font-bold text-sky-600 hover:text-sky-700 flex items-center gap-0.5">
                              <span>Game</span>
                              <ChevronRight className="w-3 h-3" />
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* KẾT QUẢ TÌM KIẾM BÀI HỌC (SEARCH RESULTS) */}
      {searchQuery.trim() && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-700">
              Kết quả tìm kiếm cho từ khóa: "<span className="text-sky-700 font-extrabold">{searchQuery}</span>" ({displayedLessons.length} bài học)
            </h3>
            <button
              onClick={() => setSearchQuery('')}
              className="text-xs text-sky-600 font-bold hover:underline"
            >
              Quay lại danh mục
            </button>
          </div>

          {displayedLessons.length === 0 ? (
            <div className="bg-white p-8 rounded-3xl border border-slate-200 text-center space-y-3">
              <p className="text-slate-500 text-sm">Không tìm thấy bài học nào phù hợp với từ khóa này.</p>
              <button
                onClick={() => setSearchQuery('')}
                className="px-4 py-2 bg-sky-50 text-sky-700 font-bold rounded-xl text-xs border border-sky-200"
              >
                Hiển thị tất cả bài học
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {displayedLessons.map((ls) => (
                <div
                  key={ls.id}
                  className="p-5 rounded-3xl bg-white border border-slate-200 shadow-soft space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-lg text-xs font-black bg-sky-50 text-sky-700 border border-sky-200">
                      Bài 0{ls.number}
                    </span>
                    <Link
                      to={`/curriculum/${ls.id}`}
                      className="text-xs font-bold text-sky-600 hover:underline flex items-center gap-1"
                    >
                      <span>Xem chi tiết</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                  <h4 className="text-base font-bold text-slate-900">{ls.title}</h4>
                  <p className="text-xs text-slate-600 line-clamp-2">{ls.summary}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
};

