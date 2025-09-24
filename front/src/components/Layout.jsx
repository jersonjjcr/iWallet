import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Home,
  CreditCard,
  TrendingUp,
  Settings,
  LogOut,
  Menu,
  X,
  User,
  Tag
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Gastos', href: '/expenses', icon: CreditCard },
  { name: 'Categorías', href: '/categories', icon: Tag },
  { name: 'Estadísticas', href: '/stats', icon: TrendingUp },
];

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const currentPage = navigation.find(item => item.href === location.pathname);

  return (
    <div className="min-h-screen bg-primary">
      {/* Mobile menu overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden animate-fade-in">
          <div className="fixed inset-0 bg-black bg-opacity-50 animate-fade-in" onClick={() => setSidebarOpen(false)} />
        </div>
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-72 sm:w-64 bg-secondary shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 sidebar-modern ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-theme animate-slide-in">
          <div className="flex items-center space-x-3">
            <img 
              src="/logo_iWallet.png" 
              alt="iWallet Logo" 
              className="w-8 h-8"
            />
            <h1 className="text-xl font-bold text-primary">iWallet</h1>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-3 rounded-md text-secondary hover:bg-tertiary transition-colors touch-manipulation"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="mt-6 px-3 sm:px-4 animate-fade-in" style={{ animationDelay: '200ms' }}>
          <div className="space-y-1 sm:space-y-2">
            {navigation.map((item, index) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`nav-item animate-slide-in-right group flex items-center px-4 py-4 sm:py-3 text-base sm:text-sm font-medium rounded-lg transition-all duration-200 touch-manipulation min-h-[48px] ${
                    isActive
                      ? 'bg-gradient-to-r from-gray-900 to-gray-800 text-white shadow-lg animate-pulse-subtle transform-gpu'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900 hover:shadow-md hover:animate-lift-gentle active:bg-gray-200 active:scale-95'
                  }`}
                  onClick={() => setSidebarOpen(false)}
                  style={{ animationDelay: `${300 + index * 100}ms` }}
                >
                  <Icon className={`mr-4 h-6 w-6 transition-all duration-200 transform-gpu ${
                    isActive 
                      ? 'text-white animate-glow' 
                      : 'text-gray-500 group-hover:text-gray-700 group-hover:scale-110'
                  }`} />
                  <span className="text-base sm:text-sm font-medium">{item.name}</span>
                  {isActive && (
                    <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  )}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Upgrade Section */}
        <div className="mx-3 sm:mx-4 mt-8 mb-8 p-4 bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl text-white animate-slide-in-up card-glow" style={{ animationDelay: '600ms' }}>
          <h3 className="font-semibold text-sm mb-2 animate-fade-in" style={{ animationDelay: '700ms' }}>Gestión Inteligente</h3>
          <p className="text-xs text-gray-300 mb-4 animate-fade-in" style={{ animationDelay: '800ms' }}>Controla tus finanzas de manera efectiva</p>
          <button 
            onClick={handleLogout}
            className="w-full btn-danger text-sm font-medium py-3 px-4 rounded-lg flex items-center justify-center min-h-[44px] touch-manipulation animate-slide-in-up"
            style={{ animationDelay: '900ms' }}
          >
            <LogOut className="h-5 w-5 mr-2 transition-transform group-hover:rotate-12" />
            Cerrar Sesión
          </button>
        </div>

        <div className="absolute bottom-0 w-full p-4 border-t border-gray-200 animate-fade-in" style={{ animationDelay: '1000ms' }}>
          <div className="flex items-center justify-center">
            <Link 
              to="/settings" 
              className="settings-link flex items-center p-3 sm:p-2 rounded-lg hover:bg-gray-100 active:bg-gray-200 transition-all min-h-[44px] touch-manipulation w-full justify-center sm:justify-start hover:animate-lift-gentle"
            >
              <Settings className="h-6 w-6 text-gray-500 mr-3 transition-transform hover:rotate-45" />
              <span className="text-base sm:text-sm font-medium text-gray-700">Configuración</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:ml-64">
        {/* Mobile header */}
        <div className="lg:hidden bg-white shadow-sm border-b border-gray-200 animate-slide-in-down">
          <div className="flex items-center justify-between h-16 px-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-3 rounded-md text-gray-500 hover:text-gray-600 hover:bg-gray-100 active:bg-gray-200 transition-all touch-manipulation min-h-[44px] min-w-[44px] hover:animate-wiggle"
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="flex items-center space-x-3 animate-fade-in" style={{ animationDelay: '200ms' }}>
              <img 
                src="/logo_iWallet.png" 
                alt="iWallet Logo" 
                className="w-8 h-8 animate-float"
              />
              <h1 className="text-lg font-bold text-gray-900 animate-slide-in-right" style={{ animationDelay: '300ms' }}>iWallet</h1>
            </div>
            <div className="flex items-center space-x-2 animate-fade-in" style={{ animationDelay: '400ms' }}>
              <div className="w-10 h-10 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center touch-manipulation hover:shadow-md transition-all duration-200 hover:animate-bounce-gentle">
                <User className="h-6 w-6 text-gray-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="min-h-screen pb-safe animate-fade-in" style={{ animationDelay: '300ms' }}>
          <div className="page-content">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}