module.exports = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  typescript: {
    // 允许生产构建成功，即使有类型错误
    ignoreBuildErrors: true,
  },
};
