import React, { useState } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { CheckCircle, Briefcase, Loader } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const Consultation: React.FC = () => {
  const { user } = useAuth(); // Get logged in user
  const { t } = useLanguage();

  const [formData, setFormData] = useState({ subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  // Auto-fill email if user is logged in
  const userEmail = user?.email || '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert("You must be logged in to request a consultation.");
      return;
    }

    setLoading(true);
    try {
      await api.requestConsultation({
        userId: user.id,
        email: userEmail,
        subject: formData.subject,
        message: formData.message,
      });
      setSubmitted(true);
    } catch (error) {
      console.error(error);
      alert("Failed to submit request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-md mx-auto mt-20 p-8 bg-white rounded-xl shadow-lg text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={32} className="text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-charcoal mb-2">{t('consultation.successTitle')}</h2>
        <p className="text-gray-600 mb-6">{t('consultation.successMsg')}</p>
        <button
          onClick={() => { setSubmitted(false); setFormData({ subject: '', message: '' }); }}
          className="text-primary font-medium hover:underline"
        >
          {t('consultation.submitAnother')}
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 bg-blue-50 text-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide mb-4">
          <Briefcase size={14} /> {t('services.forCompanies')}
        </div>
        <h1 className="text-3xl font-bold text-primary mb-2">{t('consultation.title')}</h1>
        <p className="text-gray-600">{t('consultation.subtitle')}</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-md border border-gray-200">
        <div className="mb-6">
          <label className="block text-sm font-semibold text-charcoal mb-2">{t('common.email')}</label>
          <input
            type="email"
            disabled
            className="w-full border border-gray-300 bg-gray-100 text-gray-500 rounded-lg px-4 py-3 cursor-not-allowed"
            value={userEmail || 'Please Login First'}
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-semibold text-charcoal mb-2">{t('consultation.subject')}</label>
          <input
            required
            type="text"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary outline-none"
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
          />
        </div>

        <div className="mb-8">
          <label className="block text-sm font-semibold text-charcoal mb-2">{t('consultation.message')}</label>
          <textarea
            required
            rows={6}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary outline-none resize-none"
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          />
        </div>

        <button
          type="submit"
          disabled={loading || !user}
          className="w-full bg-primary hover:bg-blue-800 text-white font-bold py-3.5 rounded-lg shadow-lg transition-all flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? <Loader className="animate-spin" /> : t('consultation.submitRequest')}
        </button>
      </form>
    </div>
  );
};