import { supabase, isSupabaseConfigured } from './supabase';
import { Profile, Badge } from '../types';
import { INITIAL_BADGES } from '../data/initialCurriculum';

export const profileService = {
  // Lấy profile theo User ID
  async getProfile(userId: string): Promise<Profile | null> {
    if (!isSupabaseConfigured) {
      const stored = localStorage.getItem('current_physics_user');
      return stored ? JSON.parse(stored) : null;
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      console.error('Lỗi lấy profile:', err);
      return null;
    }
  },

  // Cập nhật thông tin profile
  async updateProfile(userId: string, updates: Partial<Profile>): Promise<Profile | null> {
    if (!isSupabaseConfigured) {
      const stored = localStorage.getItem('current_physics_user');
      if (stored) {
        const u = { ...JSON.parse(stored), ...updates };
        localStorage.setItem('current_physics_user', JSON.stringify(u));
        return u;
      }
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      console.error('Lỗi cập nhật profile:', err);
      return null;
    }
  },

  // Lấy danh sách huy hiệu
  async getBadges(userId?: string): Promise<Badge[]> {
    if (!isSupabaseConfigured) {
      return INITIAL_BADGES;
    }

    try {
      const { data: allBadges, error } = await supabase
        .from('badges')
        .select('*');

      if (error || !allBadges || allBadges.length === 0) return INITIAL_BADGES;

      if (userId) {
        const { data: userBadges } = await supabase
          .from('user_badges')
          .select('badge_id')
          .eq('user_id', userId);

        const unlockedIds = new Set(userBadges?.map(ub => ub.badge_id) || []);
        return allBadges.map(b => ({
          ...b,
          unlocked: unlockedIds.has(b.id)
        }));
      }

      return allBadges;
    } catch (err) {
      return INITIAL_BADGES;
    }
  }
};
