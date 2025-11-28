import React, { useState, useRef, useEffect } from 'react';
import { Upload, Send, Download, FileText, X, RefreshCw, Loader, MessageSquare, History, Sparkles, Edit3, ListChecks } from 'lucide-react';
import { api } from '../services/api';
import { supabase } from '../services/supabaseClient';
import { ChatMessage, DbChatMessage, DbCvSession } from '../types';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export const CvOptimizer: React.FC = () => {
  const { user } = useAuth();
  const { t, isRTL } = useLanguage();

  // --- State Management ---
  const [file, setFile] = useState<File | null>(null);
  const [pdfPreview, setPdfPreview] = useState<string | null>(null);
  const [currentText, setCurrentText] = useState<string>('');
  const [sessionId, setSessionId] = useState<string>('');

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isProcessingFile, setIsProcessingFile] = useState(false);
  const [isFinalizing, setIsFinalizing] = useState(false);
  const [isRestoring, setIsRestoring] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // --- 1. RESTORE LAST SESSION ON MOUNT ---
  useEffect(() => {
    const restoreLastSession = async () => {
      if (!user) {
        setIsRestoring(false);
        return;
      }

      try {
        const { data: sessionData, error: sessionError } = await supabase
          .from('cv_sessions')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (sessionError && sessionError.code !== 'PGRST116') {
          console.error('Error fetching session:', sessionError);
        }

        if (sessionData) {
          const dbSession = sessionData as DbCvSession;
          setSessionId(dbSession.id);

          if (dbSession.text_content) {
            setCurrentText(dbSession.text_content);
          }

          if (dbSession.latest_draft_url) setPdfPreview(dbSession.latest_draft_url);
          else if (dbSession.original_pdf_url) setPdfPreview(dbSession.original_pdf_url);

          const { data: msgData, error: msgError } = await supabase
            .from('chat_messages')
            .select('*')
            .eq('session_id', dbSession.id)
            .order('timestamp', { ascending: true });

          if (!msgError && msgData) {
            const history: ChatMessage[] = (msgData as DbChatMessage[]).map(m => ({
              id: m.id,
              sender: m.sender,
              content: m.content,
              timestamp: new Date(m.timestamp)
            }));
            setMessages(history);
          }
        }
      } catch (err) {
        console.error("Restoration failed:", err);
      } finally {
        setIsRestoring(false);
      }
    };

    restoreLastSession();
  }, [user]);

  // --- Auto-scroll chat ---
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // --- Handlers ---

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];

      if (!user) {
        alert("You must be logged in to upload a CV.");
        return;
      }

      if (selectedFile.type !== 'application/pdf') {
        alert('Please upload a PDF file.');
        return;
      }

      setFile(selectedFile);
      setIsProcessingFile(true);
      setMessages([]);
      const objectUrl = URL.createObjectURL(selectedFile);
      setPdfPreview(objectUrl);

      try {
        const response = await api.parseCv(selectedFile, user.id);

        setCurrentText(response.text);
        setSessionId(response.sessionId);

        await supabase
          .from('cv_sessions')
          .update({ text_content: response.text })
          .eq('id', response.sessionId);

        const cleanName = selectedFile.name.length > 20 ? selectedFile.name.substring(0, 15) + '....pdf' : selectedFile.name;
        const introMsg = `I've analyzed **${cleanName}**. I'm ready to help you optimize it.`;

        await supabase.from('chat_messages').insert({
          session_id: response.sessionId,
          sender: 'ai',
          content: introMsg,
          timestamp: new Date().toISOString()
        });

        setMessages([{
          id: 'init',
          sender: 'ai',
          content: introMsg,
          timestamp: new Date()
        }]);

      } catch (error) {
        console.error(error);
        alert("Failed to analyze the PDF text. Please try again.");
        setFile(null);
        setPdfPreview(null);
      } finally {
        setIsProcessingFile(false);
      }
    }
  };

  const handleClearFile = () => {
    if (confirm("Start a new document? Current session will be archived.")) {
      setFile(null);
      setPdfPreview(null);
      setCurrentText('');
      setSessionId('');
      setMessages([]);
    }
  };

  const handleSend = async (overrideText?: string) => {
    const contentToSend = overrideText || input;

    if (!contentToSend.trim() || loading || !sessionId) return;

    if (!currentText && !file) {
      console.warn("No text content found in session. AI might fail to optimize.");
    }

    if (!overrideText) {
      setInput('');
    }

    setLoading(true);

    const tempUserMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      content: contentToSend,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, tempUserMsg]);

    try {
      await supabase.from('chat_messages').insert({
        session_id: sessionId,
        sender: 'user',
        content: contentToSend,
        timestamp: new Date().toISOString()
      });

      const loadingId = 'loading-' + Date.now();
      setMessages(prev => [...prev, {
        id: loadingId,
        sender: 'ai',
        content: 'Thinking...',
        timestamp: new Date(),
        isSystem: true
      }]);

      const result = await api.optimizeCv(sessionId, currentText || " ", contentToSend);

      setMessages(prev => prev.filter(m => !m.isSystem));

      const aiResponseText = result.message || "Request processed.";

      await supabase.from('chat_messages').insert({
        session_id: sessionId,
        sender: 'ai',
        content: aiResponseText,
        timestamp: new Date().toISOString()
      });

      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        sender: 'ai',
        content: aiResponseText,
        timestamp: new Date()
      }]);

      if (result.type === 'pdf_update' && result.pdfBase64) {
        setCurrentText(result.optimizedText);
        setPdfPreview(`data:application/pdf;base64,${result.pdfBase64}`);

        await supabase
          .from('cv_sessions')
          .update({ text_content: result.optimizedText })
          .eq('id', sessionId);
      }

    } catch (error) {
      console.error(error);
      setMessages(prev => prev.filter(m => !m.isSystem));
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        sender: 'ai',
        content: "Error: Could not connect to the AI agent.",
        timestamp: new Date(),
        isSystem: true
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadFinal = async () => {
    if (!sessionId || !user) return; // Ensure user exists
    setIsFinalizing(true);
    try {
      // ✅ UPDATED: Pass user.id
      const result = await api.finalizeCv(sessionId, user.id);

      if (result.downloadUrl) {
        window.open(result.downloadUrl, '_blank');
      } else {
        alert("Error: Download URL not received.");
      }
    } catch (error) {
      console.error(error);
      alert("Failed to save the final PDF.");
    } finally {
      setIsFinalizing(false);
    }
  };

  // --- Button Handlers ---
  const handleOptimizationATS = () => handleSend("Optimization as per ATS");
  const handleSuggestedImprovements = () => handleSend("Suggested Improvements");
  const handleCustomizedChanges = () => {
    setInput("CHANGES NEEDED: ");
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  // --- Render ---

  if (isRestoring) {
    return (
      <div className="h-[calc(100vh-64px)] flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader size={48} className="animate-spin text-primary mx-auto mb-4" />
          <p className="text-gray-500">Restoring your session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col md:flex-row overflow-hidden bg-background">

      {/* LEFT COLUMN: PDF Viewer */}
      <div className={`w-full md:w-1/2 border-r border-gray-200 bg-gray-100 flex flex-col ${isRTL ? 'border-l border-r-0' : ''}`}>
        <div className="p-4 bg-white border-b border-gray-200 flex justify-between items-center shadow-sm z-10 shrink-0">
          <h2 className="font-semibold text-charcoal flex items-center gap-2 overflow-hidden">
            <FileText size={18} className="text-primary shrink-0" />
            <span className="truncate max-w-[200px]">
              {file ? file.name : (sessionId ? "Resumed Session" : t('cv.title'))}
            </span>
          </h2>
          <div className="flex items-center gap-2 shrink-0">
            {(file || sessionId) && (
              <button
                onClick={handleClearFile}
                className="text-gray-400 hover:text-red-500 p-1.5 rounded-md hover:bg-red-50 transition-colors"
                title="New Session"
              >
                <X size={18} />
              </button>
            )}
            {pdfPreview && (
              <button
                onClick={handleDownloadFinal}
                disabled={isFinalizing}
                className="bg-secondary hover:bg-teal-600 text-white px-4 py-1.5 rounded-md text-sm font-bold flex items-center gap-2 transition-colors shadow-sm disabled:opacity-50"
              >
                {isFinalizing ? <Loader size={16} className="animate-spin" /> : <Download size={16} />}
                <span className="hidden sm:inline">Save & Download</span>
              </button>
            )}
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center bg-gray-200/50 overflow-hidden relative">
          {!pdfPreview && !isProcessingFile ? (
            <div className="text-center p-10 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 m-4 max-w-sm">
              <Upload size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-700">{t('cv.uploadTitle')}</h3>
              <p className="text-gray-500 text-sm mb-6">PDF Only (Max 5MB)</p>
              <div className="relative">
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 shadow-sm pointer-events-none">
                  Select Document
                </button>
              </div>
            </div>
          ) : isProcessingFile ? (
            <div className="text-center">
              <Loader size={40} className="animate-spin text-primary mx-auto mb-4" />
              <p className="text-gray-500 font-medium">Extracting text...</p>
            </div>
          ) : (
            <div className="w-full h-full bg-gray-300 relative">
              {pdfPreview && (
                <iframe
                  src={`${pdfPreview}#toolbar=0&navpanes=0`}
                  className="w-full h-full border-none"
                  title="CV Preview"
                />
              )}
            </div>
          )}
        </div>
      </div>

      {/* RIGHT COLUMN: Chat Interface */}
      <div className="w-full md:w-1/2 flex flex-col bg-white border-l border-gray-200">

        <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center shrink-0">
          <h2 className="font-semibold text-charcoal flex items-center gap-2">
            <MessageSquare size={18} className="text-secondary" />
            AI Editor Assistant
          </h2>
          <div className="flex items-center gap-2">
            {!currentText && sessionId && (
              <span className="text-xs text-orange-500 bg-orange-50 px-2 py-1 rounded border border-orange-200" title="Re-upload to enable editing">
                Chat Only Mode
              </span>
            )}
            <div className="text-xs font-medium text-gray-500 bg-white px-3 py-1.5 rounded-full border shadow-sm">
              Status: {loading ? <span className="text-secondary">Thinking...</span> : <span className="text-green-500">Ready</span>}
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && !isProcessingFile && (
            <div className="text-center text-gray-400 mt-20 px-6">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <RefreshCw size={24} className="text-gray-300" />
              </div>
              <p>Upload your CV or restore a session to start.</p>
            </div>
          )}

          {sessionId && messages.length === 0 && !isProcessingFile && (
            <div className="text-center text-gray-400 mt-10">
              <History size={20} className="mx-auto mb-2" />
              <p>Session restored. No previous messages found.</p>
            </div>
          )}

          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[85%] rounded-2xl px-5 py-3.5 text-sm shadow-sm leading-relaxed whitespace-pre-wrap
                ${msg.sender === 'user'
                    ? `bg-primary text-white ${isRTL ? 'rounded-bl-none' : 'rounded-br-none'}`
                    : `bg-gray-100 text-charcoal ${isRTL ? 'rounded-br-none' : 'rounded-bl-none'} ${msg.isSystem ? 'italic text-gray-500 border border-gray-200' : ''}`}`}
              >
                {msg.content}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-gray-200 bg-white">

          {/* Quick Actions - Always visible if a session exists OR messages exist */}
          {(sessionId || file || messages.length > 0) && (
            <div className="flex gap-2 mb-3 overflow-x-auto pb-2 scrollbar-thin">
              <button
                onClick={handleOptimizationATS}
                disabled={loading}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full bg-blue-50 text-primary hover:bg-primary hover:text-white transition-colors border border-blue-100 whitespace-nowrap disabled:opacity-50"
              >
                <Sparkles size={14} /> Optimization as per ATS
              </button>
              <button
                onClick={handleSuggestedImprovements}
                disabled={loading}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full bg-teal-50 text-teal-700 hover:bg-secondary hover:text-white transition-colors border border-teal-100 whitespace-nowrap disabled:opacity-50"
              >
                <ListChecks size={14} /> Suggested Improvements
              </button>
              <button
                onClick={handleCustomizedChanges}
                disabled={loading}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full bg-gray-100 text-gray-700 hover:bg-gray-700 hover:text-white transition-colors border border-gray-200 whitespace-nowrap disabled:opacity-50"
              >
                <Edit3 size={14} /> Customized Changes
              </button>
            </div>
          )}

          <div className="flex items-center gap-2 max-w-3xl mx-auto">
            <input
              ref={inputRef}
              type="text"
              disabled={(!file && !sessionId) || loading || isProcessingFile}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={sessionId ? "Ask for a rewrite..." : "Upload a file first..."}
              className="flex-1 border border-gray-300 rounded-full px-5 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-50 disabled:text-gray-400 transition-shadow"
            />
            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || loading}
              className="bg-primary text-white p-3 rounded-full hover:bg-blue-800 disabled:opacity-50 disabled:hover:bg-primary transition-all shadow-md hover:shadow-lg transform hover:scale-105"
            >
              {loading ? <Loader size={20} className="animate-spin" /> : <Send size={20} className={isRTL ? 'rotate-180' : ''} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};