import React, { useEffect, useState } from 'react';
import { CartVO, CartItemVO } from '../types/api';
import { cartApi, orderApi } from '../api';
import { formatPrice } from '../utils';
import { motion } from 'motion/react';
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight, Loader2 } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

export const Cart: React.FC = () => {
  const [cart, setCart] = useState<CartVO | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<number | null>(null);
  const navigate = useNavigate();

  const fetchCart = async () => {
    try {
      const data = await cartApi.get();
      setCart(data);
    } catch (error) {
      console.error('Failed to fetch cart', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleUpdateQuantity = async (productId: number, quantity: number) => {
    if (quantity < 1) return;
    setUpdating(productId);
    try {
      await cartApi.updateQuantity(productId, quantity);
      await fetchCart();
    } catch (error) {
      console.error('Failed to update quantity', error);
    } finally {
      setUpdating(null);
    }
  };

  const handleRemove = async (productId: number) => {
    try {
      await cartApi.remove(productId);
      await fetchCart();
    } catch (error) {
      console.error('Failed to remove item', error);
    }
  };

  const handleSelect = async (productId: number, selected: boolean) => {
    try {
      await cartApi.select(productId, selected);
      await fetchCart();
    } catch (error) {
      console.error('Failed to select item', error);
    }
  };

  const handleSelectAll = async (selected: boolean) => {
    try {
      await cartApi.selectAll(selected);
      await fetchCart();
    } catch (error) {
      console.error('Failed to select all', error);
    }
  };

  const handleCheckout = () => {
    if (!cart || cart.selectedCount === 0) return;
    navigate('/checkout');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-stone-400" size={48} />
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center bg-stone-50 px-4">
        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-stone-200 mb-8 shadow-sm">
          <ShoppingBag size={48} />
        </div>
        <h2 className="text-3xl font-serif italic text-stone-900 mb-4">您的购物车是空的</h2>
        <p className="text-stone-500 mb-10 text-center max-w-xs">快去挑选一些心仪的营养补给品，开启您的健康之旅吧。</p>
        <Link to="/products" className="px-10 py-4 bg-stone-900 text-white rounded-full font-semibold hover:bg-stone-700 transition-colors">
          去逛逛
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <h1 className="text-4xl font-serif italic text-stone-900 mb-10">购物车</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-[32px] p-6 border border-stone-100 shadow-sm">
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-stone-50">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    checked={cart.items.every(i => i.selected)}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="w-5 h-5 rounded border-stone-300 text-stone-900 focus:ring-stone-900" 
                  />
                  <span className="text-sm font-medium text-stone-600 group-hover:text-stone-900 transition-colors">全选</span>
                </label>
                <button 
                  onClick={() => cartApi.clear().then(fetchCart)}
                  className="text-sm text-stone-400 hover:text-red-500 transition-colors flex items-center gap-1"
                >
                  <Trash2 size={14} /> 清空购物车
                </button>
              </div>

              <div className="space-y-8">
                {cart.items.map((item) => (
                  <div key={item.productId} className="flex flex-col sm:flex-row items-center gap-6 group">
                    <input 
                      type="checkbox" 
                      checked={item.selected}
                      onChange={(e) => handleSelect(item.productId, e.target.checked)}
                      className="w-5 h-5 rounded border-stone-300 text-stone-900 focus:ring-stone-900" 
                    />
                    <div className="w-24 h-24 bg-stone-50 rounded-2xl overflow-hidden border border-stone-100 flex-shrink-0">
                      <img src={item.productImage} alt={item.productName} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-stone-900 font-medium mb-1 truncate">{item.productName}</h3>
                      <p className="text-stone-400 text-xs mb-4">规格: 默认</p>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-semibold text-stone-900">{formatPrice(item.price)}</span>
                        <div className="flex items-center bg-stone-50 rounded-full p-1">
                          <button 
                            onClick={() => handleUpdateQuantity(item.productId, item.quantity - 1)}
                            disabled={updating === item.productId}
                            className="w-8 h-8 flex items-center justify-center text-stone-400 hover:text-stone-900 disabled:opacity-30"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="w-8 text-center text-sm font-semibold text-stone-900">{item.quantity}</span>
                          <button 
                            onClick={() => handleUpdateQuantity(item.productId, item.quantity + 1)}
                            disabled={updating === item.productId}
                            className="w-8 h-8 flex items-center justify-center text-stone-400 hover:text-stone-900 disabled:opacity-30"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleRemove(item.productId)}
                      className="p-2 text-stone-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-stone-900 text-white rounded-[32px] p-8 sticky top-24">
              <h2 className="text-2xl font-serif italic mb-8">订单摘要</h2>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-stone-400">
                  <span>商品总额 ({cart.selectedCount} 件)</span>
                  <span>{formatPrice(cart.totalPrice)}</span>
                </div>
                <div className="flex justify-between text-stone-400">
                  <span>运费</span>
                  <span>免费</span>
                </div>
                <div className="flex justify-between text-stone-400">
                  <span>优惠券</span>
                  <span className="text-emerald-400">- {formatPrice(0)}</span>
                </div>
              </div>

              <div className="pt-6 border-t border-white/10 mb-10">
                <div className="flex justify-between items-end">
                  <span className="text-stone-400">应付总额</span>
                  <span className="text-3xl font-semibold">{formatPrice(cart.totalPrice)}</span>
                </div>
              </div>

              <button 
                onClick={handleCheckout}
                disabled={cart.selectedCount === 0}
                className="w-full py-4 bg-white text-stone-900 rounded-full font-semibold hover:bg-stone-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                立即结算 <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>

              <p className="mt-6 text-center text-xs text-stone-500">
                点击结算即表示您同意我们的服务条款和隐私政策。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
