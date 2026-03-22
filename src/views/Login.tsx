import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/auth';
import { motion } from 'motion/react';
import { Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';

export const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login({ username, password });
      navigate('/');
    } catch (err: any) {
      setError(err.message || '登录失败，请检查用户名或密码');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-stone-50 px-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-white rounded-[32px] p-8 md:p-12 shadow-xl shadow-stone-200/50 border border-stone-100"
      >
        <div className="text-center mb-10">
          <div className="w-12 h-12 bg-stone-900 rounded-2xl flex items-center justify-center text-white font-bold italic text-xl mx-auto mb-6">E</div>
          <h1 className="text-3xl font-serif italic text-stone-900 mb-2">欢迎回来</h1>
          <p className="text-stone-500">开启您的健康营养之旅</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-4 bg-red-50 text-red-600 text-sm rounded-2xl border border-red-100">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-400 mb-2 ml-1">用户名</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-stone-400">
                <Mail size={18} />
              </div>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="block w-full pl-11 pr-4 py-4 bg-stone-50 border border-stone-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-stone-900/5 focus:border-stone-900 transition-all"
                placeholder="请输入用户名"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-400 mb-2 ml-1">密码</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-stone-400">
                <Lock size={18} />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full pl-11 pr-4 py-4 bg-stone-50 border border-stone-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-stone-900/5 focus:border-stone-900 transition-all"
                placeholder="请输入密码"
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input type="checkbox" className="w-4 h-4 rounded border-stone-300 text-stone-900 focus:ring-stone-900" />
              <span className="text-stone-500 group-hover:text-stone-900 transition-colors">记住我</span>
            </label>
            <Link to="/forgot-password" title="忘记密码" className="text-stone-900 font-medium hover:underline">忘记密码？</Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-stone-900 text-white rounded-full font-semibold hover:bg-stone-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 group"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : (
              <>
                立即登录 <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <div className="mt-10 text-center text-sm text-stone-500">
          还没有账号？{' '}
          <Link to="/register" className="text-stone-900 font-semibold hover:underline">立即注册</Link>
        </div>
      </motion.div>
    </div>
  );
};
