import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Atom, LogIn, Key, Mail, AlertCircle, Sparkles } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { signIn, quickLoginAs } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await signIn(email.trim(), password);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Email hoặc mật khẩu không chính xác.');
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
        <h1 className="text-2xl font-black text-slate-900">Đăng Nhập Tài Khoản</h1>
        <p className="text-xs text-slate-500">Vật Lí 12 - Kết Nối Tri Thức Với Cuộc Sống</p>
      </div>

      {error && (
        <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          <span>{error}</span>
        </div>
      )}

      {/* Quick Persona Logins for instant demo */}
      <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
        <div className="flex items-center gap-1.5 text-[11px] font-black text-sky-700 uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-sky-600" /> Đăng nhập trải nghiệm nhanh:
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => { quickLoginAs('teacher'); navigate('/'); }}
            className="px-3 py-2 rounded-xl text-xs font-bold bg-white hover:bg-sky-50 text-sky-800 border border-slate-200 shadow-xs transition text-left"
          >
            👩‍🏫 Cô Quỳnh (Giáo viên)
          </button>
          <button
            type="button"
            onClick={() => { quickLoginAs('student'); navigate('/'); }}
            className="px-3 py-2 rounded-xl text-xs font-bold bg-white hover:bg-amber-50 text-amber-800 border border-slate-200 shadow-xs transition text-left"
          >
            🧑‍🎓 Văn An (Học sinh)
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700 uppercase">Email</label>
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
          <label className="text-xs font-bold text-slate-700 uppercase">Mật khẩu</label>
          <div className="relative">
            <input
              type="password"
              required
              placeholder="••••••••"
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
          <LogIn className="w-4 h-4" />
          <span>{loading ? 'Đang xác thực...' : 'Đăng Nhập'}</span>
        </button>
      </form>

      <div className="text-center text-xs text-slate-500">
        Chưa có tài khoản?{' '}
        <Link to="/register" className="text-sky-700 font-bold hover:underline">
          Đăng ký ngay
        </Link>
      </div>
    </div>
  );
};

