import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ArticlesListPage from './pages/ArticlesListPage';
import ArticlePage from './pages/ArticlePage';
import CategoryPage from './pages/CategoryPage';
import SearchPage from './pages/SearchPage';
import CalculatorsHubPage from './pages/CalculatorsHubPage';
import WalkRunCalculator from './pages/calculators/WalkRunCalculator';
import StepsCalculator from './pages/calculators/StepsCalculator';
import ConvertersPage from './pages/calculators/ConvertersPage';
import Zone2CalculatorPage from './pages/calculators/Zone2CalculatorPage';
import OneRepMaxPage from './pages/calculators/OneRepMaxPage';
import CaloriesPage from './pages/calculators/CaloriesPage';
import TDEECalculator from './pages/calculators/TDEECalculator';
import BMICalculator from './pages/calculators/BMICalculator';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import PrivacyPage from './pages/PrivacyPage';
import ProgramsPage from './pages/ProgramsPage';
import ProgramDetailPage from './pages/ProgramDetailPage';

export default function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <Navbar />
        <main>
          <Routes>
            <Route path="/"                        element={<HomePage />} />
            <Route path="/articles"                element={<ArticlesListPage />} />
            <Route path="/articles/:slug"          element={<ArticlePage />} />
            <Route path="/category/:name"          element={<CategoryPage />} />
            <Route path="/search"                  element={<SearchPage />} />
            <Route path="/calculators"             element={<CalculatorsHubPage />} />
            <Route path="/calculators/walk-run"    element={<WalkRunCalculator />} />
            <Route path="/calculators/steps"       element={<StepsCalculator />} />
            <Route path="/calculators/converters"  element={<ConvertersPage />} />
            <Route path="/calculators/zone2"       element={<Zone2CalculatorPage />} />
            <Route path="/calculators/one-rep-max" element={<OneRepMaxPage />} />
            <Route path="/calculators/calories"    element={<CaloriesPage />} />
            <Route path="/calculators/tdee"        element={<TDEECalculator />} />
            <Route path="/calculators/bmi"         element={<BMICalculator />} />
            <Route path="/about"                   element={<AboutPage />} />
            <Route path="/contact"                 element={<ContactPage />} />
            <Route path="/privacy"                 element={<PrivacyPage />} />
            <Route path="/programs"                element={<ProgramsPage />} />
            <Route path="/programs/:slug"          element={<ProgramDetailPage />} />
            <Route path="*"                        element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </BrowserRouter>
    </HelmetProvider>
  );
}

function NotFound() {
  return (
    <div style={{ padding: '80px 24px', textAlign: 'center' }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 64, color: 'var(--text)' }}>404</h1>
      <p style={{ color: 'var(--text-muted)', marginTop: 12 }}>Page not found.</p>
    </div>
  );
}
