import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  Atom, 
  BookOpen, 
  FolderDown, 
  Users, 
  Gamepad2, 
  Trophy, 
  Flame, 
  Zap, 
  LogOut, 
  LogIn, 
  UserPlus, 
  Menu, 
  X, 
  ShieldCheck, 
  GraduationCap, 
  School
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, role, signOut, quickLoginAs } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showRoleSwitcher, setShowRoleSwitcher] = useState(false);

  const navLinks = [
    { name: 'Chương Trình SGK', path: '/curriculum', icon: BookOpen },
    { name: 'Kho Học Liệu', path: '/materials', icon: FolderDown },
    { name: 'Quản Lý Lớp', path: '/classes', icon: Users },
    { name: 'Đấu Trường Game', path: '/games', icon: Gamepad2 },
    { name: 'Bảng Xếp Hạng', path: '/leaderboard', icon: Trophy },
  ];

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  const getRoleBadge = () => {
    switch (role) {
      case 'admin':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/30">
            <ShieldCheck className="w-3.5 h-3.5" /> Admin
          </span>
        );
      case 'teacher':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
            <GraduationCap className="w-3.5 h-3.5" /> Giáo Viên
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
            <School className="w-3.5 h-3.5" /> Học Sinh
          </span>
        );
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#0B0F19]/90 backdrop-blur-xl transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform duration-300">
              <Atom className="w-6 h-6 text-white animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base tracking-tight bg-gradient-to-r from-cyan-400 via-blue-300 to-indigo-300 bg-clip-text text-transparent">
                  VẬT LÍ 12
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  KNTT
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">Cô Quỳnh Physics Lab</p>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname.startsWith(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 shadow-sm shadow-cyan-500/10'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Bar */}
          <div className="hidden md:flex items-center gap-3">
            {/* Quick Role Switcher Helper */}
            <div className="relative">
              <button
                onClick={() => setShowRoleSwitcher(!showRoleSwitcher)}
                title="Bấm để chuyển nhanh vai trò test"
                className="flex items-center gap-1.5 text-xs bg-slate-800/80 hover:bg-slate-700/80 px-2.5 py-1.5 rounded-lg border border-slate-700 transition"
              >
                {getRoleBadge()}
                <span className="text-[10px] text-slate-400 underline">Đổi vai trò</span>
              </button>

              {showRoleSwitcher && (
                <div className="absolute right-0 mt-2 w-56 p-2 rounded-xl bg-slate-900 border border-slate-700 shadow-2xl z-50 animate-in fade-in zoom-in-95">
                  <p className="text-[11px] font-semibold text-slate-400 px-2 py-1 uppercase tracking-wider">
                    Chọn nhanh vai trò:
                  </p>
                  <button
                    onClick={() => { quickLoginAs('teacher'); setShowRoleSwitcher(false); }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs rounded-lg hover:bg-cyan-500/20 text-left text-slate-200 hover:text-cyan-300"
                  >
                    <GraduationCap className="w-4 h-4 text-cyan-400" />
                    <div>
                      <div className="font-semibold">Cô Quỳnh (Giáo Viên)</div>
                      <div className="text-[10px] text-slate-400">Tạo lớp, học liệu, ngân hàng game</div>
                    </div>
                  </button>
                  <button
                    onClick={() => { quickLoginAs('student'); setShowRoleSwitcher(false); }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs rounded-lg hover:bg-amber-500/20 text-left text-slate-200 hover:text-amber-300"
                  >
                    <School className="w-4 h-4 text-amber-400" />
                    <div>
                      <div className="font-semibold">Nguyễn Văn An (Học Sinh)</div>
                      <div className="text-[10px] text-slate-400">Chơi 3 dạng game, tích lũy XP</div>
                    </div>
                  </button>
                  <button
                    onClick={() => { quickLoginAs('admin'); setShowRoleSwitcher(false); }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs rounded-lg hover:bg-rose-500/20 text-left text-slate-200 hover:text-rose-300"
                  >
                    <ShieldCheck className="w-4 h-4 text-rose-400" />
                    <div>
                      <div className="font-semibold">Quản Trị Viên (Admin)</div>
                      <div className="text-[10px] text-slate-400">Toàn quyền hệ thống</div>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {user ? (
              <div className="flex items-center gap-3 pl-2 border-l border-slate-800">
                {/* Gamification Stats */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold" title="Chuỗi ngày học liên tục">
                    <Flame className="w-3.5 h-3.5 fill-amber-400 animate-pulse" />
                    <span>{user.streak || 1} ngày</span>
                  </div>
                  <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold" title="Điểm kinh nghiệm Vật lí">
                    <Zap className="w-3.5 h-3.5 fill-cyan-400" />
                    <span>{user.xp || 0} XP</span>
                  </div>
                </div>

                {/* Profile Avatar & Logout */}
                <Link to="/profile" className="flex items-center gap-2 group" title="Xem hồ sơ">
                  <img
                    src={user.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.full_name}`}
                    alt={user.full_name}
                    className="w-8 h-8 rounded-full border border-cyan-500/40 object-cover group-hover:border-cyan-400 transition"
                  />
                  <span className="text-xs font-medium text-slate-200 max-w-[100px] truncate hidden lg:inline">
                    {user.full_name}
                  </span>
                </Link>

                <button
                  onClick={handleLogout}
                  title="Đăng xuất"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-200 hover:text-white hover:bg-slate-800 transition"
                >
                  <LogIn className="w-3.5 h-3.5" /> Đăng nhập
                </Link>
                <Link
                  to="/register"
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-400 hover:to-blue-500 shadow-md shadow-cyan-500/20 transition"
                >
                  <UserPlus className="w-3.5 h-3.5" /> Đăng ký
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setShowRoleSwitcher(!showRoleSwitcher)}
              className="p-1.5 text-xs bg-slate-800 rounded border border-slate-700"
            >
              {getRoleBadge()}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-[#0B0F19]/95 px-4 pt-3 pb-6 space-y-2">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium ${
                  isActive
                    ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                    : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <Icon className="w-5 h-5 text-cyan-400" />
                {item.name}
              </Link>
            );
          })}

          <div className="pt-4 border-t border-slate-800">
            {user ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-300 bg-slate-900/60 p-3 rounded-lg border border-slate-800">
                  <div className="flex items-center gap-2">
                    <img
                      src={user.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.full_name}`}
                      alt={user.full_name}
                      className="w-7 h-7 rounded-full border border-cyan-500/40"
                    />
                    <span className="font-semibold">{user.full_name}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-amber-400 font-bold">🔥 {user.streak || 1}d</span>
                    <span className="text-cyan-400 font-bold">⚡ {user.xp || 0} XP</span>
                  </div>
                </div>
                <button
                  onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                  className="w-full flex items-center justify-center gap-2 py-2 text-xs font-semibold text-rose-400 bg-rose-500/10 rounded-lg"
                >
                  <LogOut className="w-4 h-4" /> Đăng xuất
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2 text-sm font-semibold text-slate-200 bg-slate-800 rounded-lg"
                >
                  Đăng nhập
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2 text-sm font-semibold bg-cyan-500 text-white rounded-lg"
                >
                  Đăng ký tài khoản
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
