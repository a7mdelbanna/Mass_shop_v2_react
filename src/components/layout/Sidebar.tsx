import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, ShoppingCart, Package, Users, Settings } from 'lucide-react';

const navLinks = [
  { to: '/dashboard', label: 'Dashboard', icon: <Home className="w-5 h-5" /> },
  { to: '/orders', label: 'Orders', icon: <ShoppingCart className="w-5 h-5" /> },
  { to: '/products', label: 'Products', icon: <Package className="w-5 h-5" /> },
  { to: '/customers', label: 'Customers', icon: <Users className="w-5 h-5" /> },
  { to: '/settings', label: 'Settings', icon: <Settings className="w-5 h-5" /> },
];

const Sidebar = ({ isOpen, onClose }: { isOpen?: boolean; onClose?: () => void }) => {
  const location = useLocation();
  return (
    <aside
      className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 shadow-lg
        flex flex-col transition-transform duration-200
        lg:translate-x-0 lg:static lg:inset-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}
      style={{ minWidth: 256 }}
    >
      {/* Logo/User section */}
      <div className="flex items-center justify-center h-16 border-b">
        <span className="font-bold text-lg tracking-wide">MyStore</span>
      </div>
      {/* Navigation */}
      <nav className="flex-1 py-4 px-2 space-y-1">
        {navLinks.map(link => (
          <Link
            key={link.to}
            to={link.to}
            className={`
              flex items-center gap-3 px-4 py-2 rounded-md font-medium transition-colors
              ${location.pathname.startsWith(link.to)
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-700 hover:bg-gray-100'}
            `}
            onClick={onClose}
          >
            {link.icon}
            <span>{link.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar; 