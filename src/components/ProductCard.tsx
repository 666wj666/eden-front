import React from 'react';
import { ProductVO } from '../types/api';
import { formatPrice } from '../utils';
import { ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ProductCardProps {
  product: ProductVO;
  onAddToCart?: (product: ProductVO) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-stone-100">
      <Link to={`/product/${product.id}`} className="block aspect-square overflow-hidden bg-stone-50">
        <img
          src={product.image || `https://picsum.photos/seed/${product.id}/400/400`}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          referrerPolicy="no-referrer"
        />
      </Link>
      <div className="p-4">
        <div className="mb-1">
          <span className="text-[10px] uppercase tracking-wider text-stone-400 font-semibold">
            {product.categoryName || 'Nutrition'}
          </span>
        </div>
        <Link to={`/product/${product.id}`} className="block">
          <h3 className="text-stone-800 font-medium text-sm line-clamp-2 h-10 group-hover:text-olive-600 transition-colors">
            {product.name}
          </h3>
        </Link>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-lg font-semibold text-stone-900">
            {formatPrice(product.price)}
          </span>
          <button
            onClick={() => onAddToCart?.(product)}
            className="w-8 h-8 rounded-full bg-stone-900 text-white flex items-center justify-center hover:bg-stone-700 transition-colors"
          >
            <ShoppingCart size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
