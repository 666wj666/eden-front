import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, LogOut, Search, Menu, X } from 'lucide-react';
import { useAuthStore } from '../store/auth';
import { cn } from '../utils';

export const Header: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-stone-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-stone-900 rounded-lg flex items-center justify-center text-white font-bold italic">E</div>
            <span className="text-xl font-serif italic font-bold tracking-tight text-stone-900">Eden Nutrition</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <NavLink to="/" className={({ isActive }) => cn("text-sm font-medium transition-colors hover:text-stone-900", isActive ? "text-stone-900" : "text-stone-500")}>首页</NavLink>
            <NavLink to="/products" className={({ isActive }) => cn("text-sm font-medium transition-colors hover:text-stone-900", isActive ? "text-stone-900" : "text-stone-500")}>全部商品</NavLink>
            <NavLink to="/seckill" className={({ isActive }) => cn("text-sm font-medium transition-colors hover:text-stone-900", isActive ? "text-stone-900" : "text-stone-500")}>限时秒杀</NavLink>
            <NavLink to="/coupons" className={({ isActive }) => cn("text-sm font-medium transition-colors hover:text-stone-900", isActive ? "text-stone-900" : "text-stone-500")}>领券中心</NavLink>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <button className="p-2 text-stone-500 hover:text-stone-900 transition-colors">
              <Search size={20} />
            </button>
            <Link to="/cart" className="p-2 text-stone-500 hover:text-stone-900 transition-colors relative">
              <ShoppingCart size={20} />
              <span className="absolute top-0 right-0 w-4 h-4 bg-stone-900 text-white text-[10px] flex items-center justify-center rounded-full">0</span>
            </Link>
            
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <Link to="/user" className="flex items-center gap-2 text-stone-700 hover:text-stone-900 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center overflow-hidden">
                    {user?.avatar ? <img src={user.avatar} className="w-full h-full object-cover" referrerPolicy="no-referrer" /> : <User size={16} />}
                  </div>
                  <span className="hidden lg:block text-sm font-medium">{user?.nickname || user?.username}</span>
                </Link>
                <button onClick={handleLogout} className="p-2 text-stone-500 hover:text-stone-900 transition-colors">
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <Link to="/login" className="text-sm font-medium px-4 py-2 bg-stone-900 text-white rounded-full hover:bg-stone-700 transition-colors">
                登录
              </Link>
            )}

            <button className="md:hidden p-2 text-stone-500" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-b border-stone-100 px-4 py-4 flex flex-col gap-4">
          <NavLink to="/" className="text-base font-medium text-stone-600" onClick={() => setIsMenuOpen(false)}>首页</NavLink>
          <NavLink to="/products" className="text-base font-medium text-stone-600" onClick={() => setIsMenuOpen(false)}>全部商品</NavLink>
          <NavLink to="/seckill" className="text-base font-medium text-stone-600" onClick={() => setIsMenuOpen(false)}>限时秒杀</NavLink>
          <NavLink to="/coupons" className="text-base font-medium text-stone-600" onClick={() => setIsMenuOpen(false)}>领券中心</NavLink>
        </div>
      )}
    </header>
  );
};
