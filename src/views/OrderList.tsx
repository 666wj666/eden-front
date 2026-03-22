import React, { useEffect, useState } from 'react';
import { Order } from '../types/api';
import { orderApi } from '../api';
import { formatPrice } from '../utils';
import { motion } from 'motion/react';
import { Package, ChevronRight, Clock, CheckCircle2, Truck, XCircle, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export const OrderList: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<number | undefined>(undefined);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await orderApi.getList(status);
      setOrders(data.list || []);
    } catch (error) {
      console.error('Failed to fetch orders', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [status]);

  const getStatusInfo = (status: number) => {
    switch (status) {
      case 0: return { label: '待付款', icon: <Clock size={14} />, color: 'text-amber-500 bg-amber-50' };
      case 1: return { label: '待发货', icon: <Package size={14} />, color: 'text-blue-500 bg-blue-50' };
      case 2: return { label: '待收货', icon: <Truck size={14} />, color: 'text-indigo-500 bg-indigo-50' };
      case 3: return { label: '已完成', icon: <CheckCircle2 size={14} />, color: 'text-emerald-500 bg-emerald-50' };
      case 4: return { label: '已取消', icon: <XCircle size={14} />, color: 'text-stone-400 bg-stone-50' };
      default: return { label: '未知', icon: null, color: 'text-stone-400 bg-stone-50' };
    }
  };

  const tabs = [
    { label: '全部', value: undefined },
    { label: '待付款', value: 0 },
    { label: '待发货', value: 1 },
    { label: '待收货', value: 2 },
    { label: '已完成', value: 3 },
  ];

  return (
    <div className="min-h-screen bg-stone-50 pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <h1 className="text-4xl font-serif italic text-stone-900 mb-10">我的订单</h1>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2 no-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab.label}
              onClick={() => setStatus(tab.value)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                status === tab.value 
                ? 'bg-stone-900 text-white shadow-lg shadow-stone-200' 
                : 'bg-white text-stone-500 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-stone-300" size={48} />
          </div>
        ) : orders.length > 0 ? (
          <div className="space-y-6">
            {orders.map((order) => {
              const statusInfo = getStatusInfo(order.status);
              return (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={order.orderNo} 
                  className="bg-white rounded-[32px] overflow-hidden border border-stone-100 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="px-8 py-4 bg-stone-50/50 border-b border-stone-50 flex flex-wrap justify-between items-center gap-4">
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-stone-400">订单号: <span className="text-stone-900 font-medium">{order.orderNo}</span></span>
                      <span className="text-stone-300">|</span>
                      <span className="text-stone-400">{new Date(order.createTime).toLocaleString()}</span>
                    </div>
                    <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${statusInfo.color}`}>
                      {statusInfo.icon}
                      {statusInfo.label}
                    </div>
                  </div>
                  
                  <div className="p-8">
                    <div className="space-y-6">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex items-center gap-6">
                          <div className="w-20 h-20 bg-stone-50 rounded-2xl overflow-hidden border border-stone-100 flex-shrink-0">
                            <img src={item.productImage} alt={item.productName} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-stone-900 font-medium truncate">{item.productName}</h4>
                            <p className="text-stone-400 text-xs mt-1">数量: x{item.quantity}</p>
                          </div>
                          <div className="text-right">
                            <span className="text-stone-900 font-semibold">{formatPrice(item.price)}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-8 pt-8 border-t border-stone-50 flex flex-wrap justify-between items-center gap-6">
                      <div className="text-sm text-stone-500">
                        共 {order.items.reduce((acc, item) => acc + item.quantity, 0)} 件商品，
                        实付 <span className="text-xl font-semibold text-stone-900 ml-1">{formatPrice(order.payPrice)}</span>
                      </div>
                      <div className="flex gap-3">
                        <Link 
                          to={`/order/${order.orderNo}`}
                          className="px-6 py-2 rounded-full border border-stone-200 text-sm font-medium text-stone-600 hover:text-stone-900 hover:border-stone-900 transition-all"
                        >
                          查看详情
                        </Link>
                        {order.status === 0 && (
                          <button className="px-6 py-2 rounded-full bg-stone-900 text-white text-sm font-medium hover:bg-stone-700 transition-all">
                            立即支付
                          </button>
                        )}
                        {order.status === 2 && (
                          <button className="px-6 py-2 rounded-full bg-stone-900 text-white text-sm font-medium hover:bg-stone-700 transition-all">
                            确认收货
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-[32px] border border-dashed border-stone-200">
            <Package size={48} className="mx-auto text-stone-200 mb-4" />
            <p className="text-stone-400">暂无相关订单</p>
          </div>
        )}
      </div>
    </div>
  );
};
