import { createBrowserRouter } from 'react-router';
import Hero from './pages/Hero';
import Test from './pages/Test';
import Results from './pages/Results';
import NotFound from './pages/NotFound';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Hero,
  },
  {
    path: '/index.html',
    Component: Hero,
  },
  {
    path: '/test',
    Component: Test,
  },
  {
    path: '/results',
    Component: Results,
  },
  {
    path: '*',
    Component: NotFound,
  },
], {
  basename: '/testnw',
});
