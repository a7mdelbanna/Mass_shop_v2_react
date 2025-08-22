import React from 'react';
import Sidebar from './Sidebar';
import { Menu } from 'lucide-react';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar for desktop & mobile */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      {/* Main content */}
      <div className="flex-1 flex flex-col lg:ml-64">
        {/* Topbar */}
        <header className="sticky top-0 z-20 bg-white border-b h-16 flex items-center px-4 lg:hidden">
          <button
            className="p-2 rounded-md hover:bg-gray-100 focus:outline-none"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open sidebar"
          >
            <Menu className="w-6 h-6" />
          </button>
          <span className="ml-4 font-bold text-lg">MyStore</span>
        </header>
        <main className="flex-1 p-2 sm:p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
};

export default Layout; 