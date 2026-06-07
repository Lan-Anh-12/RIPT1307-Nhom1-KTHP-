export default {
  dev: {
    // Thêm cấu hình này để xử lý các request bắt đầu bằng /api
    '/api': {
      target: 'https://ript1307-nhom1-kthp.onrender.com',
      changeOrigin: true,
      // pathRewrite giữ nguyên /api để Backend nhận đúng route
      pathRewrite: { '^/api': '/api' }, 
    },
    '/v1/': {
      target: 'http://203.162.10.108:8099',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
    // ... giữ nguyên các cấu hình khác
  },
  // Tương tự, cập nhật vào phần test/pre nếu cần
  test: {
    '/api': {
      target: 'https://ript1307-nhom1-kthp.onrender.com',
      changeOrigin: true,
      pathRewrite: { '^/api': '/api' },
    },
    // ...
  },
};