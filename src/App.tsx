/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Login from './pages/Login';
import Home from './pages/Home';
import PlaceholderPage from './pages/PlaceholderPage';
import UserPermissions from './pages/UserPermissions';
import AccessLogs from './pages/AccessLogs';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route path="/" element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          } />

          {/* Protected Routes */}
          <Route element={<Layout />}>
            {/* General Modules (Read-only by default) */}
            <Route path="/inbound" element={
              <ProtectedRoute>
                <PlaceholderPage title="Inbound Control" />
              </ProtectedRoute>
            } />
            <Route path="/outbound" element={
              <ProtectedRoute>
                <PlaceholderPage title="Outbound Control" />
              </ProtectedRoute>
            } />
            <Route path="/inventory" element={
              <ProtectedRoute>
                <PlaceholderPage title="Inventory Core" />
              </ProtectedRoute>
            } />
            <Route path="/returns" element={
              <ProtectedRoute>
                <PlaceholderPage title="Returns & QC" />
              </ProtectedRoute>
            } />

            {/* Confidential Modules */}
            <Route path="/settings" element={
              <ProtectedRoute isConfidential>
                <PlaceholderPage title="WMS Settings" />
              </ProtectedRoute>
            } />
            <Route path="/permissions" element={
              <ProtectedRoute isConfidential>
                <UserPermissions />
              </ProtectedRoute>
            } />
            <Route path="/access-logs" element={
              <ProtectedRoute isConfidential>
                <AccessLogs />
              </ProtectedRoute>
            } />
            
            {/* Catch all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

