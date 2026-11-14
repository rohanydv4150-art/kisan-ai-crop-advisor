import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../services/api';
import { ChatConversation, ChatMessage, ChatbotResponse } from '../../types';
import { 
  BotMessageSquare, 
  Send, 
  Plus, 
  Trash2, 
  Sparkles, 
  Loader2, 
  User, 
  AlertCircle,
  HelpCircle,
  MessageSquare,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

export const ChatbotPage: React.FC = () => {
  const { profile } = useAuth();
  const { language } = useLanguage();

  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>([
    'What are the best biofertilizers to improve soil nitrogen?',
    'How should I schedule irrigation for wheat at crown root initiation?',
    'How can I identify fall armyworm in maize crops early?',
    'Which pulses are best suited for intercropping with cotton?',
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load conversations on mount
  useEffect(() => {
    loadConversations();
  }, []);

  // When active conversation changes, load messages
  useEffect(() => {
    if (activeConversationId) {
      loadMessages(activeConversationId);
    } else {
      setMessages([]);
    }
  }, [activeConversationId]);

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isSending]);

  const loadConversations = async () => {
    try {
      const res = await api.get('/chat/conversations');
      if (res.data?.success && Array.isArray(res.data.data)) {
        setConversations(res.data.data);
        if (res.data.data.length > 0 && !activeConversationId) {
          setActiveConversationId(res.data.data[0].id);
        }
      }
    } catch (e) {
      console.error('Load conversations error:', e);
    }
  };

  const loadMessages = async (convId: string) => {
    try {
      const res = await api.get(`/chat/conversations/${convId}`);
      if (res.data?.success && res.data?.data?.messages) {
        setMessages(res.data.data.messages);
      }
    } catch (e) {
      console.error('Load messages error:', e);
    }
  };

  const handleCreateNewConversation = async () => {
    try {
      const res = await api.post('/chat/conversations', {
        title: 'New Agricultural Query',
        language,
      });
      if (res.data?.success && res.data?.data) {
        setConversations([res.data.data, ...conversations]);
        setActiveConversationId(res.data.data.id);
        setMessages([]);
      }
    } catch (e) {
      console.error('Create conversation error:', e);
    }
  };

  const handleDeleteConversation = async (convId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await api.delete(`/chat/conversations/${convId}`);
      const updated = conversations.filter((c) => c.id !== convId);
      setConversations(updated);
      if (activeConversationId === convId) {
        setActiveConversationId(updated.length > 0 ? updated[0].id : null);
      }
    } catch (e) {
      console.error('Delete conversation error:', e);
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || isSending) return;

    setError(null);
    setInputMessage('');
    setIsSending(true);

    // Optimistically show user message
    const tempUserMsg: ChatMessage = {
      id: 'temp-' + Date.now(),
      conversation_id: activeConversationId || 'temp',
      user_id: 'me',
      role: 'user',
      content: text,
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempUserMsg]);

    try {
      const res = await api.post(`/chat/conversations/${activeConversationId || 'new'}/messages`, {
        content: text,
        conversation_id: activeConversationId || undefined,
        language: language,
        farmer_context: {
          state: profile?.state || undefined,
          district: profile?.district || undefined,
          soil_type: undefined,
        },
      });

      if (res.data?.success && res.data?.data) {
        const { conversation, assistantMessage, aiResponse } = res.data.data;
        
        // Update active conversation id if it was newly created
        if (!activeConversationId) {
          setActiveConversationId(conversation.id);
          setConversations((prev) => [conversation, ...prev]);
        }

        // Replace messages with confirmed assistant reply
        setMessages((prev) => [...prev.filter((m) => m.id !== tempUserMsg.id), tempUserMsg, assistantMessage]);

        // Update follow-up questions
        if (aiResponse?.follow_up_questions && aiResponse.follow_up_questions.length > 0) {
          setSuggestedQuestions(aiResponse.follow_up_questions);
        }
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to receive AI response. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 h-[calc(100vh-5rem)] flex flex-col">
      <div className="flex-1 flex gap-6 overflow-hidden bg-white rounded-2xl border border-slate-200 shadow-sm">
        {/* Left Sidebar: Conversations */}
        <div className="w-72 border-r border-slate-200 flex flex-col bg-slate-50/50 hidden md:flex">
          <div className="p-3.5 border-b border-slate-200 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Consultation Logs
            </span>
            <button
              type="button"
              onClick={handleCreateNewConversation}
              className="p-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition-colors"
              title="Start New Farming Consultation"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {conversations.map((conv) => {
              const isActive = conv.id === activeConversationId;
              return (
                <div
                  key={conv.id}
                  onClick={() => setActiveConversationId(conv.id)}
                  className={`group flex items-center justify-between px-3 py-2.5 rounded-xl text-xs cursor-pointer transition-all ${
                    isActive
                      ? 'bg-emerald-600 text-white font-semibold shadow-sm shadow-emerald-600/30'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <MessageSquare className="w-3.5 h-3.5 flex-shrink-0" />
                    <span className="truncate">{conv.title}</span>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => handleDeleteConversation(conv.id, e)}
                    className={`opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-rose-500 hover:text-white transition-opacity ${
                      isActive ? 'text-white' : 'text-slate-400'
                    }`}
                    title="Delete conversation"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}

            {conversations.length === 0 && (
              <div className="p-4 text-center text-xs text-slate-400">
                No previous conversations. Ask your first question!
              </div>
            )}
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col h-full overflow-hidden bg-white">
          {/* Chat Header */}
          <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-white">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
                <BotMessageSquare className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xs font-bold text-slate-900">AI Agricultural Assistant</h2>
                <span className="text-[10px] text-emerald-700 font-medium">
                  Active • Context-Aware Agricultural Guidance
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 md:hidden">
              <button
                type="button"
                onClick={handleCreateNewConversation}
                className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white text-xs font-semibold"
              >
                New Chat
              </button>
            </div>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {messages.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4 max-w-md mx-auto">
                <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-slate-900">Ask Any Agricultural Question</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Get responsible answers regarding pest control, crop management, soil amendments, and seasonal sowing.
                  </p>
                </div>

                <div className="w-full text-left space-y-2 pt-2">
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Suggested Questions</p>
                  {suggestedQuestions.map((q, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSendMessage(q)}
                      className="w-full text-left p-2.5 rounded-xl border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/50 text-xs text-slate-700 transition-colors flex items-center justify-between"
                    >
                      <span className="truncate pr-2">{q}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg, index) => {
              const isAssistant = msg.role === 'assistant';
              return (
                <div
                  key={index}
                  className={`flex gap-3 ${isAssistant ? 'justify-start' : 'justify-end'}`}
                >
                  {isAssistant && (
                    <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <BotMessageSquare className="w-4 h-4" />
                    </div>
                  )}

                  <div className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-xs space-y-2 leading-relaxed ${
                    isAssistant
                      ? 'bg-slate-50 border border-slate-200 text-slate-800'
                      : 'bg-emerald-600 text-white rounded-br-none shadow-sm'
                  }`}>
                    {isAssistant && msg.category && (
                      <span className="inline-block text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-purple-100 text-purple-800">
                        {msg.category.replace('_', ' ')}
                      </span>
                    )}

                    <div className="whitespace-pre-wrap">{msg.content}</div>

                    <div className={`text-[9px] ${isAssistant ? 'text-slate-400' : 'text-emerald-100 text-right'}`}>
                      {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>

                  {!isAssistant && (
                    <div className="w-8 h-8 rounded-xl bg-emerald-700 text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              );
            })}

            {isSending && (
              <div className="flex gap-3 justify-start">
                <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center flex-shrink-0">
                  <BotMessageSquare className="w-4 h-4" />
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-500 flex items-center gap-2">
                  <Loader2 className="w-4 h-4 text-purple-600 animate-spin" />
                  <span>Synthesizing agricultural guidance with Gemini...</span>
                </div>
              </div>
            )}

            {error && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Suggested follow-up chips if chat active */}
          {messages.length > 0 && suggestedQuestions.length > 0 && !isSending && (
            <div className="px-4 py-2 border-t border-slate-100 bg-slate-50/50 flex items-center gap-2 overflow-x-auto">
              <span className="text-[10px] uppercase font-bold text-slate-400 flex-shrink-0">Suggested:</span>
              {suggestedQuestions.slice(0, 3).map((sq, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleSendMessage(sq)}
                  className="px-2.5 py-1 rounded-full border border-slate-200 bg-white hover:border-emerald-300 hover:text-emerald-800 text-[11px] text-slate-600 whitespace-nowrap transition-colors"
                >
                  {sq}
                </button>
              ))}
            </div>
          )}

          {/* Chat Input Bar */}
          <div className="p-4 border-t border-slate-200 bg-white">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ask about fertilizer doses, pests, crop rotation, soil pH..."
                disabled={isSending}
                className="flex-1 px-4 py-2.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button
                type="submit"
                disabled={!inputMessage.trim() || isSending}
                className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-40 transition-colors shadow-sm"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
