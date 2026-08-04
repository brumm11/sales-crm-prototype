import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { DealsProvider } from './state/DealsContext';
import { ToastProvider } from './components/Toast';
import BottomNav from './components/BottomNav';
import Home from './screens/Home';
import MyDeals from './screens/MyDeals';
import DealDetail from './screens/DealDetail';
import Profile from './screens/Profile';

function App() {
  return (
    <div className="app-canvas flex min-h-screen w-full items-center justify-center sm:p-6">
      {/* Mobile-width frame. On desktop it reads as an intentional phone, not a
          broken stretched layout. On a real phone it fills the screen. Providers
          and overlays (toast, sheets) resolve against this positioned frame. */}
      <div className="relative flex h-screen w-full max-w-[420px] flex-col overflow-hidden shadow-pop sm:h-[860px] sm:max-h-[92vh] sm:rounded-[2.25rem] sm:ring-1 sm:ring-black/5">
        <DealsProvider>
          <ToastProvider>
            <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
              <Shell />
            </BrowserRouter>
          </ToastProvider>
        </DealsProvider>
      </div>
    </div>
  );
}

// Route-aware shell: sets the frame background per screen (dark on Home, light
// on the list/detail screens) and provides the scroll/sticky context.
function Shell() {
  const { pathname } = useLocation();
  const dark = pathname === '/';
  // Bottom nav shows on the top-level tab screens; hidden on the nested Deal
  // Detail (which has its own sticky action bar and back navigation).
  const isDealDetail = /^\/deals\/[^/]+$/.test(pathname);
  const showNav = !isDealDetail;
  return (
    // min-h-0 is essential: without it this flex child keeps its default
    // min-height:auto and grows to its content height, overflowing the fixed
    // frame (which clips) so the inner <main> never scrolls. With min-h-0 it is
    // capped to the frame and <main>'s overflow-y-auto scrolls properly.
    <div className={`flex w-full min-h-0 flex-1 flex-col ${dark ? 'bg-[#181410]' : 'bg-neutral-50'}`}>
      {/* The scroll + sticky context for every screen. */}
      <main className="no-scrollbar min-h-0 flex-1 overflow-y-auto overscroll-contain">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/deals" element={<MyDeals />} />
          <Route path="/deals/:id" element={<DealDetail />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      {showNav && <BottomNav dark={dark} />}
    </div>
  );
}

export default App;
