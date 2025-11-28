import React, { useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { Users, MessageSquare, AlertCircle, X, Check, Eye } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

interface ConsultationRequest {
  id: string;
  date: string;
  subject: string;
  message: string;
  status: 'pending' | 'reviewed' | 'closed';
  email: string;
}

export const Admin: React.FC = () => {
  const [requests, setRequests] = useState<ConsultationRequest[]>([]);
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [selectedRequest, setSelectedRequest] = useState<ConsultationRequest | null>(null);
  const [isUpdating, setIsUpdating] = useState(false); // UI State for button
  const { user } = useAuth();
  const { t } = useLanguage();

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchAdminData();
    }
  }, [user]);

  const fetchAdminData = async () => {
    try {
      const { data: requestData, error: reqError } = await supabase
        .from('consultation_requests')
        .select('*, profiles(email)')
        .order('created_at', { ascending: false });

      if (reqError) throw reqError;

      if (requestData) {
        const mapped = requestData.map((item: any) => ({
          id: item.id,
          date: new Date(item.created_at).toLocaleDateString(),
          subject: item.subject,
          message: item.message,
          status: item.status,
          email: item.profiles?.email || 'Unknown User'
        }));
        setRequests(mapped);
      }

      const { count, error: userError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      if (!userError && count !== null) {
        setTotalUsers(count);
      }
    } catch (error) {
      console.error("Error fetching admin data:", error);
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from('consultation_requests')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;

      await fetchAdminData(); // Refresh list
      setSelectedRequest(null); // Close modal
    } catch (err: any) {
      alert("Error updating status: " + err.message);
    } finally {
      setIsUpdating(false);
    }
  };

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
    <div className="max-w-7xl mx-auto px-4 py-12 relative">
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
          <table className="w-full text-sm">
            <thead className="bg-gray-100 text-gray-600 uppercase border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 font-semibold text-start w-32">{t('admin.date')}</th>
                <th className="px-6 py-4 font-semibold text-start w-64">{t('common.email')}</th>
                <th className="px-6 py-4 font-semibold text-start">{t('admin.subject')}</th>
                <th className="px-6 py-4 font-semibold text-center w-32">{t('admin.status')}</th>
                <th className="px-6 py-4 font-semibold text-center w-32">{t('admin.action')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {requests.map((req) => (
                <tr key={req.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-gray-500 whitespace-nowrap">{req.date}</td>
                  <td className="px-6 py-4 text-charcoal font-medium">{req.email}</td>
                  <td className="px-6 py-4 text-gray-600 truncate max-w-xs" title={req.subject}>
                    {req.subject}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                      ${req.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        req.status === 'reviewed' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {req.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => setSelectedRequest(req)}
                      className="inline-flex items-center justify-center p-2 text-gray-400 hover:text-primary hover:bg-blue-50 rounded-full transition-all"
                      title={t('common.viewDetails')}
                    >
                      <Eye size={20} />
                    </button>
                  </td>
                </tr>
              ))}
              {requests.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                    <div className="flex flex-col items-center gap-2">
                      <MessageSquare size={32} className="opacity-20" />
                      <p>No requests found.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Details Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden animate-slideUp">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="font-bold text-lg text-charcoal">Request Details</h3>
              <button onClick={() => setSelectedRequest(null)} className="text-gray-400 hover:text-red-500 transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">From</label>
                  <p className="text-charcoal font-medium text-sm">{selectedRequest.email}</p>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Date</label>
                  <p className="text-charcoal font-medium text-sm">{selectedRequest.date}</p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Subject</label>
                <p className="text-charcoal font-bold text-lg">{selectedRequest.subject}</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Message</label>
                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed text-sm">{selectedRequest.message}</p>
              </div>
            </div>

            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
              {selectedRequest.status === 'pending' && (
                <button
                  onClick={() => handleUpdateStatus(selectedRequest.id, 'reviewed')}
                  disabled={isUpdating}
                  className="bg-primary hover:bg-blue-800 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 shadow-sm disabled:opacity-50"
                >
                  {isUpdating ? 'Updating...' : <><Check size={16} /> Mark as Reviewed</>}
                </button>
              )}
              {selectedRequest.status !== 'closed' && (
                <button
                  onClick={() => handleUpdateStatus(selectedRequest.id, 'closed')}
                  disabled={isUpdating}
                  className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 px-4 py-2 rounded-lg text-sm font-bold disabled:opacity-50"
                >
                  Close Request
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};