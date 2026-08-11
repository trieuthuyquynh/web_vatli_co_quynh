import { supabase, isSupabaseConfigured } from './supabase';
import { Chapter, Lesson } from '../types';
import { INITIAL_CHAPTERS, INITIAL_LESSONS } from '../data/initialCurriculum';

export const curriculumService = {
  // Lấy danh sách toàn bộ các chương
  async getChapters(): Promise<Chapter[]> {
    if (!isSupabaseConfigured) {
      return INITIAL_CHAPTERS;
    }
    try {
      const { data, error } = await supabase
        .from('chapters')
        .select('*')
        .order('number', { ascending: true });

      if (error || !data || data.length === 0) {
        return INITIAL_CHAPTERS;
      }
      return data;
    } catch (err) {
      console.warn('Lỗi kết nối Supabase, chuyển sang dữ liệu mặc định:', err);
      return INITIAL_CHAPTERS;
    }
  },

  // Lấy danh sách bài học theo chương
  async getLessonsByChapter(chapterId?: string): Promise<Lesson[]> {
    if (!isSupabaseConfigured) {
      if (chapterId) {
        return INITIAL_LESSONS.filter(l => l.chapter_id === chapterId);
      }
      return INITIAL_LESSONS;
    }
    try {
      let query = supabase
        .from('lessons')
        .select('*')
        .order('number', { ascending: true });

      if (chapterId) {
        query = query.eq('chapter_id', chapterId);
      }

      const { data, error } = await query;
      if (error || !data || data.length === 0) {
        return chapterId ? INITIAL_LESSONS.filter(l => l.chapter_id === chapterId) : INITIAL_LESSONS;
      }
      return data;
    } catch (err) {
      console.warn('Lỗi kết nối Supabase:', err);
      return chapterId ? INITIAL_LESSONS.filter(l => l.chapter_id === chapterId) : INITIAL_LESSONS;
    }
  },

  // Lấy chi tiết một bài học
  async getLessonById(lessonId: string): Promise<Lesson | null> {
    if (!isSupabaseConfigured) {
      return INITIAL_LESSONS.find(l => l.id === lessonId) || null;
    }
    try {
      const { data, error } = await supabase
        .from('lessons')
        .select('*')
        .eq('id', lessonId)
        .single();

      if (error || !data) {
        return INITIAL_LESSONS.find(l => l.id === lessonId) || null;
      }
      return data;
    } catch (err) {
      return INITIAL_LESSONS.find(l => l.id === lessonId) || null;
    }
  }
};
