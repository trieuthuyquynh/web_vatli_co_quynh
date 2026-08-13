import React from 'react';
import { Atom, Heart, Shield, BookCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-200/90 bg-white text-slate-600 text-xs py-10 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Col 1: About */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-sky-100 border border-sky-200 flex items-center justify-center">
                <Atom className="w-4 h-4 text-sky-600" />
              </div>
              <span className="font-bold text-slate-800 text-sm">VẬT LÍ 12 - KẾT NỐI TRI THỨC VỚI CUỘC SỐNG</span>
            </div>
            <p className="text-slate-500 text-xs leading-relaxed max-w-lg">
              Hệ thống trò chơi học tập và kho học liệu thông minh dành cho học sinh THPT. Thiết kế bám sát 100% chuẩn kiến thức - kĩ năng SGK Vật Lí 12 mới (KNTT) với 3 dạng câu hỏi tương tác: Trắc nghiệm 4 đáp án, Câu hỏi Đúng/Sai và Ghép nối công thức.
            </p>
            <div className="flex items-center gap-2 pt-1 text-[11px] text-sky-700 font-semibold">
              <BookCheck className="w-4 h-4 text-sky-600" />
              <span>Chương trình giáo dục phổ thông 2018 - Định hướng thi tốt nghiệp THPT</span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">Chương trình SGK 12</h4>
            <ul className="space-y-1.5 text-slate-600">
              <li><span className="hover:text-sky-600 transition cursor-pointer">Chương 1: Vật lí nhiệt</span></li>
              <li><span className="hover:text-sky-600 transition cursor-pointer">Chương 2: Khí lí tưởng</span></li>
              <li><span className="hover:text-sky-600 transition cursor-pointer">Chương 3: Từ trường</span></li>
              <li><span className="hover:text-sky-600 transition cursor-pointer">Chương 4: Vật lí hạt nhân</span></li>
            </ul>
          </div>

          {/* Col 3: Teacher & System Info */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">Giáo Viên Phụ Trách</h4>
            <p className="text-slate-800 font-bold">Cô Quỳnh - Tổ Bộ Môn Vật Lí</p>
            <p className="text-slate-500 text-[11px]">Hỗ trợ ôn luyện & Giải đáp thắc mắc chuyên đề Vật Lí THPT</p>
            <div className="pt-2 flex items-center gap-1.5 text-emerald-700 text-[11px] font-semibold">
              <Shield className="w-3.5 h-3.5 text-emerald-600" />
              <span>Cơ sở dữ liệu Supabase Đồng bộ</span>
            </div>
          </div>

        </div>

        <div className="border-t border-slate-200 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>© 2026 Web Vật Lí Cô Quỳnh. Xây dựng cho Bồi dưỡng thường xuyên & Đổi mới phương pháp dạy học.</p>
          <div className="flex items-center gap-1">
            <span>Được phát triển với</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>và công nghệ React + Supabase</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

