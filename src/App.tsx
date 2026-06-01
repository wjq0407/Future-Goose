import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { Suspense, lazy } from "react";
import Header from "@/components/Header";
import { ApiKeyModal } from '@/components/ApiKeyModal';
import ToastContainer from '@/components/ToastContainer';
import ErrorBoundary from '@/components/ErrorBoundary';
import NetworkStatusIndicator from '@/components/NetworkStatusIndicator';
import OnboardingGuide from '@/components/OnboardingGuide';
import OnboardingTrigger from '@/components/OnboardingTrigger';
import PageTransition from '@/components/PageTransition';
import LoadingFallback from '@/components/LoadingFallback';

const Home = lazy(() => import("@/pages/Home"));
const Profile = lazy(() => import("@/pages/Profile"));
const Chat = lazy(() => import("@/pages/Chat"));
const Growth = lazy(() => import("@/pages/Growth"));
const Tencent = lazy(() => import("@/pages/Tencent"));
const AISettings = lazy(() => import("@/pages/AISettings"));
const NotFound = lazy(() => import("@/pages/NotFound"));

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <PageTransition>
      <Suspense fallback={<LoadingFallback />}>
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/growth" element={<Growth />} />
          <Route path="/tencent" element={<Tencent />} />
          <Route path="/ai-settings" element={<AISettings />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </PageTransition>
  );
}

export default function App() {
  return (
    <Router>
      <ErrorBoundary>
        <a
          href="#main-content"
          className="skip-link sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-tencent-blue focus:text-white focus:rounded-lg focus:shadow-lg"
        >
          跳转到主要内容
        </a>
        <div className="min-h-screen">
          <Header />
          <main id="main-content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12 md:pb-12 pb-20" role="main">
            <ErrorBoundary>
              <AnimatedRoutes />
            </ErrorBoundary>
          </main>
          <OnboardingGuide />
          <OnboardingTrigger />
          <ApiKeyModal />
          <ToastContainer />
          <NetworkStatusIndicator />
        </div>
      </ErrorBoundary>
    </Router>
  );
}
