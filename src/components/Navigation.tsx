'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BookOpen, TrendingUp, Menu, X, ChevronDown, Calculator } from 'lucide-react';

export default function Navigation() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSemesterDropdownOpen, setIsSemesterDropdownOpen] = useState(false);

  const isActive = (path: string) => {
    return pathname === path;
  };

  const isSemesterActive = () => {
    return pathname.startsWith('/semester/');
  };

  const mainNavItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/cumulative', label: 'Cumulative GPA', icon: TrendingUp },
  ];

  const semesterItems = Array.from({ length: 10 }, (_, i) => ({
    href: `/semester/${i + 1}`,
    label: `Semester ${i + 1}`,
    number: i + 1,
  }));

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleSemesterDropdown = () => {
    setIsSemesterDropdownOpen(!isSemesterDropdownOpen);
  };

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-blue-700 shadow-xl border-b border-blue-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
              <div className="bg-white p-2 rounded-lg shadow-md">
                <Calculator className="h-6 w-6 text-blue-600" />
              </div>
              <div className="text-white">
                <span className="text-xl font-bold block">PT9 GPA Calculator</span>
                <span className="text-blue-200 text-sm">Academic GPA Calculator</span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6 rtl:space-x-reverse">
            {mainNavItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2 rtl:space-x-reverse ${
                    isActive(item.href)
                      ? 'bg-white text-blue-700 shadow-md'
                      : 'text-blue-100 hover:text-white hover:bg-blue-500'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}

            {/* Semesters Dropdown */}
            <div className="relative">
              <button
                onClick={toggleSemesterDropdown}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2 rtl:space-x-reverse ${
                  isSemesterActive()
                    ? 'bg-white text-blue-700 shadow-md'
                    : 'text-blue-100 hover:text-white hover:bg-blue-500'
                }`}
              >
                <BookOpen className="h-4 w-4" />
                <span>Semesters</span>
                <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isSemesterDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {isSemesterDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                  <div className="py-2 max-h-80 overflow-y-auto">
                    <div className="grid grid-cols-2 gap-1 px-2">
                      {semesterItems.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setIsSemesterDropdownOpen(false)}
                          className={`px-3 py-2 text-sm rounded-md transition-colors duration-200 text-center ${
                            isActive(item.href)
                              ? 'bg-blue-100 text-blue-700 font-medium'
                              : 'text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={toggleMobileMenu}
              className="text-blue-100 hover:text-white focus:outline-none focus:text-white p-2 rounded-md transition-colors duration-200"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-blue-700 border-t border-blue-600">
          <div className="px-4 pt-2 pb-3 space-y-1">
            {mainNavItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center space-x-3 rtl:space-x-reverse px-3 py-3 rounded-md text-base font-medium transition-colors duration-200 ${
                    isActive(item.href)
                      ? 'bg-white text-blue-700'
                      : 'text-blue-100 hover:text-white hover:bg-blue-600'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}

            {/* Mobile Semesters */}
            <div className="pt-2">
              <div className="text-blue-200 text-sm font-medium px-3 py-2">Semesters</div>
              <div className="grid grid-cols-2 gap-2 px-3">
                {semesterItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`px-3 py-2 text-sm rounded-md transition-colors duration-200 text-center ${
                      isActive(item.href)
                        ? 'bg-white text-blue-700 font-medium'
                        : 'text-blue-100 hover:text-white hover:bg-blue-600'
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Overlay for dropdown */}
      {isSemesterDropdownOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsSemesterDropdownOpen(false)}
        />
      )}
    </nav>
  );
}
