import http from './http';
import { 
  LoginDTO, RegisterDTO, LoginVO, UserVO, 
  ProductVO, PageVO, CategoryTreeVO, Category,
  CartVO, Order, OrderCreateDTO, UserAddress,
  Coupon, UserCoupon, ProductReview, SeckillProduct
} from '../types/api';

// User API
export const userApi = {
  register: (data: RegisterDTO) => http.post<void, void>('/user/register', data),
  login: (data: LoginDTO) => http.post<void, LoginVO>('/user/login', data),
  logout: () => http.post<void, void>('/user/logout'),
  getInfo: () => http.get<void, UserVO>('/user/info'),
  updateInfo: (data: UserVO) => http.put<void, void>('/user/info', data),
  updatePassword: (oldPassword: string, newPassword: string) => 
    http.put<void, void>(`/user/password?oldPassword=${oldPassword}&newPassword=${newPassword}`),
  checkUsername: (username: string) => http.get<void, boolean>(`/user/check/username?username=${username}`),
  checkPhone: (phone: string) => http.get<void, boolean>(`/user/check/phone?phone=${phone}`),
};

// Product API
export const productApi = {
  getById: (id: number) => http.get<void, ProductVO>(`/product/${id}`),
  getList: (params: any) => http.get<void, PageVO<ProductVO>>('/product/list', { params }),
  getHot: (limit: number) => http.get<void, ProductVO[]>(`/product/hot?limit=${limit}`),
  getRecommend: (limit: number) => http.get<void, ProductVO[]>(`/product/recommend?limit=${limit}`),
  getNew: (limit: number) => http.get<void, ProductVO[]>(`/product/new?limit=${limit}`),
  getByCategory: (categoryId: number) => http.get<void, ProductVO[]>(`/product/category/${categoryId}`),
};

// Category API
export const categoryApi = {
  getTree: () => http.get<void, CategoryTreeVO[]>('/category/tree'),
  getFirst: () => http.get<void, Category[]>('/category/first'),
  getChildren: (parentId: number) => http.get<void, Category[]>(`/category/children/${parentId}`),
  getById: (id: number) => http.get<void, Category>(`/category/${id}`),
};

// Cart API
export const cartApi = {
  get: () => http.get<void, CartVO>('/cart'),
  add: (productId: number, quantity: number) => http.post<void, void>('/cart/add', { productId, quantity }),
  updateQuantity: (productId: number, quantity: number) => http.put<void, void>('/cart/quantity', { productId, quantity }),
  remove: (productId: number) => http.delete<void, void>(`/cart/${productId}`),
  clear: () => http.delete<void, void>('/cart/clear'),
  getCount: () => http.get<void, number>('/cart/count'),
  select: (productId: number, selected: boolean) => http.put<void, void>('/cart/select', { productId, selected }),
  selectAll: (selected: boolean) => http.put<void, void>('/cart/selectAll', { selected }),
};

// Order API
export const orderApi = {
  create: (data: OrderCreateDTO) => http.post<void, Order>('/order/create', data),
  getList: (status?: number, pageNum = 1, pageSize = 10) => 
    http.get<void, PageVO<Order>>('/order/list', { params: { status, pageNum, pageSize } }),
  getByNo: (orderNo: string) => http.get<void, Order>(`/order/${orderNo}`),
  cancel: (orderNo: string) => http.post<void, void>(`/order/cancel/${orderNo}`),
  pay: (orderNo: string, payType: number) => http.post<void, void>(`/order/pay/${orderNo}`, { payType }),
  confirm: (orderNo: string) => http.post<void, void>(`/order/confirm/${orderNo}`),
  remove: (orderNo: string) => http.delete<void, void>(`/order/${orderNo}`),
};

// Address API
export const addressApi = {
  getList: () => http.get<void, UserAddress[]>('/address/list'),
  getDefault: () => http.get<void, UserAddress>('/address/default'),
  getById: (id: number) => http.get<void, UserAddress>(`/address/${id}`),
  add: (data: UserAddress) => http.post<void, void>('/address', data),
  update: (data: UserAddress) => http.put<void, void>('/address', data),
  remove: (id: number) => http.delete<void, void>(`/address/${id}`),
  setDefault: (id: number) => http.put<void, void>(`/address/default/${id}`),
};

// Coupon API
export const couponApi = {
  getAvailable: () => http.get<void, Coupon[]>('/coupon/available'),
  receive: (couponId: number) => http.post<void, void>(`/coupon/receive/${couponId}`),
  getMy: (status?: number) => http.get<void, UserCoupon[]>('/coupon/my', { params: { status } }),
  getUsable: () => http.get<void, UserCoupon[]>('/coupon/usable'),
};

// Review API
export const reviewApi = {
  getByProduct: (productId: number, pageNum = 1, pageSize = 10) => 
    http.get<void, PageVO<ProductReview>>(`/review/product/${productId}`, { params: { pageNum, pageSize } }),
  getStats: (productId: number) => http.get<void, Record<string, any>>(`/review/product/${productId}/stats`),
  add: (data: ProductReview) => http.post<void, void>('/review', data),
  remove: (reviewId: number) => http.delete<void, void>(`/review/${reviewId}`),
};

// Seckill API
export const seckillApi = {
  getList: () => http.get<void, SeckillProduct[]>('/seckill/list'),
  getOngoing: () => http.get<void, SeckillProduct[]>('/seckill/ongoing'),
  getUpcoming: () => http.get<void, SeckillProduct[]>('/seckill/upcoming'),
  getById: (seckillId: number) => http.get<void, SeckillProduct>(`/seckill/${seckillId}`),
  doSeckill: (seckillId: number) => http.post<void, string>('/seckill/do', { seckillId }),
  check: (seckillId: number) => http.get<void, boolean>(`/seckill/check/${seckillId}`),
};
