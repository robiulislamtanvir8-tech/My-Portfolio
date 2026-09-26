import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Send,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Github,
  Linkedin,
  Twitter,
  Mail,
  Copy,
  Check,
  ExternalLink,
} from 'lucide-react';
import { siteConfig } from '../config/site';
import { SocialLinkItem } from '../data/socialLinks';

interface ContactProps {
  prefersReducedMotion: boolean;
}

interface FormValues {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

type SubmitStatus = 'idle' | 'loading' | 'success' | 'error';

export const Contact: React.FC<ContactProps> = ({ prefersReducedMotion }) => {
  const [values, setValues] = useState<FormValues>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<SubmitStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [copiedPayload, setCopiedPayload] = useState(false);

  const validate = (form: FormValues): FormErrors => {
    const nextErrors: FormErrors = {};
    if (!form.name.trim() || form.name.trim().length < 2) {
      nextErrors.name = 'Please enter your name (at least 2 characters).';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.email.trim() || !emailRegex.test(form.email.trim())) {
      nextErrors.email = 'Please enter a valid email address.';
    }
    if (!form.subject.trim() || form.subject.trim().length < 3) {
      nextErrors.subject = 'Please provide a brief subject line.';
    }
    if (!form.message.trim() || form.message.trim().length < 10) {
      nextErrors.message = 'Please enter a message of at least 10 characters.';
    }
    return nextErrors;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
    if (status === 'error') {
      setStatus('idle');
      setErrorMessage('');
    }
  };

  /**
   * Structured form submission handler ready for external email service / API integration.
   * Does not falsely claim a backend email was dispatched when no backend transport is configured.
   */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validationErrors = validate(values);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setStatus('error');
      setErrorMessage('Please resolve the highlighted fields before continuing.');
      return;
    }

    setErrors({});
    setErrorMessage('');
    setStatus('loading');

