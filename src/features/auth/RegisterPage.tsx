import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import { Atom, UserPlus, Key, Mail, User, AlertCircle, School, GraduationCap } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('student');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      setError('Mật khẩu tối thiểu 6 ký tự.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await signUp(email.trim(), password, fullName.trim(), role);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Lỗi khi đăng ký tài khoản.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-12 p-8 sm:p-9 rounded-3xl bg-white border border-slate-200/90 shadow-soft space-y-6">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 mx-auto rounded-2xl bg-sky-600 flex items-center justify-center shadow-md shadow-sky-600/20">
          <Atom className="w-7 h-7 text-white animate-spin-slow" />
        </div>
        <h1 className="text-2xl font-black text-slate-900">Đăng Ký Tài Khoản</h1>
        <p className="text-xs text-slate-500">Tham gia hệ thống học tập Vật Lí 12 KNTT</p>
      </div>

      {error && (
        <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* Role Selection */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700 uppercase">Bạn là:</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setRole('student')}
              className={`p-3 rounded-2xl border flex items-center justify-center gap-2 text-xs font-bold transition ${
                role === 'student'
                  ? 'bg-amber-50 border-amber-400 text-amber-900 ring-2 ring-amber-400/20 shadow-xs'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              <School className="w-4 h-4" /> Học Sinh 12
            </button>

            <button
              type="button"
              onClick={() => setRole('teacher')}
              className={`p-3 rounded-2xl border flex items-center justify-center gap-2 text-xs font-bold transition ${
                role === 'teacher'
                  ? 'bg-sky-50 border-sky-400 text-sky-900 ring-2 ring-sky-400/20 shadow-xs'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              <GraduationCap className="w-4 h-4" /> Giáo Viên
            </button>
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700 uppercase">Họ và tên *</label>
          <div className="relative">
            <input
              type="text"
              required
              placeholder="VD: Nguyễn Văn An"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
            />
            <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700 uppercase">Email *</label>
          <div className="relative">
            <input
              type="email"
              required
              placeholder="tenban@thpt.edu.vn"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
            />
            <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700 uppercase">Mật khẩu *</label>
          <div className="relative">
            <input
              type="password"
              required
              placeholder="Tối thiểu 6 ký tự"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
            />
            <Key className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-2xl font-bold text-xs bg-sky-600 hover:bg-sky-500 text-white shadow-md shadow-sky-600/20 transition flex items-center justify-center gap-2 active:scale-95"
        >
          <UserPlus className="w-4 h-4" />
          <span>{loading ? 'Đang tạo tài khoản...' : 'Tạo Tài Khoản'}</span>
        </button>
      </form>

      <div className="text-center text-xs text-slate-500">
        Đã có tài khoản?{' '}
        <Link to="/login" className="text-sky-700 font-bold hover:underline">
          Đăng nhập ngay
        </Link>
      </div>
    </div>
  );
};

