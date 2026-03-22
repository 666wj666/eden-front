import React, { useEffect, useState } from 'react';
import { ProductVO } from '../types/api';
import { productApi } from '../api';
import { ProductCard } from '../components/ProductCard';
import { motion } from 'motion/react';
import { ArrowRight, Leaf, Zap, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Home: React.FC = () => {
  const [hotProducts, setHotProducts] = useState<ProductVO[]>([]);
  const [recommendProducts, setRecommendProducts] = useState<ProductVO[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [hot, recommend] = await Promise.all([
          productApi.getHot(4),
          productApi.getRecommend(8)
        ]);
        setHotProducts(hot || []);
        setRecommendProducts(recommend || []);
      } catch (error) {
        console.error('Failed to fetch products', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center overflow-hidden bg-stone-900 text-white">
        <div className="absolute inset-0 opacity-40">
          <img 
            src="https://images.unsplash.com/photo-1490818387583-1baba5e638af?auto=format&fit=crop&q=80&w=1920" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <span className="inline-block px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-semibold tracking-widest uppercase mb-6">
              Pure & Organic Nutrition
            </span>
            <h1 className="text-5xl md:text-7xl font-serif italic leading-tight mb-6">
              Nourish Your Body,<br />Elevate Your Life.
            </h1>
            <p className="text-lg text-stone-300 mb-10 max-w-lg">
              探索大自然的奥秘，为您提供最纯净、最有效的营养补给。从源头到餐桌，守护您的每一份健康。
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/products" className="px-8 py-4 bg-white text-stone-900 rounded-full font-semibold hover:bg-stone-200 transition-colors flex items-center gap-2">
                立即选购 <ArrowRight size={18} />
              </Link>
              <Link to="/seckill" className="px-8 py-4 bg-transparent border border-white/30 rounded-full font-semibold hover:bg-white/10 transition-colors">
                限时秒杀
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-stone-50 rounded-full flex items-center justify-center text-stone-900 mb-6">
                <Leaf size={32} />
              </div>
              <h3 className="text-xl font-serif italic mb-3">100% 天然成分</h3>
              <p className="text-stone-500">我们坚持使用最纯净的原材料，不含任何人工添加剂或防腐剂。</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-stone-50 rounded-full flex items-center justify-center text-stone-900 mb-6">
                <Zap size={32} />
              </div>
              <h3 className="text-xl font-serif italic mb-3">科学配方</h3>
              <p className="text-stone-500">每一款产品都经过营养专家精心调配，确保人体吸收率最大化。</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-stone-50 rounded-full flex items-center justify-center text-stone-900 mb-6">
                <ShieldCheck size={32} />
              </div>
              <h3 className="text-xl font-serif italic mb-3">品质保证</h3>
              <p className="text-stone-500">严格的生产标准和多重质量检测，为您提供最放心的健康保障。</p>
            </div>
          </div>
        </div>
      </section>

      {/* Hot Products */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-serif italic text-stone-900 mb-2">热门推荐</h2>
              <p className="text-stone-500">大家都在买的明星单品</p>
            </div>
            <Link to="/products" className="text-stone-900 font-semibold flex items-center gap-1 hover:underline underline-offset-8">
              查看全部 <ArrowRight size={16} />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="animate-pulse bg-white rounded-2xl aspect-[3/4]" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {hotProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Banner */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto bg-stone-900 rounded-[32px] overflow-hidden relative">
          <div className="absolute inset-0 opacity-30">
            <img 
              src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=1920" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="relative p-12 md:p-24 text-center">
            <h2 className="text-4xl md:text-6xl font-serif italic text-white mb-8">加入我们的健康社区</h2>
            <p className="text-stone-300 text-lg mb-10 max-w-2xl mx-auto">
              订阅我们的邮件列表，获取最新的健康资讯、独家折扣和新品预告。
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <input 
                type="email" 
                placeholder="您的邮箱地址" 
                className="px-6 py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white placeholder:text-stone-400 focus:outline-none focus:border-white transition-colors"
              />
              <button className="px-8 py-4 bg-white text-stone-900 rounded-full font-semibold hover:bg-stone-200 transition-colors">
                立即订阅
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Recommended */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h2 className="text-3xl font-serif italic text-stone-900 mb-2">为您推荐</h2>
            <p className="text-stone-500">根据您的喜好精心挑选</p>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                <div key={i} className="animate-pulse bg-white rounded-2xl aspect-[3/4]" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {recommendProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
