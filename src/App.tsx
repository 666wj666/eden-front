import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { Header } from './components/Header';
import { Home } from './views/Home';
import { Login } from './views/Login';
import { ProductList } from './views/ProductList';
import { ProductDetail } from './views/ProductDetail';
import { Cart } from './views/Cart';
import { Checkout } from './views/Checkout';
import { CouponCenter } from './views/CouponCenter';
import { OrderList } from './views/OrderList';
import { UserCenter } from './views/UserCenter';
import { Seckill } from './views/Seckill';
import { useAuthStore } from './store/auth';

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

export default function App() {
  const { fetchUserInfo, isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      fetchUserInfo();
    }
  }, [isAuthenticated]);

  return (
    <Router>
      <div className="min-h-screen bg-stone-50 font-sans selection:bg-stone-900 selection:text-white">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/products" element={<ProductList />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/seckill" element={<Seckill />} />
            <Route path="/coupons" element={<CouponCenter />} />
            
            {/* Protected Routes */}
            <Route path="/cart" element={<PrivateRoute><Cart /></PrivateRoute>} />
            <Route path="/checkout" element={<PrivateRoute><Checkout /></PrivateRoute>} />
            <Route path="/orders" element={<PrivateRoute><OrderList /></PrivateRoute>} />
            <Route path="/user" element={<PrivateRoute><UserCenter /></PrivateRoute>} />
            
            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
        
        <footer className="bg-white border-t border-stone-100 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
              <div className="col-span-1 md:col-span-2">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-8 h-8 bg-stone-900 rounded-lg flex items-center justify-center text-white font-bold italic">E</div>
                  <span className="text-xl font-serif italic font-bold tracking-tight text-stone-900">Eden Nutrition</span>
                </div>
                <p className="text-stone-500 max-w-sm leading-relaxed">
                  我们致力于为您提供最纯净、最科学的营养补给方案。在大自然的馈赠与现代科学的交汇点，守护您的每一份健康。
                </p>
              </div>
              <div>
                <h4 className="text-sm font-bold uppercase tracking-widest text-stone-900 mb-6">快速链接</h4>
                <ul className="space-y-4 text-sm text-stone-500">
                  <li><Link to="/products" className="hover:text-stone-900 transition-colors">全部商品</Link></li>
                  <li><Link to="/seckill" className="hover:text-stone-900 transition-colors">限时秒杀</Link></li>
                  <li><Link to="/coupons" className="hover:text-stone-900 transition-colors">领券中心</Link></li>
                  <li><Link to="/about" className="hover:text-stone-900 transition-colors">关于我们</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-bold uppercase tracking-widest text-stone-900 mb-6">联系我们</h4>
                <ul className="space-y-4 text-sm text-stone-500">
                  <li>客服热线: 400-123-4567</li>
                  <li>在线时间: 9:00 - 22:00</li>
                  <li>邮箱: support@eden-nutrition.com</li>
                  <li>地址: 上海市黄浦区南京东路 888 号</li>
                </ul>
              </div>
            </div>
            <div className="mt-12 pt-8 border-t border-stone-50 text-center text-xs text-stone-400">
              © 2026 Eden Nutrition. All rights reserved.
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}
