import React, { useEffect, useState } from 'react';
import { ProductVO, CategoryTreeVO } from '../types/api';
import { productApi, categoryApi } from '../api';
import { ProductCard } from '../components/ProductCard';
import { motion, AnimatePresence } from 'motion/react';
import { Search, SlidersHorizontal, ChevronDown, X, Loader2, LayoutGrid, List } from 'lucide-react';
import { cn } from '../utils';

export const ProductList: React.FC = () => {
  const [products, setProducts] = useState<ProductVO[]>([]);
  const [categories, setCategories] = useState<CategoryTreeVO[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Filter States
  const [keyword, setKeyword] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [sortField, setSortField] = useState('createTime');
  const [sortOrder, setSortOrder] = useState('desc');
  const [pageNum, setPageNum] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = {
        keyword: keyword || undefined,
        categoryId: selectedCategory || undefined,
        minPrice: minPrice ? Number(minPrice) : undefined,
        maxPrice: maxPrice ? Number(maxPrice) : undefined,
        sortField,
        sortOrder,
        pageNum,
        pageSize: 12
      };
      const data = await productApi.getList(params);
      setProducts(data.list || []);
      setTotal(data.total || 0);
    } catch (error) {
      console.error('Failed to fetch products', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoryApi.getTree();
        setCategories(data || []);
      } catch (error) {
        console.error('Failed to fetch categories', error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProducts();
    }, 300);
    return () => clearTimeout(timer);
  }, [keyword, selectedCategory, sortField, sortOrder, pageNum]);

  const handlePriceFilter = () => {
    setPageNum(1);
    fetchProducts();
  };

  const resetFilters = () => {
    setKeyword('');
    setSelectedCategory(null);
    setMinPrice('');
    setMaxPrice('');
    setSortField('createTime');
    setSortOrder('desc');
    setPageNum(1);
  };

  return (
    <div className="min-h-screen bg-stone-50 pb-20">
      {/* Header */}
      <section className="bg-stone-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-serif italic mb-4">全部商品</h1>
          <p className="text-stone-400 max-w-lg">探索我们的全线营养产品，为您和家人的健康保驾护航。</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters - Desktop */}
          <aside className="hidden lg:block w-64 flex-shrink-0 space-y-10">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-stone-900 mb-6">商品分类</h3>
              <div className="space-y-3">
                <button 
                  onClick={() => setSelectedCategory(null)}
                  className={cn(
                    "block w-full text-left text-sm transition-colors",
                    selectedCategory === null ? "text-stone-900 font-bold" : "text-stone-500 hover:text-stone-900"
                  )}
                >
                  全部商品
                </button>
                {categories.map(cat => (
                  <div key={cat.id} className="space-y-2">
                    <button 
                      onClick={() => setSelectedCategory(cat.id)}
                      className={cn(
                        "block w-full text-left text-sm transition-colors",
                        selectedCategory === cat.id ? "text-stone-900 font-bold" : "text-stone-500 hover:text-stone-900"
                      )}
                    >
                      {cat.name}
                    </button>
                    {cat.children && cat.children.length > 0 && (
                      <div className="pl-4 space-y-2 border-l border-stone-100">
                        {cat.children.map(child => (
                          <button 
                            key={child.id}
                            onClick={() => setSelectedCategory(child.id)}
                            className={cn(
                              "block w-full text-left text-xs transition-colors",
                              selectedCategory === child.id ? "text-stone-900 font-bold" : "text-stone-400 hover:text-stone-900"
                            )}
                          >
                            {child.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-stone-900 mb-6">价格区间</h3>
              <div className="flex items-center gap-2">
                <input 
                  type="number" 
                  placeholder="最低" 
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-stone-900"
                />
                <span className="text-stone-300">-</span>
                <input 
                  type="number" 
                  placeholder="最高" 
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-stone-900"
                />
              </div>
              <button 
                onClick={handlePriceFilter}
                className="w-full mt-4 py-2 bg-stone-100 text-stone-900 rounded-lg text-xs font-bold hover:bg-stone-200 transition-colors"
              >
                应用筛选
              </button>
            </div>

            <button 
              onClick={resetFilters}
              className="w-full py-4 border border-dashed border-stone-200 text-stone-400 rounded-2xl text-xs font-bold hover:text-stone-900 hover:border-stone-900 transition-all"
            >
              重置所有筛选
            </button>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="bg-white rounded-[24px] p-4 mb-8 border border-stone-100 shadow-sm flex flex-wrap items-center justify-between gap-4">
              <div className="relative flex-1 min-w-[240px]">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
                <input 
                  type="text" 
                  placeholder="搜索您感兴趣的商品..."
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-stone-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-stone-900/5 transition-all"
                />
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 bg-stone-50 p-1 rounded-lg">
                  <button 
                    onClick={() => setViewMode('grid')}
                    className={cn("p-2 rounded-md transition-all", viewMode === 'grid' ? "bg-white shadow-sm text-stone-900" : "text-stone-400")}
                  >
                    <LayoutGrid size={18} />
                  </button>
                  <button 
                    onClick={() => setViewMode('list')}
                    className={cn("p-2 rounded-md transition-all", viewMode === 'list' ? "bg-white shadow-sm text-stone-900" : "text-stone-400")}
                  >
                    <List size={18} />
                  </button>
                </div>

                <select 
                  value={`${sortField}-${sortOrder}`}
                  onChange={(e) => {
                    const [field, order] = e.target.value.split('-');
                    setSortField(field);
                    setSortOrder(order);
                  }}
                  className="bg-stone-50 border-none rounded-xl px-4 py-3 text-sm font-medium text-stone-600 focus:ring-2 focus:ring-stone-900/5 outline-none cursor-pointer"
                >
                  <option value="createTime-desc">最新上架</option>
                  <option value="price-asc">价格从低到高</option>
                  <option value="price-desc">价格从高到低</option>
                  <option value="sales-desc">销量优先</option>
                </select>

                <button 
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden p-3 bg-stone-900 text-white rounded-xl"
                >
                  <SlidersHorizontal size={18} />
                </button>
              </div>
            </div>

            {/* Mobile Filters Overlay */}
            <AnimatePresence>
              {showFilters && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="lg:hidden fixed inset-0 z-[60] bg-white p-6 overflow-y-auto"
                >
                  <div className="flex justify-between items-center mb-10">
                    <h2 className="text-2xl font-serif italic">筛选条件</h2>
                    <button onClick={() => setShowFilters(false)} className="p-2 bg-stone-100 rounded-full">
                      <X size={24} />
                    </button>
                  </div>
                  {/* Reuse Sidebar Logic here for mobile */}
                  <div className="space-y-10">
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-widest text-stone-900 mb-6">商品分类</h3>
                      <div className="flex flex-wrap gap-2">
                        <button 
                          onClick={() => setSelectedCategory(null)}
                          className={cn(
                            "px-4 py-2 rounded-full text-sm transition-all",
                            selectedCategory === null ? "bg-stone-900 text-white" : "bg-stone-50 text-stone-500"
                          )}
                        >
                          全部
                        </button>
                        {categories.map(cat => (
                          <button 
                            key={cat.id}
                            onClick={() => setSelectedCategory(cat.id)}
                            className={cn(
                              "px-4 py-2 rounded-full text-sm transition-all",
                              selectedCategory === cat.id ? "bg-stone-900 text-white" : "bg-stone-50 text-stone-500"
                            )}
                          >
                            {cat.name}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-widest text-stone-900 mb-6">价格区间</h3>
                      <div className="flex items-center gap-4">
                        <input 
                          type="number" 
                          placeholder="最低" 
                          value={minPrice}
                          onChange={(e) => setMinPrice(e.target.value)}
                          className="w-full px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl text-sm focus:outline-none focus:border-stone-900"
                        />
                        <span className="text-stone-300">-</span>
                        <input 
                          type="number" 
                          placeholder="最高" 
                          value={maxPrice}
                          onChange={(e) => setMaxPrice(e.target.value)}
                          className="w-full px-4 py-3 bg-stone-50 border border-stone-100 rounded-xl text-sm focus:outline-none focus:border-stone-900"
                        />
                      </div>
                    </div>

                    <div className="pt-6 border-t border-stone-100 flex gap-4">
                      <button 
                        onClick={() => { resetFilters(); setShowFilters(false); }}
                        className="flex-1 py-4 bg-stone-100 text-stone-900 rounded-full font-semibold"
                      >
                        重置
                      </button>
                      <button 
                        onClick={() => setShowFilters(false)}
                        className="flex-1 py-4 bg-stone-900 text-white rounded-full font-semibold"
                      >
                        查看商品
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Product Grid */}
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="animate-pulse bg-white rounded-[32px] aspect-[3/4]" />
                ))}
              </div>
            ) : products.length > 0 ? (
              <>
                <div className={cn(
                  "grid gap-6",
                  viewMode === 'grid' ? "grid-cols-2 md:grid-cols-3" : "grid-cols-1"
                )}>
                  {products.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                {total > 12 && (
                  <div className="mt-16 flex justify-center gap-2">
                    {Array.from({ length: Math.ceil(total / 12) }).map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setPageNum(i + 1)}
                        className={cn(
                          "w-10 h-10 rounded-full text-sm font-bold transition-all",
                          pageNum === i + 1 
                          ? "bg-stone-900 text-white shadow-lg shadow-stone-200" 
                          : "bg-white text-stone-400 hover:text-stone-900 border border-stone-100"
                        )}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-32 bg-white rounded-[40px] border border-dashed border-stone-200">
                <div className="w-20 h-20 bg-stone-50 rounded-full flex items-center justify-center text-stone-200 mx-auto mb-6">
                  <Search size={40} />
                </div>
                <h3 className="text-xl font-serif italic text-stone-900 mb-2">未找到匹配商品</h3>
                <p className="text-stone-400 mb-8">尝试调整您的筛选条件或搜索关键词</p>
                <button 
                  onClick={resetFilters}
                  className="px-8 py-3 bg-stone-900 text-white rounded-full font-semibold hover:bg-stone-700 transition-colors"
                >
                  清除所有筛选
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
