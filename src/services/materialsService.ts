import { supabase, isSupabaseConfigured } from './supabase';
import { Material, MaterialType } from '../types';

export const materialsService = {
  // Lấy danh sách tài liệu theo bài học hoặc toàn bộ
  async getMaterials(lessonId?: string): Promise<Material[]> {
    if (!isSupabaseConfigured) {
      const stored = localStorage.getItem('local_physics_materials');
      const list: Material[] = stored ? JSON.parse(stored) : [
        {
          id: 'mat-1',
          lesson_id: 'l1111111-1111-1111-1111-111111111101',
          teacher_id: 'teacher-quynh',
          title: 'Tóm tắt Sơ đồ tư duy Cấu trúc chất & Chuyển thể',
          type: 'pdf',
          file_url: 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?auto=format&fit=crop&w=1200&q=80',
          description: 'Hệ thống hóa toàn bộ kiến thức về thể rắn, lỏng, khí và mô hình động học phân tử.',
          is_public: true,
          created_at: new Date().toISOString(),
        },
        {
          id: 'mat-2',
          lesson_id: 'l2222222-2222-2222-2222-222222222202',
          teacher_id: 'teacher-quynh',
          title: 'Mô phỏng Thí nghiệm Định luật Boyle (Nén khí đẳng nhiệt)',
          type: 'video',
          file_url: 'https://phet.colorado.edu/sims/html/gas-properties/latest/gas-properties_all.html',
          description: 'Link mô phỏng tương tác PhET trực quan đo áp suất và thể tích.',
          is_public: true,
          created_at: new Date().toISOString(),
        }
      ];
      return lessonId ? list.filter(m => m.lesson_id === lessonId) : list;
    }

    try {
      let query = supabase
        .from('materials')
        .select(`
          *,
          lessons:lesson_id (id, number, title)
        `)
        .order('created_at', { ascending: false });

      if (lessonId) {
        query = query.eq('lesson_id', lessonId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    } catch (err) {
      console.error('Lỗi lấy tài liệu học liệu:', err);
      return [];
    }
  },

  // Thêm học liệu mới
  async createMaterial(material: Omit<Material, 'id' | 'created_at'>): Promise<Material> {
    if (!isSupabaseConfigured) {
      const stored = localStorage.getItem('local_physics_materials');
      const list: Material[] = stored ? JSON.parse(stored) : [];
      const newMat: Material = {
        ...material,
        id: `mat-${Date.now()}`,
        created_at: new Date().toISOString(),
      };
      list.unshift(newMat);
      localStorage.setItem('local_physics_materials', JSON.stringify(list));
      return newMat;
    }

    const { data, error } = await supabase
      .from('materials')
      .insert([material])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Tải file lên Supabase Storage
  async uploadFile(file: File): Promise<string> {
    if (!isSupabaseConfigured) {
      // Khi chưa có Supabase, tạo object URL hoặc lưu data URL
      return URL.createObjectURL(file);
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `materials/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('physics-materials')
      .upload(filePath, file);

    if (uploadError) {
      throw uploadError;
    }

    const { data } = supabase.storage
      .from('physics-materials')
      .getPublicUrl(filePath);

    return data.publicUrl;
  },

  // Xóa tài liệu
  async deleteMaterial(materialId: string): Promise<void> {
    if (!isSupabaseConfigured) {
      const stored = localStorage.getItem('local_physics_materials');
      if (stored) {
        const list: Material[] = JSON.parse(stored);
        localStorage.setItem('local_physics_materials', JSON.stringify(list.filter(m => m.id !== materialId)));
      }
      return;
    }

    const { error } = await supabase
      .from('materials')
      .delete()
      .eq('id', materialId);

    if (error) throw error;
  }
};
