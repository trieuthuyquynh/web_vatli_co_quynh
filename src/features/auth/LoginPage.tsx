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
    <div className="max-w-md mx-auto my-12 p-8 rounded-3xl bg-slate-900/90 border border-slate-700 shadow-2xl space-y-6">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 mx-auto rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/25">
          <Atom className="w-7 h-7 text-white animate-spin-slow" />
        </div>
        <h1 className="text-2xl font-black text-white">Đăng Nhập Tài Khoản</h1>
        <p className="text-xs text-slate-400">Vật Lí 12 - Kết Nối Tri Thức Với Cuộc Sống</p>
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Quick Persona Logins for instant demo */}
      <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
        <div className="flex items-center gap-1.5 text-[11px] font-bold text-cyan-400 uppercase">
          <Sparkles className="w-3.5 h-3.5" /> Đăng nhập trải nghiệm nhanh:
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => { quickLoginAs('teacher'); navigate('/'); }}
            className="px-3 py-2 rounded-xl text-xs font-bold bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 transition text-left"
          >
            👩‍🏫 Cô Quỳnh (Giáo viên)
          </button>
          <button
            type="button"
            onClick={() => { quickLoginAs('student'); navigate('/'); }}
            className="px-3 py-2 rounded-xl text-xs font-bold bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 transition text-left"
          >
            🧑‍🎓 Văn An (Học sinh)
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-300 uppercase">Email</label>
          <div className="relative">
            <input
              type="email"
              required
              placeholder="tenban@thpt.edu.vn"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
            <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-300 uppercase">Mật khẩu</label>
          <div className="relative">
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
            <Key className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl font-bold text-xs bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/20 transition flex items-center justify-center gap-2"
        >
          <LogIn className="w-4 h-4" />
          <span>{loading ? 'Đang xác thực...' : 'Đăng Nhập'}</span>
        </button>
      </form>

      <div className="text-center text-xs text-slate-400">
        Chưa có tài khoản?{' '}
        <Link to="/register" className="text-cyan-400 font-bold hover:underline">
          Đăng ký ngay
        </Link>
      </div>
    </div>
  );
};
