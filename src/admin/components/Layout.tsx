import { Outlet } from 'react-router-dom';
import { Suspense } from 'react';
import { Sidebar } from './Sidebar';
import { Toaster } from 'sonner';
import { Loader2 } from 'lucide-react';

function PageLoader() {
  return (
    <div className="flex items-center justify-center py-32">
      <Loader2 className="w-6 h-6 text-purple-500 animate-spin" />
    </div>
  );
}

export default function AdminLayout() {
  return (
    <div className="flex h-screen bg-[#0a0a0a] text-white overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="p-6 max-w-[1440px] mx-auto">
          <Suspense fallback={<PageLoader />}>
            <Outlet />
          </Suspense>
        </div>
      </main>
      <Toaster position="top-right" theme="dark" richColors />
    </div>
  );
}
