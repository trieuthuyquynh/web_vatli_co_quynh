import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { curriculumService } from '../../services/curriculumService';
import { materialsService } from '../../services/materialsService';
import { Lesson, Material } from '../../types';
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
  Play
} from 'lucide-react';

export const LessonDetailPage: React.FC = () => {
  const { lessonId } = useParams<{ lessonId: string }>();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadLessonDetail() {
      if (!lessonId) return;
      setLoading(true);
      try {
        const ls = await curriculumService.getLessonById(lessonId);
        setLesson(ls);
        const mats = await materialsService.getMaterials(lessonId);
        setMaterials(mats);
      } finally {
        setLoading(false);
      }
    }
    loadLessonDetail();
  }, [lessonId]);

  if (loading) {
    return <LoadingSpinner text="Đang tải chi tiết bài học..." />;
  }

  if (!lesson) {
    return (
      <div className="p-8 text-center space-y-4">
        <p className="text-slate-400">Không tìm thấy bài học này.</p>
        <Link to="/curriculum" className="text-cyan-400 font-bold hover:underline">
          Quay lại danh mục chương trình
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Back button */}
      <div>
        <Link
          to={`/curriculum?chapter=${lesson.chapter_id}`}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition"
        >
          <ArrowLeft className="w-4 h-4" /> Quay lại danh mục chương
        </Link>
      </div>

      {/* Header Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-700 space-y-4">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
            Bài 0{lesson.number} • SGK KNTT
          </span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-white">
          {lesson.title}
        </h1>
        <p className="text-sm text-slate-300 leading-relaxed max-w-3xl">
          {lesson.summary}
        </p>

        {/* Quick Play CTAs */}
        <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-slate-700/60">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Luyện trò chơi:
          </span>
          <Link
            to={`/games?lesson=${lesson.id}&type=multiple_choice`}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 transition"
          >
            <Zap className="w-3.5 h-3.5" /> Trắc nghiệm 4 đáp án
          </Link>
          <Link
            to={`/games?lesson=${lesson.id}&type=true_false`}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 transition"
          >
            <CheckCircle2 className="w-3.5 h-3.5" /> Đúng / Sai 4 ý
          </Link>
          <Link
            to={`/games?lesson=${lesson.id}&type=matching`}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 transition"
          >
            <Layers className="w-3.5 h-3.5" /> Ghép cặp nối từ
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Column: Key Knowledge & Formulas */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-amber-400" />
              <span>Hệ Thống Kiến Thức & Công Thức Cốt Lõi</span>
            </h3>

            <div className="space-y-3">
              {lesson.key_formulas.map((formula, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 flex items-start gap-3"
                >
                  <span className="w-6 h-6 rounded bg-cyan-500/20 text-cyan-400 font-mono text-xs flex items-center justify-center font-bold shrink-0">
                    {idx + 1}
                  </span>
                  <div className="text-sm font-medium text-slate-200">
                    <MathRenderer content={formula} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Column: Materials of this lesson */}
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <FolderDown className="w-5 h-5 text-cyan-400" />
                <span>Học Liệu Bài Học ({materials.length})</span>
              </h3>
              <Link
                to={`/materials?lesson=${lesson.id}`}
                className="text-xs text-cyan-400 font-bold hover:underline"
              >
                Xem tất cả
              </Link>
            </div>

            {materials.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">
                Chưa có học liệu riêng cho bài này. Cô Quỳnh sẽ sớm cập nhật!
              </p>
            ) : (
              <div className="space-y-3">
                {materials.map((mat) => (
                  <div
                    key={mat.id}
                    className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-slate-800 text-cyan-400">
                        {mat.type}
                      </span>
                      <a
                        href={mat.file_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs font-bold text-cyan-400 hover:underline flex items-center gap-1"
                      >
                        <Play className="w-3 h-3" /> Mở xem
                      </a>
                    </div>
                    <h5 className="text-xs font-bold text-white">{mat.title}</h5>
                    {mat.description && (
                      <p className="text-[11px] text-slate-400 line-clamp-2">{mat.description}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
