import { createRouter, createWebHashHistory } from 'vue-router';
const routes = [
  {
    path: '/',
    name: 'RoomLook',
    component: () => import('@/views/room/room-look'),
  },
  {
    path: '/island-sky',
    name: 'IslandSky',
    component: () => import('@/views/islandSky/island-sky'),
  },
  {
    path: '/car-display',
    name: 'CarDisplay',
    component: () => import('@/views/carDisplay/car-display'),
  },
  {
    path: '/ball-surround',
    name: 'BallSurround',
    component: () => import('@/views/surround/ball-surround'),
  },
];

// 创建路由实例
const router = createRouter({
  // 使用hash模式
  history: createWebHashHistory(),
  // 路由配置
  routes,
});

export default router;
