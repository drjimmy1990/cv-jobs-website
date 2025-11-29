import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  ArrowRight, ArrowLeft, FileCheck, Search, MessageCircle,
  Briefcase, Building2, User, ChevronRight, PenTool, Activity
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const Services: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');
  const { t, isRTL } = useLanguage();
  const ArrowForward = isRTL ? ArrowLeft : ArrowRight;
  const ArrowBack = isRTL ? ArrowRight : ArrowLeft;

  // 'selection' | 'individuals' | 'companies'
  const [viewMode, setViewMode] = useState<string>('selection');

  useEffect(() => {
    if (categoryParam === 'individuals') {
      setViewMode('individuals');
    } else if (categoryParam === 'companies') {
      setViewMode('companies');
    } else {
      setViewMode('selection');
    }
  }, [categoryParam]);

  const handleSelection = (type: 'individuals' | 'companies') => {
    setSearchParams({ category: type });
    setViewMode(type);
  };

  const handleBack = () => {
    setSearchParams({});
    setViewMode('selection');
  };

  return (
    <div className="bg-background min-h-screen flex flex-col">
      {/* Header Area */}
      <div className="bg-primary text-white pt-20 pb-32 px-4 relative overflow-hidden shrink-0">
        <div className={`absolute top-0 ${isRTL ? 'left-0' : 'right-0'} w-1/3 h-full bg-white/5 skew-x-12`}></div>
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 font-sans animate-fadeIn">{t('services.hubTitle')}</h1>
          <p className="text-blue-100 text-lg md:text-xl max-w-2xl mx-auto font-light leading-relaxed">
            {viewMode === 'selection' && t('services.hubSubtitleSelect')}
            {viewMode === 'individuals' && t('services.hubSubtitleInd')}
            {viewMode === 'companies' && t('services.hubSubtitleComp')}
          </p>
        </div>
      </div>

      {/* Main Content Area - Floating Over Header */}
      <div className="max-w-7xl mx-auto px-4 -mt-20 pb-24 relative z-10 w-full flex-grow">

        {/* VIEW 1: SELECTION PORTAL */}
        {viewMode === 'selection' && (
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto items-stretch">

            {/* --- INDIVIDUAL SELECTION CARD --- */}
            <div
              onClick={() => handleSelection('individuals')}
              className="bg-white rounded-2xl shadow-xl p-10 cursor-pointer transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl border-2 border-transparent hover:border-secondary group flex flex-col h-full items-center text-center"
            >
              <div className="bg-blue-50 w-24 h-24 rounded-full flex items-center justify-center mb-8 group-hover:bg-secondary group-hover:text-white transition-all duration-300 shadow-sm">
                <User size={48} className="text-primary group-hover:text-white transition-colors" />
              </div>
              <h2 className="text-2xl font-bold text-charcoal mb-4">{t('services.forIndividuals')}</h2>
              <p className="text-gray-600 mb-8 leading-relaxed max-w-sm flex-grow">
                {t('services.forIndividualsDesc')}
              </p>

              {/* LIST OF SERVICES (Added Background to make it obvious) */}
              <div className="text-left w-full max-w-xs space-y-4 mb-8 bg-gray-50 p-4 rounded-xl border border-gray-100">
                <div className="flex items-center gap-3 text-sm text-gray-700 font-medium">
                  <FileCheck size={20} className="text-secondary shrink-0" />
                  <span>{t('services.cvOptTitle')}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-700 font-medium">
                  <PenTool size={20} className="text-secondary shrink-0" />
                  <span>{t('services.cvCreatorTitle')}</span>
                </div>
              </div>

              <div className="mt-auto px-6 py-2 rounded-full bg-gray-50 text-primary font-bold group-hover:bg-secondary group-hover:text-white transition-colors flex items-center gap-2">
                {t('services.viewServices')} <ChevronRight size={18} className={isRTL ? 'rotate-180' : ''} />
              </div>
            </div>

            {/* --- COMPANY SELECTION CARD --- */}
            <div
              onClick={() => handleSelection('companies')}
              className="bg-white rounded-2xl shadow-xl p-10 cursor-pointer transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl border-2 border-transparent hover:border-primary group flex flex-col h-full items-center text-center"
            >
              <div className="bg-blue-50 w-24 h-24 rounded-full flex items-center justify-center mb-8 group-hover:bg-primary group-hover:text-white transition-all duration-300 shadow-sm">
                <Building2 size={48} className="text-charcoal group-hover:text-white transition-colors" />
              </div>
              <h2 className="text-2xl font-bold text-charcoal mb-4">{t('services.forCompanies')}</h2>
              <p className="text-gray-600 mb-8 leading-relaxed max-w-sm flex-grow">
                {t('services.forCompaniesDesc')}
              </p>

              {/* LIST OF SERVICES */}
              <div className="text-left w-full max-w-xs space-y-4 mb-8 bg-gray-50 p-4 rounded-xl border border-gray-100">
                <div className="flex items-center gap-3 text-sm text-gray-700 font-medium">
                  <Search size={20} className="text-primary shrink-0" />
                  <span>{t('services.compAnalysisTitle')}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-700 font-medium">
                  <Activity size={20} className="text-primary shrink-0" />
                  <span>{t('services.singleBusinessTitle')}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-700 font-medium">
                  <MessageCircle size={20} className="text-primary shrink-0" />
                  <span>{t('services.expertConsultTitle')}</span>
                </div>
              </div>

              <div className="mt-auto px-6 py-2 rounded-full bg-gray-50 text-charcoal font-bold group-hover:bg-primary group-hover:text-white transition-colors flex items-center gap-2">
                {t('services.viewServices')} <ChevronRight size={18} className={isRTL ? 'rotate-180' : ''} />
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: INDIVIDUALS ONLY */}
        {viewMode === 'individuals' && (
          <div className="animate-slideUp w-full">
            {/* Header Card */}
            <div className="bg-white rounded-3xl shadow-xl p-8 md:p-10 mb-10 border border-gray-100">
              <button
                onClick={handleBack}
                className="mb-8 inline-flex items-center text-gray-500 hover:text-primary transition-colors font-medium group"
              >
                <div className="bg-gray-100 p-2 rounded-full group-hover:bg-blue-50 me-3 transition-colors">
                  <ArrowBack size={18} />
                </div>
                {t('services.backToSelection')}
              </button>

              <div className="flex flex-col md:flex-row md:items-start gap-8">
                <div className="bg-secondary/10 text-secondary p-6 rounded-3xl flex-shrink-0 self-start shadow-sm">
                  <User size={48} strokeWidth={1.5} />
                </div>
                <div className="pt-2">
                  <h2 className="text-3xl md:text-4xl font-bold text-charcoal mb-4">{t('services.indTitle')}</h2>
                  <p className="text-lg text-gray-600 leading-relaxed max-w-3xl">{t('services.hubSubtitleInd')}</p>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
              {/* 1. CV Optimizer Card */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-xl hover:border-blue-300 transition-all duration-300 group flex flex-col h-full">
                <div className="h-48 bg-blue-50 flex items-center justify-center relative overflow-hidden shrink-0">
                  <div className="absolute inset-0 bg-blue-100/50 transform rotate-12 scale-150 rounded-full translate-y-20 translate-x-10"></div>
                  <FileCheck size={64} className="text-blue-300 group-hover:text-primary transition-colors relative z-10" />
                </div>
                <div className="p-8 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-charcoal">{t('services.cvOptTitle')}</h3>
                  </div>
                  <p className="text-gray-600 text-sm mb-8 leading-relaxed flex-1">
                    {t('services.cvOptDesc')}
                  </p>
                  <button
                    onClick={() => navigate('/services/cv-optimizer')}
                    className="w-full bg-primary text-white hover:bg-blue-800 py-3 rounded-xl font-bold transition-colors flex justify-center items-center gap-2 mt-auto"
                  >
                    {t('services.optimizeBtn')} <ArrowForward size={18} />
                  </button>
                </div>
              </div>

              {/* 2. CV Creator Card */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-xl hover:border-green-300 transition-all duration-300 group flex flex-col h-full">
                <div className="h-48 bg-green-50 flex items-center justify-center relative overflow-hidden shrink-0">
                  <div className="absolute inset-0 bg-green-100/50 transform -rotate-12 scale-150 rounded-full translate-y-20 -translate-x-10"></div>
                  <PenTool size={64} className="text-green-300 group-hover:text-green-600 transition-colors relative z-10" />
                </div>
                <div className="p-8 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-charcoal">{t('services.cvCreatorTitle')}</h3>
                  </div>
                  <p className="text-gray-600 text-sm mb-8 leading-relaxed flex-1">
                    {t('services.cvCreatorDesc')}
                  </p>
                  <button
                    onClick={() => navigate('/services/cv-creator')}
                    className="w-full bg-secondary text-white hover:bg-teal-600 py-3 rounded-xl font-bold transition-colors flex justify-center items-center gap-2 mt-auto"
                  >
                    {t('services.buildCvBtn')} <ArrowForward size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 3: COMPANIES ONLY */}
        {viewMode === 'companies' && (
          <div className="animate-slideUp w-full">
            {/* Header Card */}
            <div className="bg-white rounded-3xl shadow-xl p-8 md:p-10 mb-10 border border-gray-100">
              <button
                onClick={handleBack}
                className="mb-8 inline-flex items-center text-gray-500 hover:text-primary transition-colors font-medium group"
              >
                <div className="bg-gray-100 p-2 rounded-full group-hover:bg-blue-50 me-3 transition-colors">
                  <ArrowBack size={18} />
                </div>
                {t('services.backToSelection')}
              </button>

              <div className="flex flex-col md:flex-row md:items-start gap-8">
                <div className="bg-primary/10 text-primary p-6 rounded-3xl flex-shrink-0 self-start shadow-sm">
                  <Building2 size={48} strokeWidth={1.5} />
                </div>
                <div className="pt-2">
                  <h2 className="text-3xl md:text-4xl font-bold text-charcoal mb-4">{t('services.compTitle')}</h2>
                  <p className="text-lg text-gray-600 leading-relaxed max-w-3xl">{t('services.hubSubtitleComp')}</p>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
              {/* Competitor Analysis Card */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-xl hover:border-purple-300 transition-all duration-300 group flex flex-col h-full">
                <div className="h-48 bg-purple-50 flex items-center justify-center relative overflow-hidden shrink-0">
                  <div className="absolute inset-0 bg-purple-100/50 transform -rotate-6 scale-125 rounded-3xl translate-y-16"></div>
                  <Search size={64} className="text-purple-300 group-hover:text-purple-700 transition-colors relative z-10" />
                </div>
                <div className="p-8 flex-1 flex flex-col">
                  <h3 className="text-xl font-bold text-charcoal mb-4">{t('services.compAnalysisTitle')}</h3>
                  <p className="text-gray-600 text-sm mb-8 leading-relaxed flex-1">
                    {t('services.compAnalysisDesc')}
                  </p>
                  <button
                    onClick={() => navigate('/services/competitor-analysis')}
                    className="w-full border-2 border-primary text-primary hover:bg-primary hover:text-white py-3 rounded-xl font-bold transition-colors flex justify-center items-center gap-2 mt-auto"
                  >
                    {t('services.compareBtn')} <ArrowForward size={18} />
                  </button>
                </div>
              </div>

              {/* Business Analyzer Card */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-xl hover:border-teal-300 transition-all duration-300 group flex flex-col h-full">
                <div className="h-48 bg-teal-50 flex items-center justify-center relative overflow-hidden shrink-0">
                  <div className="absolute inset-0 bg-teal-100/50 transform rotate-6 scale-125 rounded-3xl translate-y-16"></div>
                  <Activity size={64} className="text-teal-300 group-hover:text-teal-700 transition-colors relative z-10" />
                </div>
                <div className="p-8 flex-1 flex flex-col">
                  <h3 className="text-xl font-bold text-charcoal mb-4">{t('businessAnalyzer.title')}</h3>
                  <p className="text-gray-600 text-sm mb-8 leading-relaxed flex-1">
                    {t('businessAnalyzer.subtitle')}
                  </p>
                  <button
                    onClick={() => navigate('/services/business-analyzer')}
                    className="w-full border-2 border-primary text-primary hover:bg-primary hover:text-white py-3 rounded-xl font-bold transition-colors flex justify-center items-center gap-2 mt-auto"
                  >
                    {t('businessAnalyzer.analyzeNow')} <ArrowForward size={18} />
                  </button>
                </div>
              </div>

              {/* Expert Consultation Card */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-xl hover:border-orange-300 transition-all duration-300 group flex flex-col h-full">
                <div className="h-48 bg-orange-50 flex items-center justify-center relative overflow-hidden shrink-0">
                  <div className="absolute inset-0 bg-orange-100/50 transform rotate-45 scale-75 rounded-full translate-x-20"></div>
                  <MessageCircle size={64} className="text-orange-300 group-hover:text-orange-600 transition-colors relative z-10" />
                </div>
                <div className="p-8 flex-1 flex flex-col">
                  <h3 className="text-xl font-bold text-charcoal mb-4">{t('services.expertConsultTitle')}</h3>
                  <p className="text-gray-600 text-sm mb-8 leading-relaxed flex-1">
                    {t('services.expertConsultDesc')}
                  </p>
                  <button
                    onClick={() => navigate('/services/consultation')}
                    className="w-full border-2 border-primary text-primary hover:bg-primary hover:text-white py-3 rounded-xl font-bold transition-colors flex justify-center items-center gap-2 mt-auto"
                  >
                    {t('services.consultBtn')} <ArrowForward size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div >
  );
};