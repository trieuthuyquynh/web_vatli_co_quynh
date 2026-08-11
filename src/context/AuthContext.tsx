import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '../services/supabase';
import { Profile, UserRole } from '../types';

interface AuthContextType {
  user: Profile | null;
  role: UserRole | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string, role: UserRole) => Promise<void>;
  signOut: () => Promise<void>;
  quickLoginAs: (role: UserRole) => void;
  updateUserXp: (additionalXp: number) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Các tài khoản demo mặc định khi chưa kết nối Supabase hoặc trải nghiệm nhanh
const DEMO_ACCOUNTS: Record<UserRole, Profile> = {
  admin: {
    id: 'admin-01',
    email: 'admin.physics@edu.vn',
    full_name: 'Thầy Quản Trị Hệ Thống',
    role: 'admin',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    school: 'Sở GD&ĐT / THPT',
    xp: 9999,
    streak: 30,
  },
  teacher: {
    id: 'teacher-quynh',
    email: 'coquynh.vatli@gmail.com',
    full_name: 'Cô Quỳnh (Giáo Viên Vật Lí 12)',
    role: 'teacher',
    avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    school: 'Trường THPT Chuyên',
    xp: 5400,
    streak: 21,
  },
  student: {
    id: 'student-an',
    email: 'nguyenvanan@thpt.edu.vn',
    full_name: 'Nguyễn Văn An (Học sinh 12A1)',
    role: 'student',
    avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
    school: 'THPT Kết Nối Tri Thức',
    grade: '12',
    xp: 1250,
    streak: 7,
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<Profile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Khởi tạo Auth state
  useEffect(() => {
    async function initAuth() {
      if (!isSupabaseConfigured) {
        const localUser = localStorage.getItem('current_physics_user');
        if (localUser) {
          try {
            setUser(JSON.parse(localUser));
          } catch {
            setUser(DEMO_ACCOUNTS.teacher);
          }
        } else {
          // Mặc định chọn tài khoản Giáo viên (Cô Quỳnh) để trải nghiệm toàn bộ tính năng quản lý
          setUser(DEMO_ACCOUNTS.teacher);
          localStorage.setItem('current_physics_user', JSON.stringify(DEMO_ACCOUNTS.teacher));
        }
        setLoading(false);
        return;
      }

      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (profile) {
            setUser(profile);
          } else {
            // Profile fallback
            const newProfile: Profile = {
              id: session.user.id,
              email: session.user.email || '',
              full_name: session.user.user_metadata?.full_name || 'Người học Vật Lí',
              role: (session.user.user_metadata?.role as UserRole) || 'student',
              xp: 0,
              streak: 1,
            };
            setUser(newProfile);
          }
        }
      } catch (err) {
        console.error('Lỗi phiên đăng nhập:', err);
      } finally {
        setLoading(false);
      }

      // Lắng nghe thay đổi auth state Supabase
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
        if (session?.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
          if (profile) setUser(profile);
        } else {
          setUser(null);
        }
      });

      return () => {
        subscription.unsubscribe();
      };
    }

    initAuth();
  }, []);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      if (!isSupabaseConfigured) {
        // Mock sign in fallback
        let targetRole: UserRole = 'student';
        if (email.includes('teacher') || email.includes('quynh')) targetRole = 'teacher';
        if (email.includes('admin')) targetRole = 'admin';

        const customUser: Profile = {
          ...DEMO_ACCOUNTS[targetRole],
          email,
          full_name: email.split('@')[0],
        };
        setUser(customUser);
        localStorage.setItem('current_physics_user', JSON.stringify(customUser));
        return;
      }

      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      if (data.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();
        if (profile) setUser(profile);
      }
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, fullName: string, role: UserRole) => {
    setLoading(true);
    try {
      if (!isSupabaseConfigured) {
        const newUser: Profile = {
          id: `usr-${Date.now()}`,
          email,
          full_name: fullName,
          role,
          avatar_url: `https://api.dicebear.com/7.x/bottts/svg?seed=${fullName}`,
          xp: 100,
          streak: 1,
          created_at: new Date().toISOString(),
        };
        setUser(newUser);
        localStorage.setItem('current_physics_user', JSON.stringify(newUser));
        return;
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role: role,
          },
        },
      });

      if (error) throw error;

      if (data.user) {
        // Chờ trigger hoặc tự tạo profile
        const newProfile: Profile = {
          id: data.user.id,
          email,
          full_name: fullName,
          role,
          xp: 100,
          streak: 1,
        };
        setUser(newProfile);
      }
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
    setUser(null);
    localStorage.removeItem('current_physics_user');
  };

  const quickLoginAs = (role: UserRole) => {
    const account = DEMO_ACCOUNTS[role];
    setUser(account);
    localStorage.setItem('current_physics_user', JSON.stringify(account));
  };

  const updateUserXp = (additionalXp: number) => {
    if (!user) return;
    const updated = { ...user, xp: (user.xp || 0) + additionalXp };
    setUser(updated);
    if (!isSupabaseConfigured) {
      localStorage.setItem('current_physics_user', JSON.stringify(updated));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || null,
        loading,
        signIn,
        signUp,
        signOut,
        quickLoginAs,
        updateUserXp,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
