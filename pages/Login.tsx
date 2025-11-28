import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';
import { useLanguage } from '../context/LanguageContext';
import { Mail, Lock, User as UserIcon, Loader, AlertTriangle, CheckCircle } from 'lucide-react';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [verificationSent, setVerificationSent] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: ''
  });

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setVerificationSent(false);

    try {
      if (isSignUp) {
        // --- SIGN UP LOGIC ---
        const { data, error: signUpError } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: { full_name: formData.fullName } // Trigger adds this to 'profiles'
          }
        });

        if (signUpError) throw signUpError;

        // Check if session is null. If so, email verification is required.
        if (data.user && !data.session) {
          setVerificationSent(true);
          setLoading(false);
          return; // Stop execution, don't redirect yet
        }

        alert("Account created and logged in!");
        navigate('/');

      } else {
        // --- SIGN IN LOGIC ---
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password
        });
        if (signInError) throw signInError;

        navigate('/');
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  // If verification email was just sent, show this specific view
  if (verificationSent) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 px-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full border border-gray-100 text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Mail size={32} className="text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-charcoal mb-4">Check your Inbox</h2>
          <p className="text-gray-600 mb-6 leading-relaxed">
            We have sent a verification link to <strong>{formData.email}</strong>.
            Please click the link to activate your account.
          </p>
          <button
            onClick={() => { setVerificationSent(false); setIsSignUp(false); }}
            className="text-primary font-bold hover:underline"
          >
            Back to Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full border border-gray-100">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-primary mb-2">
            {isSignUp ? t('auth.signUp') : t('auth.loginTitle')}
          </h2>
          <p className="text-gray-500">
            {isSignUp ? "Create your account to get started" : t('auth.loginSubtitle')}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm mb-6 flex items-start gap-3">
            <AlertTriangle size={18} className="shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-4">
          {isSignUp && (
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">Full Name</label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-3 text-gray-400" size={18} />
                <input
                  type="text"
                  required={isSignUp}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary outline-none"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-charcoal mb-1">{t('common.email')}</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                type="email"
                required
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary outline-none"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-charcoal mb-1">{t('common.password')}</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                type="password"
                required
                minLength={6}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary outline-none"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-blue-800 text-white font-bold py-3 rounded-xl transition-all shadow-md flex justify-center items-center gap-2"
          >
            {loading ? <Loader className="animate-spin" size={20} /> : (isSignUp ? t('auth.signUp') : t('common.signIn'))}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          {isSignUp ? "Already have an account? " : t('auth.noAccount') + " "}
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-secondary font-bold hover:underline"
          >
            {isSignUp ? t('common.signIn') : t('auth.signUp')}
          </button>
        </div>
      </div>
    </div>
  );
};