import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ProductVO, ProductReview } from '../types/api';
import { productApi, reviewApi, cartApi } from '../api';
import { formatPrice } from '../utils';
import { motion } from 'motion/react';
import { ShoppingCart, Heart, Share2, Star, ShieldCheck, Truck, RefreshCcw, Minus, Plus, Loader2 } from 'lucide-react';
import { useAuthStore } from '../store/auth';

export const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  
  const [product, setProduct] = useState<ProductVO | null>(null);
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      try {
        const [p, r] = await Promise.all([
          productApi.getById(Number(id)),
          reviewApi.getByProduct(Number(id))
        ]);
        setProduct(p);
        setReviews(r.list || []);
      } catch (error) {
        console.error('Failed to fetch product details', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (!product) return;
    
    setAddingToCart(true);
    try {
      await cartApi.add(product.id, quantity);
      alert('已成功加入购物车');
    } catch (error) {
      console.error('Failed to add to cart', error);
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-stone-400" size={48} />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-stone-500">
        <h2 className="text-2xl font-serif italic mb-4">未找到该商品</h2>
        <button onClick={() => navigate('/products')} className="text-stone-900 font-semibold hover:underline">返回商品列表</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <div className="aspect-square bg-white rounded-[32px] overflow-hidden border border-stone-100">
              <img 
                src={product.image || `https://picsum.photos/seed/${product.id}/800/800`} 
                alt={product.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="grid grid-cols-4 gap-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="aspect-square bg-white rounded-2xl overflow-hidden border border-stone-100 cursor-pointer hover:border-stone-900 transition-colors">
                  <img 
                    src={`https://picsum.photos/seed/${product.id + i}/200/200`} 
                    className="w-full h-full object-cover opacity-60 hover:opacity-100 transition-opacity"
                    referrerPolicy="no-referrer"
                  />
                </div>
              ))}
            </div>
          </motion.div>

          {/* Product Info */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col"
          >
            <div className="mb-6">
              <span className="inline-block px-3 py-1 bg-stone-100 rounded-full text-[10px] font-bold uppercase tracking-widest text-stone-500 mb-4">
                {product.categoryName || 'Nutrition'}
              </span>
              <h1 className="text-4xl font-serif italic text-stone-900 mb-4 leading-tight">{product.name}</h1>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center text-amber-500">
                  {[1, 2, 3, 4, 5].map(i => <Star key={i} size={16} fill={i <= 4 ? "currentColor" : "none"} />)}
                  <span className="ml-2 text-stone-900 font-medium">4.8</span>
                </div>
                <span className="text-stone-400">|</span>
                <span className="text-stone-500">{reviews.length} 条评价</span>
                <span className="text-stone-400">|</span>
                <span className="text-stone-500">已售 1.2k+</span>
              </div>
            </div>

            <div className="mb-8 p-6 bg-white rounded-3xl border border-stone-100">
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-4xl font-semibold text-stone-900">{formatPrice(product.price)}</span>
                <span className="text-stone-400 line-through text-lg">{formatPrice(product.price * 1.2)}</span>
              </div>
              <p className="text-stone-500 text-sm">库存充足 (剩余 {product.stock} 件)</p>
            </div>

            <div className="space-y-8">
              <p className="text-stone-600 leading-relaxed">
                {product.description || '这款营养补给品采用纯天然原材料，经过科学配比，旨在为您提供全方位的健康支持。无论是日常保养还是特定营养补充，它都是您的理想之选。'}
              </p>

              <div className="flex items-center gap-6">
                <div className="flex items-center bg-white border border-stone-200 rounded-full p-1">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 flex items-center justify-center text-stone-500 hover:text-stone-900 transition-colors"
                  >
                    <Minus size={18} />
                  </button>
                  <span className="w-12 text-center font-semibold text-stone-900">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 flex items-center justify-center text-stone-500 hover:text-stone-900 transition-colors"
                  >
                    <Plus size={18} />
                  </button>
                </div>
                <div className="flex gap-2">
                  <button className="w-12 h-12 rounded-full border border-stone-200 flex items-center justify-center text-stone-500 hover:text-red-500 hover:border-red-200 transition-all">
                    <Heart size={20} />
                  </button>
                  <button className="w-12 h-12 rounded-full border border-stone-200 flex items-center justify-center text-stone-500 hover:text-stone-900 transition-all">
                    <Share2 size={20} />
                  </button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={handleAddToCart}
                  disabled={addingToCart}
                  className="flex-1 py-4 bg-stone-900 text-white rounded-full font-semibold hover:bg-stone-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {addingToCart ? <Loader2 className="animate-spin" size={20} /> : <><ShoppingCart size={20} /> 加入购物车</>}
                </button>
                <button className="flex-1 py-4 bg-stone-100 text-stone-900 rounded-full font-semibold hover:bg-stone-200 transition-all">
                  立即购买
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8 border-t border-stone-100">
                <div className="flex items-center gap-3 text-sm text-stone-500">
                  <Truck size={18} className="text-stone-900" />
                  <span>顺丰包邮</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-stone-500">
                  <ShieldCheck size={18} className="text-stone-900" />
                  <span>正品保障</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-stone-500">
                  <RefreshCcw size={18} className="text-stone-900" />
                  <span>7天无理由</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Reviews Section */}
        <section className="mt-24">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl font-serif italic text-stone-900">用户评价</h2>
            <button className="text-stone-900 font-semibold hover:underline underline-offset-8">查看全部评价</button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {reviews.length > 0 ? reviews.map(review => (
              <div key={review.id} className="bg-white p-8 rounded-[32px] border border-stone-100">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-stone-100 overflow-hidden">
                      <img src={review.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${review.nickname}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-stone-900">{review.nickname}</h4>
                      <div className="flex items-center text-amber-500">
                        {[1, 2, 3, 4, 5].map(i => <Star key={i} size={12} fill={i <= review.rating ? "currentColor" : "none"} />)}
                      </div>
                    </div>
                  </div>
                  <span className="text-xs text-stone-400">{new Date(review.createTime).toLocaleDateString()}</span>
                </div>
                <p className="text-stone-600 leading-relaxed">{review.content}</p>
              </div>
            )) : (
              <div className="col-span-2 text-center py-20 bg-white rounded-[32px] border border-dashed border-stone-200">
                <p className="text-stone-400">暂无评价</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};
