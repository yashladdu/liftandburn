import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import './LegalPage.css';
import './ContactPage.css';

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  const update = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // Uses Formspree — replace YOUR_FORM_ID with your Formspree form ID
  // Sign up free at formspree.io
  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('https://formspree.io/f/mlgvngng', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(form),
    });
    if (res.ok) setSent(true);
  };

  return (
    <>
      <Helmet>
        <title>Contact — LiftAndBurn</title>
        <link rel="canonical" href="https://liftandburn.fit/contact" />
        <meta name="description" content="Get in touch with the LiftAndBurn team — questions, feedback, or content suggestions." />
      </Helmet>

      <div className="legal-page container">
        <header className="legal-header">
          <span className="legal-eyebrow">Get in touch</span>
          <h1 className="legal-title">Contact Us</h1>
          <p className="legal-sub">Questions, feedback, or content suggestions — we'd love to hear from you.</p>
        </header>

        <div className="contact-layout">
          <div className="contact-main">
            {sent ? (
              <div className="contact-success">
                <span className="contact-success__icon">✓</span>
                <h2>Message sent!</h2>
                <p>Thanks for reaching out. We'll get back to you within a few days.</p>
              </div>
            ) : (
              <form className="contact-form" onSubmit={handleSubmit}>
                <div className="contact-field">
                  <label htmlFor="name">Your name</label>
                  <input
                    id="name" name="name" type="text"
                    placeholder="e.g. John Smith"
                    value={form.name} onChange={update} required
                  />
                </div>
                <div className="contact-field">
                  <label htmlFor="email">Email address</label>
                  <input
                    id="email" name="email" type="email"
                    placeholder="you@example.com"
                    value={form.email} onChange={update} required
                  />
                </div>
                <div className="contact-field">
                  <label htmlFor="message">Message</label>
                  <textarea
                    id="message" name="message" rows="6"
                    placeholder="What's on your mind?"
                    value={form.message} onChange={update} required
                  />
                </div>
                <button type="submit" className="contact-submit">Send message →</button>
              </form>
            )}
          </div>

          <aside className="contact-sidebar">
            <div className="contact-info-card">
              <h3>Other ways to reach us</h3>
              <div className="contact-info-item">
                <span>📧</span>
                <div>
                  <strong>Email</strong>
                  <a href="mailto:hello@liftandburn.com">yashladdu10@gmail.com</a>
                </div>
              </div>
            </div>
            <div className="contact-info-card">
              <h3>What we can help with</h3>
              <ul>
                <li>Questions about our articles</li>
                <li>Suggest a topic to cover</li>
                <li>Report an error in our content</li>
                <li>General feedback</li>
              </ul>
            </div>
            <div className="contact-info-card">
              <h3>What we can't help with</h3>
              <ul>
                <li>Personal training advice</li>
                <li>Medical or injury questions</li>
                <li>Sponsored posts or link exchanges</li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
