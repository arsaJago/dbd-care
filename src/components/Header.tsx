'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Home, BookOpen, Image, Video, ClipboardCheck, LogOut, LayoutDashboard, FileText } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isQuickMenuOpen, setIsQuickMenuOpen] = useState(false);
  const { isAuthenticated, isAdmin, logout, user } = useAuth();
  const pathname = usePathname();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    closeMenu();
    setIsQuickMenuOpen(false);
  };

  useEffect(() => {
    // Close menus when route changes
    setIsMenuOpen(false);
    setIsQuickMenuOpen(false);
  }, [pathname]);

  const userMenuItems = [
    { href: '/beranda', label: 'Beranda', icon: Home },
    { href: '/materi', label: 'Materi', icon: BookOpen },
    { href: '/poster', label: 'Poster', icon: Image },
    { href: '/leaflet', label: 'Leaflet', icon: FileText },
    { href: '/video', label: 'Video', icon: Video },
    { href: '/quiz', label: 'Quiz', icon: ClipboardCheck },
  ];

  const adminMenuItems = [
    { href: '/admin', label: 'Dashboard Admin', icon: LayoutDashboard },
  ];

  const menuItems = isAdmin ? [...adminMenuItems, ...userMenuItems] : userMenuItems;

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href={isAuthenticated ? '/beranda' : '/'} className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">DB</span>
            </div>
            <span className="text-xl font-bold text-gray-800">DBD Care</span>
          </Link>

          {/* Desktop Menu */}
          <nav className="hidden md:flex items-center space-x-6">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition ${
                    pathname === item.href
                      ? 'bg-green-500 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="flex items-center space-x-1 px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 transition"
              >
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            )}
          </nav>

          {/* User Info & Hamburger Menu */}
          <div className="flex items-center space-x-3">
            <div className="relative">
              <button
                onClick={() => setIsQuickMenuOpen((prev) => !prev)}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg border border-teal-600 bg-teal-600 text-white shadow-md hover:bg-teal-700 active:scale-[0.98] transition md:border-teal-200 md:bg-white/95 md:text-teal-700 md:shadow-sm md:hover:bg-teal-50"
                aria-label="Menu cepat"
              >
                <Menu size={18} />
                <span className="text-sm font-semibold">Menu</span>
              </button>
              {isQuickMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-lg border border-gray-200 bg-white shadow-lg z-50">
                  <div className="py-2">
                    {menuItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setIsQuickMenuOpen(false)}
                          className={`flex items-center gap-2 px-3 py-2 text-sm transition hover:bg-gray-50 ${
                            pathname === item.href ? 'text-green-600 font-semibold' : 'text-gray-700'
                          }`}
                        >
                          <Icon size={16} />
                          <span>{item.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {isAuthenticated && (
              <div className="hidden md:block text-right">
                <p className="text-sm font-medium text-gray-800">{user?.username}</p>
                <p className="text-xs text-gray-500">{user?.role === 'admin' ? 'Administrator' : 'User'}</p>
              </div>
            )}

            {isAuthenticated ? (
              <button
                onClick={toggleMenu}
                className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition"
                aria-label="Toggle menu"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            ) : (
              <Link
                href="/login"
                className="px-4 py-2 text-green-600 hover:bg-green-50 rounded-lg transition"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t shadow-lg">
          <div className="container mx-auto px-4 py-4">
            {isAuthenticated && (
              <div className="mb-4 pb-4 border-b">
                <p className="text-sm font-medium text-gray-800">{user?.username}</p>
                <p className="text-xs text-gray-500">{user?.role === 'admin' ? 'Administrator' : 'User'}</p>
              </div>
            )}
            <nav className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={closeMenu}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
                      pathname === item.href
                        ? 'bg-green-500 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon size={20} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
              {isAuthenticated && (
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition"
                >
                  <LogOut size={20} />
                  <span>Logout</span>
                </button>
              )}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
