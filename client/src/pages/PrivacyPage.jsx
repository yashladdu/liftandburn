import { Helmet } from 'react-helmet-async';
import './LegalPage.css';

const LAST_UPDATED = 'May 2026';

export default function PrivacyPage() {
  return (
    <>
      <Helmet>
        <title>Privacy Policy — LiftAndBurn</title>
        <meta name="description" content="Privacy Policy for LiftAndBurn.com — how we collect, use, and protect your information." />
      </Helmet>

      <div className="legal-page container">
        <header className="legal-header">
          <span className="legal-eyebrow">Legal</span>
          <h1 className="legal-title">Privacy Policy</h1>
          <p className="legal-updated">Last updated: {LAST_UPDATED}</p>
        </header>

        <div className="legal-body">

          <section>
            <h2>Overview</h2>
            <p>LiftAndBurn ("we", "our", or "us") operates liftandburn.com. This page explains what information we collect when you visit our site, how we use it, and your rights regarding that information.</p>
            <p>We keep this simple: we do not sell your data. We do not build profiles on individual users. We are a free content site funded by advertising.</p>
          </section>

          <section>
            <h2>Information we collect</h2>
            <h3>Information you give us</h3>
            <p>We do not require you to create an account or log in. If you contact us via email, we receive your email address and the content of your message. We use this only to respond to you.</p>

            <h3>Information collected automatically</h3>
            <p>Like most websites, our hosting provider automatically collects standard server log data when you visit, including your IP address, browser type, pages visited, and time of visit. This data is used in aggregate for traffic analysis and is not linked to any individual.</p>
          </section>

          <section>
            <h2>Google AdSense and advertising</h2>
            <p>We use Google AdSense to display advertisements on this site. Google AdSense uses cookies to serve ads based on your prior visits to this website and other sites on the internet. You can opt out of personalised advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer">Google's Ads Settings</a>.</p>
            <p>Google's use of advertising cookies enables it and its partners to serve ads based on your visit to our site and other sites on the internet. For more information on how Google uses data, visit <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener noreferrer">Google's Privacy & Terms</a>.</p>
          </section>

          <section>
            <h2>Cookies</h2>
            <p>We use cookies in the following ways:</p>
            <ul>
              <li><strong>Analytics cookies</strong> — to understand how visitors use our site (via Google Analytics, if enabled)</li>
              <li><strong>Advertising cookies</strong> — placed by Google AdSense to serve relevant ads</li>
            </ul>
            <p>You can control cookies through your browser settings. Disabling cookies may affect the functionality of some features on this site.</p>
          </section>

          <section>
            <h2>Third-party links</h2>
            <p>Our articles may contain links to third-party websites. We are not responsible for the privacy practices of those sites. We recommend reading their privacy policies before providing any personal information.</p>
          </section>

          <section>
            <h2>Children's privacy</h2>
            <p>LiftAndBurn is not directed at children under the age of 13. We do not knowingly collect personal information from children. If you believe a child has provided us with personal information, please contact us and we will delete it.</p>
          </section>

          <section>
            <h2>Changes to this policy</h2>
            <p>We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated date. Continued use of the site after changes constitutes acceptance of the updated policy.</p>
          </section>

          <section>
            <h2>Contact</h2>
            <p>If you have questions about this Privacy Policy, please contact us at <a href="mailto:yashladdu10@gmail.com">yashladdu10@gmail.com</a>.</p>
          </section>

        </div>
      </div>
    </>
  );
}
