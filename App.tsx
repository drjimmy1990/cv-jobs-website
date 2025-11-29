import React, { Suspense } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Loader } from 'lucide-react';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';

// --- Lazy Load Pages ---

// For Named Exports (export const ComponentName = ...)
const Home = React.lazy(() => import('./pages/Home').then(module => ({ default: module.Home })));
const Services = React.lazy(() => import('./pages/Services').then(module => ({ default: module.Services })));
const CvOptimizer = React.lazy(() => import('./pages/CvOptimizer').then(module => ({ default: module.CvOptimizer })));
const CvCreator = React.lazy(() => import('./pages/CvCreator').then(module => ({ default: module.CvCreator })));
const BusinessAnalyzer = React.lazy(() => import('./pages/BusinessAnalyzer').then(module => ({ default: module.BusinessAnalyzer })));
const CompetitorAnalysis = React.lazy(() => import('./pages/CompetitorAnalysis').then(module => ({ default: module.CompetitorAnalysis })));
const Consultation = React.lazy(() => import('./pages/Consultation').then(module => ({ default: module.Consultation })));
const Admin = React.lazy(() => import('./pages/Admin').then(module => ({ default: module.Admin })));
const Login = React.lazy(() => import('./pages/Login').then(module => ({ default: module.Login })));
const Pricing = React.lazy(() => import('./pages/Pricing').then(module => ({ default: module.Pricing })));

// For Default Exports (export default ComponentName)
const Contact = React.lazy(() => import('./pages/Contact'));

// --- Loading Spinner Component ---
const PageLoader = () => (
  <div className="flex items-center justify-center h-[calc(100vh-64px)]">
    <div className="text-center">
      <Loader className="animate-spin text-primary mx-auto mb-4" size={48} />
      <p className="text-gray-500 font-medium">Loading...</p>
    </div>
  </div>
);

const App: React.FC = () => {
  return (
    <LanguageProvider>
      <AuthProvider>
        <Router>
          <Layout>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/services" element={<Services />} />
                <Route path="/services/cv-optimizer" element={<CvOptimizer />} />
                <Route path="/services/cv-creator" element={<CvCreator />} />
                <Route path="/services/business-analyzer" element={<BusinessAnalyzer />} />
                <Route path="/services/competitor-analysis" element={<CompetitorAnalysis />} />
                <Route path="/services/consultation" element={<Consultation />} />
                <Route path="/admin" element={<Admin />} />
              </Routes>
            </Suspense>
          </Layout>
        </Router>
      </AuthProvider>
    </LanguageProvider>
  );
};

export default App;