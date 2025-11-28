import React, { useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient'; // Real Supabase
import { Users, MessageSquare, AlertCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

// Define local interface for the request data
interface ConsultationRequest {
  id: string;
  date: string; // we will map 'created_at' to this
  subject: string;
  status: 'pending' | 'reviewed' | 'closed';
  email: string;
}

export const Admin: React.FC = () => {
  const [requests, setRequests] = useState<ConsultationRequest[]>([]);
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const { user } = useAuth();
  const { t } = useLanguage();

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchAdminData();
    }
  }, [user]);

  const fetchAdminData = async () => {
    // 1. Fetch Consultation Requests
    const { data: requestData, error: reqError } = await supabase
      .from('consultation_requests')
      .select('*')
      .order('created_at', { ascending: false });

    if (!reqError && requestData) {
      // Map database columns to our UI interface
      const mapped = requestData.map((item: any) => ({
        id: item.id,
        date: new Date(item.created_at).toLocaleDateString(),
        subject: item.subject,
        status: item.status,
        email: item.email || 'Unknown'
      }));
      setRequests(mapped);
    }

    // 2. Fetch User Count (Using count estimation for performance)
    const { count, error: userError } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true });

    if (!userError && count !== null) {
      setTotalUsers(count);
    }
  };

  // Access Control
  if (user?.role !== 'admin') {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center">
          <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
          <h1 className="text-2xl font-bold text-charcoal">{t('admin.accessDenied')}</h1>
          <p className="text-gray-500">{t('admin.accessDeniedMsg')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-primary mb-8">{t('admin.dashboard')}</h1>

      {/* KPI Cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center gap-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <Users className="text-primary" size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">{t('admin.totalUsers')}</p>
            <p className="text-2xl font-bold text-charcoal">{totalUsers}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center gap-4">
          <div className="p-4 bg-teal-50 rounded-lg">
            <MessageSquare className="text-secondary" size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">{t('admin.pendingReq')}</p>
            <p className="text-2xl font-bold text-charcoal">{requests.filter(r => r.status === 'pending').length}</p>
          </div>
        </div>
      </div>

      {/* Requests Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h2 className="font-bold text-charcoal">{t('admin.reqTable')}</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-start text-sm">
            <thead className="bg-gray-100 text-gray-600 uppercase">
              <tr>
                <th className="px-6 py-3 font-semibold">{t('admin.date')}</th>
                <th className="px-6 py-3 font-semibold">{t('common.email')}</th>
                <th className="px-6 py-3 font-semibold">{t('admin.subject')}</th>
                <th className="px-6 py-3 font-semibold">{t('admin.status')}</th>
                <th className="px-6 py-3 font-semibold">{t('admin.action')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {requests.map((req) => (
                <tr key={req.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-gray-500">{req.date}</td>
                  <td className="px-6 py-4 text-gray-500">{req.email}</td>
                  <td className="px-6 py-4 font-medium text-charcoal">{req.subject}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold
                      ${req.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                      {req.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button className="text-primary hover:text-blue-800 font-medium">{t('common.viewDetails')}</button>
                  </td>
                </tr>
              ))}
              {requests.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-400">
                    No requests found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};