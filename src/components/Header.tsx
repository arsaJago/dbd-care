'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Home, BookOpen, Image, Video, ClipboardCheck, LogOut, LayoutDashboard } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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
  };

  const userMenuItems = [
    { href: '/beranda', label: 'Beranda', icon: Home },
    { href: '/materi', label: 'Materi', icon: BookOpen },
    { href: '/poster', label: 'Poster', icon: Image },
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
          {isAuthenticated ? (
            <div className="flex items-center space-x-4">
              <div className="hidden md:block text-right">
                <p className="text-sm font-medium text-gray-800">{user?.username}</p>
                <p className="text-xs text-gray-500">{user?.role === 'admin' ? 'Administrator' : 'User'}</p>
              </div>
              <button
                onClick={toggleMenu}
                className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition"
                aria-label="Toggle menu"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          ) : null}

          {!isAuthenticated && (
            <div className="flex items-center space-x-3">
              <Link
                href="/login"
                className="px-4 py-2 text-green-600 hover:bg-green-50 rounded-lg transition"
              >
                Login
              </Link>
            </div>
          )}
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
