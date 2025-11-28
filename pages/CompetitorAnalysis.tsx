import React, { useState } from 'react';
import { Search, TrendingUp, Award, ThumbsUp, ThumbsDown, AlertTriangle, Loader, Printer, ArrowRight, Star, Users, BarChart2 } from 'lucide-react';
// ⚠️ CRITICAL CHANGE: Ensure this imports 'api', NOT 'geminiService'
import { api } from '../services/api';
import { ComparisonResult } from '../types';
import { useLanguage } from '../context/LanguageContext';

export const CompetitorAnalysis: React.FC = () => {
  const [linkA, setLinkA] = useState('');
  const [linkB, setLinkB] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ComparisonResult | null>(null);
  const { t, isRTL } = useLanguage();

  const handleCompare = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!linkA || !linkB) return;

    setLoading(true);
    setResult(null);

    try {
      // ✅ Call the n8n API wrapper
      const data = await api.compareBusinesses(linkA, linkB);

      // Safety check for empty lists to prevent .map() errors
      if (!data.strengthsA) data.strengthsA = [];
      if (!data.weaknessesA) data.weaknessesA = [];
      if (!data.strengthsB) data.strengthsB = [];
      if (!data.weaknessesB) data.weaknessesB = [];

      setResult(data);
    } catch (error) {
      console.error(error);
      alert("Analysis failed. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => window.print();

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Search Section */}
      <div className="print:hidden">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-primary mb-2">{t('analysis.title')}</h1>
          <p className="text-gray-600">{t('analysis.subtitle')}</p>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 mb-10">
          <form onSubmit={handleCompare} className="grid md:grid-cols-[1fr_auto_1fr] gap-4 items-end">
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">{t('analysis.businessA')}</label>
              <input type="text" placeholder="Google Maps Link A" value={linkA} onChange={(e) => setLinkA(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2" />
            </div>
            <div className="flex justify-center pb-2"><div className="bg-gray-100 rounded-full p-2 text-gray-500 font-bold text-sm">VS</div></div>
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">{t('analysis.businessB')}</label>
              <input type="text" placeholder="Google Maps Link B" value={linkB} onChange={(e) => setLinkB(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2" />
            </div>
            <div className="md:col-span-3 mt-4 flex justify-center">
              <button type="submit" disabled={loading} className="bg-accent hover:bg-yellow-600 text-white font-bold py-3 px-10 rounded-lg shadow-md flex items-center gap-2">
                {loading ? <><Loader className="animate-spin" /> Analyzing...</> : <><Search size={18} /> {t('analysis.compareNow')}</>}
              </button>
            </div>
          </form>
        </div>
      </div>

      {result && (
        <div className="animate-fadeIn space-y-8 print:space-y-6">
          {/* Executive Summary */}
          <div className="bg-white rounded-xl shadow-lg border-t-4 border-secondary overflow-hidden">
            <div className="bg-gray-50 px-8 py-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-charcoal">Executive Report</h2>
              <button onClick={handlePrint} className="print:hidden text-gray-500 hover:text-primary flex items-center gap-2 text-sm font-bold"><Printer size={18} /> Print PDF</button>
            </div>
            <div className="p-8">
              <div className="grid grid-cols-3 gap-4 items-center mb-8">
                <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-100">
                  <h3 className="font-bold text-lg text-charcoal mb-2">{result.businessA}</h3>
                  <div className="flex justify-center items-center gap-2 text-2xl font-bold text-primary"><Star className="text-accent fill-accent" size={24} /> {result.businessA_Score}</div>
                  <div className="text-sm text-gray-500 mt-1 flex justify-center items-center gap-1"><Users size={14} /> {result.businessA_Count} Reviews</div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-400 font-bold uppercase tracking-widest mb-2">Winner</div>
                  <div className="text-2xl font-extrabold text-secondary">{result.winner}</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-100">
                  <h3 className="font-bold text-lg text-charcoal mb-2">{result.businessB}</h3>
                  <div className="flex justify-center items-center gap-2 text-2xl font-bold text-primary"><Star className="text-accent fill-accent" size={24} /> {result.businessB_Score}</div>
                  <div className="text-sm text-gray-500 mt-1 flex justify-center items-center gap-1"><Users size={14} /> {result.businessB_Count} Reviews</div>
                </div>
              </div>
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-center max-w-3xl mx-auto">
                <p className="text-gray-700 leading-relaxed font-medium">{result.summary}</p>
              </div>
            </div>
          </div>

          {/* Charts */}
          <div className="space-y-8">
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
              <h3 className="font-bold text-charcoal mb-4 flex items-center gap-2"><BarChart2 size={20} /> Review Volume</h3>
              <div className="flex items-center justify-center h-[300px] bg-gray-50 rounded-lg">
                <img src={result.chartUrlMonthly} alt="Monthly Trends" className="max-h-full max-w-full object-contain" />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                <h3 className="font-bold text-charcoal mb-4 flex items-center gap-2"><TrendingUp size={20} /> Quarterly Growth</h3>
                <div className="flex items-center justify-center h-[250px] bg-gray-50 rounded-lg">
                  <img src={result.chartUrlQuarterly} alt="Quarterly" className="max-h-full max-w-full object-contain" />
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                <h3 className="font-bold text-charcoal mb-4 flex items-center gap-2"><ThumbsUp size={20} /> Sentiment Analysis</h3>
                <div className="flex items-center justify-center h-[250px] bg-gray-50 rounded-lg">
                  <img src={result.chartUrlSentiment} alt="Sentiment" className="max-h-full max-w-full object-contain" />
                </div>
              </div>
            </div>
          </div>

          {/* SWOT */}
          <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
            <div className="grid grid-cols-2 divide-x divide-gray-200">
              <div className="p-6">
                <h3 className="text-lg font-bold text-primary mb-4 text-center border-b pb-2">{result.businessA}</h3>
                <div className="mb-6">
                  <h4 className="flex items-center gap-2 font-bold text-green-600 mb-3 text-sm uppercase"><ThumbsUp size={16} /> Strengths</h4>
                  <ul className="space-y-2">{result.strengthsA.map((p, i) => <li key={i} className="text-sm text-gray-600 flex items-start gap-2"><span className="text-green-500">•</span> {p}</li>)}</ul>
                </div>
                <div>
                  <h4 className="flex items-center gap-2 font-bold text-red-500 mb-3 text-sm uppercase"><ThumbsDown size={16} /> Weaknesses</h4>
                  <ul className="space-y-2">{result.weaknessesA.map((p, i) => <li key={i} className="text-sm text-gray-600 flex items-start gap-2"><span className="text-red-400">•</span> {p}</li>)}</ul>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-secondary mb-4 text-center border-b pb-2">{result.businessB}</h3>
                <div className="mb-6">
                  <h4 className="flex items-center gap-2 font-bold text-green-600 mb-3 text-sm uppercase"><ThumbsUp size={16} /> Strengths</h4>
                  <ul className="space-y-2">{result.strengthsB.map((p, i) => <li key={i} className="text-sm text-gray-600 flex items-start gap-2"><span className="text-green-500">•</span> {p}</li>)}</ul>
                </div>
                <div>
                  <h4 className="flex items-center gap-2 font-bold text-red-500 mb-3 text-sm uppercase"><ThumbsDown size={16} /> Weaknesses</h4>
                  <ul className="space-y-2">{result.weaknessesB.map((p, i) => <li key={i} className="text-sm text-gray-600 flex items-start gap-2"><span className="text-red-400">•</span> {p}</li>)}</ul>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-orange-50 rounded-xl p-6 border border-orange-100 flex gap-4">
            <div className="shrink-0"><div className="bg-orange-100 p-3 rounded-full text-accent"><AlertTriangle size={24} /></div></div>
            <div>
              <h3 className="font-bold text-lg text-charcoal mb-2">{t('analysis.recommendation')}</h3>
              <p className="text-gray-800 leading-relaxed font-medium">{result.recommendation}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};