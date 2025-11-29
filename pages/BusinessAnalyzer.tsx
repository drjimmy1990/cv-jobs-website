import React, { useState } from 'react';
import { Search, TrendingUp, ThumbsUp, ThumbsDown, AlertTriangle, Loader, Printer, Star, Users, BarChart2 } from 'lucide-react';
import { api } from '../services/api';
import { BusinessAnalysisResult } from '../types';
import { useLanguage } from '../context/LanguageContext';

export const BusinessAnalyzer: React.FC = () => {
    const [link, setLink] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<BusinessAnalysisResult | null>(null);
    const { t } = useLanguage();

    const handleAnalyze = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!link) return;

        setLoading(true);
        setResult(null);

        try {
            const data = await api.analyzeBusiness(link);

            // Safety check for empty lists
            if (!data.strengths) data.strengths = [];
            if (!data.weaknesses) data.weaknesses = [];

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
                    <h1 className="text-3xl font-bold text-primary mb-2">{t('businessAnalyzer.title')}</h1>
                    <p className="text-gray-600">{t('businessAnalyzer.subtitle')}</p>
                </div>

                <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 mb-10 max-w-3xl mx-auto">
                    <form onSubmit={handleAnalyze} className="flex flex-col gap-4">
                        <div>
                            <label className="block text-sm font-medium text-charcoal mb-1">{t('businessAnalyzer.businessUrl')}</label>
                            <input
                                type="text"
                                placeholder="Google Maps Link"
                                value={link}
                                onChange={(e) => setLink(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                            />
                        </div>
                        <div className="flex justify-center mt-2">
                            <button type="submit" disabled={loading} className="w-full md:w-auto bg-accent hover:bg-yellow-600 text-white font-bold py-3 px-10 rounded-lg shadow-md flex items-center justify-center gap-2 transition-colors">
                                {loading ? <><Loader className="animate-spin" /> {t('businessAnalyzer.analyzing')}</> : <><Search size={18} /> {t('businessAnalyzer.analyzeNow')}</>}
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
                            <h2 className="text-2xl font-bold text-charcoal">{t('businessAnalyzer.executiveReport')}</h2>
                            <button onClick={handlePrint} className="print:hidden text-gray-500 hover:text-primary flex items-center gap-2 text-sm font-bold"><Printer size={18} /> {t('businessAnalyzer.printPdf')}</button>
                        </div>
                        <div className="p-8">
                            <div className="flex flex-col items-center mb-8">
                                <div className="text-center p-6 bg-gray-50 rounded-xl border border-gray-100 min-w-[300px]">
                                    <h3 className="font-bold text-2xl text-charcoal mb-3">{result.businessName}</h3>
                                    <div className="flex justify-center items-center gap-2 text-4xl font-bold text-primary mb-2"><Star className="text-accent fill-accent" size={32} /> {result.score}</div>
                                    <div className="text-gray-500 flex justify-center items-center gap-1"><Users size={16} /> {result.reviewCount} {t('businessAnalyzer.reviews')}</div>
                                </div>
                            </div>
                            <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 text-center max-w-4xl mx-auto">
                                <p className="text-gray-700 leading-relaxed font-medium text-lg">{result.summary}</p>
                            </div>
                        </div>
                    </div>

                    {/* Charts */}
                    <div className="space-y-8">
                        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                            <h3 className="font-bold text-charcoal mb-4 flex items-center gap-2"><BarChart2 size={20} /> {t('businessAnalyzer.reviewVolume')}</h3>
                            <div className="flex items-center justify-center h-[300px] bg-gray-50 rounded-lg">
                                <img src={result.chartUrlMonthly} alt="Monthly Trends" className="max-h-full max-w-full object-contain" />
                            </div>
                        </div>
                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                                <h3 className="font-bold text-charcoal mb-4 flex items-center gap-2"><TrendingUp size={20} /> {t('businessAnalyzer.quarterlyGrowth')}</h3>
                                <div className="flex items-center justify-center h-[250px] bg-gray-50 rounded-lg">
                                    <img src={result.chartUrlQuarterly} alt="Quarterly" className="max-h-full max-w-full object-contain" />
                                </div>
                            </div>
                            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                                <h3 className="font-bold text-charcoal mb-4 flex items-center gap-2"><ThumbsUp size={20} /> {t('businessAnalyzer.sentimentAnalysis')}</h3>
                                <div className="flex items-center justify-center h-[250px] bg-gray-50 rounded-lg">
                                    <img src={result.chartUrlSentiment} alt="Sentiment" className="max-h-full max-w-full object-contain" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* SWOT */}
                    <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
                        <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-200">
                            <div className="p-8">
                                <h4 className="flex items-center gap-2 font-bold text-green-600 mb-4 text-lg uppercase"><ThumbsUp size={20} /> {t('businessAnalyzer.strengths')}</h4>
                                <ul className="space-y-3">{result.strengths.map((p, i) => <li key={i} className="text-gray-700 flex items-start gap-2"><span className="text-green-500 mt-1">•</span> {p}</li>)}</ul>
                            </div>
                            <div className="p-8">
                                <h4 className="flex items-center gap-2 font-bold text-red-500 mb-4 text-lg uppercase"><ThumbsDown size={20} /> {t('businessAnalyzer.weaknesses')}</h4>
                                <ul className="space-y-3">{result.weaknesses.map((p, i) => <li key={i} className="text-gray-700 flex items-start gap-2"><span className="text-red-400 mt-1">•</span> {p}</li>)}</ul>
                            </div>
                        </div>
                    </div>

                    {/* Recommendation */}
                    <div className="bg-orange-50 rounded-xl p-8 border border-orange-100 flex gap-6 items-start">
                        <div className="shrink-0"><div className="bg-orange-100 p-4 rounded-full text-accent"><AlertTriangle size={32} /></div></div>
                        <div>
                            <h3 className="font-bold text-xl text-charcoal mb-3">{t('businessAnalyzer.recommendation')}</h3>
                            <p className="text-gray-800 leading-relaxed font-medium text-lg">{result.recommendation}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
