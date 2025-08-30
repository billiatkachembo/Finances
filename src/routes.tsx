import * as React from 'react';
import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import Spinner from './components/Spinner';
import Layout from './components/Layout';

// Lazy load pages
const Home = lazy(() => import('./pages/Index'));
const Settings = lazy(() => import('./pages/Settings'));
const Profile = lazy(() => import('./pages/Profile'));

// Error boundary fallback component
const ErrorFallback = () => (
  <div className="flex justify-center items-center min-h-screen">
    <p className="text-destructive">Something went wrong loading this page.</p>
  </div>
);

class ErrorBoundary extends React.Component<React.PropsWithChildren, { hasError: boolean }> {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    return this.state.hasError ? <ErrorFallback /> : this.props.children;
  }
}

// Layout for settings nested routes
const SettingsLayout = () => (
  <Layout>
    <h1 className="text-2xl font-semibold mb-4">Settings</h1>
    <Outlet />
  </Layout>
);

export default function AppRoutes() {
  return (
    <BrowserRouter basename="/Finances/">
      <ErrorBoundary>
        <Suspense fallback={<Spinner />}>
          <Routes>
            <Route path="/" element={<Home />} />

            <Route path="settings" element={<SettingsLayout />}>
              <Route index element={<Settings />} />
            </Route>

            <Route path="profile" element={<Profile />} />

            <Route path="*" element={<div className="p-6 text-center text-lg">Page not found</div>} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </BrowserRouter>
  );
}