import React, { useState } from 'react';
// ✅ This import should now work correctly because api.ts has a named export.
import { api } from '../services/api';
import { CheckCircle, Mail, MapPin, Phone } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
const Contact: React.FC = () => {
  const [formData, setFormData] = useState({ email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const { t } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.submitContact({
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
      });
      setSubmitted(true);
    } catch (error) {
      console.error("Submission failed:", error);
      alert("Failed to send message. Please ensure the backend (n8n) is running.");
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
        <h2 className="text-2xl font-bold text-charcoal mb-2">{t('contact.successTitle')}</h2>
        <p className="text-gray-600 mb-6">{t('contact.successMsg')}</p>
        <button
          onClick={() => { setSubmitted(false); setFormData({ email: '', subject: '', message: '' }); }}
          className="text-primary font-medium hover:underline"
        >
          {t('contact.sendAnother')}
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold text-primary mb-3">{t('contact.title')}</h1>
        <p className="text-gray-600 text-lg">{t('contact.subtitle')}</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-12 items-start">
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-sm font-semibold text-charcoal mb-2">{t('common.email')}</label>
              <input
                required
                type="email"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all bg-gray-50 focus:bg-white"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-semibold text-charcoal mb-2">{t('contact.subject')}</label>
              <input
                required
                type="text"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all bg-gray-50 focus:bg-white"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              />
            </div>
            <div className="mb-8">
              <label className="block text-sm font-semibold text-charcoal mb-2">{t('contact.message')}</label>
              <textarea
                required
                rows={5}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all resize-none bg-gray-50 focus:bg-white"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-blue-800 text-white font-bold py-3.5 rounded-lg shadow-lg transition-all flex justify-center items-center gap-2"
            >
              {loading ? t('common.loading') : t('contact.submit')}
            </button>
          </form>
        </div>
        <div className="space-y-6">
          <div className="bg-primary text-white p-8 rounded-2xl shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-8 -mt-8"></div>
            <h3 className="text-2xl font-bold mb-6 relative z-10">Get in Touch</h3>
            <ul className="space-y-6 relative z-10">
              <li className="flex items-start gap-4">
                <div className="bg-white/20 p-2 rounded-lg"><MapPin size={24} /></div>
                <div>
                  <h5 className="font-bold text-blue-100">Visit Us</h5>
                  <p className="text-sm">Innovation Hub, Building 3<br />Dubai Internet City, UAE</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="bg-white/20 p-2 rounded-lg"><Mail size={24} /></div>
                <div>
                  <h5 className="font-bold text-blue-100">Email</h5>
                  <p className="text-sm font-mono">info@growthnexus.com</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="bg-white/20 p-2 rounded-lg"><Phone size={24} /></div>
                <div>
                  <h5 className="font-bold text-blue-100">Call Us</h5>
                  <p className="text-sm" dir="ltr">+971 4 123 4567</p>
                </div>
              </li>
            </ul>
          </div>
          <div className="bg-gray-100 p-8 rounded-2xl border border-gray-200">
            <h4 className="font-bold text-charcoal mb-2">Support Hours</h4>
            <p className="text-gray-600 mb-4">Our dedicated support team is available to assist you during business hours.</p>
            <div className="flex justify-between text-sm text-gray-500 border-t border-gray-200 pt-4">
              <span>Mon - Fri</span>
              <span className="font-bold text-charcoal">9:00 AM - 6:00 PM (GST)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// This line makes it the default export
export default Contact;