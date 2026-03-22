export interface Result<T> {
  code: number;
  message: string;
  data: T;
}

export interface PageVO<T> {
  list: T[];
  total: number;
  pageNum: number;
  pageSize: number;
  pages: number;
}

// User Types
export interface LoginDTO {
  username: string;
  password?: string;
}

export interface RegisterDTO {
  username: string;
  password?: string;
  nickname?: string;
  phone?: string;
}

export interface LoginVO {
  token: string;
  user: UserVO;
}

export interface UserVO {
  id: number;
  username: string;
  nickname: string;
  phone: string;
  avatar?: string;
  gender?: number;
}

// Product Types
export interface ProductVO {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  image: string;
  categoryId: number;
  categoryName?: string;
  status: number;
  createTime: string;
}

export interface Category {
  id: number;
  name: string;
  parentId: number;
  level: number;
  sort: number;
}

export interface CategoryTreeVO extends Category {
  children: CategoryTreeVO[];
}

// Cart Types
export interface CartItemVO {
  productId: number;
  productName: string;
  productImage: string;
  price: number;
  quantity: number;
  selected: boolean;
  stock: number;
}

export interface CartVO {
  items: CartItemVO[];
  totalPrice: number;
  totalCount: number;
  selectedCount: number;
}

// Order Types
export interface Order {
  orderNo: string;
  userId: number;
  totalPrice: number;
  payPrice: number;
  status: number; // 0: unpaid, 1: paid, 2: shipped, 3: completed, 4: cancelled
  payType?: number;
  createTime: string;
  items: OrderItem[];
  address?: UserAddress;
}

export interface OrderItem {
  id: number;
  orderNo: string;
  productId: number;
  productName: string;
  productImage: string;
  price: number;
  quantity: number;
}

export interface OrderCreateDTO {
  addressId: number;
  couponId?: number;
  remark?: string;
}

// Address Types
export interface UserAddress {
  id: number;
  userId: number;
  receiverName: string;
  receiverPhone: string;
  province: string;
  city: string;
  district: string;
  detailAddress: string;
  isDefault: number;
}

// Coupon Types
export interface Coupon {
  id: number;
  name: string;
  type: number; // 0: cash, 1: discount
  value: number;
  minAmount: number;
  startTime: string;
  endTime: string;
}

export interface UserCoupon extends Coupon {
  userCouponId: number;
  status: number; // 0: unused, 1: used, 2: expired
}

// Review Types
export interface ProductReview {
  id: number;
  productId: number;
  userId: number;
  nickname: string;
  avatar?: string;
  rating: number;
  content: string;
  images?: string;
  createTime: string;
}

// Seckill Types
export interface SeckillProduct extends ProductVO {
  seckillId: number;
  seckillPrice: number;
  seckillStock: number;
  startTime: string;
  endTime: string;
}
