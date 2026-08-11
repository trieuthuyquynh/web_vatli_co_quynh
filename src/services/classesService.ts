import { supabase, isSupabaseConfigured } from './supabase';
import { Class, ClassMember } from '../types';

export const classesService = {
  // Lấy danh sách lớp theo vai trò
  async getClasses(userId: string, role: string): Promise<Class[]> {
    if (!isSupabaseConfigured) {
      const stored = localStorage.getItem('local_physics_classes');
      const list: Class[] = stored ? JSON.parse(stored) : [
        {
          id: 'cls-12a1',
          name: '12A1 - Chuyên Vật Lí',
          code: 'VATLI12A1',
          grade: '12',
          school_year: '2025-2026',
          teacher_id: 'teacher-quynh',
          description: 'Lớp ôn luyện thi tốt nghiệp THPT Quốc gia & ĐGNL',
          created_at: new Date().toISOString(),
          member_count: 42,
        },
        {
          id: 'cls-12a2',
          name: '12A2 - Ôn Thi TN THPT KNTT',
          code: 'VATLI12A2',
          grade: '12',
          school_year: '2025-2026',
          teacher_id: 'teacher-quynh',
          description: 'Lớp luyện dạng câu hỏi Đúng/Sai và Ghép cặp thực hành',
          created_at: new Date().toISOString(),
          member_count: 38,
        }
      ];
      return list;
    }

    try {
      if (role === 'teacher' || role === 'admin') {
        const { data, error } = await supabase
          .from('classes')
          .select(`
            *,
            class_members (id)
          `)
          .eq('teacher_id', userId)
          .order('created_at', { ascending: false });

        if (error) throw error;
        return (data || []).map(c => ({
          ...c,
          member_count: c.class_members?.length || 0
        }));
      } else {
        // Học sinh: Lấy các lớp đã tham gia
        const { data, error } = await supabase
          .from('class_members')
          .select(`
            classes:class_id (
              id, name, code, grade, school_year, teacher_id, description, created_at,
              profiles:teacher_id (full_name, email)
            )
          `)
          .eq('student_id', userId);

        if (error) throw error;
        return (data || []).map((item: any) => item.classes).filter(Boolean);
      }
    } catch (err) {
      console.error('Lỗi lấy danh sách lớp:', err);
      return [];
    }
  },

  // Tạo lớp học mới (Dành cho Giáo viên)
  async createClass(classData: {
    name: string;
    grade: string;
    school_year: string;
    teacher_id: string;
    description?: string;
  }): Promise<Class> {
    const randomCode = 'VL12-' + Math.random().toString(36).substring(2, 7).toUpperCase();

    if (!isSupabaseConfigured) {
      const stored = localStorage.getItem('local_physics_classes');
      const list: Class[] = stored ? JSON.parse(stored) : [];
      const newClass: Class = {
        ...classData,
        id: `cls-${Date.now()}`,
        code: randomCode,
        created_at: new Date().toISOString(),
        member_count: 0
      };
      list.unshift(newClass);
      localStorage.setItem('local_physics_classes', JSON.stringify(list));
      return newClass;
    }

    const { data, error } = await supabase
      .from('classes')
      .insert([{
        ...classData,
        code: randomCode
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Học sinh tham gia lớp bằng mã mời
  async joinClassByCode(code: string, studentId: string): Promise<Class> {
    if (!isSupabaseConfigured) {
      const stored = localStorage.getItem('local_physics_classes');
      const list: Class[] = stored ? JSON.parse(stored) : [];
      const found = list.find(c => c.code.toUpperCase() === code.trim().toUpperCase());
      if (!found) {
        throw new Error('Mã lớp không tồn tại. Vui lòng kiểm tra lại!');
      }
      return found;
    }

    // 1. Tìm lớp theo mã
    const { data: targetClass, error: findError } = await supabase
      .from('classes')
      .select('*')
      .ilike('code', code.trim())
      .single();

    if (findError || !targetClass) {
      throw new Error('Không tìm thấy lớp học với mã này!');
    }

    // 2. Thêm vào bảng class_members
    const { error: joinError } = await supabase
      .from('class_members')
      .insert([{
        class_id: targetClass.id,
        student_id: studentId
      }]);

    if (joinError) {
      if (joinError.code === '23505') {
        throw new Error('Bạn đã tham gia lớp học này rồi!');
      }
      throw joinError;
    }

    return targetClass;
  },

  // Lấy danh sách thành viên học sinh trong lớp
  async getClassMembers(classId: string): Promise<ClassMember[]> {
    if (!isSupabaseConfigured) {
      return [
        {
          id: 'cm-1',
          class_id: classId,
          student_id: 's-1',
          joined_at: new Date().toISOString(),
          status: 'active',
          profiles: {
            id: 's-1',
            email: 'nguyenvanan@thpt.edu.vn',
            full_name: 'Nguyễn Văn An',
            role: 'student',
            xp: 850,
            streak: 5,
          }
        },
        {
          id: 'cm-2',
          class_id: classId,
          student_id: 's-2',
          joined_at: new Date().toISOString(),
          status: 'active',
          profiles: {
            id: 's-2',
            email: 'lethimai@thpt.edu.vn',
            full_name: 'Lê Thị Mai',
            role: 'student',
            xp: 1200,
            streak: 7,
          }
        }
      ];
    }

    try {
      const { data, error } = await supabase
        .from('class_members')
        .select(`
          *,
          profiles:student_id (id, email, full_name, role, avatar_url, xp, streak)
        `)
        .eq('class_id', classId)
        .order('joined_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (err) {
      console.error('Lỗi lấy thành viên lớp:', err);
      return [];
    }
  }
};
