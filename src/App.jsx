import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { DealsProvider } from './state/DealsContext';
import { ToastProvider } from './components/Toast';
import StatusBar from './components/StatusBar';
import Home from './screens/Home';
import MyDeals from './screens/MyDeals';
import DealDetail from './screens/DealDetail';

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

// Route-aware shell: the simulated phone status bar + the scroll/sticky context.
// Home uses the dark theme; the list and detail screens stay light.
function Shell() {
  const { pathname } = useLocation();
  const dark = pathname === '/';
  return (
    <div className={`flex w-full flex-1 flex-col ${dark ? 'bg-[#181410]' : 'bg-neutral-50'}`}>
      <StatusBar dark={dark} />
      {/* The scroll + sticky context for every screen. */}
      <main className="no-scrollbar flex-1 overflow-y-auto overscroll-contain">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/deals" element={<MyDeals />} />
          <Route path="/deals/:id" element={<DealDetail />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
