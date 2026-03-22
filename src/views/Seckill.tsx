import React, { useEffect, useState } from 'react';
import { SeckillProduct } from '../types/api';
import { seckillApi } from '../api';
import { formatPrice } from '../utils';
import { motion } from 'motion/react';
import { Zap, Clock, ArrowRight, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Seckill: React.FC = () => {
  const [products, setProducts] = useState<SeckillProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'ongoing' | 'upcoming'>('ongoing');

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = activeTab === 'ongoing' 
        ? await seckillApi.getOngoing() 
        : await seckillApi.getUpcoming();
      setProducts(data || []);
    } catch (error) {
      console.error('Failed to fetch seckill products', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-stone-50 pb-20">
      {/* Banner */}
      <section className="bg-stone-900 text-white py-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-10">
          <Zap size={400} className="rotate-12 translate-x-1/4" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-amber-400 rounded-full flex items-center justify-center text-stone-900">
                <Zap size={24} fill="currentColor" />
              </div>
              <span className="text-amber-400 font-bold tracking-widest uppercase">Flash Sale</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-serif italic mb-6">限时秒杀</h1>
            <p className="text-stone-400 text-lg max-w-xl">
              每日精选好物，限时超低折扣。手慢无，快来抢购吧！
            </p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-10">
        {/* Tabs */}
        <div className="bg-white rounded-full p-2 shadow-xl shadow-stone-200/50 flex gap-2 max-w-md mx-auto mb-16 border border-stone-100">
          <button
            onClick={() => setActiveTab('ongoing')}
            className={`flex-1 py-4 rounded-full text-sm font-bold uppercase tracking-wider transition-all ${
              activeTab === 'ongoing' ? 'bg-stone-900 text-white' : 'text-stone-400 hover:text-stone-900'
            }`}
          >
            正在进行
          </button>
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`flex-1 py-4 rounded-full text-sm font-bold uppercase tracking-wider transition-all ${
              activeTab === 'upcoming' ? 'bg-stone-900 text-white' : 'text-stone-400 hover:text-stone-900'
            }`}
          >
            即将开始
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-stone-300" size={48} />
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <motion.div 
                key={product.seckillId}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-[32px] overflow-hidden border border-stone-100 shadow-sm hover:shadow-md transition-all group"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-stone-50">
                  <img 
                    src={product.image || `https://picsum.photos/seed/${product.id}/600/450`} 
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-4 left-4 px-3 py-1 bg-amber-400 text-stone-900 text-[10px] font-bold uppercase tracking-widest rounded-full">
                    {activeTab === 'ongoing' ? '抢购中' : '预热中'}
                  </div>
                </div>
                <div className="p-8">
                  <h3 className="text-xl font-serif italic text-stone-900 mb-4 line-clamp-1">{product.name}</h3>
                  
                  <div className="flex items-end gap-3 mb-6">
                    <span className="text-3xl font-semibold text-red-500">{formatPrice(product.seckillPrice)}</span>
                    <span className="text-stone-400 line-through mb-1">{formatPrice(product.price)}</span>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between text-xs font-medium mb-1">
                      <span className="text-stone-500">已抢 {Math.round((1 - product.seckillStock / 100) * 100)}%</span>
                      <span className="text-stone-900">剩余 {product.seckillStock} 件</span>
                    </div>
                    <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-stone-900 rounded-full transition-all duration-1000" 
                        style={{ width: `${(1 - product.seckillStock / 100) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div className="mt-8 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-stone-500 text-xs">
                      <Clock size={14} />
                      <span>{activeTab === 'ongoing' ? '距结束 02:14:55' : '12:00 开始'}</span>
                    </div>
                    <Link 
                      to={`/product/${product.id}`}
                      className={`px-6 py-3 rounded-full font-semibold text-sm transition-all flex items-center gap-2 ${
                        activeTab === 'ongoing' 
                        ? 'bg-stone-900 text-white hover:bg-stone-700' 
                        : 'bg-stone-100 text-stone-400 cursor-not-allowed'
                      }`}
                    >
                      {activeTab === 'ongoing' ? '立即抢购' : '提醒我'}
                      <ArrowRight size={16} />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-[32px] border border-dashed border-stone-200">
            <Zap size={48} className="mx-auto text-stone-200 mb-4" />
            <p className="text-stone-400">暂无秒杀活动，敬请期待</p>
          </div>
        )}
      </div>
    </div>
  );
};
