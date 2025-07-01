// src/utils/preloadRoutes.ts
// Intelligent preloading - предзагрузка компонентов при hover

const preloadedRoutes = new Set<string>();

// Функции preload для каждого lazy компонента
export const preloadRoutes = {
  news: () => import('../pages/News'),
  events: () => import('../pages/Events'),
  promotions: () => import('../pages/Promotions'),
  services: () => import('../pages/1CServices'),
  readySolutions: () => import('../components/ReadySolutionsList'),
  newsDetail: () => import('../components/NewsDetail'),
  eventsDetail: () => import('../components/EventsDetail'),
  promotionsDetail: () => import('../components/PromotionsDetail'),
  readySolutionDetail: () => import('../components/ReadySolutionDetail'),
  dashboard: () => import('../pages/admin/Dashboard'),
};

// Типы маршрутов
export type PreloadableRoute = keyof typeof preloadRoutes;

/**
 * Предзагрузка компонента по имени маршрута
 */
export const preloadRoute = (routeName: PreloadableRoute): void => {
  if (preloadedRoutes.has(routeName)) {
    return; // Уже предзагружено
  }

  preloadedRoutes.add(routeName);

  // Выполняем preload с небольшой задержкой
  setTimeout(() => {
    preloadRoutes[routeName]().catch((error) => {
      console.warn(`Failed to preload route ${routeName}:`, error);
      preloadedRoutes.delete(routeName); // Убираем из кэша при ошибке
    });
  }, 100);
};

/**
 * Определение маршрута по URL для preload
 */
export const getRouteNameFromPath = (path: string): PreloadableRoute | null => {
  if (path.startsWith('/news/')) return 'newsDetail';
  if (path.startsWith('/events/')) return 'eventsDetail';
  if (path.startsWith('/promotions/')) return 'promotionsDetail';
  if (path.startsWith('/ready-solutions/') && path !== '/ready-solutions')
    return 'readySolutionDetail';
  if (path === '/news') return 'news';
  if (path === '/events') return 'events';
  if (path === '/promotions') return 'promotions';
  if (path === '/1c-services') return 'services';
  if (path === '/ready-solutions') return 'readySolutions';
  if (path.startsWith('/admin')) return 'dashboard';

  return null;
};

/**
 * Хук для автоматического preload при hover
 */
export const usePreloadOnHover = () => {
  const handleMouseEnter = (path: string) => {
    const routeName = getRouteNameFromPath(path);
    if (routeName) {
      preloadRoute(routeName);
    }
  };

  return { handleMouseEnter };
};

/**
 * Batch preload для часто используемых маршрутов
 */
export const preloadCriticalRoutes = (): void => {
  // Предзагружаем самые популярные маршруты
  const criticalRoutes: PreloadableRoute[] = ['news', 'events', 'promotions'];

  criticalRoutes.forEach((route) => {
    setTimeout(() => preloadRoute(route), Math.random() * 2000 + 1000); // Случайная задержка 1-3 сек
  });
};

/**
 * Предзагрузка при idle состоянии браузера
 */
export const preloadOnIdle = (): void => {
  if ('requestIdleCallback' in window) {
    requestIdleCallback(
      () => {
        preloadCriticalRoutes();
      },
      { timeout: 5000 }
    );
  } else {
    // Fallback для браузеров без requestIdleCallback
    setTimeout(preloadCriticalRoutes, 3000);
  }
};
