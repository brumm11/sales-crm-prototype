import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { DealsProvider } from './state/DealsContext';
import { ToastProvider } from './components/Toast';
import Home from './screens/Home';
import MyDeals from './screens/MyDeals';
import DealDetail from './screens/DealDetail';

function App() {
  return (
    <div className="app-canvas flex min-h-screen w-full items-center justify-center sm:p-6">
      {/* Mobile-width frame. On desktop it reads as an intentional phone, not a
          broken stretched layout. On a real phone it fills the screen. Providers
          and overlays (toast, sheets) resolve against this positioned frame. */}
      <div className="relative flex h-screen w-full max-w-[420px] flex-col overflow-hidden bg-neutral-50 shadow-pop sm:h-[860px] sm:max-h-[92vh] sm:rounded-[2.25rem] sm:ring-1 sm:ring-black/5">
        <DealsProvider>
          <ToastProvider>
            <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
              {/* The scroll + sticky context for every screen. */}
              <main className="no-scrollbar flex-1 overflow-y-auto overscroll-contain">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/deals" element={<MyDeals />} />
                  <Route path="/deals/:id" element={<DealDetail />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </main>
            </BrowserRouter>
          </ToastProvider>
        </DealsProvider>
      </div>
    </div>
  );
}

export default App;