    try {
      await new Promise((resolve) => setTimeout(resolve, 650));
      setStatus('success');
    } catch {
      setStatus('error');
      setErrorMessage(
        'Unable to process your message right now. Please check your connection and try again.'
      );
    }
  };

  const handleCopyFormattedInquiry = async () => {
    const text = `Name: ${values.name}\nEmail: ${values.email}\nSubject: ${values.subject}\n\n${values.message}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopiedPayload(true);
      setTimeout(() => setCopiedPayload(false), 2500);
    } catch {
      // Ignore clipboard permission errors
    }
  };

  const renderSocialIcon = (id: SocialLinkItem['id']) => {
    switch (id) {
      case 'github':
        return <Github className="w-4 h-4" />;
      case 'linkedin':
        return <Linkedin className="w-4 h-4" />;
      case 'twitter':
        return <Twitter className="w-4 h-4" />;
      case 'email':
        return <Mail className="w-4 h-4" />;
    }
  };

  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="relative py-24 sm:py-32 border-t border-white/[0.07]"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-12 items-start">
          {/* Left 5 Cols: Contact Heading, Supporting Copy & Configurable Social Links */}
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 space-y-8"
          >
            <div className="space-y-3">
              <p className="text-xs font-mono tracking-wider text-blue-400">
                COLLABORATION &amp; INQUIRIES
              </p>
              <h2
                id="contact-heading"
                className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-[1.1] [text-wrap:balance]"
              >
                {siteConfig.contact.heading}
              </h2>
              <p className="text-base text-slate-300 leading-relaxed pt-1">
                {siteConfig.contact.description}
              </p>
            </div>

            {/* Social Links Directory */}
            <div className="space-y-4 pt-4 border-t border-white/10">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Profiles &amp; Direct Channels</span>
                <span className="font-mono text-[11px] text-slate-500">
                  src/data/socialLinks.ts
                </span>
              </div>

              <div className="divide-y divide-white/[0.07] rounded-2xl bg-[#0B0E17] border border-white/10 overflow-hidden">
                {siteConfig.socialLinks.map((item) => (
                  <a
                    key={item.id}
                    href={item.href}
                    target={item.id === 'email' ? undefined : '_blank'}
                    rel={item.id === 'email' ? undefined : 'noopener noreferrer'}
                    className="flex items-center justify-between gap-4 p-4 hover:bg-white/[0.03] transition-colors group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-white/5 text-slate-300 group-hover:text-blue-400 group-hover:bg-blue-500/10 transition-colors shrink-0">
                        {renderSocialIcon(item.id)}
                      </span>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-white">
                            {item.label}
                          </span>
                          <span className="text-slate-600" aria-hidden="true">
                            ·
                          </span>
                          <span className="text-xs font-mono text-slate-400 truncate">
                            {item.handle}
                          </span>
                        </div>
                        {item.isPlaceholder && (
                          <p className="text-[11px] text-slate-500 truncate">
                            Configurable placeholder in central config
                          </p>
                        )}
                      </div>
                    </div>

                    <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-blue-400 transition-colors shrink-0" />
                  </a>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right 7 Cols: Contact Form */}
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.45, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7"
          >
            <div className="rounded-2xl bg-[#0B0E17] border border-white/12 p-6 sm:p-8 lg:p-10 shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
              {status === 'success' ? (
                <div
                  role="status"
                  aria-live="polite"
                  className="space-y-6 py-4"
                >
                  <div className="flex items-start gap-3.5">
                    <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <h3 className="font-display text-xl font-bold text-white">
                        Message Validated &amp; Prepared
                      </h3>
                      <p className="text-sm text-slate-300 leading-relaxed">
                        Your message has been validated on the client. Because no
                        external email backend is currently connected, you can open
                        your prepared inquiry directly in your email client or copy
                        the formatted message below.
                      </p>
                    </div>
                  </div>

                  <div className="rounded-xl bg-[#07090F] border border-white/10 p-4 font-mono text-xs text-slate-300 space-y-1.5">
                    <div>
                      <span className="text-slate-500">From:</span> {values.name} (
                      {values.email})
                    </div>
                    <div>
                      <span className="text-slate-500">Subject:</span> {values.subject}
                    </div>
                    <div className="pt-2 text-slate-200 whitespace-pre-wrap border-t border-white/10">
                      {values.message}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <a
                      href={`mailto:${siteConfig.contact.email}?subject=${encodeURIComponent(
                        values.subject
                      )}&body=${encodeURIComponent(
                        `Name: ${values.name}\nEmail: ${values.email}\n\n${values.message}`
                      )}`}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap"
                    >
                      <Mail className="w-4 h-4" />
                      <span>Open in Email Client</span>
                    </a>

                    <button
                      type="button"
                      onClick={handleCopyFormattedInquiry}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap"
                    >
                      {copiedPayload ? (
                        <>
                          <Check className="w-4 h-4 text-emerald-400" />
                          <span>Copied to Clipboard</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          <span>Copy Formatted Inquiry</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setValues({ name: '', email: '', subject: '', message: '' });
                        setStatus('idle');
                      }}
                      className="px-4 py-2.5 text-xs sm:text-sm text-slate-400 hover:text-white transition-colors whitespace-nowrap"
                    >
                      Reset Form
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="space-y-5">
                  {status === 'error' && errorMessage && (
                    <div
                      role="alert"
                      className="flex items-center gap-2.5 p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-xs sm:text-sm text-red-200"
                    >
                      <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Name Field */}
                    <div className="space-y-2">
                      <label
                        htmlFor="contact-name"
                        className="block text-xs font-medium text-slate-300"
                      >
                        Name <span className="text-blue-400">*</span>
                      </label>
                      <input
                        id="contact-name"
                        name="name"
                        type="text"
                        autoComplete="name"
                        value={values.name}
                        onChange={handleChange}
                        placeholder="Your full name"
                        aria-invalid={Boolean(errors.name)}
                        aria-describedby={errors.name ? 'error-name' : undefined}
                        className={`w-full px-4 py-3 rounded-xl bg-[#07090F] border text-sm text-white placeholder:text-slate-500 transition-colors focus:outline-none focus:ring-2 ${
                          errors.name
                            ? 'border-red-500/60 focus:ring-red-500/40'
                            : 'border-white/12 focus:border-blue-500 focus:ring-blue-500/30'
                        }`}
                      />
                      {errors.name && (
                        <p
                          id="error-name"
                          className="text-xs text-red-400 flex items-center gap-1.5"
                        >
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                          <span>{errors.name}</span>
                        </p>
                      )}
                    </div>

                    {/* Email Field */}
                    <div className="space-y-2">
                      <label
                        htmlFor="contact-email"
                        className="block text-xs font-medium text-slate-300"
                      >
                        Email <span className="text-blue-400">*</span>
                      </label>
                      <input
                        id="contact-email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        value={values.email}
                        onChange={handleChange}
                        placeholder="you@example.com"
                        aria-invalid={Boolean(errors.email)}
                        aria-describedby={errors.email ? 'error-email' : undefined}
                        className={`w-full px-4 py-3 rounded-xl bg-[#07090F] border text-sm text-white placeholder:text-slate-500 transition-colors focus:outline-none focus:ring-2 ${
                          errors.email
                            ? 'border-red-500/60 focus:ring-red-500/40'
                            : 'border-white/12 focus:border-blue-500 focus:ring-blue-500/30'
                        }`}
                      />
                      {errors.email && (
                        <p
                          id="error-email"
                          className="text-xs text-red-400 flex items-center gap-1.5"
                        >
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                          <span>{errors.email}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Subject Field */}
                  <div className="space-y-2">
                    <label
                      htmlFor="contact-subject"
                      className="block text-xs font-medium text-slate-300"
                    >
                      Subject <span className="text-blue-400">*</span>
                    </label>
                    <input
                      id="contact-subject"
                      name="subject"
                      type="text"
                      value={values.subject}
                      onChange={handleChange}
                      placeholder="Project inquiry, collaboration, or question"
                      aria-invalid={Boolean(errors.subject)}
                      aria-describedby={errors.subject ? 'error-subject' : undefined}
                      className={`w-full px-4 py-3 rounded-xl bg-[#07090F] border text-sm text-white placeholder:text-slate-500 transition-colors focus:outline-none focus:ring-2 ${
                        errors.subject
                          ? 'border-red-500/60 focus:ring-red-500/40'
                          : 'border-white/12 focus:border-blue-500 focus:ring-blue-500/30'
                      }`}
                    />
                    {errors.subject && (
                      <p
                        id="error-subject"
                        className="text-xs text-red-400 flex items-center gap-1.5"
                      >
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{errors.subject}</span>
                      </p>
                    )}
                  </div>

                  {/* Message Field */}
                  <div className="space-y-2">
                    <label
                      htmlFor="contact-message"
                      className="block text-xs font-medium text-slate-300"
                    >
                      Message <span className="text-blue-400">*</span>
                    </label>
                    <textarea
                      id="contact-message"
                      name="message"
                      rows={5}
                      value={values.message}
                      onChange={handleChange}
                      placeholder="Tell me about your project goals, timeline, and requirements..."
                      aria-invalid={Boolean(errors.message)}
                      aria-describedby={errors.message ? 'error-message' : undefined}
                      className={`w-full px-4 py-3 rounded-xl bg-[#07090F] border text-sm text-white placeholder:text-slate-500 transition-colors resize-y focus:outline-none focus:ring-2 ${
                        errors.message
                          ? 'border-red-500/60 focus:ring-red-500/40'
                          : 'border-white/12 focus:border-blue-500 focus:ring-blue-500/30'
                      }`}
                    />
                    {errors.message && (
                      <p
                        id="error-message"
                        className="text-xs text-red-400 flex items-center gap-1.5"
                      >
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{errors.message}</span>
                      </p>
                    )}
                  </div>

                  <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <p className="text-xs text-slate-400">
                      Structured for email service / API integration.
                    </p>

                    <button
                      type="submit"
                      disabled={status === 'loading'}
                      className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white text-sm font-semibold transition-all duration-150 shadow-[0_0_28px_rgba(37,99,235,0.3)] whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                    >
                      {status === 'loading' ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Preparing Message...</span>
                        </>
                      ) : (
                        <>
                          <span>Send Message</span>
                          <Send className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
