import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Services } from './pages/Services';
import { CvOptimizer } from './pages/CvOptimizer';
import { CompetitorAnalysis } from './pages/CompetitorAnalysis';
import { Consultation } from './pages/Consultation';
import Contact from './pages/Contact'; // Note: Default export now
import { Admin } from './pages/Admin';
import { Login } from './pages/Login';
import { Pricing } from './pages/Pricing';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext'; // 1. Import This

const App: React.FC = () => {
  return (
    <LanguageProvider>
      {/* 2. Wrap everything in AuthProvider */}
      <AuthProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/services" element={<Services />} />
              <Route path="/services/cv-optimizer" element={<CvOptimizer />} />
              <Route path="/services/competitor-analysis" element={<CompetitorAnalysis />} />
              <Route path="/services/consultation" element={<Consultation />} />
              <Route path="/admin" element={<Admin />} />
            </Routes>
          </Layout>
        </Router>
      </AuthProvider>
    </LanguageProvider>
  );
};

export default App;