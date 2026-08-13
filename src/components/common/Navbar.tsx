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
  School,
  ChevronDown
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
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <ShieldCheck className="w-3.5 h-3.5 text-rose-600" /> Admin
          </span>
        );
      case 'teacher':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-200">
            <GraduationCap className="w-3.5 h-3.5 text-sky-600" /> Giáo Viên
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <School className="w-3.5 h-3.5 text-amber-600" /> Học Sinh
          </span>
        );
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/90 bg-white/95 backdrop-blur-md shadow-[0_1px_3px_rgba(0,0,0,0.03)] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 via-blue-600 to-indigo-600 flex items-center justify-center shadow-md shadow-sky-500/20 group-hover:scale-105 transition-transform duration-300">
              <Atom className="w-6 h-6 text-white animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base tracking-tight bg-gradient-to-r from-sky-600 via-blue-700 to-indigo-800 bg-clip-text text-transparent">
                  VẬT LÍ 12
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-sky-100 text-sky-800 border border-sky-200">
                  KNTT
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">Cô Quỳnh Physics Hub</p>
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
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-sky-50 text-sky-700 border border-sky-200 font-semibold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-sky-600' : 'text-slate-400'}`} />
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
                title="Bấm để chuyển nhanh vai trò kiểm thử"
                className="flex items-center gap-1.5 text-xs bg-slate-100 hover:bg-slate-200/80 px-2.5 py-1.5 rounded-xl border border-slate-200 text-slate-700 transition"
              >
                {getRoleBadge()}
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {showRoleSwitcher && (
                <div className="absolute right-0 mt-2 w-60 p-2 rounded-2xl bg-white border border-slate-200 shadow-xl z-50 animate-in fade-in zoom-in-95">
                  <p className="text-[11px] font-bold text-slate-400 px-3 py-1 uppercase tracking-wider">
                    Đổi nhanh vai trò:
                  </p>
                  <button
                    onClick={() => { quickLoginAs('teacher'); setShowRoleSwitcher(false); }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs rounded-xl hover:bg-sky-50 text-left text-slate-800 hover:text-sky-700 transition"
                  >
                    <div className="p-1.5 rounded-lg bg-sky-100 text-sky-600">
                      <GraduationCap className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-800">Cô Quỳnh (Giáo Viên)</div>
                      <div className="text-[10px] text-slate-500">Tạo lớp, học liệu, ngân hàng game</div>
                    </div>
                  </button>
                  <button
                    onClick={() => { quickLoginAs('student'); setShowRoleSwitcher(false); }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs rounded-xl hover:bg-amber-50 text-left text-slate-800 hover:text-amber-700 transition"
                  >
                    <div className="p-1.5 rounded-lg bg-amber-100 text-amber-600">
                      <School className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-800">Nguyễn Văn An (Học Sinh)</div>
                      <div className="text-[10px] text-slate-500">Chơi 3 dạng game, tích lũy XP</div>
                    </div>
                  </button>
                  <button
                    onClick={() => { quickLoginAs('admin'); setShowRoleSwitcher(false); }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs rounded-xl hover:bg-rose-50 text-left text-slate-800 hover:text-rose-700 transition"
                  >
                    <div className="p-1.5 rounded-lg bg-rose-100 text-rose-600">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-800">Quản Trị Viên (Admin)</div>
                      <div className="text-[10px] text-slate-500">Toàn quyền hệ thống</div>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {user ? (
              <div className="flex items-center gap-3 pl-2 border-l border-slate-200">
                {/* Gamification Stats */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 text-xs font-bold" title="Chuỗi ngày học liên tục">
                    <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500 animate-pulse" />
                    <span>{user.streak || 1} ngày</span>
                  </div>
                  <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-sky-50 border border-sky-200 text-sky-700 text-xs font-bold" title="Điểm kinh nghiệm Vật lí">
                    <Zap className="w-3.5 h-3.5 fill-sky-500 text-sky-500" />
                    <span>{user.xp || 0} XP</span>
                  </div>
                </div>

                {/* Profile Avatar & Logout */}
                <Link to="/profile" className="flex items-center gap-2 group" title="Xem hồ sơ">
                  <img
                    src={user.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.full_name}`}
                    alt={user.full_name}
                    className="w-8 h-8 rounded-full border-2 border-sky-300 object-cover group-hover:border-sky-500 transition"
                  />
                  <span className="text-xs font-semibold text-slate-700 max-w-[110px] truncate hidden lg:inline">
                    {user.full_name}
                  </span>
                </Link>

                <button
                  onClick={handleLogout}
                  title="Đăng xuất"
                  className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition"
                >
                  <LogIn className="w-3.5 h-3.5" /> Đăng nhập
                </Link>
                <Link
                  to="/register"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-sky-600 hover:bg-sky-500 text-white shadow-sm shadow-sky-500/20 transition"
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
              className="p-1.5 text-xs bg-slate-100 rounded-lg border border-slate-200"
            >
              {getRoleBadge()}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2 shadow-lg">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium ${
                  isActive
                    ? 'bg-sky-50 text-sky-700 border border-sky-200 font-semibold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Icon className="w-5 h-5 text-sky-600" />
                {item.name}
              </Link>
            );
          })}

          <div className="pt-4 border-t border-slate-200">
            {user ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <div className="flex items-center gap-2">
                    <img
                      src={user.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.full_name}`}
                      alt={user.full_name}
                      className="w-7 h-7 rounded-full border border-sky-400"
                    />
                    <span className="font-bold">{user.full_name}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-amber-700 font-bold">🔥 {user.streak || 1}d</span>
                    <span className="text-sky-700 font-bold">⚡ {user.xp || 0} XP</span>
                  </div>
                </div>
                <button
                  onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 text-xs font-bold text-rose-700 bg-rose-50 border border-rose-200 rounded-xl"
                >
                  <LogOut className="w-4 h-4" /> Đăng xuất
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 text-sm font-bold text-slate-700 bg-slate-100 rounded-xl"
                >
                  Đăng nhập
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 text-sm font-bold bg-sky-600 text-white rounded-xl shadow-sm"
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

