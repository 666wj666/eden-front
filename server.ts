import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // --- Mock Data ---
  const mockProducts = [
    { id: 1, name: '有机乳清蛋白粉', price: 299, image: 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?auto=format&fit=crop&q=80&w=400', categoryName: '蛋白质', description: '纯净天然，助力肌肉恢复。', stock: 100, status: 1, createTime: new Date().toISOString() },
    { id: 2, name: '综合维生素片', price: 158, image: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&q=80&w=400', categoryName: '维生素', description: '每日一粒，补充全天能量。', stock: 500, status: 1, createTime: new Date().toISOString() },
    { id: 3, name: '深海鱼油胶囊', price: 188, image: 'https://images.unsplash.com/photo-1550573105-4584e7d6a261?auto=format&fit=crop&q=80&w=400', categoryName: '欧米茄-3', description: '呵护心脑血管健康。', stock: 200, status: 1, createTime: new Date().toISOString() },
    { id: 4, name: '益生菌咀嚼片', price: 129, image: 'https://images.unsplash.com/photo-1576073719710-41f58a7f39e4?auto=format&fit=crop&q=80&w=400', categoryName: '肠道健康', description: '平衡肠道菌群，增强免疫。', stock: 300, status: 1, createTime: new Date().toISOString() },
  ];

  // --- API Routes ---
  
  // User API
  app.post('/user/login', (req, res) => {
    res.json({
      code: 0,
      message: 'success',
      data: {
        token: 'mock-jwt-token-' + Date.now(),
        user: { id: 1, username: req.body.username || 'admin', nickname: 'Eden用户', phone: '13800138000' }
      }
    });
  });

  app.get('/user/info', (req, res) => {
    res.json({
      code: 0,
      message: 'success',
      data: { id: 1, username: 'admin', nickname: 'Eden用户', phone: '13800138000' }
    });
  });

  // Product API
  app.get('/product/list', (req, res) => {
    res.json({
      code: 0,
      message: 'success',
      data: {
        list: mockProducts,
        total: mockProducts.length,
        pageNum: 1,
        pageSize: 10,
        pages: 1
      }
    });
  });

  app.get('/product/hot', (req, res) => {
    res.json({ code: 0, message: 'success', data: mockProducts.slice(0, 4) });
  });

  app.get('/product/recommend', (req, res) => {
    res.json({ code: 0, message: 'success', data: mockProducts });
  });

  app.get('/product/new', (req, res) => {
    res.json({ code: 0, message: 'success', data: mockProducts.slice(-2) });
  });

  app.get('/product/category/:categoryId', (req, res) => {
    res.json({ code: 0, message: 'success', data: mockProducts });
  });

  app.get('/product/:id', (req, res) => {
    const product = mockProducts.find(p => p.id === Number(req.params.id));
    res.json({ code: 0, message: 'success', data: product || mockProducts[0] });
  });

  // Seckill API
  app.get('/seckill/ongoing', (req, res) => {
    res.json({
      code: 0,
      message: 'success',
      data: [
        { ...mockProducts[0], seckillId: 1, seckillPrice: 199, seckillStock: 10, startTime: new Date().toISOString(), endTime: new Date(Date.now() + 86400000).toISOString() }
      ]
    });
  });

  app.get('/seckill/upcoming', (req, res) => {
    res.json({
      code: 0,
      message: 'success',
      data: [
        { ...mockProducts[1], seckillId: 2, seckillPrice: 99, seckillStock: 50, startTime: new Date(Date.now() + 86400000).toISOString(), endTime: new Date(Date.now() + 172800000).toISOString() }
      ]
    });
  });

  app.get('/seckill/list', (req, res) => {
    res.json({
      code: 0,
      message: 'success',
      data: [
        { ...mockProducts[0], seckillId: 1, seckillPrice: 199, seckillStock: 10, startTime: new Date().toISOString(), endTime: new Date(Date.now() + 86400000).toISOString() },
        { ...mockProducts[1], seckillId: 2, seckillPrice: 99, seckillStock: 50, startTime: new Date(Date.now() + 86400000).toISOString(), endTime: new Date(Date.now() + 172800000).toISOString() }
      ]
    });
  });

  // Category API
  app.get('/category/tree', (req, res) => {
    res.json({
      code: 0,
      message: 'success',
      data: [
        { id: 1, name: '基础营养', children: [{ id: 11, name: '蛋白质' }, { id: 12, name: '维生素' }] },
        { id: 2, name: '功能保健', children: [{ id: 21, name: '肠道健康' }, { id: 22, name: '心脑血管' }] }
      ]
    });
  });

  // Cart API
  app.get('/cart', (req, res) => {
    res.json({
      code: 0,
      message: 'success',
      data: {
        items: [
          { productId: 1, productName: '有机乳清蛋白粉', productImage: mockProducts[0].image, price: 299, quantity: 1, selected: true, stock: 100 }
        ],
        totalPrice: 299,
        totalCount: 1,
        selectedCount: 1
      }
    });
  });

  // Address API
  app.get('/address/list', (req, res) => {
    res.json({
      code: 0,
      message: 'success',
      data: [
        { id: 1, receiverName: '张三', receiverPhone: '13800138000', province: '上海市', city: '上海市', district: '黄浦区', detailAddress: '南京东路888号', isDefault: 1 }
      ]
    });
  });

  // Coupon API
  app.get('/coupon/available', (req, res) => {
    res.json({
      code: 0,
      message: 'success',
      data: [
        { id: 1, name: '新用户大礼包', type: 0, value: 50, minAmount: 200, startTime: new Date().toISOString(), endTime: new Date(Date.now() + 86400000).toISOString() }
      ]
    });
  });

  app.get('/coupon/my', (req, res) => {
    res.json({
      code: 0,
      message: 'success',
      data: [
        { id: 1, userCouponId: 101, name: '新用户大礼包', type: 0, value: 50, minAmount: 200, status: 0, startTime: new Date().toISOString(), endTime: new Date(Date.now() + 86400000).toISOString() }
      ]
    });
  });

  app.get('/coupon/usable', (req, res) => {
    res.json({
      code: 0,
      message: 'success',
      data: [
        { id: 1, userCouponId: 101, name: '新用户大礼包', type: 0, value: 50, minAmount: 200, status: 0, startTime: new Date().toISOString(), endTime: new Date(Date.now() + 86400000).toISOString() }
      ]
    });
  });

  app.post('/coupon/receive/:couponId', (req, res) => {
    res.json({
      code: 0,
      message: 'success',
      data: null
    });
  });

  // Review API
  app.get('/review/product/:productId', (req, res) => {
    res.json({
      code: 0,
      message: 'success',
      data: {
        list: [
          { id: 1, productId: Number(req.params.productId), userId: 1, nickname: '健康达人', rating: 5, content: '产品非常棒，效果明显！', createTime: new Date().toISOString() }
        ],
        total: 1
      }
    });
  });

  app.get('/review/product/:productId/stats', (req, res) => {
    res.json({
      code: 0,
      message: 'success',
      data: { averageRating: 4.8, totalCount: 120 }
    });
  });

  // Order API
  app.get('/order/list', (req, res) => {
    res.json({
      code: 0,
      message: 'success',
      data: {
        list: [
          { orderNo: 'ORD20260322001', totalPrice: 299, payPrice: 299, status: 0, createTime: new Date().toISOString(), items: [{ id: 1, productName: '有机乳清蛋白粉', productImage: mockProducts[0].image, price: 299, quantity: 1 }] }
        ],
        total: 1
      }
    });
  });

  // --- Vite Integration ---
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
