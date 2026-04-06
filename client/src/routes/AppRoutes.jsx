import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

// Layout
import AppLayout from '../components/layout/AppLayout';

// Pages
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import DashboardPage from '../pages/DashboardPage';
import TransactionsPage from '../pages/TransactionsPage';
import TransactionDetailPage from '../pages/TransactionDetailPage';
import UsersPage from '../pages/UsersPage';
import ProfilePage from '../pages/ProfilePage';
import LeaderboardPage from '../pages/LeaderboardPage';
import HistoryPage from '../pages/HistoryPage';
import TopInvestorsPage from '../pages/TopInvestorsPage';
import SystemStatusPage from '../pages/SystemStatusPage';
import NotFoundPage from '../pages/NotFoundPage';

// Guards
import ProtectedRoute from './ProtectedRoute';
import RoleRoute from './RoleRoute';

const AppRoutes = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* Public Routes */}
      <Route 
        path="/login" 
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />} 
      />
      <Route 
        path="/register" 
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <RegisterPage />} 
      />
      <Route path="/status" element={<SystemStatusPage />} />

      {/* Protected Routes */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <AppLayout><DashboardPage /></AppLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/transactions" 
        element={
          <ProtectedRoute>
            <AppLayout><TransactionsPage /></AppLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/transactions/:id" 
        element={
          <ProtectedRoute>
            <AppLayout><TransactionDetailPage /></AppLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/users" 
        element={
          <RoleRoute allowedRoles={['admin']}>
            <AppLayout><UsersPage /></AppLayout>
          </RoleRoute>
        } 
      />
      <Route 
        path="/profile" 
        element={
          <ProtectedRoute>
            <AppLayout><ProfilePage /></AppLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/profile/:id" 
        element={
          <RoleRoute allowedRoles={['admin', 'analyst']}>
            <AppLayout><ProfilePage /></AppLayout>
          </RoleRoute>
        } 
      />
      <Route 
        path="/leaderboard" 
        element={
          <ProtectedRoute>
            <AppLayout><LeaderboardPage /></AppLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/history" 
        element={
          <ProtectedRoute>
            <AppLayout><HistoryPage /></AppLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/investors" 
        element={
          <RoleRoute allowedRoles={['admin', 'analyst']}>
            <AppLayout><TopInvestorsPage /></AppLayout>
          </RoleRoute>
        } 
      />

      {/* Root Redirect */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      {/* 404 */}
      <Route path="*" element={<AppLayout><NotFoundPage /></AppLayout>} />
    </Routes>
  );
};

export default AppRoutes;
