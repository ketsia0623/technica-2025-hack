import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import AboutUs from './pages/aboutus'
import Quiz from './pages/Quiz';
import Sim from './pages/Sim';
import './App.css';
import ProtectedRoute from './components/ProtectedRoute';
import QuizPage1 from './pages/Quiz-hs-student';
import QuizPage2 from './pages/Quiz-college';
import QuizPage3 from './pages/Quiz-new-grad';  

function App() {
  return (
    <Router>
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
          path="/quiz1" 
          element={
            <ProtectedRoute>
              <QuizPage1 />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/quiz2" 
          element={
            <ProtectedRoute>
              <QuizPage2 />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/quiz3" 
          element={
            <ProtectedRoute>
              <QuizPage3 />
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