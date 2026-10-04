import React, { useState } from 'react';
import { ProfileContent } from '../../types/cms';
import { cmsApi } from '../../services/api';
import { useToast } from '../common/Toast';
import { Send, Mail, MapPin, CheckCircle, Loader2 } from 'lucide-react';

interface ContactSectionProps {
  profile: ProfileContent;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ profile }) => {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedMessageId, setSubmittedMessageId] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      showToast('Please fill in all required fields.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await cmsApi.submitContactForm(formData);
      if (res.success) {
        setSubmittedMessageId(res.id);
        showToast('Message sent! Stored in CMS Inbox & dispatched notification.');
        setFormData({ name: '', email: '', subject: '', message: '' });
      }
    } catch {
      showToast('Failed to deliver message. Please retry.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20 border-b border-neutral-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 pb-6 border-b border-neutral-900 gap-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-amber-400 block mb-2">
              Direct Communication
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-100">
              Start a Conversation
            </h2>
          </div>
          <p className="text-neutral-400 text-sm max-w-md leading-relaxed">
            Interested in collaborating on a custom CMS, Spring Boot microservices, or full-stack web application? Send an inquiry directly.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Column: Direct Info & Availability */}
          <div className="lg:col-span-5 space-y-8">
            <div className="p-8 rounded-2xl bg-neutral-900/40 border border-neutral-800/80">
              <h3 className="text-xl font-bold text-neutral-100 mb-4">
                Let's discuss architecture.
              </h3>
              <p className="text-neutral-400 text-sm leading-relaxed mb-6">
                I am actively taking on select consulting engagements, architecture audits, and high-impact engineering roles.
              </p>

              <div className="space-y-4 pt-2">
                {profile.email && (
                <div className="flex items-center gap-3 text-sm text-neutral-300">
                  <div className="w-8 h-8 rounded-lg bg-neutral-800 flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4 text-amber-400" />
                  </div>
                  <div>
                    <div className="text-[11px] font-mono text-neutral-500 uppercase">Direct Email</div>
                    <a href={`mailto:${profile.email}`} className="text-neutral-200 hover:text-amber-300 transition-colors font-medium">
                      {profile.email}
                    </a>
                  </div>
                </div>
                )}

                <div className="flex items-center gap-3 text-sm text-neutral-300">
                  <div className="w-8 h-8 rounded-lg bg-neutral-800 flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4 text-amber-400" />
                  </div>
                  <div>
                    <div className="text-[11px] font-mono text-neutral-500 uppercase">Primary Base</div>
                    <div className="text-neutral-200 font-medium">{profile.location}</div>
                  </div>
                </div>
              </div>

              {/* Status Indicator */}
              <div className="mt-8 pt-6 border-t border-neutral-800/80 flex items-center gap-2.5 text-xs font-mono text-neutral-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Response time: typically under 24 hours</span>
              </div>
            </div>

            {/* REST Endpoint Callout */}
            <div className="p-4 rounded-xl bg-neutral-900/30 border border-neutral-800/60 text-xs font-mono text-neutral-400">
              <div className="text-neutral-300 font-semibold mb-1">
                API Integration Note:
              </div>
              Submissions post to <code className="text-amber-400">POST /api/contact</code> and synchronize in real-time with the CMS Inbox database.
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7">
            {submittedMessageId ? (
              <div className="p-8 sm:p-10 rounded-2xl bg-neutral-900/60 border border-emerald-500/30 text-center animate-in fade-in duration-300">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold text-neutral-100 mb-2">Message Delivered</h3>
                <p className="text-neutral-400 text-sm max-w-md mx-auto mb-6 leading-relaxed">
                  Thank you for reaching out! Your message was assigned ID <code className="text-amber-400 font-mono text-xs">{submittedMessageId}</code> and logged into the CMS Inbox.
                </p>
                <button
                  onClick={() => setSubmittedMessageId(null)}
                  className="px-5 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-100 text-sm font-medium transition-colors"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="p-8 rounded-2xl bg-neutral-900/40 border border-neutral-800/80 space-y-5"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-medium text-neutral-300 uppercase tracking-wider mb-2">
                      Your Name <span className="text-amber-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Alex Sterling"
                      className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-100 placeholder-neutral-600 text-sm focus:outline-none focus:border-amber-400 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-neutral-300 uppercase tracking-wider mb-2">
                      Email Address <span className="text-amber-400">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="alex@company.com"
                      className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-100 placeholder-neutral-600 text-sm focus:outline-none focus:border-amber-400 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 uppercase tracking-wider mb-2">
                    Subject / Project Context
                  </label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="e.g. Headless CMS Architecture & Consulting"
                    className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-100 placeholder-neutral-600 text-sm focus:outline-none focus:border-amber-400 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 uppercase tracking-wider mb-2">
                    Message <span className="text-amber-400">*</span>
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell me about your system requirements, timeline, or engineering goals..."
                    className="w-full px-4 py-3 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-100 placeholder-neutral-600 text-sm focus:outline-none focus:border-amber-400 transition-colors resize-none"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto px-7 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 disabled:opacity-50 text-neutral-950 text-sm font-semibold transition-colors flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Submitting to API...</span>
                      </>
                    ) : (
                      <>
                        <span>Transmit Message</span>
                        <Send className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>

        </div>

      </div>
    </section>
  );
};
