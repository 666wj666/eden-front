import React, { useEffect, useState } from 'react';
import { CartVO, UserAddress, UserCoupon } from '../types/api';
import { cartApi, addressApi, couponApi, orderApi } from '../api';
import { formatPrice } from '../utils';
import { motion } from 'motion/react';
import { MapPin, Ticket, CreditCard, ShieldCheck, ArrowRight, Loader2, ChevronRight, Plus, Package } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../utils';

export const Checkout: React.FC = () => {
  const [cart, setCart] = useState<CartVO | null>(null);
  const [addresses, setAddresses] = useState<UserAddress[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<number | null>(null);
  const [coupons, setCoupons] = useState<UserCoupon[]>([]);
  const [selectedCoupon, setSelectedCoupon] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cartData, addrData, coupData] = await Promise.all([
          cartApi.get(),
          addressApi.getList(),
          couponApi.getUsable()
        ]);
        setCart(cartData);
        setAddresses(addrData || []);
        setCoupons(coupData || []);
        
        const defaultAddr = addrData?.find(a => a.isDefault === 1) || addrData?.[0];
        if (defaultAddr) setSelectedAddress(defaultAddr.id);
      } catch (error) {
        console.error('Failed to fetch checkout data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleCreateOrder = async () => {
    if (!selectedAddress) {
      alert('请选择收货地址');
      return;
    }
    setSubmitting(true);
    try {
      const order = await orderApi.create({
        addressId: selectedAddress,
        couponId: selectedCoupon || undefined
      });
      navigate(`/order/${order.orderNo}`);
    } catch (error) {
      console.error('Failed to create order', error);
    } finally {
      setSubmitting(false);
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
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <h1 className="text-4xl font-serif italic text-stone-900 mb-10">确认订单</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-8">
            {/* Address Selection */}
            <section className="bg-white rounded-[32px] p-8 border border-stone-100 shadow-sm">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-xl font-serif italic text-stone-900 flex items-center gap-2">
                  <MapPin size={20} /> 收货地址
                </h2>
                <button className="text-sm font-semibold text-stone-900 flex items-center gap-1 hover:underline">
                  <Plus size={16} /> 新增地址
                </button>
              </div>

              <div className="space-y-4">
                {addresses.length > 0 ? addresses.map((addr) => (
                  <div 
                    key={addr.id}
                    onClick={() => setSelectedAddress(addr.id)}
                    className={cn(
                      "p-6 rounded-3xl border-2 transition-all cursor-pointer",
                      selectedAddress === addr.id 
                      ? "border-stone-900 bg-stone-50" 
                      : "border-stone-50 hover:border-stone-200"
                    )}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-stone-900">{addr.receiverName}</span>
                        <span className="text-stone-500">{addr.receiverPhone}</span>
                        {addr.isDefault === 1 && (
                          <span className="px-2 py-0.5 bg-stone-900 text-white text-[10px] font-bold rounded-full">默认</span>
                        )}
                      </div>
                    </div>
                    <p className="text-stone-600 text-sm leading-relaxed">
                      {addr.province} {addr.city} {addr.district} {addr.detailAddress}
                    </p>
                  </div>
                )) : (
                  <button className="w-full py-10 border-2 border-dashed border-stone-200 rounded-3xl text-stone-400 hover:text-stone-900 hover:border-stone-900 transition-all">
                    请先添加收货地址
                  </button>
                )}
              </div>
            </section>

            {/* Product Review */}
            <section className="bg-white rounded-[32px] p-8 border border-stone-100 shadow-sm">
              <h2 className="text-xl font-serif italic text-stone-900 mb-8 flex items-center gap-2">
                <Package size={20} /> 商品清单
              </h2>
              <div className="space-y-6">
                {cart?.items.filter(i => i.selected).map((item) => (
                  <div key={item.productId} className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-stone-50 rounded-2xl overflow-hidden border border-stone-100">
                      <img src={item.productImage} alt={item.productName} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-stone-900 font-medium truncate">{item.productName}</h4>
                      <p className="text-stone-400 text-xs mt-1">数量: x{item.quantity}</p>
                    </div>
                    <span className="font-semibold text-stone-900">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Coupon Selection */}
            <section className="bg-white rounded-[32px] p-8 border border-stone-100 shadow-sm">
              <h2 className="text-xl font-serif italic text-stone-900 mb-8 flex items-center gap-2">
                <Ticket size={20} /> 优惠券
              </h2>
              <div className="space-y-4">
                {coupons.length > 0 ? (
                  <select 
                    value={selectedCoupon || ''} 
                    onChange={(e) => setSelectedCoupon(e.target.value ? Number(e.target.value) : null)}
                    className="w-full px-6 py-4 bg-stone-50 border-none rounded-2xl text-sm font-medium text-stone-600 focus:ring-2 focus:ring-stone-900/5 outline-none"
                  >
                    <option value="">不使用优惠券</option>
                    {coupons.map(c => (
                      <option key={c.id} value={c.id}>{c.name} - 减 {formatPrice(c.value)}</option>
                    ))}
                  </select>
                ) : (
                  <p className="text-stone-400 text-sm text-center py-4">暂无可用优惠券</p>
                )}
              </div>
            </section>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-stone-900 text-white rounded-[32px] p-8 sticky top-24">
              <h2 className="text-2xl font-serif italic mb-8">订单结算</h2>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-stone-400">
                  <span>商品总额</span>
                  <span>{formatPrice(cart?.totalPrice || 0)}</span>
                </div>
                <div className="flex justify-between text-stone-400">
                  <span>运费</span>
                  <span>免费</span>
                </div>
                {selectedCoupon && (
                  <div className="flex justify-between text-emerald-400">
                    <span>优惠券抵扣</span>
                    <span>- {formatPrice(coupons.find(c => c.id === selectedCoupon)?.value || 0)}</span>
                  </div>
                )}
              </div>

              <div className="pt-6 border-t border-white/10 mb-10">
                <div className="flex justify-between items-end">
                  <span className="text-stone-400">实付金额</span>
                  <span className="text-3xl font-semibold">
                    {formatPrice((cart?.totalPrice || 0) - (selectedCoupon ? (coupons.find(c => c.id === selectedCoupon)?.value || 0) : 0))}
                  </span>
                </div>
              </div>

              <div className="space-y-4 mb-10">
                <div className="flex items-center gap-3 text-xs text-stone-500">
                  <CreditCard size={14} />
                  <span>支持 微信 / 支付宝 / 银行卡</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-stone-500">
                  <ShieldCheck size={14} />
                  <span>安全支付保障</span>
                </div>
              </div>

              <button 
                onClick={handleCreateOrder}
                disabled={submitting || !selectedAddress}
                className="w-full py-4 bg-white text-stone-900 rounded-full font-semibold hover:bg-stone-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50 group"
              >
                {submitting ? <Loader2 className="animate-spin" size={20} /> : <>提交订单 <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" /></>}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
