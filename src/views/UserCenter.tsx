import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../store/auth';
import { UserAddress, UserCoupon } from '../types/api';
import { addressApi, couponApi, orderApi } from '../api';
import { motion } from 'motion/react';
import { User, MapPin, Ticket, Package, ChevronRight, Settings, LogOut, ShieldCheck, Heart } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export const UserCenter: React.FC = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState<UserAddress[]>([]);
  const [coupons, setCoupons] = useState<UserCoupon[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [addr, coup] = await Promise.all([
          addressApi.getList(),
          couponApi.getMy(0)
        ]);
        setAddresses(addr || []);
        setCoupons(coup || []);
      } catch (error) {
        console.error('Failed to fetch user data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { label: '我的订单', icon: <Package size={20} />, path: '/orders', count: 3 },
    { label: '收货地址', icon: <MapPin size={20} />, path: '/address', count: addresses.length },
    { label: '我的优惠券', icon: <Ticket size={20} />, path: '/coupons', count: coupons.length },
    { label: '我的收藏', icon: <Heart size={20} />, path: '/favorites', count: 12 },
    { label: '账户安全', icon: <ShieldCheck size={20} />, path: '/security' },
    { label: '设置', icon: <Settings size={20} />, path: '/settings' },
  ];

  return (
    <div className="min-h-screen bg-stone-50 pb-20">
      {/* Header Profile */}
      <section className="bg-stone-900 text-white pt-20 pb-32">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="w-32 h-32 rounded-[40px] bg-white/10 backdrop-blur-md border border-white/20 p-2 relative">
              <div className="w-full h-full rounded-[32px] overflow-hidden bg-stone-800 flex items-center justify-center">
                {user?.avatar ? (
                  <img src={user.avatar} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                  <User size={48} className="text-stone-600" />
                )}
              </div>
              <button className="absolute -bottom-2 -right-2 w-10 h-10 bg-white text-stone-900 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                <Settings size={18} />
              </button>
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-4xl font-serif italic mb-2">{user?.nickname || user?.username}</h1>
              <p className="text-stone-400 mb-6">{user?.phone || '未绑定手机号'}</p>
              <div className="flex flex-wrap justify-center md:justify-start gap-4">
                <div className="px-4 py-2 bg-white/5 rounded-full border border-white/10 text-xs font-medium">
                  会员等级: <span className="text-amber-400">黄金会员</span>
                </div>
                <div className="px-4 py-2 bg-white/5 rounded-full border border-white/10 text-xs font-medium">
                  健康积分: <span className="text-emerald-400">2,450</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Main Menu */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white rounded-[32px] p-8 border border-stone-100 shadow-sm">
              <h2 className="text-xl font-serif italic text-stone-900 mb-8">个人中心</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {menuItems.map((item) => (
                  <Link 
                    key={item.label} 
                    to={item.path}
                    className="flex items-center justify-between p-6 rounded-3xl bg-stone-50 hover:bg-stone-100 transition-colors group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center text-stone-400 group-hover:text-stone-900 transition-colors">
                        {item.icon}
                      </div>
                      <span className="font-medium text-stone-700">{item.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {item.count !== undefined && (
                        <span className="text-xs font-bold bg-stone-200 text-stone-600 px-2 py-0.5 rounded-full">{item.count}</span>
                      )}
                      <ChevronRight size={16} className="text-stone-300 group-hover:text-stone-900 transition-colors" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Default Address Preview */}
            <div className="bg-white rounded-[32px] p-8 border border-stone-100 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-serif italic text-stone-900">默认收货地址</h2>
                <Link to="/address" className="text-sm font-semibold text-stone-900 hover:underline">管理地址</Link>
              </div>
              {addresses.length > 0 ? (
                <div className="p-6 rounded-3xl bg-stone-50 border border-stone-100">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-bold text-stone-900">{addresses[0].receiverName}</span>
                    <span className="text-stone-500">{addresses[0].receiverPhone}</span>
                  </div>
                  <p className="text-stone-600 text-sm leading-relaxed">
                    {addresses[0].province} {addresses[0].city} {addresses[0].district} {addresses[0].detailAddress}
                  </p>
                </div>
              ) : (
                <div className="text-center py-10 bg-stone-50 rounded-3xl border border-dashed border-stone-200">
                  <p className="text-stone-400 text-sm">暂未设置默认地址</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar Info */}
          <div className="md:col-span-1 space-y-6">
            <div className="bg-stone-900 text-white rounded-[32px] p-8">
              <h3 className="text-xl font-serif italic mb-6">健康报告</h3>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-xs font-medium mb-2">
                    <span className="text-stone-400">每日营养达成率</span>
                    <span>85%</span>
                  </div>
                  <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-400 rounded-full" style={{ width: '85%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs font-medium mb-2">
                    <span className="text-stone-400">水分摄入</span>
                    <span>60%</span>
                  </div>
                  <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-400 rounded-full" style={{ width: '60%' }} />
                  </div>
                </div>
              </div>
              <button className="w-full mt-10 py-3 bg-white/10 hover:bg-white/20 rounded-full text-sm font-semibold transition-colors">
                查看详细报告
              </button>
            </div>

            <button 
              onClick={handleLogout}
              className="w-full py-4 bg-white text-red-500 border border-red-100 rounded-[24px] font-semibold hover:bg-red-50 transition-all flex items-center justify-center gap-2"
            >
              <LogOut size={20} /> 退出登录
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
