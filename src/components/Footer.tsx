'use client';

import React from 'react';
import Link from 'next/link';
import { Heart, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-white mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About Section */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">DB</span>
              </div>
              <span className="text-xl font-bold">DBD Care</span>
            </div>
            <p className="text-gray-300 text-sm">
              Platform edukasi pencegahan Demam Berdarah Dengue untuk membantu masyarakat menjadi agent perubahan dalam mencegah DBD.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Link Cepat</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/materi" className="text-gray-300 hover:text-green-400 transition">
                  Materi Edukasi
                </Link>
              </li>
              <li>
                <Link href="/poster" className="text-gray-300 hover:text-green-400 transition">
                  Poster & Leaflet
                </Link>
              </li>
              <li>
                <Link href="/video" className="text-gray-300 hover:text-green-400 transition">
                  Video Pembelajaran
                </Link>
              </li>
              <li>
                <Link href="/quiz" className="text-gray-300 hover:text-green-400 transition">
                  Quiz DBD
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Kontak</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center space-x-2">
                <Mail size={16} className="text-green-400" />
                <span className="text-gray-300">dbdcare@gmail.com</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone size={16} className="text-green-400" />
                <span className="text-gray-300">0812-2692-9432</span>
              </li>
              <li className="flex items-center space-x-2">
                <MapPin size={16} className="text-green-400" />
                <span className="text-gray-300">Yogyakarta, Indonesia</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-8 pt-6 flex flex-col md:flex-row items-center justify-between">
          <p className="text-sm text-gray-300 flex items-center">
            Made with <Heart size={16} className="text-red-500 mx-1" /> for Indonesian Families
          </p>
          <p className="text-sm text-gray-300 mt-2 md:mt-0">
            &copy; {currentYear} DBD Care. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
