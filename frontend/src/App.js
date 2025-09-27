import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './layouts/AppLayout';
import RegistrationPage from './pages/RegistrationPage';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import EventsPage from './pages/EventsPage';
import CreateEventPage from './pages/CreateEventPage';
import EventRegistrationPage from './pages/EventRegistrationPage';
import './App.css';



function PrivateRoute({ children }) {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<RegistrationPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route element={<AppLayout />}>
          <Route path="/home" element={<HomePage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/events/:eventId/register" element={<EventRegistrationPage />} />
          <Route path="/events/create" element={<CreateEventPage />} />
        </Route>
        <Route path="/" element={
          <PrivateRoute>
            <LoginPage />
          </PrivateRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;
