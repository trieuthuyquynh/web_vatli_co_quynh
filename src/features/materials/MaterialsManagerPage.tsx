import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { materialsService } from '../../services/materialsService';
import { curriculumService } from '../../services/curriculumService';
import { Material, Lesson, MaterialType } from '../../types';
import { UploadMaterialModal } from './UploadMaterialModal';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { 
  FolderDown, 
  Upload, 
  FileText, 
  Video, 
  Presentation, 
  ExternalLink, 
  Trash2, 
  Filter, 
  Sparkles,
  Play
} from 'lucide-react';

export const MaterialsManagerPage: React.FC = () => {
  const { user, role } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeLessonId = searchParams.get('lesson');

  const [materials, setMaterials] = useState<Material[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);

  const canManage = role === 'teacher' || role === 'admin';

  const loadData = async () => {
    setLoading(true);
    try {
      const [mats, lss] = await Promise.all([
        materialsService.getMaterials(activeLessonId || undefined),
        curriculumService.getLessonsByChapter()
      ]);
      setMaterials(mats);
      setLessons(lss);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [activeLessonId]);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa học liệu này?')) return;
    await materialsService.deleteMaterial(id);
    loadData();
  };

  const filteredMaterials = materials.filter(m => {
    if (selectedType !== 'all' && m.type !== selectedType) return false;
    return true;
  });

  const getTypeIcon = (type: MaterialType) => {
    switch (type) {
      case 'video': return <Video className="w-5 h-5 text-rose-400" />;
      case 'slide': return <Presentation className="w-5 h-5 text-amber-400" />;
      case 'pdf': return <FileText className="w-5 h-5 text-cyan-400" />;
      default: return <FolderDown className="w-5 h-5 text-blue-400" />;
    }
  };

  return (
    <div className="space-y-8 pb-12">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
            <FolderDown className="w-3.5 h-3.5" /> Kho Tài Liệu & Học Liệu Điện Tử
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white">
            Học Liệu Vật Lí 12 KNTT
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Tổng hợp bài giảng, slide trình chiếu, tóm tắt lý thuyết và link thí nghiệm ảo PhET mô phỏng
          </p>
        </div>

        {canManage && (
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-xs bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/20 transition shrink-0"
          >
            <Upload className="w-4 h-4" />
            <span>Tải Lên Học Liệu Mới</span>
          </button>
        )}
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
        
        {/* Type pills */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {[
            { id: 'all', label: 'Tất cả học liệu' },
            { id: 'pdf', label: 'Tài liệu PDF' },
            { id: 'video', label: 'Video / Mô phỏng PhET' },
            { id: 'slide', label: 'Slide Bài Giảng' },
            { id: 'doc', label: 'Đề cương Word' },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setSelectedType(t.id)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${
                selectedType === t.id
                  ? 'bg-cyan-500 text-slate-950 shadow-sm'
                  : 'bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Filter by Lesson */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter className="w-4 h-4 text-slate-500 shrink-0" />
          <select
            value={activeLessonId || ''}
            onChange={(e) => setSearchParams(e.target.value ? { lesson: e.target.value } : {})}
            className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 w-full md:w-64"
          >
            <option value="">-- Lọc theo tất cả bài học --</option>
            {lessons.map(ls => (
              <option key={ls.id} value={ls.id}>
                Bài {ls.number}: {ls.title}
              </option>
            ))}
          </select>
        </div>

      </div>

      {/* Materials List */}
      {loading ? (
        <LoadingSpinner text="Đang tải danh sách học liệu..." />
      ) : filteredMaterials.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-slate-900/50 border border-slate-800 space-y-3">
          <FolderDown className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-slate-300">Chưa có học liệu nào trong mục này</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {canManage
              ? 'Thầy cô hãy bấm nút "Tải Lên Học Liệu Mới" để chia sẻ tài liệu bài giảng cho học sinh.'
              : 'Cô Quỳnh sẽ sớm cập nhật thêm tài liệu và mô phỏng cho bài học này.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredMaterials.map((mat) => {
            const linkedLesson = lessons.find(l => l.id === mat.lesson_id);

            return (
              <div
                key={mat.id}
                className="group p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-cyan-500/40 hover:bg-slate-800/80 transition-all duration-200 flex flex-col justify-between space-y-4 shadow-md"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="p-2.5 rounded-xl bg-slate-800/90 border border-slate-700/60">
                      {getTypeIcon(mat.type)}
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                      {mat.type}
                    </span>
                  </div>

                  <div>
                    {linkedLesson && (
                      <span className="text-[11px] font-bold text-cyan-400 block mb-1">
                        Bài 0{linkedLesson.number}: {linkedLesson.title}
                      </span>
                    )}
                    <h4 className="text-sm font-bold text-white group-hover:text-cyan-300 transition leading-snug">
                      {mat.title}
                    </h4>
                    {mat.description && (
                      <p className="text-xs text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                        {mat.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <a
                    href={mat.file_url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 text-xs font-bold text-cyan-400 hover:text-cyan-300 transition"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Mở / Tải Về</span>
                  </a>

                  {canManage && (
                    <button
                      onClick={() => handleDelete(mat.id)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition"
                      title="Xóa học liệu"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Upload Modal */}
      <UploadMaterialModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onSuccess={loadData}
      />
    </div>
  );
};
