import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Warehouses from './pages/Warehouses';
import RequestsManager from './pages/RequestsManager';
import RequestForm from './pages/RequestForm';
import Requests from './pages/Requests';
import Users from './pages/Users';
import Suppliers from './pages/Suppliers';

function App() {
  const isAuthenticated = () => !!localStorage.getItem('authToken');

  return (
    <Routes>
      <Route path="/" element={isAuthenticated() ? <Navigate to="/dashboard" /> : <Login />} />
      
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      
      <Route path="/warehouses" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <Warehouses />
        </ProtectedRoute>
      } />
      
      <Route path="/requests" element={
        <ProtectedRoute>
          <RequestsManager />
        </ProtectedRoute>
      } />
      
      <Route path="/requests/new" element={
        <ProtectedRoute>
          <RequestForm />
        </ProtectedRoute>
      } />
      
      <Route path="/requests/edit/:id" element={
        <ProtectedRoute>
          <RequestForm />
        </ProtectedRoute>
      } />
      
      <Route path="/users" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <Users />
        </ProtectedRoute>
      } />
      <Route path="/suppliers" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <Suppliers />
        </ProtectedRoute>
      } />
      
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;