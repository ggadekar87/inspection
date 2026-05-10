import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Provider } from 'react-redux';
import { store } from './app/store';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layout/MainLayout';
import Dashboard from './pages/Dashboard';
import AppointmentsPage from './pages/AppointmentsPage';
import Reports from './pages/Reports';
import Support from './pages/Support';
import NewAppointment from './pages/NewAppointment';
import Login from './pages/Auth/Login';
import Signup from './pages/Auth/Signup';
import ProtectedRoute from './routes/ProtectedRoute';
import { ErrorBoundary } from './components/ErrorBoundary';
import './styles/global.css';
function App() {
  const AppRoutes = () => (
  <Routes>
      <Route index element={<Dashboard />} />
      <Route path="/appointments" element={<AppointmentsPage />} />
      <Route path="/reports" element={<Reports />} />
      <Route path="/support" element={<Support />} />
      <Route path="/new-appointment" element={<NewAppointment />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
    <Route path="*" element={<div style={{ padding: 20 }}>Not found</div>} />
  </Routes>
);
  return (
    <div className="App">
       <React.StrictMode>
    <Provider store={store}>
      <ErrorBoundary>
        <BrowserRouter>
        <MainLayout> <AppRoutes /></MainLayout>
         
        </BrowserRouter>
      </ErrorBoundary>
    </Provider>
  </React.StrictMode>
    </div>
  );
}

export default App;
