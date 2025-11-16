import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import AboutUs from './pages/aboutus';
import Quiz from './pages/Quiz';
import Sim from './pages/Sim';
import ChatBubble from "./components/ChatBubble"; 

import './App.css';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      {/* ChatBubble will appear on all pages */}
      <ChatBubble />

      <Routes>
        {/* Public routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/homepage" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/aboutus" element={<AboutUs />} />

        {/* Protected routes - require login */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/quiz" 
          element={
            <ProtectedRoute>
              <Quiz />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/sim" 
          element={
            <ProtectedRoute>
              <Sim />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;
