import React, { useEffect, useState } from 'react';
import { Coupon } from '../types/api';
import { couponApi } from '../api';
import { formatPrice, cn } from '../utils';
import { motion, AnimatePresence } from 'motion/react';
import { Ticket, Gift, Clock, CheckCircle2, Loader2, AlertCircle, ArrowRight } from 'lucide-react';
import { useAuthStore } from '../store/auth';
import { useNavigate } from 'react-router-dom';

export const CouponCenter: React.FC = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [receivingId, setReceivingId] = useState<number | null>(null);
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  const fetchCoupons = async () => {
    try {
      const data = await couponApi.getAvailable();
      setCoupons(data || []);
    } catch (error) {
      console.error('Failed to fetch available coupons', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleReceive = async (couponId: number) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setReceivingId(couponId);
    try {
      await couponApi.receive(couponId);
      // Refresh list or show success state
      alert('领取成功！');
      fetchCoupons();
    } catch (error) {
      console.error('Failed to receive coupon', error);
      alert('领取失败，请稍后再试');
    } finally {
      setReceivingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-stone-400" size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 pb-20">
      {/* Hero Section */}
      <section className="bg-stone-900 text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-stone-400 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl" />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <span className="inline-block px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-full text-xs font-bold tracking-widest uppercase mb-6">
              Exclusive Rewards
            </span>
            <h1 className="text-5xl md:text-6xl font-serif italic mb-6">领券中心</h1>
            <p className="text-stone-400 max-w-2xl mx-auto text-lg leading-relaxed">
              在这里领取您的专属优惠，开启健康生活新篇章。每一份优惠都是我们对您健康的承诺。
            </p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
        {coupons.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {coupons.map((coupon, index) => (
              <motion.div
                key={coupon.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group relative bg-white rounded-[40px] overflow-hidden border border-stone-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500"
              >
                {/* Coupon Design */}
                <div className="p-8">
                  <div className="flex justify-between items-start mb-10">
                    <div className="w-12 h-12 bg-stone-50 rounded-2xl flex items-center justify-center text-stone-900 group-hover:bg-stone-900 group-hover:text-white transition-colors duration-500">
                      <Ticket size={24} />
                    </div>
                    <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-bold rounded-full uppercase tracking-wider">
                      {coupon.type === 0 ? '满减券' : '折扣券'}
                    </span>
                  </div>

                  <div className="mb-8">
                    <div className="flex items-baseline gap-1 mb-2">
                      <span className="text-4xl font-bold text-stone-900">
                        {coupon.type === 0 ? formatPrice(coupon.value).replace('¥', '') : `${coupon.value * 10}折`}
                      </span>
                      {coupon.type === 0 && <span className="text-lg font-medium text-stone-400">元</span>}
                    </div>
                    <p className="text-stone-500 text-sm font-medium">
                      满 {formatPrice(coupon.minAmount)} 可用
                    </p>
                  </div>

                  <div className="space-y-3 mb-10">
                    <h3 className="text-lg font-serif italic text-stone-900">{coupon.name}</h3>
                    <div className="flex items-center gap-2 text-xs text-stone-400">
                      <Clock size={14} />
                      <span>有效期至: {new Date(coupon.endTime).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleReceive(coupon.id)}
                    disabled={receivingId === coupon.id}
                    className={cn(
                      "w-full py-4 rounded-2xl font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2",
                      receivingId === coupon.id
                        ? "bg-stone-100 text-stone-400 cursor-not-allowed"
                        : "bg-stone-900 text-white hover:bg-stone-800 shadow-lg shadow-stone-200"
                    )}
                  >
                    {receivingId === coupon.id ? (
                      <Loader2 className="animate-spin" size={18} />
                    ) : (
                      <>立即领取 <ArrowRight size={16} /></>
                    )}
                  </button>
                </div>

                {/* Decorative Elements */}
                <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-stone-50 rounded-full border border-stone-100" />
                <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-stone-50 rounded-full border border-stone-100" />
                <div className="absolute left-8 right-8 top-1/2 -translate-y-1/2 border-t border-dashed border-stone-100" />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-[48px] p-20 text-center border border-stone-100 shadow-sm">
            <div className="w-24 h-24 bg-stone-50 rounded-full flex items-center justify-center text-stone-200 mx-auto mb-8">
              <Gift size={48} />
            </div>
            <h2 className="text-3xl font-serif italic text-stone-900 mb-4">暂无可用优惠券</h2>
            <p className="text-stone-400 max-w-md mx-auto mb-10">
              目前没有可以领取的优惠券，请关注我们的后续活动或查看您的账户。
            </p>
            <button
              onClick={() => navigate('/products')}
              className="px-10 py-4 bg-stone-900 text-white rounded-full font-bold hover:bg-stone-700 transition-all"
            >
              去逛逛商品
            </button>
          </div>
        )}

        {/* Tips Section */}
        <section className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="flex gap-6">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-stone-900 shadow-sm flex-shrink-0">
              <CheckCircle2 size={24} />
            </div>
            <div>
              <h4 className="font-serif italic text-lg mb-2">领取规则</h4>
              <p className="text-sm text-stone-500 leading-relaxed">
                每个用户每张优惠券限领一次，领取后请在有效期内使用。
              </p>
            </div>
          </div>
          <div className="flex gap-6">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-stone-900 shadow-sm flex-shrink-0">
              <AlertCircle size={24} />
            </div>
            <div>
              <h4 className="font-serif italic text-lg mb-2">使用限制</h4>
              <p className="text-sm text-stone-500 leading-relaxed">
                优惠券不可叠加使用，每笔订单仅限使用一张。
              </p>
            </div>
          </div>
          <div className="flex gap-6">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-stone-900 shadow-sm flex-shrink-0">
              <Gift size={24} />
            </div>
            <div>
              <h4 className="font-serif italic text-lg mb-2">更多福利</h4>
              <p className="text-sm text-stone-500 leading-relaxed">
                关注 Eden Nutrition 官方公众号，获取更多隐藏福利。
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
