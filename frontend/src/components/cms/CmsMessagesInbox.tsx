import React, { useState } from 'react';
import { ContactMessage } from '../../types/cms';
import { cmsApi } from '../../services/api';
import { useToast } from '../common/Toast';
import { Mail, Trash2, Send, CheckCheck } from 'lucide-react';

interface CmsMessagesInboxProps {
  onRefresh: () => void;
}

export const CmsMessagesInbox: React.FC<CmsMessagesInboxProps> = ({ onRefresh }) => {
  const { showToast } = useToast();
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [replyText, setReplyText] = useState('');
  const [isSendingReply, setIsSendingReply] = useState(false);

  const messages = cmsApi.getMessages();

  const handleToggleRead = (id: string, current: boolean) => {
    cmsApi.markMessageRead(id, !current);
    showToast(!current ? 'Marked as read' : 'Marked as unread');
    onRefresh();
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this message entry?')) {
      cmsApi.deleteMessage(id);
      showToast('Message deleted');
      if (selectedMessage?.id === id) {
        setSelectedMessage(null);
      }
      onRefresh();
    }
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedMessage) return;

    setIsSendingReply(true);
    setTimeout(() => {
      showToast(`Reply dispatched to ${selectedMessage.email}`);
      setIsSendingReply(false);
      setReplyText('');
      cmsApi.markMessageRead(selectedMessage.id, true);
      onRefresh();
    }, 400);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-neutral-100">Inbound Contact Inquiries</h2>
          <p className="text-xs text-neutral-400 font-mono">REST API Target: POST /api/contact · Table: messages</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Messages List Column */}
        <div className="lg:col-span-5 space-y-3">
          {messages.map((msg) => (
            <div
              key={msg.id}
              onClick={() => {
                setSelectedMessage(msg);
                if (!msg.isRead) cmsApi.markMessageRead(msg.id, true);
              }}
              className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                selectedMessage?.id === msg.id
                  ? 'bg-neutral-800/80 border-amber-400/80 shadow-md'
                  : msg.isRead
                  ? 'bg-neutral-900/40 border-neutral-800 hover:border-neutral-700'
                  : 'bg-amber-950/20 border-amber-500/40 hover:border-amber-400'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <div className="font-bold text-neutral-100 text-sm truncate flex items-center gap-2">
                  {!msg.isRead && (
                    <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
                  )}
                  <span>{msg.name}</span>
                </div>
                <div className="text-[11px] font-mono text-neutral-500 shrink-0">
                  {new Date(msg.submittedAt).toLocaleDateString()}
                </div>
              </div>

              <div className="text-xs font-semibold text-neutral-300 truncate mb-1">
                {msg.subject}
              </div>

              <div className="text-xs text-neutral-400 line-clamp-2 leading-relaxed">
                {msg.message}
              </div>
            </div>
          ))}

          {messages.length === 0 && (
            <div className="p-8 text-center border border-dashed border-neutral-800 rounded-2xl text-xs text-neutral-500">
              No inquiries logged yet. Submissions via the public Contact section will appear here.
            </div>
          )}
        </div>

        {/* Message Detail & Reply Column */}
        <div className="lg:col-span-7">
          {selectedMessage ? (
            <div className="p-6 rounded-2xl bg-neutral-900/50 border border-neutral-800 space-y-6">
              
              {/* Header details */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-neutral-800">
                <div>
                  <h3 className="text-lg font-bold text-neutral-100 mb-1">
                    {selectedMessage.subject}
                  </h3>
                  <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-neutral-400">
                    <span className="text-neutral-200">{selectedMessage.name}</span>
                    <span>·</span>
                    <a href={`mailto:${selectedMessage.email}`} className="text-amber-400 hover:underline">
                      {selectedMessage.email}
                    </a>
                    <span>·</span>
                    <span>{new Date(selectedMessage.submittedAt).toLocaleString()}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleRead(selectedMessage.id, selectedMessage.isRead)}
                    className="p-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs transition-colors"
                    title={selectedMessage.isRead ? 'Mark as Unread' : 'Mark as Read'}
                  >
                    <CheckCheck className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(selectedMessage.id)}
                    className="p-2 rounded-lg bg-neutral-800 hover:bg-red-950 text-neutral-400 hover:text-red-400 text-xs transition-colors"
                    title="Delete message"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Message Body */}
              <div className="text-neutral-200 text-sm leading-relaxed whitespace-pre-wrap p-4 rounded-xl bg-neutral-950 border border-neutral-800/80">
                {selectedMessage.message}
              </div>

              {/* Reply Box */}
              <form onSubmit={handleSendReply} className="space-y-3 pt-2">
                <label className="block text-xs font-medium text-neutral-300 uppercase tracking-wider">
                  Draft Response (Simulated SMTP Outbox)
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder={`Write reply to ${selectedMessage.name}...`}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-100 text-xs focus:outline-none focus:border-amber-400 resize-none"
                />
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isSendingReply}
                    className="px-5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 text-xs font-semibold transition-colors flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Reply Email</span>
                  </button>
                </div>
              </form>

            </div>
          ) : (
            <div className="h-64 flex flex-col items-center justify-center p-8 rounded-2xl bg-neutral-900/20 border border-dashed border-neutral-800 text-center">
              <Mail className="w-8 h-8 text-neutral-600 mb-2" />
              <div className="text-sm font-medium text-neutral-300">Select an inquiry to view details</div>
              <div className="text-xs text-neutral-500 mt-1">Review contact records stored in the database</div>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
