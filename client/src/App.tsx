import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';

// Common Components
import { Navbar } from './components/common/Navbar';
import { Sidebar } from './components/common/Sidebar';
import { Footer } from './components/common/Footer';
import { ProtectedRoute } from './components/common/ProtectedRoute';

// Public Pages
import { LandingPage } from './pages/public/LandingPage';
import { NotFoundPage } from './pages/public/NotFoundPage';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage';

// Protected Pages
import { DashboardPage } from './pages/dashboard/DashboardPage';
import { ProfilePage } from './pages/dashboard/ProfilePage';
import { CropAdvisoryPage } from './pages/advisory/CropAdvisoryPage';
import { CropAdvisoryResultPage } from './pages/advisory/CropAdvisoryResultPage';
import { SoilAdvisoryPage } from './pages/advisory/SoilAdvisoryPage';
import { FertilizerAdvisoryPage } from './pages/advisory/FertilizerAdvisoryPage';
import { IrrigationAdvisoryPage } from './pages/advisory/IrrigationAdvisoryPage';
import { DiseaseAdvisoryPage } from './pages/advisory/DiseaseAdvisoryPage';
import { ChatbotPage } from './pages/chatbot/ChatbotPage';
import { HistoryPage } from './pages/history/HistoryPage';
import { ReportDetailPage } from './pages/history/ReportDetailPage';
import { SettingsPage } from './pages/settings/SettingsPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const AppLayout: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Check if current route is a public auth page or landing page
  const isPublicOnly = ['/', '/login', '/register', '/forgot-password'].includes(location.pathname);
  const showSidebar = user && !isPublicOnly;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      <Navbar
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        isSidebarOpen={isSidebarOpen}
      />

      <div className="flex-1 flex">
        {showSidebar && (
          <Sidebar
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
          />
        )}

        <main className={`flex-1 transition-all duration-300 ${showSidebar ? 'md:pl-64' : ''}`}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />

            {/* Protected Routes */}
            <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
            
            {/* Advisory Routes */}
            <Route path="/crop-advisory" element={<ProtectedRoute><CropAdvisoryPage /></ProtectedRoute>} />
            <Route path="/crop-advisory/results/:id" element={<ProtectedRoute><CropAdvisoryResultPage /></ProtectedRoute>} />
            <Route path="/soil-advisory" element={<ProtectedRoute><SoilAdvisoryPage /></ProtectedRoute>} />
            <Route path="/fertilizer-advisory" element={<ProtectedRoute><FertilizerAdvisoryPage /></ProtectedRoute>} />
            <Route path="/irrigation-advisory" element={<ProtectedRoute><IrrigationAdvisoryPage /></ProtectedRoute>} />
            <Route path="/disease-advisory" element={<ProtectedRoute><DiseaseAdvisoryPage /></ProtectedRoute>} />

            {/* Chatbot Route */}
            <Route path="/chatbot" element={<ProtectedRoute><ChatbotPage /></ProtectedRoute>} />

            {/* History Routes */}
            <Route path="/history" element={<ProtectedRoute><HistoryPage /></ProtectedRoute>} />
            <Route path="/history/:id" element={<ProtectedRoute><ReportDetailPage /></ProtectedRoute>} />

            {/* Settings Route */}
            <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />

            {/* Not Found */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
      </div>

      {isPublicOnly && <Footer />}
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <AuthProvider>
          <BrowserRouter>
            <AppLayout />
          </BrowserRouter>
        </AuthProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
};

export default App;
