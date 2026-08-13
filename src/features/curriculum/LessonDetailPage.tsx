import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { curriculumService } from '../../services/curriculumService';
import { materialsService } from '../../services/materialsService';
import { Chapter, Lesson, Material } from '../../types';
import { MathRenderer } from '../../components/common/MathRenderer';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { 
  BookOpen, 
  ArrowLeft, 
  Gamepad2, 
  FolderDown, 
  Zap, 
  CheckCircle2, 
  Layers, 
  Lightbulb, 
  FileText, 
  Play,
  Share2,
  ChevronRight,
  ExternalLink
} from 'lucide-react';

export const LessonDetailPage: React.FC = () => {
  const { lessonId } = useParams<{ lessonId: string }>();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadLessonDetail() {
      if (!lessonId) return;
      setLoading(true);
      try {
        const [ls, chs, mats] = await Promise.all([
          curriculumService.getLessonById(lessonId),
          curriculumService.getChapters(),
          materialsService.getMaterials(lessonId)
        ]);
        setLesson(ls);
        if (ls) {
          const ch = chs.find(c => c.id === ls.chapter_id);
          setChapter(ch || null);
        }
        setMaterials(mats);
      } finally {
        setLoading(false);
      }
    }
    loadLessonDetail();
  }, [lessonId]);

  if (loading) {
    return <LoadingSpinner text="Đang tải chi tiết bài học và công thức Vật Lí..." />;
  }

  if (!lesson) {
    return (
      <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 shadow-soft space-y-4">
        <p className="text-slate-600 font-medium">Không tìm thấy dữ liệu bài học này.</p>
        <Link to="/curriculum" className="inline-flex items-center gap-2 text-sky-700 font-bold hover:underline">
          <ArrowLeft className="w-4 h-4" /> Quay lại danh mục chương trình
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16">
      
      {/* Breadcrumb Navigation: CHƯƠNG -> BÀI */}
      <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-500">
        <Link to="/curriculum" className="hover:text-sky-700 transition">
          SGK Vật Lí 12
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        {chapter && (
          <>
            <Link to={`/curriculum?chapter=${chapter.id}`} className="hover:text-sky-700 transition">
              {chapter.title}
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          </>
        )}
        <span className="text-slate-900 font-bold truncate max-w-xs sm:max-w-md">
          {lesson.title}
        </span>
      </div>

      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-soft space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-xl text-xs font-black bg-sky-50 text-sky-700 border border-sky-200 shadow-xs">
              Bài {lesson.number < 10 ? `0${lesson.number}` : lesson.number} • SGK KNTT
            </span>
            {chapter && (
              <span className="text-xs font-bold text-slate-500">
                {chapter.title}
              </span>
            )}
          </div>

          <Link
            to={`/curriculum?chapter=${lesson.chapter_id}`}
            className="text-xs font-bold text-slate-500 hover:text-sky-700 flex items-center gap-1 transition"
          >
            <ArrowLeft className="w-4 h-4" /> Danh sách bài trong chương
          </Link>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            {lesson.title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-3xl">
            {lesson.summary}
          </p>
        </div>

        {/* 3 Quick Game Actions for this Lesson */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
            <Gamepad2 className="w-4 h-4 text-sky-600" />
            <span>Ôn Luyện Trò Chơi Bài Này:</span>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              to={`/games?lesson=${lesson.id}&type=multiple_choice`}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 shadow-xs transition active:scale-95"
            >
              <Zap className="w-3.5 h-3.5 text-sky-600" />
              <span>Trắc nghiệm 4 đáp án</span>
            </Link>
            <Link
              to={`/games?lesson=${lesson.id}&type=true_false`}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 shadow-xs transition active:scale-95"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />
              <span>Đúng / Sai 4 ý</span>
            </Link>
            <Link
              to={`/games?lesson=${lesson.id}&type=matching`}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 shadow-xs transition active:scale-95"
            >
              <Layers className="w-3.5 h-3.5 text-emerald-600" />
              <span>Ghép nối công thức</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content Grid: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Column: Key Knowledge & Formulas */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/90 shadow-soft space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-amber-100 text-amber-600">
                  <Lightbulb className="w-4 h-4" />
                </div>
                <span>Hệ Thống Kiến Thức & Công Thức Cốt Lõi</span>
              </h3>
              <span className="text-xs font-bold text-sky-700 bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-200">
                {lesson.key_formulas.length} công thức chính
              </span>
            </div>

            <div className="space-y-3.5">
              {lesson.key_formulas.map((formula, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/90 flex items-start gap-3.5 hover:border-sky-300 transition"
                >
                  <span className="w-7 h-7 rounded-xl bg-sky-100 text-sky-700 font-mono text-xs flex items-center justify-center font-bold shrink-0 border border-sky-200 shadow-xs">
                    0{idx + 1}
                  </span>
                  <div className="text-sm font-medium text-slate-800 pt-0.5 overflow-x-auto">
                    <MathRenderer content={formula} />
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-2xl bg-sky-50/60 border border-sky-100 text-xs text-slate-600 flex items-start gap-2.5">
              <BookOpen className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-sky-900">Ghi nhớ phương pháp giải bài tập:</strong> Hãy chú ý đơn vị đo chuẩn trong hệ SI và điều kiện áp dụng định luật trước khi bấm máy tính.
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Column: Materials of this lesson */}
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-soft space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <FolderDown className="w-4 h-4 text-sky-600" />
                <span>Học Liệu Bài Học ({materials.length})</span>
              </h3>
              <Link
                to={`/materials?lesson=${lesson.id}`}
                className="text-xs text-sky-700 font-bold hover:underline"
              >
                Xem tất cả
              </Link>
            </div>

            {materials.length === 0 ? (
              <div className="py-8 text-center space-y-2">
                <FolderDown className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="text-xs text-slate-500">
                  Chưa có tài liệu tải lên cho bài này. Cô Quỳnh sẽ sớm bổ sung!
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {materials.map((mat) => (
                  <div
                    key={mat.id}
                    className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200 space-y-2 hover:border-sky-300 transition"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-md bg-sky-100 text-sky-700 border border-sky-200">
                        {mat.type}
                      </span>
                      <a
                        href={mat.file_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs font-bold text-sky-700 hover:text-sky-800 flex items-center gap-1"
                      >
                        <span>Mở xem</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                    <h5 className="text-xs font-bold text-slate-800">{mat.title}</h5>
                    {mat.description && (
                      <p className="text-[11px] text-slate-500 line-clamp-2">{mat.description}</p>
                    )}
                  </div>
                ))}
              </div>
            )}

            <div className="pt-2">
              <Link
                to={`/materials?lesson=${lesson.id}`}
                className="w-full flex items-center justify-center gap-2 py-2.5 text-xs font-bold text-sky-700 bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded-xl transition"
              >
                <FolderDown className="w-4 h-4 text-sky-600" />
                <span>Mở Kho Học Liệu Bài Này</span>
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

