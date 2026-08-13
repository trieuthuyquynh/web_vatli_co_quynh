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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black bg-sky-50 text-sky-800 border border-sky-200">
            <FolderDown className="w-3.5 h-3.5 text-sky-600" /> Kho Tài Liệu & Học Liệu Điện Tử
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Học Liệu Vật Lí 12 KNTT
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            Tổng hợp bài giảng, slide trình chiếu, tóm tắt lý thuyết và link thí nghiệm ảo PhET mô phỏng
          </p>
        </div>

        {canManage && (
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-xs bg-sky-600 hover:bg-sky-500 text-white shadow-md shadow-sky-600/20 transition shrink-0 active:scale-95"
          >
            <Upload className="w-4 h-4" />
            <span>Tải Lên Học Liệu Mới</span>
          </button>
        )}
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-3xl bg-white border border-slate-200 shadow-soft">
        
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
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                selectedType === t.id
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'bg-slate-50 text-slate-600 hover:text-slate-950 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Filter by Lesson */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={activeLessonId || ''}
            onChange={(e) => setSearchParams(e.target.value ? { lesson: e.target.value } : {})}
            className="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 w-full md:w-64"
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
        <div className="p-12 text-center rounded-3xl bg-white border border-slate-200 shadow-soft space-y-3">
          <FolderDown className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">Chưa có học liệu nào trong mục này</h3>
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
                className="group p-6 rounded-3xl bg-white border border-slate-200/90 hover:border-sky-300 hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between space-y-4 shadow-soft"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="p-2.5 rounded-2xl bg-sky-50 border border-sky-100">
                      {getTypeIcon(mat.type)}
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                      {mat.type}
                    </span>
                  </div>

                  <div>
                    {linkedLesson && (
                      <span className="text-[11px] font-extrabold text-sky-700 block mb-1">
                        Bài 0{linkedLesson.number}: {linkedLesson.title}
                      </span>
                    )}
                    <h4 className="text-sm font-bold text-slate-900 group-hover:text-sky-700 transition leading-snug">
                      {mat.title}
                    </h4>
                    {mat.description && (
                      <p className="text-xs text-slate-600 mt-2 line-clamp-3 leading-relaxed">
                        {mat.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-3.5 border-t border-slate-100 flex items-center justify-between">
                  <a
                    href={mat.file_url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 text-xs font-bold text-sky-700 hover:text-sky-800 transition"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Mở / Tải Về</span>
                  </a>

                  {canManage && (
                    <button
                      onClick={() => handleDelete(mat.id)}
                      className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
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
